import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase-server'
import { prisma } from '@/lib/db/prisma'

// API Key validation - required for external clients (Android), optional for same-origin (web)
const API_KEY = process.env.STYLO_API_KEY

function validateApiKey(request: NextRequest): boolean {
  // Check if request is from same origin (web app) - skip API key check
  const origin = request.headers.get('origin')
  const referer = request.headers.get('referer')
  const host = request.headers.get('host')

  // If request comes from same origin (no origin header or matching host), allow it
  const isSameOrigin = !origin || (host && (origin.includes(host) || referer?.includes(host)))
  if (isSameOrigin) {
    return true
  }

  // For external clients (Android app), require API key
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

    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
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
