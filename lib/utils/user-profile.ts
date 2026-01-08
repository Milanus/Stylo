import { prisma } from '@/lib/db/prisma'

/**
 * Get user's subscription tier from database
 * @param userId - Supabase user ID
 * @returns User's subscription tier or null if not found
 */
export async function getUserSubscriptionTier(userId: string): Promise<string | null> {
  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: { id: userId },
      select: { subscriptionTier: true },
    })

    return userProfile?.subscriptionTier || null
  } catch (error) {
    console.error('Failed to fetch user subscription tier:', error)
    // Return null on error - will default to 'free' tier
    return null
  }
}

/**
 * Get or create user profile with subscription tier
 * Ensures user profile exists in database
 * @param userId - Supabase user ID
 * @param email - User's email address
 * @returns User's subscription tier
 */
export async function getOrCreateUserProfile(userId: string, email: string): Promise<string> {
  try {
    const userProfile = await prisma.userProfile.upsert({
      where: { id: userId },
      update: {},
      create: {
        id: userId,
        email,
        subscriptionTier: 'free', // Default to free tier
      },
      select: { subscriptionTier: true },
    })

    return userProfile.subscriptionTier
  } catch (error) {
    console.error('Failed to get or create user profile:', error)
    // Default to 'free' tier on error
    return 'free'
  }
}
