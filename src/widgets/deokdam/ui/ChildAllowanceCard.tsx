import type { ChildAllowanceItem } from '@/entities/deokdam/api/deokdam.child.queries'
import { Badge } from '@/shared/ui/Badge'

type Props = {
  item: ChildAllowanceItem
}

export function ChildAllowanceCard({ item }: Props) {
  const isReward = item.type === 'reward'
  const typeLabel = isReward ? '보상 덕담' : '받은 덕담'
  const typeVariant = isReward ? 'primarySoft' : 'sky'
  const dateLabel = formatDatetime(item.createdAt)

  return (
    <div className="rounded-2xl bg-card p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-muted shrink-0" />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="text-sm font-semibold">{item.senderName}</p>
            <Badge variant={typeVariant} size="xs">
              <Badge.Text>{typeLabel}</Badge.Text>
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{dateLabel}</p>
        </div>

        <p className="text-sm font-semibold text-primary shrink-0">
          +{item.amount.toLocaleString('ko-KR')}원
        </p>
      </div>

      {item.message && (
        <div className="mt-3 rounded-xl bg-muted px-3 py-2">
          <p className="text-xs text-foreground">"{item.message}"</p>
        </div>
      )}
    </div>
  )
}

function formatDatetime(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()

  const isYesterday = (() => {
    const yesterday = new Date(now)
    yesterday.setDate(now.getDate() - 1)
    return (
      d.getFullYear() === yesterday.getFullYear() &&
      d.getMonth() === yesterday.getMonth() &&
      d.getDate() === yesterday.getDate()
    )
  })()

  const timeStr = d.toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' })

  if (isToday) return `오늘 ${timeStr}`
  if (isYesterday) return '어제'
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}
