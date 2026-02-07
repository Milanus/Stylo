import { NextRequest, NextResponse } from 'next/server'
import { callLLM, DEFAULT_PROVIDER, getDefaultModel, isValidModel, isModelAllowedForTier, LLMProvider } from '@/lib/llm/provider'
import { getUserPrompt } from '@/lib/llm/prompts'
import { HUMANIZE_INSTRUCTIONS, HUMANIZE_SUFFIX } from '@/lib/constants/humanize-rules'
import {
  transformTextSchema,
  sanitizeText,
  detectPromptInjection,
} from '@/lib/utils/validation'
import { checkRateLimit, refundRateLimitUse } from '@/lib/utils/rate-limit'
import { prisma } from '@/lib/db/prisma'
import { createClient } from '@/lib/auth/supabase-server'
import { getCachedTransformationPrompt } from '@/lib/cache/transformation-types'
import { getUserRateLimit } from '@/lib/constants/rate-limits'
import { getUserSubscriptionTier, getOrCreateUserProfile } from '@/lib/utils/user-profile'
import { getUserPromptForTransform } from '@/lib/llm/user-prompt-builder'
import { getUserHistoryLimit } from '@/lib/constants/history-limits'

// API Key validation
const API_KEY = process.env.STYLO_API_KEY

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === API_KEY && API_KEY !== undefined && API_KEY !== ''
}

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let rateLimitIdentifier: string | null = null

  try {
    // 0. Validate API Key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    // 1. Get authenticated user - OPTIONAL (anonymous access allowed)
    // Check both Authorization header (mobile) and cookies (web)
    const authHeader = request.headers.get('authorization')
    let user = null
    let authError = null

    if (authHeader?.startsWith('Bearer ')) {
      // Mobile app with Authorization header
      const token = authHeader.substring(7)
      const { createClient: createServiceClient } = await import('@supabase/supabase-js')
      const supabaseAdmin = createServiceClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
      const result = await supabaseAdmin.auth.getUser(token)
      user = result.data.user
      authError = result.error
    } else {
      // Web app with cookies
      const supabase = await createClient()
      const result = await supabase.auth.getUser()
      user = result.data.user
      authError = result.error
    }

    const isAuthenticated = !!(user && !authError)
    const userId = user?.id || null

    // 2. Parse and validate request body
    const body = await request.json()
    console.log('📥 Raw request body:', JSON.stringify(body, null, 2))

    const validationResult = transformTextSchema.safeParse(body)

    if (!validationResult.success) {
      console.error('❌ Validation error:', validationResult.error.issues)
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { text, transformationType, customPromptId, targetLanguage, humanize, provider, model } =
      validationResult.data

    console.log('📥 Transform API received:', {
      hasCustomPromptId: !!customPromptId,
      customPromptId,
      transformationType,
      userId,
      isAuthenticated,
    })

    // 3. Sanitize input text
    const sanitizedText = sanitizeText(text)

    // 4. Check for prompt injection attempts
    if (detectPromptInjection(sanitizedText)) {
      return NextResponse.json(
        { error: 'Potential security issue detected in input text' },
        { status: 400 }
      )
    }

    // 5. Get client IP for rate limiting (parse x-forwarded-for correctly)
    const getClientIp = (req: NextRequest): string => {
      // Cloudflare/Vercel trusted header first
      const cfConnectingIp = req.headers.get('cf-connecting-ip')
      if (cfConnectingIp) return cfConnectingIp

      // Vercel sets x-forwarded-for with original client IP first
      const forwarded = req.headers.get('x-forwarded-for')
      if (forwarded) {
        // First IP in comma-separated list is the original client
        const ips = forwarded.split(',').map(ip => ip.trim())
        return ips[0] || 'unknown'
      }

      return req.headers.get('x-real-ip') || 'unknown'
    }

    // 6. Create anonymous fingerprint (harder to spoof than just IP)
    const getAnonymousFingerprint = (req: NextRequest, ip: string): string => {
      const components = [
        ip,
        req.headers.get('user-agent') || '',
        req.headers.get('accept-language') || '',
        req.headers.get('accept-encoding') || '',
      ]
      // Simple hash - in production use crypto.createHash('sha256')
      return `anon:${components.join(':').substring(0, 64)}`
    }

    const clientIp = getClientIp(request)

    // 7. Check rate limiting - Subscription-tier based: 6/hour anonymous, 20/hour free, 100/hour paid
    // Fetch user's subscription tier if authenticated (also ensures profile exists)
    let subscriptionTier: string | null = null
    if (isAuthenticated && userId && user?.email) {
      subscriptionTier = await getOrCreateUserProfile(userId, user.email)
    } else if (isAuthenticated && userId) {
      subscriptionTier = await getUserSubscriptionTier(userId)
    }

    // Determine rate limit based on authentication and subscription
    const { limit, window, tier } = getUserRateLimit(isAuthenticated, subscriptionTier)

    // Use fingerprint for anonymous to prevent simple IP rotation attacks
    rateLimitIdentifier = isAuthenticated
      ? userId!
      : getAnonymousFingerprint(request, clientIp)
    const rateLimitMax = limit
    const rateLimitWindow = window

    const rateLimitResult = await checkRateLimit(rateLimitIdentifier, rateLimitMax, rateLimitWindow)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          resetAt: rateLimitResult.reset,
          isAnonymous: !isAuthenticated,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString(),
          }
        }
      )
    }

    // 6. Get prompt from DB (server-side only, never exposed to client)
    let basePrompt: string | null = null
    let effectiveTransformationType = transformationType || 'custom'

    if (customPromptId) {
      // Custom prompt requires authentication
      console.log('🔑 Using custom prompt:', customPromptId)

      if (!isAuthenticated || !userId) {
        console.log('❌ Auth failed for custom prompt')
        return NextResponse.json(
          { error: 'Authentication required for custom prompts' },
          { status: 401 }
        )
      }

      basePrompt = await getUserPromptForTransform(customPromptId, userId)
      console.log('✅ Custom prompt retrieved:', !!basePrompt)

      if (!basePrompt) {
        console.log('❌ Custom prompt not found')
        return NextResponse.json(
          { error: 'Custom prompt not found or not accessible' },
          { status: 404 }
        )
      }

      effectiveTransformationType = 'custom'
    } else if (transformationType) {
      console.log('📝 Using standard transformation type:', transformationType)
      basePrompt = await getCachedTransformationPrompt(transformationType)

      if (!basePrompt) {
        return NextResponse.json(
          { error: 'Invalid transformation type' },
          { status: 400 }
        )
      }
    } else {
      console.log('❌ No transformation type or custom prompt provided')
      return NextResponse.json(
        { error: 'Either transformationType or customPromptId is required' },
        { status: 400 }
      )
    }

    // Apply language modifications if targetLanguage is specified
    let systemPrompt = basePrompt
    if (targetLanguage && targetLanguage !== 'auto') {
      const languageNames: Record<string, string> = {
        'cs': 'Czech',
        'sk': 'Slovak',
        'en': 'English',
        'es': 'Spanish',
        'de': 'German',
        'fr': 'French',
      }
      const langName = languageNames[targetLanguage] || targetLanguage
      systemPrompt = systemPrompt.replace(
        /Keep(ing)? the same language as the input/g,
        `Respond in ${langName} language`
      )
      systemPrompt = `IMPORTANT: The output must be in ${langName} language.\n\n${systemPrompt}`
    }

    // Apply humanization rules if enabled
    // Skip humanize for 'response' type - it generates replies, not edits text
    // The humanize rules would confuse the model into editing instead of responding
    if (humanize && transformationType !== 'response') {
      systemPrompt = HUMANIZE_INSTRUCTIONS + '\n\n' + systemPrompt + HUMANIZE_SUFFIX
    }

    const userPrompt = getUserPrompt(sanitizedText)

    const selectedProvider: LLMProvider = provider || DEFAULT_PROVIDER
    const selectedModel = model || getDefaultModel(selectedProvider)

    // Validate model against provider's allowlist
    if (model && !isValidModel(selectedProvider, selectedModel)) {
      return NextResponse.json(
        { error: `Invalid model "${model}" for provider "${selectedProvider}". Please choose a valid model.` },
        { status: 400 }
      )
    }

    // Enforce tier-based model restrictions
    if (!isModelAllowedForTier(selectedProvider, selectedModel, tier)) {
      return NextResponse.json(
        { error: 'This model requires a paid subscription. Please upgrade or choose a different model.' },
        { status: 403 }
      )
    }

    console.log('🤖 Sending to LLM:', {
      provider: selectedProvider,
      model: selectedModel,
      isCustomPrompt: !!customPromptId,
    })
    console.log('📋 FULL SYSTEM PROMPT:')
    console.log('━'.repeat(80))
    console.log(systemPrompt)
    console.log('━'.repeat(80))
    console.log(`📏 Lengths: system=${systemPrompt.length} chars, user=${userPrompt.length} chars`)

    const llmResponse = await callLLM(
      systemPrompt,
      userPrompt,
      selectedProvider,
      selectedModel,
      { temperature: humanize ? 0.6 : 0.3, maxTokens: 2000 }
    )

    const transformedText = llmResponse.content
    const tokensUsed = llmResponse.usage.totalTokens
    const costUsd = llmResponse.costUsd

    const processingTime = Date.now() - startTime

    // 8. Save to database
    try {
      // Save transformation
      await prisma.transformation.create({
        data: {
          userId,
          originalText: sanitizedText,
          transformedText,
          transformationType: effectiveTransformationType,
          modelUsed: llmResponse.model,
          tokensUsed,
          costUsd,
          processingTimeMs: processingTime,
        },
      })

      // Enforce history limit per user - delete oldest records beyond the limit
      if (userId) {
        const historyLimit = getUserHistoryLimit(subscriptionTier)
        const count = await prisma.transformation.count({
          where: { userId },
        })

        if (count > historyLimit) {
          const toDelete = await prisma.transformation.findMany({
            where: { userId },
            orderBy: { createdAt: 'asc' },
            take: count - historyLimit,
            select: { id: true },
          })

          await prisma.transformation.deleteMany({
            where: { id: { in: toDelete.map(t => t.id) } },
          })
        }
      }

      // Save usage log with enhanced tracking for anonymous users
      await prisma.usageLog.create({
        data: {
          userId,
          ipAddress: clientIp,
          endpoint: '/api/transform',
          userAgent: request.headers.get('user-agent')?.substring(0, 255), // Store user agent (truncated)
        },
      })
    } catch (dbError) {
      // Log DB error but don't fail the request
      console.error('Failed to save to database:', dbError)
    }

    // 9. Return success response
    return NextResponse.json({
      success: true,
      data: {
        originalText: sanitizedText,
        transformedText,
        transformationType,
        metadata: {
          tokensUsed,
          costUsd: parseFloat(costUsd.toFixed(6)),
          processingTimeMs: processingTime,
          model: llmResponse.model,
          provider: llmResponse.provider,
        },
        rateLimit: {
          remaining: rateLimitResult.remaining,
          resetAt: rateLimitResult.reset,
          limit: rateLimitMax,
          isAnonymous: !isAuthenticated,
          tier,
        },
      },
    })

  } catch (error: any) {
    console.error('Transform API error:', error)

    // Refund rate limit use on server-side failures - user shouldn't lose a use
    // for errors they can't control (LLM failures, missing API keys, etc.)
    if (rateLimitIdentifier) {
      await refundRateLimitUse(rateLimitIdentifier)
    }

    // Handle LLM API errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'LLM API authentication failed' },
        { status: 500 }
      )
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'LLM rate limit exceeded. Please try again later.' },
        { status: 429 }
      )
    }

    // Handle missing API key errors
    if (error.message?.includes('Missing') && error.message?.includes('environment variable')) {
      return NextResponse.json(
        { error: 'Selected provider is not available. Please choose a different model.' },
        { status: 400 }
      )
    }

    // Generic error response - hide details in production
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { message: error.message })
      },
      { status: 500 }
    )
  }
}

// GET endpoint removed - use /api/transformation-types instead
