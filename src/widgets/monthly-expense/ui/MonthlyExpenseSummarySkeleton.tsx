export function MonthlyExpenseSummarySkeleton() {
  return (
    <section className="bg-card rounded-2xl p-5 card-shadow">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-20 rounded bg-muted animate-pulse" />
        <div className="h-3 w-12 rounded bg-muted animate-pulse" />
      </div>

      {/* 콘텐츠 */}
      <div className="flex items-center gap-6">
        {/* 원형 스켈레톤 */}
        <div className="shrink-0 w-24 h-24 rounded-full bg-muted animate-pulse" />

        <div className="space-y-3">
          <div>
            <div className="h-3 w-12 rounded bg-muted animate-pulse mb-1" />
            <div className="h-6 w-28 rounded bg-muted animate-pulse" />
          </div>
          <div>
            <div className="h-3 w-14 rounded bg-muted animate-pulse mb-1" />
            <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </section>
  )
}
