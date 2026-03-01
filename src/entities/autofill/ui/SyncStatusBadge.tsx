import { Badge } from '@/shared/ui/Badge'
import { CheckIcon, RefreshCwIcon, AlertCircleIcon } from 'lucide-react'
import type { SyncStatus } from '../model/autofill.types'

type Props = {
  status: SyncStatus
}

export function SyncStatusBadge({ status }: Props) {
  if (status === 'connected') {
    return (
      <Badge variant="green" size="sm">
        <Badge.LeftIcon>
          <CheckIcon />
        </Badge.LeftIcon>
        <Badge.Text>연결됨</Badge.Text>
      </Badge>
    )
  }

  if (status === 'syncing') {
    return (
      <Badge variant="sky" size="sm">
        <Badge.LeftIcon>
          <RefreshCwIcon className="animate-spin" />
        </Badge.LeftIcon>
        <Badge.Text>동기화 중...</Badge.Text>
      </Badge>
    )
  }

  return (
    <Badge variant="red" size="sm">
      <Badge.LeftIcon>
        <AlertCircleIcon />
      </Badge.LeftIcon>
      <Badge.Text>오류</Badge.Text>
    </Badge>
  )
}
