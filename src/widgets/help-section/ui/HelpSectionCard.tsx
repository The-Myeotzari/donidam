import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/shared/ui/Accordion'
import { Card } from '@/shared/ui/Card'

type HelpItem = {
  id: string
  question: string
  answer: string
}

type HelpSection = {
  id: string
  title: string
  items: HelpItem[]
}

export function HelpSectionCard({ section }: { section: HelpSection }) {
  return (
    <Card>
      <Card.Header>
        <Card.Title>{section.title}</Card.Title>
      </Card.Header>

      <Card.Content>
        <Accordion type="multiple" className="bg-card text-sm">
          {section.items.map((item) => (
            <AccordionItem key={item.id} value={`${section.id}-${item.id}`}>
              <AccordionTrigger>{item.question}</AccordionTrigger>
              <AccordionContent>{item.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </Card.Content>
    </Card>
  )
}
