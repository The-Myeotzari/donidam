import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 덕담 온보딩 상태 조회: parent | child | none
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const { data, error } = await supabase
    .from('family_relations')
    .select('parent_id, child_id')
    .or(`parent_id.eq.${user.id},child_id.eq.${user.id}`)
    .limit(1)
    .maybeSingle()

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  if (!data) {
    return NextResponse.json({ ok: true, data: { role: 'none' } })
  }

  const role = data.parent_id === user.id ? 'parent' : 'child'
  return NextResponse.json({ ok: true, data: { role } })
}
