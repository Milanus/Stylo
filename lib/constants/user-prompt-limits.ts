// Limits for custom user prompts based on subscription tier

export const USER_PROMPT_LIMITS = {
  free: 3,
  paid: Infinity,
} as const

export const KEYWORD_LIMITS = {
  min: 3,
  max: 10,
} as const

export const KEYWORD_MAX_LENGTH = 30

export function getUserPromptLimit(subscriptionTier: string | null): number {
  const isPaid =
    subscriptionTier &&
    ['paid', 'pro', 'premium'].includes(subscriptionTier.toLowerCase())
  return isPaid ? USER_PROMPT_LIMITS.paid : USER_PROMPT_LIMITS.free
}
