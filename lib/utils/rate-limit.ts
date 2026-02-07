import { Redis } from '@upstash/redis'

// Initialize Redis client for rate limiting
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

export interface RateLimitResult {
  success: boolean
  limit: number
  remaining: number
  reset: number
}

export async function checkRateLimit(
  identifier: string, // user ID or IP address
  limit: number = 10, // requests per window
  window: number = 3600 // window in seconds (default: 1 hour)
): Promise<RateLimitResult> {
  const key = `rate_limit:${identifier}`

  try {
    const current = await redis.incr(key)

    // Set expiry on first request
    if (current === 1) {
      await redis.expire(key, window)
    }

    const ttl = await redis.ttl(key)
    const resetTime = Math.floor(Date.now() / 1000) + ttl

    return {
      success: current <= limit,
      limit,
      remaining: Math.max(0, limit - current),
      reset: resetTime,
    }
  } catch (error) {
    console.error('Rate limit check failed:', error)
    // Fail closed for security - deny requests if Redis is unavailable
    // This prevents abuse when rate limiting infrastructure is down
    return {
      success: false,
      limit,
      remaining: 0,
      reset: Math.floor(Date.now() / 1000) + window,
    }
  }
}

/**
 * Refund a rate limit use (e.g. when a request fails due to server error).
 * Decrements the counter so the user doesn't lose a use for a failed attempt.
 */
export async function refundRateLimitUse(identifier: string): Promise<void> {
  const key = `rate_limit:${identifier}`
  try {
    const current = await redis.get<number>(key)
    if (current && current > 0) {
      await redis.decr(key)
    }
  } catch (error) {
    console.error('Failed to refund rate limit use:', error)
  }
}

export async function getRemainingQuota(
  identifier: string,
  limit: number = 10
): Promise<number> {
  const key = `rate_limit:${identifier}`

  try {
    const current = await redis.get<number>(key)
    if (!current) return limit

    return Math.max(0, limit - current)
  } catch (error) {
    console.error('Failed to get remaining quota:', error)
    return limit
  }
}
