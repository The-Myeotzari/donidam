import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 자녀가 약속 완료 보고 (IN_PROGRESS → PENDING_APPROVAL)
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const { id } = await params
  const promiseId = Number(id)

  if (isNaN(promiseId)) {
    return apiError(request, 'INVALID_REQUEST', 400, '유효하지 않은 약속 ID입니다.')
  }

  // 본인 약속인지 확인
  const { data: promise, error: fetchError } = await supabase
    .from('promises')
    .select('status, child_id')
    .eq('id', promiseId)
    .single()

  if (fetchError || !promise) {
    return apiError(request, 'NOT_FOUND', 404, '약속을 찾을 수 없습니다.')
  }

  if (promise.child_id !== user.id) {
    return apiError(request, 'FORBIDDEN', 403, '본인의 약속만 완료 보고할 수 있습니다.')
  }

  if (promise.status !== 'IN_PROGRESS') {
    return apiError(request, 'CONFLICT', 409, '진행중인 약속만 완료 보고할 수 있습니다.')
  }

  const { error } = await supabase
    .from('promises')
    .update({ status: 'PENDING_APPROVAL' })
    .eq('id', promiseId)

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({ ok: true })
}
