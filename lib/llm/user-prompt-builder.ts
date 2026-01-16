import { prisma } from '@/lib/db/prisma'

/**
 * Get user's custom prompt for text transformation
 * Returns the stored LLM-generated prompt from database
 * Called ONLY server-side - never expose to frontend
 *
 * @param customPromptId UUID of the custom prompt
 * @param userId UUID of the user (for ownership verification)
 * @returns Complete system prompt for text transformation, or null if not found
 */
export async function getUserPromptForTransform(
  customPromptId: string,
  userId: string
): Promise<string | null> {
  const userPrompt = await prisma.userPrompt.findFirst({
    where: {
      id: customPromptId,
      userId: userId, // Security: ensure ownership
      isActive: true,
    },
    select: {
      prompt: true,
    },
  })

  return userPrompt?.prompt || null
}
