'use client'

import { BottomSheet } from '@/shared/ui/BottomSheet'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Bell, BellOff, Check, Trash2, X } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'

type NotificationItem = {
  id: string
  type: string
  title: string
  body: string
  deep_link: string
  is_read: boolean
  created_at: string
}

const TYPE_ICON: Record<string, string> = {
  budget: '💰',
  stats: '📊',
  retention: '📝',
  dukdam: '💌',
  nodam: '🚭',
}

export const NOTIFICATION_HISTORY_QUERY_KEY = ['notification-history']

async function fetchHistory(): Promise<NotificationItem[]> {
  const res = await fetch('/api/notifications/history', { credentials: 'include' })
  if (!res.ok) return []
  return res.json() as Promise<NotificationItem[]>
}

async function markAllRead() {
  await fetch('/api/notifications/history', { method: 'PATCH', credentials: 'include' })
}

async function deleteOne(id: string) {
  await fetch(`/api/notifications/history?id=${id}`, { method: 'DELETE', credentials: 'include' })
}

async function deleteAll() {
  await fetch('/api/notifications/history', { method: 'DELETE', credentials: 'include' })
}

interface Props {
  isOpen: boolean
  onClose: () => void
}

export function NotificationCenter({ isOpen, onClose }: Props) {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: items = [], isLoading } = useQuery({
    queryKey: NOTIFICATION_HISTORY_QUERY_KEY,
    queryFn: fetchHistory,
    enabled: isOpen,
    staleTime: 0,
  })

  const { mutate: readAll } = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(NOTIFICATION_HISTORY_QUERY_KEY, (prev) =>
        prev?.map((n) => ({ ...n, is_read: true })) ?? [],
      )
    },
  })

  const { mutate: removeOne } = useMutation({
    mutationFn: deleteOne,
    onMutate: async (id) => {
      queryClient.setQueryData<NotificationItem[]>(NOTIFICATION_HISTORY_QUERY_KEY, (prev) =>
        prev?.filter((n) => n.id !== id) ?? [],
      )
    },
  })

  const { mutate: removeAll } = useMutation({
    mutationFn: deleteAll,
    onSuccess: () => {
      queryClient.setQueryData<NotificationItem[]>(NOTIFICATION_HISTORY_QUERY_KEY, [])
    },
  })

  const unreadCount = items.filter((n) => !n.is_read).length

  const handleOpen = () => {
    if (unreadCount > 0) readAll()
  }

  const handleItemClick = (item: NotificationItem) => {
    onClose()
    router.push(item.deep_link)
  }

  // 바텀시트 열릴 때 읽음 처리
  if (isOpen && unreadCount > 0) handleOpen()

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <BottomSheet.Header>
        <span className="text-lg font-bold flex items-center gap-2">
          <Bell size={18} />
          알림
          {unreadCount > 0 && (
            <span className="text-xs bg-primary text-primary-foreground rounded-full px-2 py-0.5">
              {unreadCount}
            </span>
          )}
        </span>

        {items.length > 0 && (
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <button
                onClick={() => readAll()}
                className="flex items-center gap-1 text-xs text-muted-foreground"
              >
                <Check size={13} />
                모두 읽음
              </button>
            )}
            <button
              onClick={() => removeAll()}
              className="flex items-center gap-1 text-xs text-destructive"
            >
              <Trash2 size={13} />
              전체 삭제
            </button>
          </div>
        )}
      </BottomSheet.Header>

      <BottomSheet.Content className="max-h-[60vh]">
        {isLoading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-muted-foreground">
            <BellOff size={36} />
            <p className="text-sm">아직 받은 알림이 없어요</p>
          </div>
        ) : (
          <ul className="space-y-2">
            {items.map((item) => (
              <li key={item.id} className="relative group">
                <button
                  onClick={() => handleItemClick(item)}
                  className={`w-full text-left rounded-xl p-4 flex gap-3 items-start transition-colors pr-10 ${
                    item.is_read ? 'bg-muted/40' : 'bg-card card-shadow'
                  }`}
                >
                  <span className="text-xl mt-0.5">{TYPE_ICON[item.type] ?? '🔔'}</span>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${item.is_read ? 'text-muted-foreground' : ''}`}>
                      {item.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{item.body}</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: ko })}
                    </p>
                  </div>
                  {!item.is_read && (
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                  )}
                </button>

                {/* 개별 삭제 버튼 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    removeOne(item.id)
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                  aria-label="알림 삭제"
                >
                  <X size={14} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </BottomSheet.Content>
    </BottomSheet>
  )
}
