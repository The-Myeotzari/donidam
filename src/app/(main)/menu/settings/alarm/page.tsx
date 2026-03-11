'use client'

import { Bell, Mail } from 'lucide-react'
import { useState } from 'react'

import { Card } from '@/shared/ui/Card'
import { Toggle } from '@/shared/ui/Toggle'

export default function AlarmPage() {
  const [pushEnabled, setPushEnabled] = useState(true)
  const [emailEnabled, setEmailEnabled] = useState(true)

  return (
    <div className="space-y-6 pt-2 pb-6">
      <Card className="p-4">
        <div className="divide-y divide-border">
          <div className="flex items-center gap-4 py-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Bell size={20} className="text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">푸시 알림</p>
              <p className="text-xs text-muted-foreground">앱 알림을 받습니다</p>
            </div>
            <Toggle
              checked={pushEnabled}
              onCheckedChange={setPushEnabled}
              label="푸시 알림"
            >
              <Toggle.Track>
                <Toggle.Thumb />
              </Toggle.Track>
            </Toggle>
          </div>

          <div className="flex items-center gap-4 py-4">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <Mail size={20} className="text-secondary" />
            </div>
            <div className="flex-1">
              <p className="font-medium text-sm">이메일 알림</p>
              <p className="text-xs text-muted-foreground">이메일로 알림을 받습니다</p>
            </div>
            <Toggle
              checked={emailEnabled}
              onCheckedChange={setEmailEnabled}
              label="이메일 알림"
            >
              <Toggle.Track>
                <Toggle.Thumb />
              </Toggle.Track>
            </Toggle>
          </div>
        </div>
      </Card>

      <p className="text-center text-xs text-muted-foreground leading-relaxed">
        알림 설정은 로그인 시 계정에 저장됩니다.
        <br />
        비로그인 상태에서는 이 기기에만 적용됩니다.
      </p>
    </div>
  )
}
