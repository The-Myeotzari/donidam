import {
  monthToKstRange,
  resolveMonthFirstDay,
} from '@/app/api/dashboard/main-card/mainCard.server'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { createAdminClient } from '@/shared/lib/supabase/admin'
import { NextResponse } from 'next/server'

// 자녀 덕담 요약: 이번 달 받은 총 용돈, 건수, 자녀 이름
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const url = new URL(request.url)

  const resolved = resolveMonthFirstDay(url.searchParams.get('month'))
  if (!resolved.ok) {
    return apiError(request, 'INVALID_REQUEST', 400, resolved.detail)
  }
  const { rangeStart, rangeEnd } = monthToKstRange(resolved.monthFirstDay)

  const { data: allowances, error } = await supabase
    .from('allowances')
    .select('amount')
    .eq('receiver_id', user.id)
    .gte('created_at', rangeStart)
    .lt('created_at', rangeEnd)

  if (error) {
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, error.message)
  }

  // 자녀 본인 이름 (이메일 앞부분)
  const admin = createAdminClient()
  let childName = '나'
  try {
    const { data } = await admin.auth.admin.getUserById(user.id)
    const email = data?.user?.email ?? ''
    childName = email.split('@')[0] ?? '나'
  } catch {
    childName = '나'
  }

  const totalAmount = (allowances ?? []).reduce((sum, a) => sum + a.amount, 0)
  const count = (allowances ?? []).length

  return NextResponse.json({
    ok: true,
    data: { totalAmount, count, childName },
  })
}
