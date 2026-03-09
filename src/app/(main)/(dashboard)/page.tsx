import { fetchMainDashboardCard } from '@/entities/dashboard-card/api/dashboardCard.queries'
import { fetchRecentTransactions } from '@/entities/transaction/api/transaction.queries'
import { DashboardCard } from '@/entities/dashboard-card/ui/DashboardCard'
import { DashboardCardSkeleton } from '@/entities/dashboard-card/ui/DashboardCardSkeleton'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { getCookies } from '@/shared/lib/api/getCookies'
import { DashboardQuickActions } from '@/widgets/dashboard-quick-actions/ui/DashboardQuickActions'
import { MonthlyExpenseSummary } from '@/widgets/monthly-expense/ui/MonthlyExpenseSummary'
import { MonthlyExpenseSummarySkeleton } from '@/widgets/monthly-expense/ui/MonthlyExpenseSummarySkeleton'
import { RecentTransactions } from '@/widgets/recent-transactions/ui/RecentTransactions'
import { RecentTransactionsSkeleton } from '@/widgets/recent-transactions/ui/RecentTransactionsSkeleton'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'

const RECENT_LIMIT = 5

export default async function Page() {
  const queryClient = new QueryClient()
  const cookie = await getCookies()

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.DASHBOARD.mainCard(),
      queryFn: () => fetchMainDashboardCard(undefined, { headers: { Cookie: cookie }, cache: 'no-store' }),
    }),
    queryClient.prefetchQuery({
      queryKey: QUERY_KEYS.TRANSACTIONS.recent(RECENT_LIMIT),
      queryFn: () => fetchRecentTransactions(RECENT_LIMIT, { headers: { Cookie: cookie }, cache: 'no-store' }),
    }),
  ])

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<DashboardCardSkeleton />}>
          <DashboardCard />
        </Suspense>
      </HydrationBoundary>

      <DashboardQuickActions />

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MonthlyExpenseSummarySkeleton />}>
          <MonthlyExpenseSummary />
        </Suspense>
      </HydrationBoundary>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<RecentTransactionsSkeleton />}>
          <RecentTransactions limit={RECENT_LIMIT} />
        </Suspense>
      </HydrationBoundary>
    </>
  )
}
