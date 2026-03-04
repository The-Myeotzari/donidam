'use client'

import { useMainDashboardCardQuery } from '@/entities/dashboard-card/api/dashboardCard.queries'
import { ROUTES } from '@/shared/constants/route'
import { DoughnutChart } from '@/widgets/monthly-expense/ui/DoughnutChart'
import Link from 'next/link'

type Props = {
  month?: string
}

export function MonthlyExpenseSummary({ month }: Props) {
  const { data } = useMainDashboardCardQuery(month)

  if (!data || !('totalExpense' in data.vars)) return null

  const { spendPercent, totalExpense, remainingAmount } = data.vars

  return (
    <section className="bg-card rounded-2xl mt-6 p-5 card-shadow">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold">이번 달 지출</h3>
        <Link
          href={ROUTES.dashboardMonthly}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          상세보기 &gt;
        </Link>
      </div>

      {/* 콘텐츠 */}
      <div className="flex items-center gap-6">
        <DoughnutChart percent={spendPercent} />

        <div className="space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">총 지출</p>
            <p className="text-xl font-bold">{totalExpense.toLocaleString('ko-KR')}원</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-0.5">남은 예산</p>
            <p className="text-sm font-semibold text-primary">
              {remainingAmount.toLocaleString('ko-KR')}원
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
