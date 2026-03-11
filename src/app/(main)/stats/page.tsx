import { StatsSummaryCards } from '@/widgets/stats/ui/StatsSummaryCards'
import { StatsCategoryChart } from '@/widgets/stats/ui/StatsCategoryChart'
import { MonthlyTrendChart } from '@/widgets/stats/ui/MonthlyTrendChart'
import { MonthComparisonChart } from '@/widgets/stats/ui/MonthComparisonChart'
import { MonthlyInsights } from '@/widgets/stats/ui/MonthlyInsights'

export default function StatsPage() {
  return (
    <div className="pb-4">
      <StatsSummaryCards />
      <StatsCategoryChart />
      <MonthlyTrendChart />
      <MonthComparisonChart />
      <MonthlyInsights />
    </div>
  )
}
