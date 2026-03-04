'use client'

import { ArcElement, Chart, DoughnutController } from 'chart.js'
import { useEffect, useRef } from 'react'

Chart.register(DoughnutController, ArcElement)

function getThemeColors() {
  const root = document.documentElement
  const primary = getComputedStyle(root).getPropertyValue('--primary').trim()
  const muted = getComputedStyle(root).getPropertyValue('--muted').trim()
  return { primary, muted }
}

export function DoughnutChart({ percent }: { percent: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart<'doughnut'> | null>(null)
  const clampedPercent = Math.min(Math.round(percent), 100)

  useEffect(() => {
    if (!canvasRef.current) return

    chartRef.current?.destroy()

    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return

    const { primary, muted } = getThemeColors()

    chartRef.current = new Chart(ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: [clampedPercent, 100 - clampedPercent],
            backgroundColor: [primary, muted],
            borderWidth: 0,
            hoverOffset: 0,
          },
        ],
      },
      options: {
        cutout: '76%',
        responsive: false,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: false },
        },
        animation: { duration: 500 },
        events: [],
      },
    })

    return () => {
      chartRef.current?.destroy()
      chartRef.current = null
    }
  }, [clampedPercent])

  return (
    <div className="relative shrink-0" style={{ width: 96, height: 96 }}>
      <canvas ref={canvasRef} width={96} height={96} />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <span className="text-sm font-bold tabular-nums">{clampedPercent}%</span>
      </div>
    </div>
  )
}
