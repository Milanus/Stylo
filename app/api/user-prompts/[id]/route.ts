import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase-server'
import { prisma } from '@/lib/db/prisma'
import { updateUserPromptSchema } from '@/lib/utils/validation'
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

type RouteContext = {
  params: Promise<{ id: string }>
}

/**
 * GET /api/user-prompts/[id]
 * Get single prompt details
 */
export async function GET(request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params

    const prompt = await prisma.userPrompt.findFirst({
      where: {
        id,
        userId: user.id,
        isActive: true,
      },
      select: {
        id: true,
        name: true,
        prompt: true,
        keywords: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: prompt,
    })
  } catch (error) {
    console.error('GET /api/user-prompts/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * PATCH /api/user-prompts/[id]
 * Update a prompt
 */
export async function PATCH(request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params

    // Check ownership
    const existingPrompt = await prisma.userPrompt.findFirst({
      where: {
        id,
        userId: user.id,
        isActive: true,
      },
    })

    if (!existingPrompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Parse and validate body
    const body = await request.json()
    const validation = updateUserPromptSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: validation.error.issues,
        },
        { status: 400 }
      )
    }

    const { regenerate, ...updateData } = validation.data

    // Check for duplicate name if name is being changed
    if (updateData.name && updateData.name !== existingPrompt.name) {
      const duplicateName = await prisma.userPrompt.findUnique({
        where: { userId_name: { userId: user.id, name: updateData.name } },
      })

      if (duplicateName) {
        return NextResponse.json(
          { error: 'A prompt with this name already exists' },
          { status: 409 }
        )
      }
    }

    // If regenerate flag is true and keywords are provided, regenerate prompt
    if (regenerate && updateData.keywords && updateData.keywords.length > 0) {
      console.log('🔄 Regenerating prompt from keywords:', updateData.keywords)
      try {
        const newPrompt = await generateUserPrompt(updateData.keywords)
        updateData.prompt = newPrompt
        console.log('✅ Prompt regenerated successfully')
      } catch (error) {
        console.error('❌ Failed to regenerate prompt:', error)
        return NextResponse.json(
          { error: 'Failed to regenerate prompt from keywords' },
          { status: 500 }
        )
      }
    }

    // Update the prompt
    const updatedPrompt = await prisma.userPrompt.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        prompt: true,
        keywords: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: updatedPrompt,
    })
  } catch (error) {
    console.error('PATCH /api/user-prompts/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/user-prompts/[id]
 * Soft delete (set isActive = false)
 */
export async function DELETE(request: NextRequest, context: RouteContext) {
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

    const { id } = await context.params

    // Check ownership
    const existingPrompt = await prisma.userPrompt.findFirst({
      where: {
        id,
        userId: user.id,
        isActive: true,
      },
    })

    if (!existingPrompt) {
      return NextResponse.json({ error: 'Prompt not found' }, { status: 404 })
    }

    // Soft delete
    await prisma.userPrompt.update({
      where: { id },
      data: { isActive: false },
    })

    return NextResponse.json({
      success: true,
      message: 'Prompt deleted successfully',
    })
  } catch (error) {
    console.error('DELETE /api/user-prompts/[id] error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
