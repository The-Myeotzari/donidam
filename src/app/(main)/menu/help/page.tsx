'use client'

import { SUPPORT_EMAIL } from '@/shared/constants/email'
import { HELP } from '@/shared/constants/help'
import { Card } from '@/shared/ui/Card'
import { HelpSectionCard } from '@/widgets/help-section/ui/HelpSectionCard'

export default function HelpPage() {
  return (
    <div className="space-y-4">
      {HELP.map((section) => (
        <HelpSectionCard key={section.id} section={section} />
      ))}

      <Card className="pt-5 text-center">
        <Card.Content>
          <p className="text-muted-foreground mb-2 text-sm">찾는 내용이 없으신가요?</p>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="text-primary text-sm font-medium hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </Card.Content>
      </Card>
    </div>
  )
}
