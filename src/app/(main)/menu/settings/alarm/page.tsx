'use client'

import {
  Bell,
  Mail,
  ChartBar,
  BookOpen,
  Heart,
  Wallet,
  MessageCircleHeart,
  MoonStar,
  ShieldAlert,
  Smile,
  Scale,
} from 'lucide-react'

import { Card } from '@/shared/ui/Card'
import { Toggle } from '@/shared/ui/Toggle'
import { useNotificationPreferences, useUpdateNotificationPreferences } from '@/features/notifications/model/useNotificationPreferences'
import { usePushSubscription } from '@/features/notifications/model/usePushSubscription'
import type { NotificationPreferences } from '@/features/notifications/model/useNotificationPreferences'

type Mode = 'nag' | 'cheer' | 'balanced'

const MODES: { value: Mode; icon: React.ReactNode; label: string; desc: string }[] = [
  {
    value: 'nag',
    icon: <ShieldAlert size={16} />,
    label: '잔소리 모드',
    desc: '경고 위주',
  },
  {
    value: 'balanced',
    icon: <Scale size={16} />,
    label: '균형 모드',
    desc: '기본값',
  },
  {
    value: 'cheer',
    icon: <Smile size={16} />,
    label: '응원 모드',
    desc: '칭찬 위주',
  },
]

type ToggleKey = Exclude<
  keyof NotificationPreferences,
  'user_id' | 'created_at' | 'updated_at' | 'notification_mode'
>

type Section = {
  key: ToggleKey
  icon: React.ReactNode
  iconBg: string
  iconColor: string
  label: string
  desc: string
}

const PUSH_SECTIONS: Section[] = [
  {
    key: 'budget_control_enabled',
    icon: <Wallet size={18} />,
    iconBg: 'bg-primary/10',
    iconColor: 'text-primary',
    label: '예산 관리 알림',
    desc: '소진율 경고·칭찬, 임계치 알림',
  },
  {
    key: 'stats_insight_enabled',
    icon: <ChartBar size={18} />,
    iconBg: 'bg-blue-500/10',
    iconColor: 'text-blue-500',
    label: '통계 인사이트',
    desc: '매주 월요일 지출 패턴 분석',
  },
  {
    key: 'retention_enabled',
    icon: <BookOpen size={18} />,
    iconBg: 'bg-amber-500/10',
    iconColor: 'text-amber-500',
    label: '기록 유도',
    desc: '당일 기록 없을 때 21:30 알림',
  },
  {
    key: 'dukdam_enabled',
    icon: <MessageCircleHeart size={18} />,
    iconBg: 'bg-pink-500/10',
    iconColor: 'text-pink-500',
    label: '덕담 알림',
    desc: '약속 달성·용돈 수령 알림',
  },
  {
    key: 'nodam_enabled',
    icon: <Heart size={18} />,
    iconBg: 'bg-green-500/10',
    iconColor: 'text-green-500',
    label: '노담 알림',
    desc: '금연 성공·절약 금액 알림',
  },
]

export default function AlarmPage() {
  const { data: prefs, isLoading } = useNotificationPreferences()
  const { mutate: updatePref } = useUpdateNotificationPreferences()
  const { isSupported, isSubscribed, isLoading: subLoading, subscribe, unsubscribe } = usePushSubscription()

  const handleToggle = (key: ToggleKey) => (checked: boolean) => {
    updatePref({ [key]: checked })
  }

  const handlePushToggle = async (checked: boolean) => {
    updatePref({ push_enabled: checked })
    if (checked && !isSubscribed) {
      await subscribe()
    } else if (!checked && isSubscribed) {
      await unsubscribe()
    }
  }

  const handleModeSelect = (mode: Mode) => {
    updatePref({ notification_mode: mode })
  }

  if (isLoading || !prefs) {
    return (
      <div className="space-y-4 pt-2 pb-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-muted" />
        <div className="h-48 rounded-2xl bg-muted" />
        <div className="h-28 rounded-2xl bg-muted" />
      </div>
    )
  }

  return (
    <div className="space-y-4 pt-2 pb-6">

      {/* 알림 채널 */}
      <Card className="p-4">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          알림 채널
        </p>
        <div className="divide-y divide-border">
          {/* 푸시 알림 */}
          <div className="flex items-center gap-4 py-3">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Bell size={18} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">푸시 알림</p>
              <p className="text-xs text-muted-foreground">
                {!isSupported
                  ? '이 브라우저는 지원하지 않아요'
                  : isSubscribed
                  ? '이 기기에서 알림을 수신 중이에요'
                  : '앱 알림을 받습니다'}
              </p>
            </div>
            <Toggle
              checked={prefs.push_enabled}
              onCheckedChange={handlePushToggle}
              label="푸시 알림"
              disabled={!isSupported || subLoading}
            >
              <Toggle.Track>
                <Toggle.Thumb />
              </Toggle.Track>
            </Toggle>
          </div>

          {/* 이메일 알림 */}
          <div className="flex items-center gap-4 py-3">
            <div className="w-9 h-9 rounded-xl bg-secondary/10 flex items-center justify-center shrink-0">
              <Mail size={18} className="text-secondary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm">이메일 알림</p>
              <p className="text-xs text-muted-foreground">주요 소식을 이메일로 받습니다</p>
            </div>
            <Toggle
              checked={prefs.email_enabled}
              onCheckedChange={handleToggle('email_enabled')}
              label="이메일 알림"
            >
              <Toggle.Track>
                <Toggle.Thumb />
              </Toggle.Track>
            </Toggle>
          </div>
        </div>
      </Card>

      {/* 알림 유형 (푸시 ON일 때만 활성화) */}
      <Card className={`p-4 transition-opacity ${prefs.push_enabled ? '' : 'opacity-40 pointer-events-none'}`}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          알림 유형
        </p>
        <div className="divide-y divide-border">
          {PUSH_SECTIONS.map((section) => (
            <div key={section.key} className="flex items-center gap-4 py-3">
              <div className={`w-9 h-9 rounded-xl ${section.iconBg} flex items-center justify-center shrink-0`}>
                <span className={section.iconColor}>{section.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm">{section.label}</p>
                <p className="text-xs text-muted-foreground">{section.desc}</p>
              </div>
              <Toggle
                checked={prefs[section.key] as boolean}
                onCheckedChange={handleToggle(section.key)}
                label={section.label}
              >
                <Toggle.Track>
                  <Toggle.Thumb />
                </Toggle.Track>
              </Toggle>
            </div>
          ))}
        </div>
      </Card>

      {/* 알림 모드 */}
      <Card className={`p-4 transition-opacity ${prefs.push_enabled ? '' : 'opacity-40 pointer-events-none'}`}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-1">
          알림 톤
        </p>
        <div className="grid grid-cols-3 gap-2">
          {MODES.map((mode) => {
            const isActive = prefs.notification_mode === mode.value
            return (
              <button
                key={mode.value}
                onClick={() => handleModeSelect(mode.value)}
                className={`flex flex-col items-center gap-1.5 rounded-xl p-3 border transition-all text-center ${
                  isActive
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border bg-card text-muted-foreground hover:border-primary/40'
                }`}
              >
                {mode.icon}
                <span className="text-xs font-semibold">{mode.label}</span>
                <span className="text-[10px] opacity-70">{mode.desc}</span>
              </button>
            )
          })}
        </div>
      </Card>

      {/* 방해 금지 안내 */}
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
            <MoonStar size={18} className="text-indigo-500" />
          </div>
          <div>
            <p className="font-medium text-sm">방해 금지 시간</p>
            <p className="text-xs text-muted-foreground">22:00 ~ 08:00 사이에는 알림을 보내지 않아요</p>
          </div>
        </div>
      </Card>

      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        알림 설정은 계정에 저장되며 모든 기기에 적용됩니다.
      </p>
    </div>
  )
}
