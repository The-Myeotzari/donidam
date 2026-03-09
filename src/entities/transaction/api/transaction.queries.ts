import { buildTransactionQS } from '@/entities/transaction/lib/buildTransactionQS'
import { TransactionsResponseSchema } from '@/entities/transaction/model/transaction.schema'
import type {
  TransactionListParams,
  TransactionsData,
} from '@/entities/transaction/model/transaction.type'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { createClient } from '@/shared/lib/supabase/client'
import type { Transaction } from '../model/transaction.types'

// 캘린더용 월별 거래 조회
export async function fetchTransactionsByMonth(month: Date): Promise<Transaction[]> {
  const supabase = createClient()

  const start = new Date(month.getFullYear(), month.getMonth(), 1).toISOString()
  const end = new Date(month.getFullYear(), month.getMonth() + 1, 0, 23, 59, 59).toISOString()

  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .gte('created_at', start)
    .lte('created_at', end)
    .order('created_at', { ascending: true })

  if (error) throw error

  return data ?? []
}

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
