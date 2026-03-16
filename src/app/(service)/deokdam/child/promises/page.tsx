'use client'

import { useChildPromisesQuery } from '@/entities/deokdam/api/deokdam.child.queries'
import { ChildPromiseCard } from '@/widgets/deokdam/ui/ChildPromiseCard'
import { NewPromiseModal } from '@/widgets/deokdam/ui/NewPromiseModal'
import cn from '@/shared/lib/cn'
import { useState } from 'react'

const FILTERS = [
  { label: '전체', value: 'ALL' },
  { label: '진행중', value: 'IN_PROGRESS' },
  { label: '달성', value: 'ACHIEVED' },
  { label: '완료', value: 'APPROVED' },
]

export default function ChildPromisesPage() {
  const [status, setStatus] = useState('ALL')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const { data } = useChildPromisesQuery(status)
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
      <div className="space-y-2 pb-4">
        {items.map((item) => (
          <ChildPromiseCard key={item.id} item={item} showStatus />
        ))}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full rounded-2xl border-2 border-dashed border-border py-4 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
        >
          + 새 약속 만들기
        </button>
      </div>

      <NewPromiseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
