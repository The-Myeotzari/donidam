import { fetchMainDashboardCard } from '@/entities/dashboard-card/api/dashboardCard.queries'
import { DashboardCard } from '@/entities/dashboard-card/ui/DashboardCard'
import { DashboardCardSkeleton } from '@/entities/dashboard-card/ui/DashboardCardSkeleton'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { getCookies } from '@/shared/lib/api/getCookies'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'

export default async function Page() {
  const queryClient = new QueryClient()
  const cookie = await getCookies()

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.DASHBOARD.mainCard(),
    queryFn: () => fetchMainDashboardCard(undefined, { headers: { Cookie: cookie } }),
  })

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<DashboardCardSkeleton />}>
          <DashboardCard />
        </Suspense>
      </HydrationBoundary>

      <div>버튼 리스트</div>
    </>
  )
}
