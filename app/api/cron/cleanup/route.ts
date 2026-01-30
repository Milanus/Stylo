import { NextRequest, NextResponse } from 'next/server'
import { cleanupHistory } from '@/lib/jobs/cleanup-history'

/**
 * GET /api/cron/cleanup
 * Vercel Cron Job endpoint - runs daily to clean up old history data.
 * Protected by CRON_SECRET to prevent unauthorized access.
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const result = await cleanupHistory()

    console.log('Cleanup completed:', result)

    return NextResponse.json({
      success: true,
      deleted: result,
    })
  } catch (error) {
    console.error('Cleanup cron failed:', error)
    return NextResponse.json(
      { error: 'Cleanup failed' },
      { status: 500 }
    )
  }
}
