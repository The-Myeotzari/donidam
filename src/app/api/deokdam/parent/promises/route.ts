import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 부모 보상 약속 목록
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const url = new URL(request.url)
  const status = url.searchParams.get('status') // ALL | IN_PROGRESS | PENDING_APPROVAL | APPROVED

  // 내 자녀 ID 목록
  const { data: relations, error: relError } = await supabase
    .from('family_relations')
    .select('child_id')
    .eq('parent_id', user.id)

  if (relError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, relError.message)
  }

  const childIds = (relations ?? []).map((r) => r.child_id)
  if (childIds.length === 0) {
    return NextResponse.json({ ok: true, data: { items: [] } })
  }

  // 약속 조회
  let query = supabase
    .from('promises')
    .select('*')
    .in('child_id', childIds)
    .order('created_at', { ascending: false })

  if (status && status !== 'ALL') {
    query = query.eq('status', status as 'IN_PROGRESS' | 'ACHIEVED' | 'COMPLETED' | 'PENDING_APPROVAL' | 'FAILED' | 'CANCELED' | 'APPROVED')
  }

  const { data: promises, error: promisesError } = await query

  if (promisesError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, promisesError.message)
  }

  // 자녀 이름 조회 (admin - 이메일 기반)
  const admin = createAdminClient()
  const childNameMap: Record<string, string> = {}

  await Promise.all(
    childIds.map(async (id) => {
      try {
        const { data } = await admin.auth.admin.getUserById(id)
        const email = data?.user?.email ?? ''
        childNameMap[id] = email.split('@')[0] ?? '자녀'
      } catch {
        childNameMap[id] = '자녀'
      }
    }),
  )

  const items = (promises ?? []).map((p) => ({
    id: p.id,
    title: p.title,
    category: p.category,
    childId: p.child_id,
    childName: childNameMap[p.child_id] ?? '자녀',
    reward: p.reward,
    status: p.status,
    dueDate: p.due_date,
    message: p.message,
    createdAt: p.created_at,
  }))

  return NextResponse.json({ ok: true, data: { items } })
}
