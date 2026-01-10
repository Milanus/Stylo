import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/db/prisma'

// API Key validation
const API_KEY = process.env.STYLO_API_KEY

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === API_KEY && API_KEY !== undefined && API_KEY !== ''
}

/**
 * DELETE /api/user/delete
 * Deletes the authenticated user's account and all associated data
 *
 * This endpoint:
 * 1. Verifies the user is authenticated
 * 2. Deletes all user data from database (cascades automatically via Prisma schema)
 * 3. Deletes the user from Supabase Auth
 *
 * Data deleted:
 * - User profile
 * - All transformations
 * - All usage logs
 * - Subscription (if exists)
 */
export async function DELETE(request: NextRequest) {
  try {
    // 0. Validate API Key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    // 1. Get authenticated user - check both Authorization header (mobile) and cookies (web)
    const authHeader = request.headers.get('authorization')
    let user = null
    let authError = null

    if (authHeader?.startsWith('Bearer ')) {
      // Mobile app with Authorization header
      const token = authHeader.substring(7)
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
        { error: 'Authentication required' },
        { status: 401 }
      )
    }

    const userId = user.id

    // 2. Delete user profile from database
    // This will cascade delete all related data (transformations, usage_logs, subscriptions)
    // thanks to onDelete: Cascade in Prisma schema
    try {
      await prisma.userProfile.delete({
        where: {
          id: userId,
        },
      })
    } catch (dbError: any) {
      // If user profile doesn't exist in DB, continue to delete from Auth
      if (dbError.code !== 'P2025') { // P2025 = Record not found
        console.error('Failed to delete user profile from database:', dbError)
        return NextResponse.json(
          { error: 'Failed to delete user data from database' },
          { status: 500 }
        )
      }
    }

    // 3. Delete user from Supabase Auth using service role client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const supabaseAdmin = createServiceClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { error: deleteAuthError } = await supabaseAdmin.auth.admin.deleteUser(userId)

    if (deleteAuthError) {
      console.error('Failed to delete user from Supabase Auth:', deleteAuthError)
      return NextResponse.json(
        { error: 'Failed to delete user account' },
        { status: 500 }
      )
    }

    // 4. Return success (user is already deleted from auth)
    return NextResponse.json({
      success: true,
      message: 'Account deleted successfully',
    })

  } catch (error: any) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      {
        error: 'Internal server error',
        ...(process.env.NODE_ENV === 'development' && { message: error.message })
      },
      { status: 500 }
    )
  }
}
