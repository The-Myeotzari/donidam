'use client'

import { useDailyTrendQuery } from '@/entities/stats/api/stats.queries'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js'
import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import cn from '@/shared/lib/cn'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler)

type TrendMode = 'expense' | 'all'

function formatWan(value: number) {
  return value === 0 ? '0만' : `${Math.round(value / 10000)}만`
}

export function MonthlyTrendChart() {
  const [mode, setMode] = useState<TrendMode>('all')
  const { data } = useDailyTrendQuery()

  const items = data?.items ?? []
  const labels = items.map((it) => `${it.day}일`)

  const datasets =
    mode === 'expense'
      ? [
          {
            label: '지출',
            data: items.map((it) => it.expense),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.08)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
        ]
      : [
          {
            label: '지출',
            data: items.map((it) => it.expense),
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239,68,68,0.08)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
          {
            label: '수입',
            data: items.map((it) => it.income),
            borderColor: '#10b981',
            backgroundColor: 'rgba(16,185,129,0.08)',
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.4,
            fill: true,
          },
        ]

  // x축은 1일/8일/15일/22일만 표시
  const tickDays = new Set([1, 8, 15, 22])

  return (
    <div className="mt-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-md font-semibold">월별 지출 추이</h3>
        <div className="flex overflow-hidden rounded-full border border-border text-xs">
          <button
            className={cn('px-3 py-1', mode === 'expense' ? 'bg-foreground text-background font-medium' : 'text-muted-foreground')}
            onClick={() => setMode('expense')}
          >
            지출
          </button>
          <button
            className={cn('px-3 py-1', mode === 'all' ? 'bg-foreground text-background font-medium' : 'text-muted-foreground')}
            onClick={() => setMode('all')}
          >
            전체
          </button>
        </div>
      </div>

      <Line
        data={{ labels, datasets }}
        options={{
          responsive: true,
          plugins: { legend: { display: false }, tooltip: { enabled: true } },
          scales: {
            x: {
              border: { display: false },
              grid: { display: false },
              ticks: {
                font: { size: 11 },
                color: '#94a3b8',
                callback(_val, index) {
                  const day = items[index]?.day
                  return tickDays.has(day) ? `${day}일` : ''
                },
              },
            },
            y: {
              border: { display: false },
              grid: { color: 'rgba(0,0,0,0.05)' },
              ticks: {
                font: { size: 10 },
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
