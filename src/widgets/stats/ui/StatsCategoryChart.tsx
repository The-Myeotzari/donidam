'use client'

import { useSpendingByCategoryQuery } from '@/entities/spending-by-category/api/spendingByCategory.queries'
import { CategoryDoughnutChart } from '@/entities/spending-by-category/ui/CategoryDoughnutChart'
import {
  EXPENSE_CATEGORY_LABEL,
  type ExpenseCategory,
} from '@/shared/constants/transactionCategory'

const CATEGORY_CHART_COLOR: Record<ExpenseCategory, string> = {
  FOOD: '#f97316',
  CAFE: '#d97706',
  TRANSPORT: '#0ea5e9',
  HOUSING: '#14b8a6',
  SHOPPING: '#f43f5e',
  MEDICAL: '#ef4444',
  EDUCATION: '#8b5cf6',
  LEISURE: '#65a30d',
  ETC: '#94a3b8',
}

export function StatsCategoryChart() {
  const { data } = useSpendingByCategoryQuery()

  if (!data) return null

  const activeItems = data.items.filter((it) => it.amount > 0).sort((a, b) => b.amount - a.amount)

  return (
    <div className="mt-3 rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-md font-semibold">카테고리별 지출</h3>

      <div className="flex items-center gap-5">
        <CategoryDoughnutChart items={data.items} className="relative my-2 ml-2 mr-6 w-28 h-28 " />

        <ul className="flex-1 space-y-2">
          {activeItems.length === 0 ? (
            <li className="text-xs text-muted-foreground">지출 내역이 없습니다.</li>
          ) : (
            activeItems.map((item) => (
              <li key={item.category} className="flex items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: CATEGORY_CHART_COLOR[item.category] }}
                />
                <span className="flex-1 text-xs text-foreground">
                  {EXPENSE_CATEGORY_LABEL[item.category]}
                </span>
                <span className="text-xs font-semibold tabular-nums text-muted-foreground">
                  {Math.round(item.ratio * 100)}%
                </span>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  )
}
