import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase-server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { prisma } from '@/lib/db/prisma'

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
    // 1. Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

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

    // 4. Sign out the user
    await supabase.auth.signOut()

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
