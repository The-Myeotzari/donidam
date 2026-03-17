import { NextResponse } from 'next/server'
import { z } from 'zod'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'

const SubscribeSchema = z.object({
  endpoint: z.string().url(),
  p256dh: z.string().min(1),
  auth: z.string().min(1),
})

// POST /api/notifications/subscribe — 푸시 구독 등록
export async function POST(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response
  const { supabase, user } = auth

  let raw: unknown
  try {
    raw = await request.json()
  } catch {
    return apiError(request, 'INVALID_REQUEST', 400, 'Invalid JSON body')
  }

  const parsed = SubscribeSchema.safeParse(raw)
  if (!parsed.success) {
    return apiError(request, 'INVALID_REQUEST', 400, parsed.error.issues[0].message)
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .upsert({ user_id: user.id, ...parsed.data }, { onConflict: 'endpoint' })

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return new NextResponse(null, { status: 204 })
}

// DELETE /api/notifications/subscribe — 푸시 구독 해제
export async function DELETE(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response
  const { supabase, user } = auth

  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')

  if (!endpoint) {
    return apiError(request, 'INVALID_REQUEST', 400, 'endpoint 파라미터가 필요합니다')
  }

  const { error } = await supabase
    .from('push_subscriptions')
    .delete()
    .eq('user_id', user.id)
    .eq('endpoint', endpoint)

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return new NextResponse(null, { status: 204 })
}
