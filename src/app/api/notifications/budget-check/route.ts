import { NextResponse } from 'next/server'
import { sendNotificationToUser } from '@/shared/lib/notification/sender'
import { buildBudgetPayload } from '@/shared/lib/notification/conditions'
import { getUser } from '@/shared/lib/api/getUser'
import { apiError } from '@/shared/lib/api/apiError'

/**
 * POST /api/notifications/budget-check
 * 결제(지출 등록) 직후 호출 → 예산 알림 판단 후 발송
 */
export async function POST(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response
  const { user } = auth

  const payload = await buildBudgetPayload(user.id)
  if (!payload) return new NextResponse(null, { status: 204 })

  try {
    await sendNotificationToUser(user.id, 'budget', payload)
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Unknown error'
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, message)
  }

  return NextResponse.json({ ok: true })
}
