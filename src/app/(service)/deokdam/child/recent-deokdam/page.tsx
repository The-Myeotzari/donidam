'use client'

import { useChildAllowancesQuery } from '@/entities/deokdam/api/deokdam.child.queries'
import { ChildAllowanceCard } from '@/widgets/deokdam/ui/ChildAllowanceCard'
import cn from '@/shared/lib/cn'
import { useState } from 'react'

const FILTERS = [
  { label: '전체', value: 'all' },
  { label: '받은 덕담', value: 'manual' },
  { label: '보상 덕담', value: 'reward' },
]

export default function ChildRecentDeokdamPage() {
  const [type, setType] = useState('all')
  const { data } = useChildAllowancesQuery(type)
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
      {items.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">받은 덕담이 없어요</p>
        </div>
      ) : (
        <div className="space-y-2 pb-4">
          {items.map((item) => (
            <ChildAllowanceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
