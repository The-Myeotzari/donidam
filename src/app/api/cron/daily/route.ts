import { NextResponse } from 'next/server'
import { broadcastNotification } from '@/shared/lib/notification/sender'
import { buildRetentionPayload, buildNodamPayload } from '@/shared/lib/notification/conditions'

/**
 * Vercel Cron: 매일 21:30 KST (12:30 UTC)
 * - C. 리텐션 유도형 (당일 기록 0건 시 nudge)
 * - E. 노담 일일 성공 축하
 */
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await Promise.allSettled([
    broadcastNotification('retention', buildRetentionPayload),
    broadcastNotification('nodam', buildNodamPayload),
  ])

  return NextResponse.json({ ok: true })
}
