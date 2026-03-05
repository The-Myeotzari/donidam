import { fetchMainDashboardCard } from '@/entities/dashboard-card/api/dashboardCard.queries'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { getCookies } from '@/shared/lib/api/getCookies'
import { BudgetStatus } from '@/widgets/monthly-expense-budget-status/ui/BudgetStatus'
import { BudgetStatusSkeleton } from '@/widgets/monthly-expense-budget-status/ui/BudgetStatusSkeleton'
import { SpendingByCategoryDetail } from '@/widgets/monthly-expense-spending-by-category-detail/ui/SpendingByCategoryDetail'
import { SpendingByCategoryDetailSkeleton } from '@/widgets/monthly-expense-spending-by-category-detail/ui/SpendingByCategoryDetailSkeleton'
import { SpendingByCategory } from '@/widgets/monthly-expense-spending-by-category/ui/SpendingByCategory'
import { SpendingByCategorySkeleton } from '@/widgets/monthly-expense-spending-by-category/ui/SpendingByCategorySkeleton'
import { MonthlyExpenseSummary } from '@/widgets/monthly-expense/ui/MonthlyExpenseSummary'
import { MonthlyExpenseSummarySkeleton } from '@/widgets/monthly-expense/ui/MonthlyExpenseSummarySkeleton'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'

export default async function MonthlyExpensesPage() {
  const queryClient = new QueryClient()
  const cookie = await getCookies()

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.DASHBOARD.mainCard(),
    queryFn: () =>
      fetchMainDashboardCard(undefined, { headers: { Cookie: cookie }, cache: 'no-store' }),
  })

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<MonthlyExpenseSummarySkeleton />}>
          <MonthlyExpenseSummary showDetailLink={false} />
        </Suspense>
      </HydrationBoundary>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<BudgetStatusSkeleton />}>
          <BudgetStatus />
        </Suspense>
      </HydrationBoundary>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SpendingByCategorySkeleton />}>
          <SpendingByCategory />
        </Suspense>
      </HydrationBoundary>

      <HydrationBoundary state={dehydrate(queryClient)}>
        <Suspense fallback={<SpendingByCategoryDetailSkeleton />}>
          <SpendingByCategoryDetail />
        </Suspense>
      </HydrationBoundary>
    </>
  )
}
