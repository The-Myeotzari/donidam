import { ROUTES } from '@/shared/constants/route'
import { Card } from '@/shared/ui/Card'
import { MenuCardItem } from '@/widgets/menu-card/ui/MenuCardItem'
import { MenuCardSubItem } from '@/widgets/menu-card/ui/MenuCardSubItem'
import { MenuLogoutButton } from '@/widgets/menu-card/ui/MenuLogoutButton'
import { HelpCircle, LayoutGrid, Settings, User } from 'lucide-react'

export default function MenuPage() {
  return (
    <div className="pt-4 pb-6 space-y-4">
      {/* 메인 메뉴 */}
      <div className="space-y-3 flex flex-col">
        <MenuCardItem
          icon={<User size={22} />}
          title="내정보"
          description="프로필 및 계정 설정"
          href={ROUTES.menuProfile}
        />
        <MenuCardItem
          icon={<LayoutGrid size={22} />}
          title="서비스"
          description="덕담, 노담 등 부가 서비스"
          href={ROUTES.service}
        />
      </div>

      {/* 서브 메뉴 */}
      <Card className="p-4">
        <div className="divide-y divide-border">
          <MenuCardSubItem icon={<Settings size={20} />} title="설정" href={ROUTES.menuSettings} />
          <MenuCardSubItem icon={<HelpCircle size={20} />} title="도움말" href={ROUTES.menuHelp} />
        </div>
      </Card>

      {/* 로그아웃 */}
      <MenuLogoutButton />

      {/* 앱 버전 */}
      <p className="text-center text-xs text-muted-foreground pt-2">돈이담 v1.0.0</p>
    </div>
  )
}
