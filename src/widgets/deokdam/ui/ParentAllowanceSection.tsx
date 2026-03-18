'use client'

import { useParentAllowancesQuery } from '@/entities/deokdam/api/deokdam.queries'
import { AllowanceItem } from '@/widgets/deokdam/ui/AllowanceItem'
import { ROUTES } from '@/shared/constants/route'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

export function ParentAllowanceSection() {
  const { data } = useParentAllowancesQuery()
  const items = (data?.items ?? []).slice(0, 3)

  return (
    <div className="">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-md font-semibold">최근 덕담 내역</h3>
        <Link
          href={ROUTES.deokdamParentRecent}
          className="flex items-center gap-0.5 text-xs text-muted-foreground"
        >
          전체보기 <ChevronRight size={14} />
        </Link>
      </div>

      <div className="rounded-2xl bg-card px-4 py-1 shadow-sm">
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
