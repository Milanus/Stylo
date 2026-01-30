import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase-server'
import { prisma } from '@/lib/db/prisma'
import { getOrCreateUserProfile } from '@/lib/utils/user-profile'

// API Key validation
const API_KEY = process.env.STYLO_API_KEY

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === API_KEY && API_KEY !== undefined && API_KEY !== ''
}

/**
 * GET /api/history
 * Fetches user's transformation history
 */
export async function GET(request: NextRequest) {
  try {
    // Validate API Key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    // Get authenticated user - check both Authorization header (mobile) and cookies (web)
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

    if (!user || authError) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    // Ensure user profile exists in database
    if (user.email) {
      await getOrCreateUserProfile(user.id, user.email)
    }

    // Get transformations ordered by most recent
    const transformations = await prisma.transformation.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50, // Limit to last 50 transformations
      select: {
        id: true,
        originalText: true,
        transformedText: true,
        transformationType: true,
        createdAt: true,
      },
    })

    return NextResponse.json({
      success: true,
      data: transformations,
    })
  } catch (error: any) {
    console.error('Fetch history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/history
 * Deletes user's transformation history.
 * - Send { "id": "..." } to delete a single record
 * - Send { "all": true } to delete all history
 */
export async function DELETE(request: NextRequest) {
  try {
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    const authHeader = request.headers.get('authorization')
    let user = null
    let authError = null

    if (authHeader?.startsWith('Bearer ')) {
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
      const supabase = await createClient()
      const result = await supabase.auth.getUser()
      user = result.data.user
      authError = result.error
    }

    if (!user || authError) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 }
      )
    }

    const body = await request.json()

    // Bulk delete - all history
    if (body.all === true) {
      const result = await prisma.transformation.deleteMany({
        where: { userId: user.id },
      })

      return NextResponse.json({
        success: true,
        deleted: result.count,
      })
    }

    // Single delete by id
    if (body.id && typeof body.id === 'string') {
      const record = await prisma.transformation.findFirst({
        where: { id: body.id, userId: user.id },
      })

      if (!record) {
        return NextResponse.json(
          { error: 'Record not found' },
          { status: 404 }
        )
      }

      await prisma.transformation.delete({
        where: { id: body.id },
      })

      return NextResponse.json({
        success: true,
        deleted: 1,
      })
    }

    return NextResponse.json(
      { error: 'Provide either { "id": "..." } or { "all": true }' },
      { status: 400 }
    )
  } catch (error: any) {
    console.error('Delete history error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
