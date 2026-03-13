import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 자녀 약속 목록 조회
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const url = new URL(request.url)
  const status = url.searchParams.get('status') // ALL | IN_PROGRESS | ACHIEVED | APPROVED

  let query = supabase
    .from('promises')
    .select('*')
    .eq('child_id', user.id)
    .order('created_at', { ascending: false })

  if (status && status !== 'ALL') {
    query = query.eq('status', status as 'IN_PROGRESS' | 'ACHIEVED' | 'COMPLETED' | 'PENDING_APPROVAL' | 'FAILED' | 'CANCELED' | 'APPROVED')
  }

  const { data, error } = await query
  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  const items = (data ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    reward: p.reward,
    status: p.status,
    dueDate: p.due_date,
    message: p.message,
    createdAt: p.created_at,
  }))

  return NextResponse.json({ ok: true, data: { items } })
}

// 새 약속 만들기 (자녀가 제안)
export async function POST(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const body = await request.json()
  const { title, reward, dueDate, category } = body

  if (!title || typeof reward !== 'number' || reward < 0) {
    return apiError(request, 'INVALID_REQUEST', 400, 'title과 reward는 필수입니다.')
  }

  const { data, error } = await supabase
    .from('promises')
    .insert({
      child_id: user.id,
      title,
      reward,
      due_date: dueDate ?? null,
      category: category ?? '기타',
    })
    .select('id')
    .single()

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({ ok: true, data: { id: data.id } })
}
