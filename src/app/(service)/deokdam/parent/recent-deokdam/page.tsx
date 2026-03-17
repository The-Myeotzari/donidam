'use client'

import { useParentAllowancesQuery } from '@/entities/deokdam/api/deokdam.queries'
import { AllowanceItem } from '@/widgets/deokdam/ui/AllowanceItem'
import type { AllowanceType } from '@/entities/deokdam/model/deokdam.types'
import cn from '@/shared/lib/cn'
import { useState } from 'react'

type FilterType = 'all' | AllowanceType

const FILTERS: { label: string; value: FilterType }[] = [
  { label: '전체', value: 'all' },
  { label: '수동', value: 'manual' },
  { label: '보상', value: 'reward' },
]

export default function ParentRecentDeokdamPage() {
  const [type, setType] = useState<FilterType>('all')
  const { data } = useParentAllowancesQuery(type)
  const items = data?.items ?? []

  return (
    <div>
      {/* 필터 칩 */}
      <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setType(f.value)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              type === f.value
                ? 'bg-foreground text-background'
                : 'bg-card text-muted-foreground shadow-sm',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 내역 목록 */}
      <div className="rounded-2xl bg-card px-4 shadow-sm">
        {items.length === 0 ? (
          <p className="py-5 text-center text-sm text-muted-foreground">덕담 내역이 없어요</p>
        ) : (
          <ul>
            {items.map((item) => (
              <AllowanceItem key={item.id} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
