export function SpendingByCategorySkeleton() {
  return (
    <section className="bg-card rounded-2xl p-5 card-shadow mt-4">
      {/* title */}
      <div className="h-4 w-28 bg-muted animate-pulse rounded mb-4" />

      <div className="flex items-center gap-5">
        {/* 도넛 차트 skeleton */}
        <div className="w-30 h-30 rounded-full bg-muted animate-pulse shrink-0" />

        {/* 카테고리 리스트 skeleton */}
        <ul className="flex-1 space-y-2.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <li key={i} className="flex items-center gap-2.5">
              {/* icon */}
              <div className="w-8 h-8 rounded-full bg-muted animate-pulse shrink-0" />

              {/* label */}
              <div className="h-3 w-20 bg-muted animate-pulse rounded flex-1" />

              {/* percent */}
              <div className="h-3 w-8 bg-muted animate-pulse rounded" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
