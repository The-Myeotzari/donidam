'use client'

import { useChildPromisesQuery } from '@/entities/deokdam/api/deokdam.child.queries'
import { ChildPromiseCard } from '@/widgets/deokdam/ui/ChildPromiseCard'
import { NewPromiseModal } from '@/widgets/deokdam/ui/NewPromiseModal'
import { ROUTES } from '@/shared/constants/route'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export function ChildPromiseSection() {
  const { data } = useChildPromisesQuery('IN_PROGRESS')
  const items = (data?.items ?? []).slice(0, 3)
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md font-semibold">진행중인 약속</h3>
        <Link
          href={ROUTES.deokdamChildPromises}
          className="flex items-center gap-0.5 text-xs text-muted-foreground"
        >
          전체보기 <ChevronRight size={14} />
        </Link>
      </div>

      <div className="space-y-2">
        {items.map((item) => (
          <ChildPromiseCard key={item.id} item={item} />
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
