import { Card } from '@/shared/ui/Card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface MenuCardItemProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

export function MenuCardItem({ icon, title, description, href }: MenuCardItemProps) {
  return (
    <Link href={href}>
      <Card hoverable className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-(--primary)/10 flex items-center justify-center text-primary shrink-0">
            {icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <ChevronRight size={20} className="text-muted-foreground shrink-0" />
        </div>
      </Card>
    </Link>
  )
}
