import { prisma } from '@/lib/db/prisma'
import { HISTORY_RETENTION_DAYS } from '@/lib/constants/history-limits'

/**
 * Cleanup old transformation history based on retention policy.
 * - Free users: records older than 30 days
 * - Paid users: records older than 365 days
 * - Anonymous records (no userId): older than 7 days
 */
export async function cleanupHistory(): Promise<{
  deletedFree: number
  deletedPaid: number
  deletedAnonymous: number
}> {
  const now = new Date()

  // 1. Delete anonymous (no userId) transformations older than 7 days
  const anonymousCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const deletedAnonymous = await prisma.transformation.deleteMany({
    where: {
      userId: null,
      createdAt: { lt: anonymousCutoff },
    },
  })

  // 2. Delete free-tier user transformations beyond retention
  const freeCutoff = new Date(
    now.getTime() - HISTORY_RETENTION_DAYS.free * 24 * 60 * 60 * 1000
  )
  const freeUserIds = await prisma.userProfile.findMany({
    where: {
      subscriptionTier: { notIn: ['paid', 'pro', 'premium'] },
    },
    select: { id: true },
  })
  const deletedFree = await prisma.transformation.deleteMany({
    where: {
      userId: { in: freeUserIds.map((u) => u.id) },
      createdAt: { lt: freeCutoff },
    },
  })

  // 3. Delete paid-tier user transformations beyond retention
  const paidCutoff = new Date(
    now.getTime() - HISTORY_RETENTION_DAYS.paid * 24 * 60 * 60 * 1000
  )
  const paidUserIds = await prisma.userProfile.findMany({
    where: {
      subscriptionTier: { in: ['paid', 'pro', 'premium'] },
    },
    select: { id: true },
  })
  const deletedPaid = await prisma.transformation.deleteMany({
    where: {
      userId: { in: paidUserIds.map((u) => u.id) },
      createdAt: { lt: paidCutoff },
    },
  })

  // 4. Clean up old usage logs (older than 90 days for all users)
  const usageLogCutoff = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
  await prisma.usageLog.deleteMany({
    where: {
      createdAt: { lt: usageLogCutoff },
    },
  })

  return {
    deletedFree: deletedFree.count,
    deletedPaid: deletedPaid.count,
    deletedAnonymous: deletedAnonymous.count,
  }
}
