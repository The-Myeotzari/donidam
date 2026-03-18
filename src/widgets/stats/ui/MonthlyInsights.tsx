'use client'

import { useSpendingByCategoryQuery } from '@/entities/spending-by-category/api/spendingByCategory.queries'
import { useDailyTrendQuery } from '@/entities/stats/api/stats.queries'
import {
  EXPENSE_CATEGORY_LABEL,
  type ExpenseCategory,
} from '@/shared/constants/transactionCategory'

function getPrevMonthFirstDay() {
  const now = new Date()
  now.setMonth(now.getMonth() - 1)
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

function computeInsights(
  currentItems: { category: ExpenseCategory; amount: number }[],
  prevItems: { category: ExpenseCategory; amount: number }[],
  dailyItems: { dayOfWeek: number; expense: number }[],
): string[] {
  const insights: string[] = []

  const prevMap = Object.fromEntries(prevItems.map((it) => [it.category, it.amount]))

  // 1. 가장 많이 증가한 카테고리
  let biggest = { category: '' as ExpenseCategory, pct: 0 }
  for (const { category, amount } of currentItems) {
    const prev = prevMap[category] ?? 0
    if (prev > 0 && amount > prev) {
      const pct = Math.round(((amount - prev) / prev) * 100)
      if (pct > biggest.pct) biggest = { category, pct }
    }
  }
  if (biggest.pct > 0) {
    insights.push(
      `이번 달 ${EXPENSE_CATEGORY_LABEL[biggest.category]}가 지난달보다 ${biggest.pct}% 증가했어요`,
    )
  }

  // 2. 주말 vs 평일 지출
  const weekendDays = dailyItems.filter((d) => d.dayOfWeek === 0 || d.dayOfWeek === 6)
  const weekdayDays = dailyItems.filter((d) => d.dayOfWeek >= 1 && d.dayOfWeek <= 5)
  const weekendAvg =
    weekendDays.length > 0
      ? weekendDays.reduce((s, d) => s + d.expense, 0) / weekendDays.length
      : 0
  const weekdayAvg =
    weekdayDays.length > 0
      ? weekdayDays.reduce((s, d) => s + d.expense, 0) / weekdayDays.length
      : 0

  if (weekdayAvg > 0 && weekendAvg > weekdayAvg * 1.5) {
    const times = Math.round((weekendAvg / weekdayAvg) * 10) / 10
    insights.push(`주말 지출이 평일보다 ${times}배 많아요`)
  }

  // 3. 지출 변동 없는 카테고리
  for (const { category, amount } of currentItems) {
    const prev = prevMap[category] ?? 0
    if (prev > 0 && amount > 0 && Math.abs(amount - prev) / prev < 0.05) {
      insights.push(`${EXPENSE_CATEGORY_LABEL[category]} 지출은 변동 없이 유지중이에요`)
      break
    }
  }

  return insights.slice(0, 3)
}

export function MonthlyInsights() {
  const { data: current } = useSpendingByCategoryQuery()
  const { data: prev } = useSpendingByCategoryQuery(getPrevMonthFirstDay())
  const { data: trend } = useDailyTrendQuery()

  if (!current || !prev || !trend) return null

  const insights = computeInsights(current.items, prev.items, trend.items)

  if (insights.length === 0) return null

  return (
    <div className="mt-3 rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-md font-semibold">이달의 인사이트</h3>
      <ul className="space-y-2.5">
        {insights.map((text, i) => (
          <li key={i} className="rounded-full bg-muted px-4 py-3 text-center text-xs text-foreground">
            {text}
          </li>
        ))}
      </ul>
    </div>
  )
}
