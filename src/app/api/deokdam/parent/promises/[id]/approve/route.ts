import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 보상 약속 승인
export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const { id } = await params
  const promiseId = Number(id)

  if (isNaN(promiseId)) {
    return apiError(request, 'INVALID_REQUEST', 400, '유효하지 않은 약속 ID입니다.')
  }

  const { error } = await supabase.rpc('approve_promise', {
    p_parent_id: user.id,
    p_promise_id: promiseId,
  })

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({ ok: true })
}
