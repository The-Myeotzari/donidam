'use client'

import { ParentSummaryCard } from '@/widgets/deokdam/ui/ParentSummaryCard'
import { ParentAutoAllowanceCard } from '@/widgets/deokdam/ui/ParentAutoAllowanceCard'
import { ParentPromiseSection } from '@/widgets/deokdam/ui/ParentPromiseSection'
import { ParentAllowanceSection } from '@/widgets/deokdam/ui/ParentAllowanceSection'
import { DeokdamSendModal } from '@/widgets/deokdam/ui/DeokdamSendModal'
import { Button } from '@/shared/ui/Button'
import { useState } from 'react'

export default function DeokdamParentPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div className="pb-4 space-y-5">
      <ParentSummaryCard />

      <Button
        fullWidth
        size="lg"
        variant="primary"
        className="bg-rose-400 hover:bg-rose-500"
        onClick={() => setIsModalOpen(true)}
      >
        덕담 보내기
      </Button>

      <ParentAutoAllowanceCard />
      <ParentPromiseSection />
      <ParentAllowanceSection />

      <DeokdamSendModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  )
}
