import { DailyTrendSchema, StatsSummarySchema } from '@/entities/stats/model/stats.schema'
import type { DailyTrend, StatsSummary } from '@/entities/stats/model/stats.types'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useQuery } from '@tanstack/react-query'

export function fetchStatsSummary(month?: string): Promise<StatsSummary> {
  const params = new URLSearchParams()
  if (month) params.set('month', month)
  const qs = params.toString()
  return Api.get(`/stats/summary${qs ? `?${qs}` : ''}`, StatsSummarySchema)
}

export function fetchDailyTrend(month?: string): Promise<DailyTrend> {
  const params = new URLSearchParams()
  if (month) params.set('month', month)
  const qs = params.toString()
  return Api.get(`/stats/daily-trend${qs ? `?${qs}` : ''}`, DailyTrendSchema)
}

export function useStatsSummaryQuery(month?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.STATS.summary(month),
    queryFn: () => fetchStatsSummary(month),
    staleTime: 60_000,
    gcTime: 0,
  })
}

export function useDailyTrendQuery(month?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.STATS.dailyTrend(month),
    queryFn: () => fetchDailyTrend(month),
    staleTime: 60_000,
    gcTime: 0,
  })
}
