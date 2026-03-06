import { buildTransactionQS } from '@/entities/transaction/lib/buildTransactionQS'
import { TransactionsResponseSchema } from '@/entities/transaction/model/transaction.schema'
import type {
  TransactionListParams,
  TransactionsData,
} from '@/entities/transaction/model/transaction.type'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'

// 최근 거래 (대시보드용)
export function fetchRecentTransactions(
  limit = 5,
  options?: RequestInit,
): Promise<TransactionsData> {
  return Api.get(
    `/dashboard/transactions?limit=${limit}&sort=createdAt:desc`,
    TransactionsResponseSchema,
    options,
  )
}

export function useRecentTransactionsQuery(limit = 5) {
  return useQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.recent(limit),
    queryFn: () => fetchRecentTransactions(limit),
    staleTime: 60_000,
    gcTime: 0,
  })
}

// 전체 거래 목록 (무한 스크롤)
export function fetchTransactions(
  params: TransactionListParams & { cursor?: string },
  options?: RequestInit,
): Promise<TransactionsData> {
  return Api.get(
    `/dashboard/transactions?${buildTransactionQS(params)}`,
    TransactionsResponseSchema,
    options,
  )
}

export function useInfiniteTransactionsQuery(params: TransactionListParams) {
  return useInfiniteQuery({
    queryKey: QUERY_KEYS.TRANSACTIONS.list(params as Record<string, string>),
    queryFn: ({ pageParam }) =>
      fetchTransactions({ ...params, cursor: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.page.hasMore ? (lastPage.page.nextCursor ?? undefined) : undefined,
    staleTime: 60_000,
    gcTime: 0,
  })
}
