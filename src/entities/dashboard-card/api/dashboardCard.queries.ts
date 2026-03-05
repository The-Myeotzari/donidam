import { DashboardCardSchema } from '@/entities/dashboard-card/model/dashboardCard.schema'
import type { DashboardCard } from '@/entities/dashboard-card/model/dashboardCard.type'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { Api } from '@/shared/lib/api/api'
import { useQuery } from '@tanstack/react-query'

export function fetchMainDashboardCard(month?: string, options?: RequestInit): Promise<DashboardCard> {
  const qs = month ? `?month=${encodeURIComponent(month)}` : ''
  return Api.get(`/dashboard/main-card${qs}`, DashboardCardSchema, options)
}

export function useMainDashboardCardQuery(month?: string) {
  return useQuery({
    queryKey: QUERY_KEYS.DASHBOARD.mainCard(month),
    queryFn: () => fetchMainDashboardCard(month),
    staleTime: 60_000,
    gcTime: 0,
  })
}
