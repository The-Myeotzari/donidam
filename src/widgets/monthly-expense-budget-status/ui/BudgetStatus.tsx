'use client'

import { useMainDashboardCardQuery } from '@/entities/dashboard-card/api/dashboardCard.queries'

type Props = {
  month?: string
}

export function BudgetStatus({ month }: Props) {
  const { data } = useMainDashboardCardQuery(month)

  if (!data || !('totalExpense' in data.vars)) return null

  const { spendPercent, totalExpense, remainingAmount, remainingDays, dailyRecommendedAmount, elapsedPercent } =
    data.vars

  const targetAmount = totalExpense + remainingAmount
  const isOverBudget = remainingAmount < 0
  const clampedSpend = Math.min(spendPercent, 100)
  const clampedElapsed = Math.min(elapsedPercent, 100)

  return (
    <section className="bg-card rounded-2xl p-5 card-shadow mt-4">
      {/* 헤더 */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold">예산 현황</h3>
      </div>

      {/* 예산 금액 */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground mb-0.5">이번 달 예산</p>
        <p className="text-xl font-bold">{targetAmount.toLocaleString('ko-KR')}원</p>
      </div>

      {/* 프로그레스 바 */}
      <div className="mb-5">
        <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
          <span>지출 {Math.round(spendPercent)}%</span>
          <span>경과 {Math.round(elapsedPercent)}%</span>
        </div>
        <div className="relative h-2.5 rounded-full bg-muted overflow-hidden">
          {/* 경과 기간 인디케이터 */}
          <div
            className="absolute h-full rounded-full bg-muted-foreground/25 transition-all duration-500"
            style={{ width: `${clampedElapsed}%` }}
          />
          {/* 지출 인디케이터 */}
          <div
            className={`absolute h-full rounded-full transition-all duration-500 ${isOverBudget ? 'bg-destructive' : 'bg-primary'}`}
            style={{ width: `${clampedSpend}%` }}
          />
        </div>
      </div>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">남은 예산</p>
          <p className={`text-sm font-semibold ${isOverBudget ? 'text-destructive' : 'text-primary'}`}>
            {remainingAmount.toLocaleString('ko-KR')}원
          </p>
        </div>
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">남은 일수</p>
          <p className="text-sm font-semibold">{remainingDays}일</p>
        </div>
        <div className="bg-muted rounded-xl p-3">
          <p className="text-xs text-muted-foreground mb-1">일 추천 지출</p>
          <p className="text-sm font-semibold">
            {dailyRecommendedAmount > 0 ? `${dailyRecommendedAmount.toLocaleString('ko-KR')}원` : '-'}
          </p>
        </div>
      </div>
    </section>
  )
}
