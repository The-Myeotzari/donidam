'use client'

import { useSpendingByCategoryQuery } from '@/entities/spending-by-category/api/spendingByCategory.queries'
import {
  EXPENSE_CATEGORY_ICON,
  EXPENSE_CATEGORY_LABEL,
  EXPENSE_CATEGORY_THEME,
} from '@/shared/constants/transactionCategory'
import { CategoryDoughnutChart } from '@/widgets/monthly-expense-spending-by-category/ui/CategoryDoughnutChart'

type Props = {
  month?: string
}

export function SpendingByCategory({ month }: Props) {
  const { data } = useSpendingByCategoryQuery(month)

  if (!data) return null

  const activeItems = data.items.filter((it) => it.amount > 0).sort((a, b) => b.amount - a.amount)

  return (
    <section className="bg-card rounded-2xl p-5 card-shadow mt-4">
      <h3 className="text-sm font-semibold mb-4">카테고리별 지출</h3>

      <div className="flex items-center gap-5">
        {/* 도넛 차트 */}
        <CategoryDoughnutChart items={data.items} />

        {/* 카테고리 리스트 */}
        <ul className="flex-1 space-y-2.5">
          {activeItems.length === 0 ? (
            <li className="text-xs text-muted-foreground">지출 내역이 없습니다.</li>
          ) : (
            activeItems.map((item) => {
              const Icon = EXPENSE_CATEGORY_ICON[item.category]
              const theme = EXPENSE_CATEGORY_THEME[item.category]
              const color = EXPENSE_CATEGORY_THEME[item.category].icon
              const percent = Math.round(item.ratio * 100)

              return (
                <li key={item.category} className="flex items-center gap-2.5">
                  {/* 아이콘 */}
                  <div
                    className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${theme.bg}`}
                  >
                    <Icon size={15} className={theme.icon} />
                  </div>

                  {/* 라벨 */}
                  <span className="flex-1 text-xs font-medium text-foreground">
                    {EXPENSE_CATEGORY_LABEL[item.category]}
                  </span>

                  {/* 퍼센트 */}
                  <span className="text-xs font-semibold tabular-nums" style={{ color }}>
                    {percent}%
                  </span>
                </li>
              )
            })
          )}
        </ul>
      </div>
    </section>
  )
}
