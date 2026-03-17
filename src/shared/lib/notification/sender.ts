import { createClient } from '@supabase/supabase-js'
import { isQuietHours } from '@/shared/constants/notification'
import { sendPushNotification, type PushPayload } from './webpush'

function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )
}

type NotificationPrefs = {
  push_enabled: boolean
  budget_control_enabled: boolean
  stats_insight_enabled: boolean
  retention_enabled: boolean
  dukdam_enabled: boolean
  nodam_enabled: boolean
  notification_mode: 'nag' | 'cheer' | 'balanced'
}

export type NotificationType = 'budget' | 'stats' | 'retention' | 'dukdam' | 'nodam'

// 알림 유형과 설정 컬럼 매핑
const PREF_COLUMN: Record<NotificationType, keyof NotificationPrefs> = {
  budget: 'budget_control_enabled',
  stats: 'stats_insight_enabled',
  retention: 'retention_enabled',
  dukdam: 'dukdam_enabled',
  nodam: 'nodam_enabled',
}

/**
 * 특정 사용자에게 푸시 알림 전송
 * - 방해 금지 시간대 자동 차단
 * - 사용자별 설정 확인
 * - 구독 정보 없으면 silently skip
 */
export async function sendNotificationToUser(
  userId: string,
  type: NotificationType,
  payload: PushPayload,
  options?: { ignoreQuietHours?: boolean },
) {
  if (!options?.ignoreQuietHours && isQuietHours()) return

  const supabase = createAdminClient()

  // 알림 설정 조회
  const { data: prefs } = await supabase
    .from('notification_preferences')
    .select('push_enabled, budget_control_enabled, stats_insight_enabled, retention_enabled, dukdam_enabled, nodam_enabled, notification_mode')
    .eq('user_id', userId)
    .single()

  if (!prefs?.push_enabled) return
  if (!prefs[PREF_COLUMN[type]]) return

  // 구독 정보 조회
  const { data: subscriptions } = await supabase
    .from('push_subscriptions')
    .select('endpoint, p256dh, auth')
    .eq('user_id', userId)

  if (!subscriptions?.length) return

  // 모든 기기에 전송 (병렬)
  await Promise.allSettled(
    subscriptions.map((sub) => sendPushNotification(sub, payload)),
  )
}

/**
 * 전체 사용자 대상 브로드캐스트 (Cron 전용)
 * type에 해당하는 enabled 설정이 true인 사용자만 발송
 */
export async function broadcastNotification(
  type: NotificationType,
  buildPayload: (userId: string) => Promise<PushPayload | null>,
) {
  if (isQuietHours()) return

  const supabase = createAdminClient()

  const prefColumn = PREF_COLUMN[type]
  const { data: users } = await supabase
    .from('notification_preferences')
    .select('user_id')
    .eq('push_enabled', true)
    .eq(prefColumn, true)

  if (!users?.length) return

  await Promise.allSettled(
    users.map(async ({ user_id }) => {
      const payload = await buildPayload(user_id)
      if (!payload) return

      const { data: subscriptions } = await supabase
        .from('push_subscriptions')
        .select('endpoint, p256dh, auth')
        .eq('user_id', user_id)

      if (!subscriptions?.length) return

      await Promise.allSettled(
        subscriptions.map((sub) => sendPushNotification(sub, payload)),
      )
    }),
  )
}
