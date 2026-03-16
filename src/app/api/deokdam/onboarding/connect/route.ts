import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 자녀 이메일로 덕담 가족 연결
export async function POST(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const body = await request.json()
  const childEmail: string | undefined = body?.childEmail
  if (!childEmail) {
    return apiError(request, 'INVALID_REQUEST', 400, 'childEmail은 필수입니다.')
  }

  // admin client로 이메일 → user 조회
  const admin = createAdminClient()
  const { data: listData, error: userError } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const foundUser = listData?.users?.find((u) => u.email === childEmail)
  if (userError || !foundUser) {
    return apiError(request, 'NOT_FOUND', 404, '해당 이메일로 가입한 사용자를 찾을 수 없습니다.')
  }

  const childId = foundUser.id
  if (childId === user.id) {
    return apiError(request, 'INVALID_REQUEST', 400, '자신을 자녀로 등록할 수 없습니다.')
  }

  // 이미 연결된 관계인지 확인
  const { data: existing } = await supabase
    .from('family_relations')
    .select('parent_id')
    .eq('parent_id', user.id)
    .eq('child_id', childId)
    .single()

  if (existing) {
    return apiError(request, 'CONFLICT', 409, '이미 연결된 자녀입니다.')
  }

  // family_relation 생성
  const { error: relError } = await supabase
    .from('family_relations')
    .insert({ parent_id: user.id, child_id: childId })

  if (relError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, relError.message)
  }

  // 부모 is_dukdam_active 활성화
  await supabase
    .from('profiles')
    .update({ is_dukdam_active: true })
    .eq('id', user.id)

  return NextResponse.json({ ok: true })
}
