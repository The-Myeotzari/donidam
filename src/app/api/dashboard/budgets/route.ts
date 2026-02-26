import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth

  // 예산 조회
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('monthly_budget')
    .eq('id', user.id)
    .single()

  if (profileError) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, profileError.message)
  }

  const targetAmount = Math.floor(profile.monthly_budget ?? 0)

  return NextResponse.json({
    ok: true,
    budgetData: {
      targetAmount: targetAmount,
    },
  })
}
