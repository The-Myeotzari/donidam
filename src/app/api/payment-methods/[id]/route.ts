import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// DELETE /api/payment-methods/[id] — 결제 수단 삭제
export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const { id } = await params

  // 본인 소유 확인 후 삭제
  const { error } = await supabase.from('payment_methods').delete().eq('id', id).eq('user_id', user.id)

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return new NextResponse(null, { status: 204 })
}

// PATCH /api/payment-methods/[id] — 기본 결제 수단 변경
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const { id } = await params

  // 기존 기본 수단 해제
  await supabase.from('payment_methods').update({ is_default: false }).eq('user_id', user.id)

  // 새 기본 수단 설정 (본인 소유 확인)
  const { error } = await supabase.from('payment_methods').update({ is_default: true }).eq('id', id).eq('user_id', user.id)

  if (error) return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)

  return new NextResponse(null, { status: 204 })
}
