import type { AllowanceItem as TAllowanceItem } from '@/entities/deokdam/model/deokdam.types'
import { Badge } from '@/shared/ui/Badge'

type Props = {
  item: TAllowanceItem
}

export function AllowanceItem({ item }: Props) {
  const typeLabel = item.type === 'reward' ? '보상' : '수동'
  const typeVariant = item.type === 'reward' ? 'primarySoft' : 'sky'
  const dateLabel = formatDate(item.createdAt)

  return (
    <li className="flex items-center gap-3 py-4 border-b last:border-b-0">
      <div className="w-9 h-9 rounded-full bg-muted shrink-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-medium truncate">{item.childName}</p>
          <Badge variant={typeVariant} size="xs">
            <Badge.Text>{typeLabel}</Badge.Text>
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground truncate">
          {item.message ?? '메시지 없음'}
        </p>
      </div>

      <div className="text-right shrink-0">
        <p className="text-sm font-semibold text-foreground">
          -{item.amount.toLocaleString('ko-KR')}원
        </p>
        <p className="text-xs text-muted-foreground">{dateLabel}</p>
      </div>
    </li>
  )
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  const now = new Date()
  const isToday =
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()

  if (isToday) return '오늘'
  return `${d.getMonth() + 1}월 ${d.getDate()}일`
}
