export function RecentTransactionsSkeleton() {
  return (
    <section className="bg-card rounded-2xl p-5 card-shadow mt-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        <div className="h-3 w-12 rounded bg-muted animate-pulse" />
      </div>

      {/* 아이템 */}
      <ul className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <li key={i} className="flex items-center gap-3">
            <div className="shrink-0 w-10 h-10 rounded-full bg-muted animate-pulse" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 w-24 rounded bg-muted animate-pulse" />
              <div className="h-3 w-16 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          </li>
        ))}
      </ul>
    </section>
  )
}
