'use client'

import { useParentPromisesQuery } from '@/entities/deokdam/api/deokdam.queries'
import { PromiseCard } from '@/widgets/deokdam/ui/PromiseCard'
import { ROUTES } from '@/shared/constants/route'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function ParentPromiseSection() {
  const { data } = useParentPromisesQuery()
  const items = (data?.items ?? []).slice(0, 3)

  return (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md font-semibold">보상 약속</h3>
        <Link
          href={ROUTES.deokdamParentPromises}
          className="flex items-center gap-0.5 text-xs text-muted-foreground"
        >
          전체보기 <ChevronRight size={14} />
        </Link>
      </div>

      {items.length === 0 ? (
        <div className="rounded-2xl bg-card p-5 shadow-sm text-center">
          <p className="text-sm text-muted-foreground">등록된 약속이 없어요</p>
        </div>
      ) : (
        <div className="space-y-2">
          {items.map((item) => (
            <PromiseCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
