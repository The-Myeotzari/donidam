import { SpendingByCategorySchema } from '@/entities/spending-by-category/model/spendingByCategory.schema'
import type { SpendingByCategoryData } from '@/entities/spending-by-category/model/spendingByCategory.type'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useQuery } from '@tanstack/react-query'

export function fetchSpendingByCategory(
  month?: string,
  options?: RequestInit,
): Promise<SpendingByCategoryData> {
  const params = new URLSearchParams({ type: 'OUT' })
  if (month) params.set('month', month)
  return Api.get(`/dashboard/spending/by-category?${params}`, SpendingByCategorySchema, options)
}

export function useSpendingByCategoryQuery(month?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.SPENDING_BY_CATEGORY.byMonth(month),
    queryFn: () => fetchSpendingByCategory(month),
    staleTime: 60_000,
    gcTime: 0,
  })
}
