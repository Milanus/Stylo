import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase-server'
import { prisma } from '@/lib/db/prisma'
import { createUserPromptSchema } from '@/lib/utils/validation'
import { getUserPromptLimit } from '@/lib/constants/user-prompt-limits'
import { generateUserPrompt } from '@/lib/llm/prompt-generator'

// API Key validation
const API_KEY = process.env.STYLO_API_KEY

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === API_KEY && API_KEY !== undefined && API_KEY !== ''
}

// Helper for auth (supports both web and mobile)
async function authenticateUser(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.substring(7)
    const { createClient: createServiceClient } = await import(
      '@supabase/supabase-js'
    )
    const supabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    return supabase.auth.getUser(token)
  }

  const supabase = await createClient()
  return supabase.auth.getUser()
}

// Helper to get user's subscription tier
async function getUserSubscriptionTier(userId: string): Promise<string> {
  const profile = await prisma.userProfile.findUnique({
    where: { id: userId },
    select: { subscriptionTier: true },
  })
  return profile?.subscriptionTier || 'free'
}

/**
 * GET /api/user-prompts
 * List all user's custom prompts (metadata only, no prompt content)
 */
export async function GET(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    const {
      data: { user },
      error: authError,
    } = await authenticateUser(request)

    if (!user || authError) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const prompts = await prisma.userPrompt.findMany({
      where: { userId: user.id, isActive: true },
      select: {
        id: true,
        name: true,
        prompt: true,
        keywords: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    // Get user's limit info
    const subscriptionTier = await getUserSubscriptionTier(user.id)
    const limit = getUserPromptLimit(subscriptionTier)

    return NextResponse.json({
      success: true,
      data: prompts,
      meta: {
        count: prompts.length,
        limit: limit === Infinity ? null : limit,
        remaining:
          limit === Infinity ? null : Math.max(0, limit - prompts.length),
      },
    })
  } catch (error) {
    console.error('GET /api/user-prompts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * POST /api/user-prompts
 * Create a new custom prompt
 */
export async function POST(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    const {
      data: { user },
      error: authError,
    } = await authenticateUser(request)

    if (!user || authError) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Parse and validate body
    const body = await request.json()
    const validation = createUserPromptSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { name, keywords } = validation.data

    // Check user's limit
    const subscriptionTier = await getUserSubscriptionTier(user.id)
    const limit = getUserPromptLimit(subscriptionTier)

    const existingCount = await prisma.userPrompt.count({
      where: { userId: user.id, isActive: true },
    })

    if (existingCount >= limit) {
      return NextResponse.json(
        {
          error: 'Prompt limit reached',
          limit,
          message:
            subscriptionTier === 'free'
              ? 'Upgrade to paid plan for unlimited prompts'
              : 'Maximum prompts reached',
        },
        { status: 403 }
      )
    }

    // Check for duplicate name
    const existingName = await prisma.userPrompt.findUnique({
      where: { userId_name: { userId: user.id, name } },
    })

    if (existingName) {
      return NextResponse.json(
        { error: 'A prompt with this name already exists' },
        { status: 409 }
      )
    }

    // Generate prompt from keywords using LLM
    console.log('🤖 Generating prompt from keywords:', keywords)
    let generatedPrompt: string
    try {
      generatedPrompt = await generateUserPrompt(keywords)
      console.log('✅ Prompt generated successfully')
    } catch (error) {
      console.error('❌ Failed to generate prompt:', error)
      return NextResponse.json(
        { error: 'Failed to generate prompt from keywords' },
        { status: 500 }
      )
    }

    // Create the prompt
    const newPrompt = await prisma.userPrompt.create({
      data: {
        userId: user.id,
        name,
        prompt: generatedPrompt,
        keywords,
      },
      select: {
        id: true,
        name: true,
        prompt: true,
        keywords: true,
        isActive: true,
        createdAt: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        data: newPrompt,
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('POST /api/user-prompts error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
