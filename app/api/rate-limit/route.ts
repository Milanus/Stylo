import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/auth/supabase-server'
import { Redis } from '@upstash/redis'
import { getUserRateLimit } from '@/lib/constants/rate-limits'
import { getUserSubscriptionTier } from '@/lib/utils/user-profile'

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

// API Key validation
const API_KEY = process.env.STYLO_API_KEY

function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get('x-api-key')
  return apiKey === API_KEY && API_KEY !== undefined && API_KEY !== ''
}

export async function GET(request: NextRequest) {
  try {
    // Validate API Key
    if (!validateApiKey(request)) {
      return NextResponse.json(
        { error: 'Invalid or missing API key' },
        { status: 401 }
      )
    }

    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    const isAuthenticated = !!(user && !authError)
    const userId = user?.id || null

    // Get client IP for anonymous users
    const getClientIp = (req: NextRequest): string => {
      const cfConnectingIp = req.headers.get('cf-connecting-ip')
      if (cfConnectingIp) return cfConnectingIp

      const forwarded = req.headers.get('x-forwarded-for')
      if (forwarded) {
        const ips = forwarded.split(',').map(ip => ip.trim())
        return ips[0] || 'unknown'
      }

      return req.headers.get('x-real-ip') || 'unknown'
    }

    // Create anonymous fingerprint
    const getAnonymousFingerprint = (req: NextRequest, ip: string): string => {
      const components = [
        ip,
        req.headers.get('user-agent') || '',
        req.headers.get('accept-language') || '',
        req.headers.get('accept-encoding') || '',
      ]
      return `anon:${components.join(':').substring(0, 64)}`
    }

    const clientIp = getClientIp(request)

    // Fetch user's subscription tier if authenticated
    let subscriptionTier: string | null = null
    if (isAuthenticated && userId) {
      subscriptionTier = await getUserSubscriptionTier(userId)
    }

    // Determine rate limit based on authentication and subscription
    const { limit, tier } = getUserRateLimit(isAuthenticated, subscriptionTier)

    const rateLimitIdentifier = isAuthenticated
      ? userId!
      : getAnonymousFingerprint(request, clientIp)

    const key = `rate_limit:${rateLimitIdentifier}`

    // Get current usage from Redis
    const currentValue = await redis.get(key)
    const current = currentValue ? parseInt(String(currentValue), 10) : 0
    const ttl = await redis.ttl(key)
    const resetTime = ttl > 0 ? Math.floor(Date.now() / 1000) + ttl : null

    return NextResponse.json({
      limit,
      remaining: Math.max(0, limit - current),
      used: current,
      resetAt: resetTime,
      isAuthenticated,
      tier,
    })
  } catch (error) {
    console.error('Failed to get rate limit status:', error)
    return NextResponse.json(
      { error: 'Failed to get rate limit status' },
      { status: 500 }
    )
  }
}
