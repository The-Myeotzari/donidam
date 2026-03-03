import { Card } from '@/shared/ui/Card'

export function DashboardCard() {
  return (
    <Card variant="primary" className="relative overflow-hidden p-5">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

      <div className="relative z-10">
        <p className="text-primary-foreground/80 text-sm">이번 달도</p>
        <p className="text-xl font-bold text-primary-foreground mt-1">잘하고 있어요! 👏</p>
        <p className="text-primary-foreground/70 text-sm mt-2">예산의 30%를 사용했어요</p>
      </div>
    </Card>
  )
}
