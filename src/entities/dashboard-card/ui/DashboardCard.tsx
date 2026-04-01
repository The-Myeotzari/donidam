'use client'

import { useMainDashboardCardQuery } from '@/entities/dashboard-card/api/dashboardCard.queries'
import { MAIN_CARD_CODES } from '@/shared/constants/dashboardMainCard'
import { isNotFoundLikeError } from '@/shared/lib/api/api'
import { Card } from '@/shared/ui/Card'

type Props = {
  month?: string
}

type BudgetCode = Exclude<(typeof MAIN_CARD_CODES)[number], 'MAIN_CARD_NO_BUDGET'>

type CardConfig = {
  title: string
  variant: 'primary' | 'secondary' | 'family'
}

const CODE_CONFIG: Record<BudgetCode, CardConfig> = {
  MAIN_CARD_CRUISING: { title: '잘하고 있어요! 👏', variant: 'primary' },
  MAIN_CARD_DEFAULT: { title: '계획대로네요! 👍', variant: 'primary' },
  MAIN_CARD_SPEED_CONTROL: { title: '조금 빠른 편이에요 🏃', variant: 'secondary' },
  MAIN_CARD_THRESHOLD: { title: '주의가 필요해요 ⚠️', variant: 'family' },
}

export function DashboardCard({ month }: Props) {
  const { data, isError, error } = useMainDashboardCardQuery(month)

  if (isError) {
    if (isNotFoundLikeError(error)) return null
    return (
      <section className="rounded-2xl bg-card p-4 card-shadow">
        <div className="text-sm">메인 카드를 불러오지 못했습니다.</div>
      </section>
    )
  }

  if (!data) return null

  const hasVars = 'spendPercent' in data.vars

  if (data.code === 'MAIN_CARD_NO_BUDGET' || !hasVars) {
    return (
      <Card variant="primary" className="relative overflow-hidden p-5">
        <div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="relative z-10">
          <p className="text-primary-foreground/70 text-sm">이번 달도</p>
          <p className="text-xl font-bold text-primary-foreground mt-1">예산을 설정해 주세요</p>
          <p className="text-primary-foreground/70 text-sm mt-1">
            예산을 설정하면 관리가 더 쉬워요
          </p>
        </div>
      </Card>
    )
  }

  const { spendPercent } = data.vars
  const { title, variant } = CODE_CONFIG[data.code as BudgetCode] ?? {
    title: '이번 달 예산 관리',
    variant: 'primary',
  }

  return (
    <Card variant={variant} className="relative overflow-hidden p-5">
      <div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
      <div className="relative z-10">
        <p className="text-primary-foreground/70 text-sm">이번 달도</p>
        <p className="text-xl font-bold text-primary-foreground mt-1">{title}</p>
        <p className="text-primary-foreground/70 text-sm mt-1">
          예산의 {Math.round(spendPercent)}%를 사용했어요
        </p>
      </div>
    </Card>
  )
}
