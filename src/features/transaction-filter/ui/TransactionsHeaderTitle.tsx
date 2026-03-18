'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function formatMonthDay(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(m)}월 ${parseInt(d)}일`
}

function Inner() {
  const searchParams = useSearchParams()
  const from = searchParams.get('from')
  const to = searchParams.get('to')

  if (from && to) return <>{formatMonthDay(from)} - {formatMonthDay(to)}</>
  if (from) return <>{formatMonthDay(from)} ~</>
  if (to) return <>~ {formatMonthDay(to)}</>

  const now = new Date()
  return <>{now.getFullYear()}년 {now.getMonth() + 1}월</>
}

export function TransactionsHeaderTitle() {
  const now = new Date()
  const fallback = `${now.getFullYear()}년 ${now.getMonth() + 1}월`

  return (
    <Suspense fallback={fallback}>
      <Inner />
    </Suspense>
  )
}
