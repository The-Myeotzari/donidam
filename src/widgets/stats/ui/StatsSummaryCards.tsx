'use client'

import { useStatsSummaryQuery } from '@/entities/stats/api/stats.queries'
import { TrendingDown, TrendingUp } from 'lucide-react'

function formatAmount(amount: number) {
  return `${amount.toLocaleString('ko-KR')}원`
}

export function StatsSummaryCards() {
  const { data } = useStatsSummaryQuery()

  const totalIncome = data?.totalIncome ?? 0
  const totalExpense = data?.totalExpense ?? 0
  const changePercent = data?.expenseChangePercent ?? null

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* 수입 카드 */}
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingUp size={14} className="text-emerald-500" />
          이번 달 수입
        </div>
        <p className="text-lg font-bold text-foreground">{formatAmount(totalIncome)}</p>
      </div>

      {/* 지출 카드 */}
      <div className="rounded-2xl bg-card p-4 shadow-sm">
        <div className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
          <TrendingDown size={14} className="text-red-500" />
          이번 달 지출
        </div>
        <p className="text-lg font-bold text-foreground">{formatAmount(totalExpense)}</p>
        {changePercent !== null && (
          <p className={`mt-1 text-xs ${changePercent > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
            {changePercent > 0 ? '▲' : '▼'} {Math.abs(changePercent)}% 지난달 대비
          </p>
        )}
      </div>
    </div>
  )
}
