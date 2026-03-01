import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

interface RouteParams {
  params: {
    id: string
  }
}

export async function GET(request: Request, { params }: RouteParams) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const id = Number(params.id)

  if (!id || isNaN(id)) {
    return apiError(request, 'INVALID_REQUEST', 400, `Invalid transaction id`)
  }

  const { data, error } = await supabase
    .from('transactions')
    .select('id, type, category, amount, is_fixed, created_at, updated_at')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return apiError(request, 'NOT_FOUND', 404, `Transaction not found`)
    }

    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({
    ok: true,
    data: {
      id: data.id,
      type: data.type,
      category: data.category,
      amount: data.amount,
      isFixed: data.is_fixed,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    },
  })
}
