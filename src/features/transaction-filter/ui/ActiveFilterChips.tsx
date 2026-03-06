'use client'

import {
  EXPENSE_CATEGORY_LABEL,
  type ExpenseCategory,
} from '@/shared/constants/transactionCategory'
import { Badge } from '@/shared/ui/Badge'
import { CalendarDays, X } from 'lucide-react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

function formatShortDate(dateStr: string): string {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(m)}/${parseInt(d)}`
}

export function ActiveFilterChips() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const categories = searchParams.get('categories')?.split(',').filter(Boolean) ?? []
  const from = searchParams.get('from') ?? ''
  const to = searchParams.get('to') ?? ''

  const hasAny = categories.length > 0 || !!from || !!to
  if (!hasAny) return null

  const update = (updater: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    updater(params)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  const removeCategory = (cat: string) => {
    update((p) => {
      const remaining = categories.filter((c) => c !== cat)
      if (remaining.length) p.set('categories', remaining.join(','))
      else p.delete('categories')
    })
  }

  const removeDateRange = () => {
    update((p) => {
      p.delete('from')
      p.delete('to')
    })
  }

  const clearAll = () => {
    update((p) => {
      p.delete('categories')
      p.delete('from')
      p.delete('to')
    })
  }

  const dateLabel =
    from && to
      ? `${formatShortDate(from)} - ${formatShortDate(to)}`
      : from
        ? `${formatShortDate(from)} ~`
        : `~ ${formatShortDate(to)}`

  return (
    <div className="text-right">
      {/* 모두 지우기 */}
      <button
        onClick={clearAll}
        className="shrink-0 mb-2 text-xs text-muted-foreground whitespace-nowrap ml-1"
      >
        모두 지우기
      </button>
      <div className="flex items-center flex-wrap gap-2 pb-1 mb-3">
        {/* 날짜 범위 칩 */}
        {(from || to) && (
          <Badge variant="green" size="sm">
            <Badge.LeftIcon className="mr-2">
              <CalendarDays />
            </Badge.LeftIcon>
            <Badge.Text>{dateLabel}</Badge.Text>
            <Badge.Action aria-label="날짜 필터 제거" onClick={removeDateRange}>
              <X />
            </Badge.Action>
          </Badge>
        )}

        {/* 카테고리 칩 */}
        {categories.map((cat) => (
          <Badge key={cat} variant="green" size="sm">
            <Badge.Text>{EXPENSE_CATEGORY_LABEL[cat as ExpenseCategory] ?? cat}</Badge.Text>
            <Badge.Action aria-label={`${cat} 필터 제거`} onClick={() => removeCategory(cat)}>
              <X />
            </Badge.Action>
          </Badge>
        ))}
      </div>
    </div>
  )
}
