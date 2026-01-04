import { createClient } from '@/lib/auth/supabase-server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const errorDescription = requestUrl.searchParams.get('error_description')
  const origin = requestUrl.origin

  // Handle OAuth errors from provider
  if (error) {
    console.error('OAuth error:', error, errorDescription)
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(error)}&message=${encodeURIComponent(errorDescription || 'Authentication failed')}`
    )
  }

  // Validate authorization code exists
  if (!code) {
    console.error('Missing authorization code in callback')
    return NextResponse.redirect(
      `${origin}/login?error=missing_code&message=${encodeURIComponent('Authorization code not found')}`
    )
  }

  try {
    // Exchange code for session
    const supabase = await createClient()
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)

    if (exchangeError) {
      console.error('Failed to exchange code for session:', exchangeError)
      return NextResponse.redirect(
        `${origin}/login?error=auth_exchange_failed&message=${encodeURIComponent('Failed to complete authentication')}`
      )
    }

    // Verify we have a valid session
    if (!data?.session) {
      console.error('No session returned after code exchange')
      return NextResponse.redirect(
        `${origin}/login?error=no_session&message=${encodeURIComponent('Authentication session not established')}`
      )
    }

    // Success - redirect to dashboard
    console.log('Authentication successful for user:', data.user?.email)
    return NextResponse.redirect(`${origin}/dashboard`)

  } catch (err) {
    console.error('Unexpected error during authentication callback:', err)
    return NextResponse.redirect(
      `${origin}/login?error=unexpected_error&message=${encodeURIComponent('An unexpected error occurred')}`
    )
  }
}
