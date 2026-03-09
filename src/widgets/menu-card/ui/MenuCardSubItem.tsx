import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface MenuCardSubItemProps {
  icon: React.ReactNode
  title: string
  href: string
}

export function MenuCardSubItem({ icon, title, href }: MenuCardSubItemProps) {
  return (
    <Link href={href} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div className="w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0">
        {icon}
      </div>
      <span className="flex-1 font-medium text-sm">{title}</span>
      <ChevronRight size={18} className="text-muted-foreground shrink-0" />
    </Link>
  )
}
