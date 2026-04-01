export function SpendingByCategoryDetailSkeleton() {
  return (
    <section className="bg-card rounded-2xl p-5 card-shadow mt-4">
      <div className="h-4 w-24 bg-muted rounded animate-pulse mb-4" />

      <ul className="flex-1 space-y-2.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <li key={i} className="flex items-center gap-2.5 p-3 rounded-md bg-muted/50">
            {/* 아이콘 */}
            <div className="w-8 h-8 rounded-md bg-muted animate-pulse" />

            {/* 라벨 */}
            <div className="flex-1 h-3 w-20 bg-muted rounded animate-pulse" />

            {/* 퍼센트 */}
            <div className="h-3 w-10 bg-muted rounded animate-pulse" />
          </li>
        ))}
      </ul>
    </section>
  )
}
