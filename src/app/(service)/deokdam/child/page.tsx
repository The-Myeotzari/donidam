import { ChildSummaryCard } from '@/widgets/deokdam/ui/ChildSummaryCard'
import { ChildPromiseSection } from '@/widgets/deokdam/ui/ChildPromiseSection'
import { ChildRecentAllowanceSection } from '@/widgets/deokdam/ui/ChildRecentAllowanceSection'

export default function DeokdamChildPage() {
  return (
    <div className="pb-4">
      <ChildSummaryCard />
      <ChildPromiseSection />
      <ChildRecentAllowanceSection />
    </div>
  )
}
