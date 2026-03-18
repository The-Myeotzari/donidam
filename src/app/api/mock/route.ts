import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  const { data, error } = await supabase.from('transactions').select('*').eq('user_id', user.id)

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  return NextResponse.json({ ok: true, transactions: data })
}
