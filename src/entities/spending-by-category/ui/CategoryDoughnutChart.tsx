'use client'

import type { SpendingByCategoryItem } from '@/entities/spending-by-category/model/spendingByCategory.type'
import type { ExpenseCategory } from '@/shared/constants/transactionCategory'
import { ArcElement, Chart, DoughnutController } from 'chart.js'
import { useEffect, useRef } from 'react'

Chart.register(DoughnutController, ArcElement)

const EXPENSE_CATEGORY_CHART_COLOR: Record<ExpenseCategory, string> = {
  FOOD: '#f97316', // orange-500
  CAFE: '#d97706', // amber-600
  TRANSPORT: '#0ea5e9', // sky-500
  HOUSING: '#14b8a6', // teal-500
  SHOPPING: '#f43f5e', // rose-500
  MEDICAL: '#ef4444', // red-500
  EDUCATION: '#8b5cf6', // violet-500
  LEISURE: '#65a30d', // lime-600
  ETC: '#94a3b8', // slate-400
}

type Props = {
  items: SpendingByCategoryItem[]
  className?: string
}

export function CategoryDoughnutChart({ items, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)

  const activeItems = items.filter((it) => it.amount > 0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    chartRef.current?.destroy()

    const data = activeItems.length > 0 ? activeItems.map((it) => it.amount) : [1]

    const colors =
      activeItems.length > 0
        ? activeItems.map((it) => EXPENSE_CATEGORY_CHART_COLOR[it.category])
        : ['#e2e8f0']

    chartRef.current = new Chart(canvas, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data,
            backgroundColor: colors,
            borderWidth: 3,
            borderColor: 'white',
          },
        ],
      },
      options: {
        cutout: '60%',
        events: [],
        plugins: { tooltip: { enabled: false }, legend: { display: false } },
        animation: { duration: 400 },
      },
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(activeItems)])

  return (
    <div className={className ?? 'relative shrink-0 w-24 h-24'}>
      <canvas ref={canvasRef} />
    </div>
  )
}
