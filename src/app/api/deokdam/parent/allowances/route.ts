import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 부모 덕담 내역 목록
// type: all | manual | reward
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const url = new URL(request.url)
  const type = url.searchParams.get('type') ?? 'all' // all | manual | reward

  let query = supabase
    .from('allowances')
    .select('*')
    .eq('sender_id', user.id)
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

  // 자녀 이름 조회
  const admin = createAdminClient()
  const receiverIds = [...new Set((allowances ?? []).map((a) => a.receiver_id))]
  const nameMap: Record<string, string> = {}

  await Promise.all(
    receiverIds.map(async (id) => {
      try {
        const { data } = await admin.auth.admin.getUserById(id)
        const email = data?.user?.email ?? ''
        nameMap[id] = email.split('@')[0] ?? '자녀'
      } catch {
        nameMap[id] = '자녀'
      }
    }),
  )

  const items = (allowances ?? []).map((a) => ({
    id: a.id,
    senderId: a.sender_id,
    receiverId: a.receiver_id,
    childName: nameMap[a.receiver_id] ?? '자녀',
    amount: a.amount,
    message: a.message,
    type: a.promise_id != null ? 'reward' : 'manual',
    createdAt: a.created_at,
  }))

  return NextResponse.json({ ok: true, data: { items } })
}

// 덕담 보내기
export async function POST(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const body = await request.json()
  const { receiverId, amount, message } = body

  if (!receiverId || typeof amount !== 'number' || amount <= 0) {
    return apiError(request, 'INVALID_REQUEST', 400, 'receiverId와 amount(양수)는 필수입니다.')
  }

  const { error } = await supabase.from('allowances').insert({
    sender_id: user.id,
    receiver_id: receiverId,
    amount,
    message: message ?? null,
  })

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({ ok: true })
}
