import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 자녀가 부모 이메일 입력 → family_relation 확인 후 is_dukdam_active 활성화
export async function POST(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const body = await request.json()
  const parentEmail: string | undefined = body?.parentEmail

  if (!parentEmail) {
    return apiError(request, 'INVALID_REQUEST', 400, 'parentEmail은 필수입니다.')
  }

  const admin = createAdminClient()
  const { data: listData, error: userError } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const foundUser = listData?.users?.find((u) => u.email === parentEmail)

  if (userError || !foundUser) {
    return apiError(request, 'NOT_FOUND', 404, '해당 이메일로 가입한 사용자를 찾을 수 없습니다.')
  }

  const parentId = foundUser.id

  // family_relation이 이미 존재하는지 확인 (부모가 먼저 연결한 경우)
  const { data: relation } = await supabase
    .from('family_relations')
    .select('parent_id')
    .eq('parent_id', parentId)
    .eq('child_id', user.id)
    .single()

  if (!relation) {
    // 관계가 없으면 새로 생성 (자녀가 먼저 연결하는 경우)
    const { error: relError } = await supabase
      .from('family_relations')
      .insert({ parent_id: parentId, child_id: user.id })

    if (relError) {
      return apiError(request, 'INTERNAL_SERVER_ERROR', 500, relError.message)
    }
  }

  // 자녀 is_dukdam_active 활성화
  await supabase
    .from('profiles')
    .update({ is_dukdam_active: true })
    .eq('id', user.id)

  return NextResponse.json({ ok: true })
}
