import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 자녀 받은 덕담 목록
// type: all | manual | reward
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const url = new URL(request.url)
  const type = url.searchParams.get('type') ?? 'all'

  let query = supabase
    .from('allowances')
    .select('*')
    .eq('receiver_id', user.id)
    .order('created_at', { ascending: false })

  if (type === 'reward') {
    query = query.not('promise_id', 'is', null)
  } else if (type === 'manual') {
    query = query.is('promise_id', null)
  }

  const { data: allowances, error } = await query
  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  // 부모 이름 조회
  const admin = createAdminClient()
  const senderIds = [...new Set((allowances ?? []).map((a) => a.sender_id))]
  const nameMap: Record<string, string> = {}

  await Promise.all(
    senderIds.map(async (id) => {
      try {
        const { data } = await admin.auth.admin.getUserById(id)
        const email = data?.user?.email ?? ''
        nameMap[id] = email.split('@')[0] ?? '부모님'
      } catch {
        nameMap[id] = '부모님'
      }
    }),
  )

  const items = (allowances ?? []).map((a) => ({
    id: a.id,
    senderId: a.sender_id,
    senderName: nameMap[a.sender_id] ?? '부모님',
    amount: a.amount,
    message: a.message,
    type: a.promise_id != null ? 'reward' : 'manual',
    createdAt: a.created_at,
  }))

  return NextResponse.json({ ok: true, data: { items } })
}
