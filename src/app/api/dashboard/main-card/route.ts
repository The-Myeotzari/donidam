import { resolveMonthFirstDay } from '@/app/api/dashboard/main-card/mainCard.server'
import { getMainDashboardCard } from '@/entities/dashboard-card/api/dashboardCard.server'
import { apiError } from '@/shared/lib/api/apiError'
import { getUser } from '@/shared/lib/api/getUser'
import { NextResponse } from 'next/server'

// 메인 카드 조회
export async function GET(request: Request) {
  const auth = await getUser(request)
  if ('response' in auth) return auth.response

  const { supabase, user } = auth
  const url = new URL(request.url)

  const resolved = resolveMonthFirstDay(url.searchParams.get('month'))
  if (!resolved.ok) {
    return apiError(request, resolved.title, resolved.status, resolved.detail)
  }
  const monthFirstDay = resolved.monthFirstDay

  try {
    const profileData = await getMainDashboardCard(supabase, user.id, monthFirstDay)
    return NextResponse.json({ ok: true, profileData })
  } catch (error) {
    const detail = error instanceof Error ? error.message : '메인 카드 조회에 실패했습니다.'
    return apiError(request, 'INTERNAL_SERVER_ERROR', 500, detail)
  }
}
