import {
  calcBudgetVars,
  calcElapsedAndRemainingByMonthKst,
  decideMainCardCode,
  monthToKstRange,
} from '@/app/api/dashboard/main-card/mainCard.server'
import type { DashboardCard } from '@/entities/dashboard-card/model/dashboardCard.type'
import type { Database } from '@/shared/types/database.types'
import type { SupabaseClient } from '@supabase/supabase-js'
import 'server-only'

type ServerSupabaseClient = SupabaseClient<Database>

export async function getMainDashboardCard(
  supabase: ServerSupabaseClient,
  userId: string,
  monthFirstDay: string,
): Promise<DashboardCard> {
  const { rangeStart, rangeEnd } = monthToKstRange(monthFirstDay)
  const { elapsedPercent, remainingDays } = calcElapsedAndRemainingByMonthKst(monthFirstDay)

  const [profileResult, transactionsResult] = await Promise.all([
    supabase.from('profiles').select('monthly_budget').eq('id', userId).single(),
    supabase
      .from('transactions')
      .select('totalExpense:amount.sum()')
      .eq('user_id', userId)
      .eq('type', 'OUT')
      .gte('created_at', rangeStart)
      .lt('created_at', rangeEnd),
  ])

  if (profileResult.error) throw new Error(profileResult.error.message)

  const targetAmount = Math.floor(profileResult.data.monthly_budget ?? 0)

  if (targetAmount <= 0) {
    return {
      month: monthFirstDay,
      code: 'MAIN_CARD_NO_BUDGET',
      vars: {},
    }
  }

  if (transactionsResult.error) throw new Error(transactionsResult.error.message)

  const totalExpense = Math.floor(Number(transactionsResult.data?.[0]?.totalExpense ?? 0))
  const { spendPercent, remainingAmount, dailyRecommendedAmount } = calcBudgetVars({
    targetAmount,
    totalExpense,
    remainingDays,
  })

  return {
    month: monthFirstDay,
    code: decideMainCardCode(targetAmount, elapsedPercent, spendPercent),
    vars: {
      elapsedPercent,
      spendPercent,
      totalExpense,
      remainingAmount,
      remainingDays,
      dailyRecommendedAmount,
    },
  }
}
