import { prisma } from '@/lib/db/prisma'

// In-memory cache
let cachedTypes: any[] | null = null
let cacheTime = 0
const CACHE_TTL = 5 * 60 * 1000 // 5 minút

export interface TransformationTypePublic {
  slug: string
  label: string
  description: string
  icon: string
  sortOrder: number
}

export interface TransformationTypeWithPrompt {
  slug: string
  label: string
  description: string
  icon: string
  prompt: string
  sortOrder: number
}

/**
 * Get all active transformation types (without prompts)
 * Cached for 5 minutes
 */
export async function getCachedTransformationTypes(): Promise<TransformationTypePublic[]> {
  if (cachedTypes && Date.now() - cacheTime < CACHE_TTL) {
    return cachedTypes
  }

  const types = await prisma.transformationType.findMany({
    where: { isActive: true },
    select: {
      slug: true,
      label: true,
      description: true,
      icon: true,
      sortOrder: true,
    },
    orderBy: { sortOrder: 'asc' },
  })

  cachedTypes = types
  cacheTime = Date.now()

  return types
}

/**
 * Get prompt for specific transformation type
 * Server-side only - prompts are NEVER sent to frontend
 */
export async function getCachedTransformationPrompt(slug: string): Promise<string | null> {
  const type = await prisma.transformationType.findUnique({
    where: { slug, isActive: true },
    select: { prompt: true },
  })

  return type?.prompt || null
}

/**
 * Get full transformation type details (including prompt)
 * Server-side only
 */
export async function getCachedTransformationType(slug: string): Promise<TransformationTypeWithPrompt | null> {
  const type = await prisma.transformationType.findUnique({
    where: { slug, isActive: true },
    select: {
      slug: true,
      label: true,
      description: true,
      icon: true,
      prompt: true,
      sortOrder: true,
    },
  })

  return type
}

/**
 * Invalidate cache - call this when transformation types are updated
 */
export function invalidateCache() {
  cachedTypes = null
  cacheTime = 0
}

/**
 * Get all active transformation slugs for validation
 */
export async function getActiveTransformationSlugs(): Promise<string[]> {
  const types = await getCachedTransformationTypes()
  return types.map(t => t.slug)
}
