import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 연결된 자녀 목록 조회
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const { data: relations, error } = await supabase
    .from('family_relations')
    .select('child_id')
    .eq('parent_id', user.id)

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  const childIds = (relations ?? []).map((r) => r.child_id)

  const admin = createAdminClient()
  const children = await Promise.all(
    childIds.map(async (id) => {
      try {
        const { data } = await admin.auth.admin.getUserById(id)
        const email = data?.user?.email ?? ''
        return { id, name: email.split('@')[0] ?? '자녀' }
      } catch {
        return { id, name: '자녀' }
      }
    }),
  )

  return NextResponse.json({ ok: true, data: { children } })
}
