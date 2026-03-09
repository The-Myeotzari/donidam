import { DashboardCardSchema } from '@/entities/dashboard-card/model/dashboardCard.schema'
import { z } from 'zod'

export type DashboardCard = z.infer<typeof DashboardCardSchema>
