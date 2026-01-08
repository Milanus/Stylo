// Single source of truth for rate limit configurations
// Follows the pattern established in transformations.ts

/**
 * Rate limit constants - easy to import and use directly
 */
export const ANONYMOUS_LIMIT = 6
export const FREE_LIMIT = 20
export const PAID_LIMIT = 100
export const RATE_LIMIT_WINDOW = 3600 // 1 hour in seconds

/**
 * Rate limit tiers based on user subscription status
 */
export const RATE_LIMIT_TIERS = {
  ANONYMOUS: {
    id: 'anonymous' as const,
    limit: ANONYMOUS_LIMIT,
    window: RATE_LIMIT_WINDOW,
    description: 'Unauthenticated users (guest mode)',
  },
  FREE: {
    id: 'free' as const,
    limit: FREE_LIMIT,
    window: RATE_LIMIT_WINDOW,
    description: 'Free registered users',
  },
  PAID: {
    id: 'paid' as const,
    limit: PAID_LIMIT,
    window: RATE_LIMIT_WINDOW,
    description: 'Premium subscribers',
  },
} as const

/**
 * Type representing possible subscription tiers
 */
export type SubscriptionTier = 'anonymous' | 'free' | 'paid'

/**
 * Helper function to determine user's rate limit based on authentication and subscription
 * @param isAuthenticated - Whether the user is logged in
 * @param subscriptionTier - User's subscription tier from database (e.g., 'free', 'paid', 'pro', 'premium')
 * @returns Rate limit configuration for the user
 */
export function getUserRateLimit(
  isAuthenticated: boolean,
  subscriptionTier?: string | null
): { limit: number; window: number; tier: SubscriptionTier } {
  // Anonymous users
  if (!isAuthenticated) {
    return {
      limit: RATE_LIMIT_TIERS.ANONYMOUS.limit,
      window: RATE_LIMIT_TIERS.ANONYMOUS.window,
      tier: 'anonymous',
    }
  }

  // Authenticated users - check subscription tier
  // Map various paid tier names to 'paid' category
  const isPaidUser = subscriptionTier && ['paid', 'pro', 'premium'].includes(subscriptionTier.toLowerCase())

  if (isPaidUser) {
    return {
      limit: RATE_LIMIT_TIERS.PAID.limit,
      window: RATE_LIMIT_TIERS.PAID.window,
      tier: 'paid',
    }
  }

  // Default to free tier for authenticated users
  return {
    limit: RATE_LIMIT_TIERS.FREE.limit,
    window: RATE_LIMIT_TIERS.FREE.window,
    tier: 'free',
  }
}

/**
 * Get rate limit for a specific tier (for display purposes)
 */
export function getRateLimitByTier(tier: SubscriptionTier): { limit: number; window: number } {
  switch (tier) {
    case 'anonymous':
      return { limit: RATE_LIMIT_TIERS.ANONYMOUS.limit, window: RATE_LIMIT_TIERS.ANONYMOUS.window }
    case 'free':
      return { limit: RATE_LIMIT_TIERS.FREE.limit, window: RATE_LIMIT_TIERS.FREE.window }
    case 'paid':
      return { limit: RATE_LIMIT_TIERS.PAID.limit, window: RATE_LIMIT_TIERS.PAID.window }
  }
}

/**
 * Get all rate limit tiers for display in UI (pricing page, modals, etc.)
 */
export function getAllRateLimitTiers() {
  return {
    anonymous: RATE_LIMIT_TIERS.ANONYMOUS,
    free: RATE_LIMIT_TIERS.FREE,
    paid: RATE_LIMIT_TIERS.PAID,
  }
}
