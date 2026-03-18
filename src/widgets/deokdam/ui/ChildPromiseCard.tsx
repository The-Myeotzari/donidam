'use client'

import type { ChildPromiseItem } from '@/entities/deokdam/api/deokdam.child.queries'
import { useCompletePromiseMutation } from '@/entities/deokdam/api/deokdam.child.mutations'
import { Badge } from '@/shared/ui/Badge'
import { Button } from '@/shared/ui/Button'

const STATUS_BADGE: Record<string, { label: string; variant: 'sky' | 'yellow' | 'green' | 'red' | 'gray' }> = {
  IN_PROGRESS: { label: '진행중', variant: 'sky' },
  PENDING_APPROVAL: { label: '승인 대기', variant: 'yellow' },
  ACHIEVED: { label: '달성', variant: 'green' },
  APPROVED: { label: '완료', variant: 'green' },
  COMPLETED: { label: '완료', variant: 'green' },
  FAILED: { label: '실패', variant: 'red' },
  CANCELED: { label: '취소', variant: 'gray' },
}

type Props = {
  item: ChildPromiseItem
  showStatus?: boolean
}

export function ChildPromiseCard({ item, showStatus = false }: Props) {
  const badge = STATUS_BADGE[item.status] ?? { label: item.status, variant: 'gray' as const }
  const { mutate: complete, isPending } = useCompletePromiseMutation()

  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <p className="text-sm font-medium">{item.title}</p>
            {showStatus && (
              <Badge variant={badge.variant} size="xs">
                <Badge.Text>{badge.label}</Badge.Text>
              </Badge>
            )}
          </div>
          {item.dueDate && (
            <p className="text-xs text-muted-foreground mt-0.5">{formatDate(item.dueDate)}</p>
          )}
        </div>
        <p className="text-sm font-semibold shrink-0">{item.reward.toLocaleString('ko-KR')}원</p>
      </div>

      {item.status === 'IN_PROGRESS' && (
        <div className="mt-3">
          <Button
            fullWidth
            size="sm"
            variant="outline"
            isLoading={isPending}
            onClick={() => complete(item.id)}
          >
            완료 보고
          </Button>
        </div>
      )}
    </div>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}월 ${d.getDate()}일까지`
}
