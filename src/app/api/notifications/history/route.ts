import { NextResponse } from 'next/server'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'

// GET /api/notifications/history — 최근 알림 20개 조회
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response
  const { supabase, user } = auth

  const { data, error } = await supabase
    .from('notification_history')
    .select('id, type, title, body, deep_link, is_read, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return NextResponse.json(data)
}

// PATCH /api/notifications/history — 전체 읽음 처리
export async function PATCH(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response
  const { supabase, user } = auth

  const { error } = await supabase
    .from('notification_history')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return new NextResponse(null, { status: 204 })
}

// DELETE /api/notifications/history — 전체 삭제 또는 개별 삭제(?id=xxx)
export async function DELETE(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response
  const { supabase, user } = auth

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  const query = supabase.from('notification_history').delete().eq('user_id', user.id)
  const { error } = id ? await query.eq('id', id) : await query

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return new NextResponse(null, { status: 204 })
}
