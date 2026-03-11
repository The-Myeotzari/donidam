import { ROUTES } from '@/shared/constants/route'
import { MenuCardItem } from '@/widgets/menu-card/ui/MenuCardItem'

export default function ServicePage() {
  return (
    <div className="pt-4 pb-6 space-y-4">
      {/* 메인 메뉴 */}
      <div className="space-y-3 flex flex-col">
        <MenuCardItem
          icon="🎁"
          title="덕담"
          description="가족과 함께 용돈을 주고 받아요"
          // 덕담 개발에 맞춰서 수정 필요
          href={ROUTES.deokdamOnboarding}
          iconClassName="bg-linear-to-br from-pink-500 to-rose-400"
        />
        <MenuCardItem
          icon={'🚭'}
          title="노담"
          description="금연으로 절약한 금액을 확인해요"
          // 덕담 개발에 맞춰서 수정 필요
          href={ROUTES.nodamOnboarding}
          iconClassName="bg-linear-to-br from-emerald-500 to-teal-400"
        />
      </div>

      {/* 서브 메뉴 */}
      <div className="space-y-3 flex flex-col bg-(--muted)/30">
        <MenuCardItem
          icon="✨"
          title="더 많은 서비스"
          description="곧 새로운 서비스가 출시될 예정이에요"
          href={ROUTES.service}
          cardClassName="bg-(--muted)/30 text-muted-foreground"
          iconClassName="bg-muted"
        />
      </div>
    </div>
  )
}
