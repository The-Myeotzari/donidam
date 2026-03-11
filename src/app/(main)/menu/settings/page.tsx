import { ROUTES } from '@/shared/constants/route'
import { Card } from '@/shared/ui/Card'
import { MenuCardSubItem } from '@/widgets/menu-card/ui/MenuCardSubItem'
import { Bell, CreditCard, Palette, Shield } from 'lucide-react'

export default function SettingPage() {
  return (
    <div className="space-y-6 pt-2 pb-6">
      <Card className="p-4">
        <div className="divide-y divide-border">
          <MenuCardSubItem
            icon={<Bell size={20} />}
            title="알림 설정"
            subTitle="푸시 알림, 이메일 알림"
            href={ROUTES.menuSettingsAlarm}
            iconClassName="bg-(--primary)/10 text-primary"
          />
          <MenuCardSubItem
            icon={<Shield size={20} />}
            title="보안 설정"
            subTitle="비밀번호 인증"
            href={ROUTES.menuSettingsPassword}
            iconClassName="bg-(--primary)/10 text-primary"
          />
          <MenuCardSubItem
            icon={<CreditCard size={20} />}
            title="결제 수단"
            subTitle="카드 관리"
            href={ROUTES.menuSettingsCard}
            iconClassName="bg-(--primary)/10 text-primary"
          />
          <MenuCardSubItem
            icon={<Palette size={20} />}
            title="테마"
            subTitle="라이트, 다크 모드"
            href={ROUTES.menuSettingsTheme}
            iconClassName="bg-(--primary)/10 text-primary"
          />
        </div>
      </Card>
    </div>
  )
}
