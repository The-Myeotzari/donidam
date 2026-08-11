import { getMainDashboardCard } from '@/entities/dashboard-card/api/dashboardCard.server'
import { DashboardCard } from '@/entities/dashboard-card/ui/DashboardCard'
import { DashboardCardSkeleton } from '@/entities/dashboard-card/ui/DashboardCardSkeleton'
import { getRecentTransactions } from '@/entities/transaction/api/transaction.server'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { resolveMonthFirstDay } from '@/app/api/dashboard/main-card/mainCard.server'
import { createServer } from '@/shared/lib/supabase/server'
import { DashboardQuickActions } from '@/widgets/dashboard-quick-actions/ui/DashboardQuickActions'
import { MonthlyExpenseSummary } from '@/widgets/monthly-expense/ui/MonthlyExpenseSummary'
import { MonthlyExpenseSummarySkeleton } from '@/widgets/monthly-expense/ui/MonthlyExpenseSummarySkeleton'
import { RecentTransactions } from '@/widgets/recent-transactions/ui/RecentTransactions'
import { RecentTransactionsSkeleton } from '@/widgets/recent-transactions/ui/RecentTransactionsSkeleton'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'

const RECENT_LIMIT = 5

export default async function Page() {
  const queryClient = new QueryClient()
  const supabase = await createServer()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) redirect('/auth')

  const resolvedMonth = resolveMonthFirstDay(null)
  if (!resolvedMonth.ok) throw new Error(resolvedMonth.detail)

  const [mainCard, recentTransactions] = await Promise.all([
    getMainDashboardCard(supabase, user.id, resolvedMonth.monthFirstDay),
    getRecentTransactions(supabase, user.id, RECENT_LIMIT),
  ])

  queryClient.setQueryData(QUERY_KEYS.DASHBOARD.mainCard(), mainCard)
  queryClient.setQueryData(QUERY_KEYS.TRANSACTIONS.recent(RECENT_LIMIT), recentTransactions)

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <>
        <Suspense fallback={<DashboardCardSkeleton />}>
          <DashboardCard />
        </Suspense>

        <DashboardQuickActions />

        <Suspense fallback={<MonthlyExpenseSummarySkeleton />}>
          <MonthlyExpenseSummary />
        </Suspense>

        <Suspense fallback={<RecentTransactionsSkeleton />}>
          <RecentTransactions limit={RECENT_LIMIT} />
        </Suspense>
      </>
    </HydrationBoundary>
  )
}
