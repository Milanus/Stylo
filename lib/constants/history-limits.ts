// Limits for transformation history storage based on subscription tier

export const HISTORY_LIMITS = {
  free: 50,
  paid: 100,
} as const

// Retention policy - max age of history records in days per tier
export const HISTORY_RETENTION_DAYS = {
  free: 30,
  paid: 200,
} as const

/**
 * Get the maximum number of stored transformations for a user's subscription tier.
 */
export function getUserHistoryLimit(subscriptionTier: string | null): number {
  const isPaid =
    subscriptionTier &&
    ['paid', 'pro', 'premium'].includes(subscriptionTier.toLowerCase())
  return isPaid ? HISTORY_LIMITS.paid : HISTORY_LIMITS.free
}

/**
 * Get the retention period in days for a user's subscription tier.
 */
export function getUserRetentionDays(subscriptionTier: string | null): number {
  const isPaid =
    subscriptionTier &&
    ['paid', 'pro', 'premium'].includes(subscriptionTier.toLowerCase())
  return isPaid ? HISTORY_RETENTION_DAYS.paid : HISTORY_RETENTION_DAYS.free
}
