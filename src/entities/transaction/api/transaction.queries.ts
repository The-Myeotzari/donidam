import { TransactionsResponseSchema } from '@/entities/transaction/model/transaction.schema'
import type { TransactionsData } from '@/entities/transaction/model/transaction.type'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useQuery } from '@tanstack/react-query'

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
