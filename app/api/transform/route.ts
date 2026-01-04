import { NextRequest, NextResponse } from 'next/server'
import { openai, DEFAULT_MODEL, MODEL_PRICING } from '@/lib/llm/openai'
import { getSystemPrompt, getUserPrompt } from '@/lib/llm/prompts'
import { transformTextSchema, sanitizeText, detectPromptInjection } from '@/lib/utils/validation'
import { checkRateLimit } from '@/lib/utils/rate-limit'
import { prisma } from '@/lib/db/prisma'
import { createClient } from '@/lib/auth/supabase-server'

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    // 1. Get authenticated user - REQUIRED for API access
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    // Reject unauthenticated requests
    if (!user || authError) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to use this feature.' },
        { status: 401 }
      )
    }

    const userId = user.id

    // 2. Parse and validate request body
    const body = await request.json()
    const validationResult = transformTextSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validationResult.error.issues },
        { status: 400 }
      )
    }

    const { text, transformationType } = validationResult.data

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
      // Vercel sets x-forwarded-for with original client IP first
      const forwarded = req.headers.get('x-forwarded-for')
      if (forwarded) {
        // First IP in comma-separated list is the original client
        const ips = forwarded.split(',').map(ip => ip.trim())
        return ips[0] || 'unknown'
      }
      return req.headers.get('x-real-ip') || 'unknown'
    }

    const clientIp = getClientIp(request)

    // 6. Check rate limiting (10 requests per hour for free tier)
    const rateLimitResult = await checkRateLimit(clientIp, 10, 3600)

    if (!rateLimitResult.success) {
      return NextResponse.json(
        {
          error: 'Rate limit exceeded',
          limit: rateLimitResult.limit,
          remaining: rateLimitResult.remaining,
          resetAt: rateLimitResult.reset,
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

    // 6. Call OpenAI API
    const systemPrompt = getSystemPrompt(transformationType)
    const userPrompt = getUserPrompt(sanitizedText)

    const completion = await openai.chat.completions.create({
      model: DEFAULT_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.3, // Lower temperature for more consistent results
      max_tokens: 2000,
    })

    const transformedText = completion.choices[0]?.message?.content || ''
    const tokensUsed = completion.usage?.total_tokens || 0

    // 7. Calculate cost
    const inputTokens = completion.usage?.prompt_tokens || 0
    const outputTokens = completion.usage?.completion_tokens || 0
    const pricing = MODEL_PRICING[DEFAULT_MODEL]
    const costUsd = (
      (inputTokens / 1_000_000) * pricing.input +
      (outputTokens / 1_000_000) * pricing.output
    )

    const processingTime = Date.now() - startTime

    // 8. Save to database
    try {
      // Save transformation
      await prisma.transformation.create({
        data: {
          userId,
          originalText: sanitizedText,
          transformedText,
          transformationType,
          modelUsed: DEFAULT_MODEL,
          tokensUsed,
          costUsd,
          processingTimeMs: processingTime,
        },
      })

      // Save usage log
      await prisma.usageLog.create({
        data: {
          userId,
          ipAddress: clientIp,
          endpoint: '/api/transform',
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
          model: DEFAULT_MODEL,
        },
        rateLimit: {
          remaining: rateLimitResult.remaining - 1,
          resetAt: rateLimitResult.reset,
        },
      },
    })

  } catch (error: any) {
    console.error('Transform API error:', error)

    // Handle OpenAI specific errors
    if (error.status === 401) {
      return NextResponse.json(
        { error: 'OpenAI API authentication failed' },
        { status: 500 }
      )
    }

    if (error.status === 429) {
      return NextResponse.json(
        { error: 'OpenAI rate limit exceeded. Please try again later.' },
        { status: 429 }
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

// GET endpoint to retrieve transformation types
export async function GET() {
  return NextResponse.json({
    transformationTypes: [
      { id: 'grammar', label: 'Grammar & Spelling', description: 'Fix grammatical errors and spelling mistakes' },
      { id: 'formal', label: 'Formal Style', description: 'Convert to professional, formal writing' },
      { id: 'informal', label: 'Informal Style', description: 'Convert to casual, conversational writing' },
      { id: 'legal', label: 'Legal Style', description: 'Transform into formal legal writing' },
      { id: 'summary', label: 'Summarize', description: 'Create a concise summary (30-50% of original)' },
      { id: 'expand', label: 'Expand', description: 'Elaborate and expand the text (150-200%)' },
    ],
  })
}
