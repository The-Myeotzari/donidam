'use client'

import { useSpendingByCategoryQuery } from '@/entities/spending-by-category/api/spendingByCategory.queries'
import {
  EXPENSE_CATEGORY_ICON,
  EXPENSE_CATEGORY_LABEL,
  EXPENSE_CATEGORY_THEME,
} from '@/shared/constants/transactionCategory'

type Props = {
  month?: string
}

export function SpendingByCategoryDetail({ month }: Props) {
  const { data } = useSpendingByCategoryQuery(month)

  if (!data) return null

  return (
    <section className="bg-card rounded-2xl p-5 card-shadow mt-4">
      <h3 className="text-sm font-semibold mb-4">카테고리 상세</h3>

      <ul className="flex-1 space-y-2.5">
        {data.items.map((item) => {
          const Icon = EXPENSE_CATEGORY_ICON[item.category]
          const theme = EXPENSE_CATEGORY_THEME[item.category]
          const color = EXPENSE_CATEGORY_THEME[item.category].icon
          const percent = Math.round(item.ratio * 100)

          return (
            <li
              key={item.category}
              className="flex items-center gap-2.5 p-3 rounded-md bg-(--muted)/50"
            >
              {/* 아이콘 */}
              <div
                className={`shrink-0 w-8 h-8 rounded-md flex items-center justify-center ${theme.bg}`}
              >
                <Icon size={15} className={theme.icon} />
              </div>

              {/* 라벨 */}
              <span className="flex-1 text-xs font-medium">
                {EXPENSE_CATEGORY_LABEL[item.category]}
              </span>

              {/* 퍼센트 */}
              <span className="text-xs font-semibold tabular-nums" style={{ color }}>
                {percent}%
              </span>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
