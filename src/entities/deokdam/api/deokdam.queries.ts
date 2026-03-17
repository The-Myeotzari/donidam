import {
  ParentAllowancesSchema,
  ParentPromisesSchema,
  ParentSummarySchema,
} from '@/entities/deokdam/model/deokdam.schema'
import { Api } from '@/shared/lib/api/api'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { useQuery } from '@tanstack/react-query'
import type { AllowanceType, PromiseStatus } from '@/entities/deokdam/model/deokdam.types'

export function fetchParentSummary(month?: string) {
  const url = month
    ? `/deokdam/parent/summary?month=${month}`
    : '/deokdam/parent/summary'
  return Api.get(url, ParentSummarySchema)
}

export function fetchParentPromises(status?: PromiseStatus | 'ALL') {
  const url = status && status !== 'ALL'
    ? `/deokdam/parent/promises?status=${status}`
    : '/deokdam/parent/promises'
  return Api.get(url, ParentPromisesSchema)
}

export function fetchParentAllowances(type?: AllowanceType | 'all') {
  const url = type && type !== 'all'
    ? `/deokdam/parent/allowances?type=${type}`
    : '/deokdam/parent/allowances'
  return Api.get(url, ParentAllowancesSchema)
}

export function useParentSummaryQuery(month?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.DEOKDAM.parentSummary(month),
    queryFn: () => fetchParentSummary(month),
    staleTime: 1000 * 60,
  })
}

export function useParentPromisesQuery(status?: PromiseStatus | 'ALL') {
  return useQuery({
    queryKey: QUERY_KEYS.DEOKDAM.parentPromises(status),
    queryFn: () => fetchParentPromises(status),
    staleTime: 1000 * 30,
  })
}

export function useParentAllowancesQuery(type?: AllowanceType | 'all') {
  return useQuery({
    queryKey: QUERY_KEYS.DEOKDAM.parentAllowances(type),
    queryFn: () => fetchParentAllowances(type),
    staleTime: 1000 * 30,
  })
}
