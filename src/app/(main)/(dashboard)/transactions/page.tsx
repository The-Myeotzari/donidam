import { fetchTransactions } from '@/entities/transaction/api/transaction.queries'
import type {
  TransactionListParams,
  TransactionsData,
} from '@/entities/transaction/model/transaction.type'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { getCookies } from '@/shared/lib/api/getCookies'
import { TransactionList } from '@/widgets/transaction-list/ui/TransactionList'
import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query'
import { Suspense } from 'react'

type SearchParams = Promise<{
  type?: string
  categories?: string
  from?: string
  to?: string
}>

export default async function TransactionsPage({ searchParams }: { searchParams: SearchParams }) {
  const param = await searchParams
  const queryClient = new QueryClient()
  const cookie = await getCookies()

  const params: TransactionListParams = {
    type: param.type === 'OUT' ? 'OUT' : param.type === 'IN' ? 'IN' : undefined,
    categories: param.categories ? param.categories.split(',').filter(Boolean) : undefined,
    from: param.from || undefined,
    to: param.to || undefined,
    limit: 20,
    includeSummary: true,
  }

  await queryClient.prefetchInfiniteQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.list(params as Record<string, string>),
    queryFn: ({ pageParam }) =>
      fetchTransactions(
        { ...params, cursor: pageParam as string | undefined },
        { headers: { Cookie: cookie }, cache: 'no-store' },
      ),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      const { page } = lastPage as TransactionsData
      return page.hasMore ? (page.nextCursor ?? undefined) : undefined
    },
    pages: 1,
  })

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <TransactionList />
      </Suspense>
    </HydrationBoundary>
  )
}
