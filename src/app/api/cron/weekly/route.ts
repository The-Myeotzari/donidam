import { NextResponse } from 'next/server'
import { broadcastNotification } from '@/shared/lib/notification/sender'
import { buildWeeklyStatsPayload } from '@/shared/lib/notification/conditions'

/**
 * Vercel Cron: 매주 월요일 10:00 KST (01:00 UTC)
 * - B. 통계 인사이트형 (전주 데이터 기반 카테고리 분석)
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await broadcastNotification('stats', buildWeeklyStatsPayload)

  return NextResponse.json({ ok: true })
}
