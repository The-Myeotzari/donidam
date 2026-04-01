'use client'

import { useSpendingByCategoryQuery } from '@/entities/spending-by-category/api/spendingByCategory.queries'
import { EXPENSE_CATEGORY_LABEL } from '@/shared/constants/transactionCategory'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Tooltip } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend)

function getPrevMonthFirstDay() {
  const now = new Date()
  now.setMonth(now.getMonth() - 1)
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`
}

function formatWan(value: number) {
  return value === 0 ? '0만' : `${Math.round(value / 10000)}만`
}

export function MonthComparisonChart() {
  const { data: current } = useSpendingByCategoryQuery()
  const { data: prev } = useSpendingByCategoryQuery(getPrevMonthFirstDay())

  if (!current || !prev) return null

  const activeCategories = current.items
    .filter((it) => it.amount > 0 || (prev.items.find((p) => p.category === it.category)?.amount ?? 0) > 0)
    .map((it) => it.category)

  const labels = activeCategories.map((cat) => EXPENSE_CATEGORY_LABEL[cat])

  const currentAmounts = activeCategories.map(
    (cat) => current.items.find((it) => it.category === cat)?.amount ?? 0,
  )
  const prevAmounts = activeCategories.map(
    (cat) => prev.items.find((it) => it.category === cat)?.amount ?? 0,
  )

  return (
    <div className="mt-3 rounded-2xl bg-card p-5 shadow-sm">
      <h3 className="mb-4 text-md font-semibold">전월 비교</h3>

      <Bar
        data={{
          labels,
          datasets: [
            {
              label: '지난 달',
              data: prevAmounts,
              backgroundColor: '#cbd5e1',
              borderRadius: 4,
              barThickness: 16,
            },
            {
              label: '이번 달',
              data: currentAmounts,
              backgroundColor: '#40c981',
              borderRadius: 4,
              barThickness: 16,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'bottom',
              labels: {
                font: { size: 11},
                color: '#64748b',
                usePointStyle: true,
                pointStyle: 'circle',
                boxWidth: 8,
                boxHeight: 8,
                padding: 16,
              },
            },
            tooltip: {
              enabled: true,
              callbacks: {
                label(ctx) {
                  const value = Number(ctx.raw)
                  const wan = Math.round(value / 10000)
                  return ` ${ctx.dataset.label} : ${wan}만원`
                },
              },
            },
          },
          scales: {
            x: {
              border: { display: false },
              grid: { display: false },
              ticks: { font: { size: 11 }, color: '#94a3b8' },
            },
            y: {
              border: { display: false },
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                font: { size: 11 },
                color: '#94a3b8',
                callback(val) {
                  return formatWan(Number(val))
                },
              },
            },
          },
        }}
      />
    </div>
  )
}
