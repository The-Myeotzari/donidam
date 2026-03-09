import cn from '@/shared/lib/cn'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface MenuCardSubItemProps {
  icon: React.ReactNode
  title: string
  subTitle?: string
  href: string
  iconClassName?: string
}

export function MenuCardSubItem({
  icon,
  title,
  subTitle,
  href,
  iconClassName,
}: MenuCardSubItemProps) {
  return (
    <Link href={href} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
      <div
        className={cn(
          'w-9 h-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground shrink-0',
          iconClassName,
        )}
      >
        {icon}
      </div>
      <div className="flex-1">
        <span className="font-medium text-sm">{title}</span>
        {subTitle && <p className="text-xs text-muted-foreground">{subTitle}</p>}
      </div>
      <ChevronRight size={18} className="text-muted-foreground shrink-0" />
    </Link>
  )
}
