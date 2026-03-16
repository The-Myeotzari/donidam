'use client'

import type { PromiseItem, PromiseStatus } from '@/entities/deokdam/model/deokdam.types'
import { useApprovePromiseMutation } from '@/entities/deokdam/api/deokdam.mutations'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'

const STATUS_BADGE: Record<PromiseStatus, { label: string; variant: 'sky' | 'yellow' | 'green' | 'red' | 'gray' }> = {
  IN_PROGRESS: { label: '진행중', variant: 'sky' },
  PENDING_APPROVAL: { label: '승인 대기', variant: 'yellow' },
  ACHIEVED: { label: '달성', variant: 'green' },
  APPROVED: { label: '덕담 완료', variant: 'green' },
  COMPLETED: { label: '덕담 완료', variant: 'green' },
  FAILED: { label: '실패', variant: 'red' },
  CANCELED: { label: '취소', variant: 'gray' },
}

type Props = {
  item: PromiseItem
}

export function PromiseCard({ item }: Props) {
  const badge = STATUS_BADGE[item.status]
  const { mutate: approve, isPending } = useApprovePromiseMutation()

  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.childName}</p>
          </div>
        </div>
        <Badge variant={badge.variant} size="sm" className="shrink-0">
          <Badge.Text>{badge.label}</Badge.Text>
        </Badge>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-muted-foreground space-y-0.5">
          <p>보상금: {item.reward.toLocaleString('ko-KR')}원</p>
          {item.dueDate && <p>기한: {formatDueDate(item.dueDate)}</p>}
        </div>
        {item.status === 'PENDING_APPROVAL' && (
          <Button
            size="sm"
            variant="primary"
            onClick={() => approve(item.id)}
            isLoading={isPending}
          >
            승인하기
          </Button>
        )}
        {(item.status === 'APPROVED' || item.status === 'COMPLETED') && (
          <Button size="sm" variant="ghost" disabled>
            덕담 완료
          </Button>
        )}
      </div>
    </div>
  )
}

function formatDueDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}
