export function BudgetStatusSkeleton() {
  return (
    <section className="bg-card rounded-2xl p-5 card-shadow mt-4">
      {/* 헤더 */}
      <div className="mb-4">
        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
      </div>

      {/* 예산 금액 */}
      <div className="mb-4">
        <div className="h-3 w-20 rounded bg-muted animate-pulse mb-1.5" />
        <div className="h-7 w-36 rounded bg-muted animate-pulse" />
      </div>

      {/* 프로그레스 바 */}
      <div className="mb-5">
        <div className="flex justify-between mb-1.5">
          <div className="h-3 w-14 rounded bg-muted animate-pulse" />
          <div className="h-3 w-14 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-2.5 rounded-full bg-muted animate-pulse" />
      </div>

      {/* 통계 그리드 */}
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-muted rounded-xl p-3">
            <div className="h-3 w-12 rounded bg-muted-foreground/20 animate-pulse mb-1" />
            <div className="h-4 w-16 rounded bg-muted-foreground/20 animate-pulse" />
          </div>
        ))}
      </div>
    </section>
  )
}
