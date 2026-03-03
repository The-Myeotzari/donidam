'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon, CreditCardIcon, CalendarDays, ChartColumn, TextAlignJustify } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES } from '@/shared/constants/route'
import cn from '@/shared/lib/cn'

type NavItem = {
  icon: LucideIcon
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { icon: HomeIcon, label: '홈', href: ROUTES.dashboard },
  { icon: CreditCardIcon, label: '자동기입', href: ROUTES.autoFill },
  { icon: CalendarDays, label: '캘린더', href: ROUTES.calendar },
  { icon: ChartColumn, label: '통계', href: ROUTES.stats },
  { icon: TextAlignJustify, label: '더보기', href: ROUTES.menu },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
      <div className="max-w-107.5 mx-auto flex items-center justify-around px-2 py-2 pb-safe">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const active = href === ROUTES.dashboard ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? 'page' : undefined}
              className="flex flex-col items-center gap-2 px-3 pt-2 pb-1.5 min-w-0"
            >
              <Icon
                className={cn('size-5.5', active ? 'text-primary' : 'text-muted-foreground')}
                strokeWidth="2"
              />
              <span
                className={cn('text-[10px]', active ? 'text-primary font-semibold' : 'text-muted-foreground')}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
