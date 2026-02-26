'use client'

import { usePathname } from 'next/navigation'
import { HomeIcon, CreditCardIcon, CalendarIcon, BarChart2Icon, MoreHorizontalIcon, CalendarDays, ChartColumn, TextAlignJustify } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type NavItem = {
  icon: LucideIcon
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { icon: HomeIcon, label: '홈', href: '/' },
  { icon: CreditCardIcon, label: '자동기입', href: '/auto-fill' },
  { icon: CalendarDays, label: '캘린더', href: '/calendar' },
  { icon: ChartColumn, label: '통계', href: '/stats' },
  { icon: TextAlignJustify, label: '더보기', href: '/more' },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-107.5 mx-auto flex items-center justify-around px-2 py-2 pb-safe">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = pathname === href
          return (
            <a
              key={href}
              href={href}
              className="flex flex-col items-center gap-2 px-3 pt-2 pb-1.5 min-w-0"
            >
              <Icon
                className={`size-5.5 ${active ? 'text-primary' : 'text-muted-foreground'}`}
                strokeWidth="2"
              />
              <span
                className={`text-[10px] ${active ? 'text-primary font-semibold' : 'text-muted-foreground'}`}
              >
                {label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
