import { NextResponse } from 'next/server'
import { getCachedTransformationTypes } from '@/lib/cache/transformation-types'

/**
 * GET /api/transformation-types
 * Returns list of available transformation types (without prompts for security)
 */
export async function GET() {
  try {
    const types = await getCachedTransformationTypes()

    return NextResponse.json({
      success: true,
      data: types,
    })
  } catch (error) {
    console.error('Failed to fetch transformation types:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch transformation types',
      },
      { status: 500 }
    )
  }
}
