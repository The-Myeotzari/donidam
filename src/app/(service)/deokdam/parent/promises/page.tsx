'use client'

import { useParentPromisesQuery } from '@/entities/deokdam/api/deokdam.queries'
import { PromiseCard } from '@/widgets/deokdam/ui/PromiseCard'
import type { PromiseStatus } from '@/entities/deokdam/model/deokdam.types'
import cn from '@/shared/lib/cn'
import { useState } from 'react'

type FilterStatus = 'ALL' | PromiseStatus

const FILTERS: { label: string; value: FilterStatus }[] = [
  { label: '전체', value: 'ALL' },
  { label: '진행중', value: 'IN_PROGRESS' },
  { label: '덕담 대기', value: 'PENDING_APPROVAL' },
  { label: '덕담 완료', value: 'APPROVED' },
]

export default function ParentPromisesPage() {
  const [status, setStatus] = useState<FilterStatus>('ALL')
  const { data } = useParentPromisesQuery(status)
  const items = data?.items ?? []

  return (
    <div>
      {/* 필터 칩 */}
      <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setStatus(f.value)}
            className={cn(
              'shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              status === f.value
                ? 'bg-foreground text-background'
                : 'bg-card text-muted-foreground shadow-sm',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* 약속 목록 */}
      {items.length === 0 ? (
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">약속이 없어요</p>
        </div>
      ) : (
        <div className="space-y-2 pb-4">
          {items.map((item) => (
            <PromiseCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
