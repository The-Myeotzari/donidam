'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon, CalendarDays, ChartColumn, TextAlignJustify, ScanLine, Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES } from '@/shared/constants/route'
import cn from '@/shared/lib/cn'
import { useRef, useState } from 'react'
import { useToast } from '@/app/_providers/ToastProvier'
import { useAddExpenseMutation } from '@/features/add-transaction/api/addTransaction.mutation'
import { EXPENSE_CATEGORIES } from '@/shared/constants/transactionCategory'
import type { ExpenseCategory } from '@/shared/constants/transactionCategory'

type NavItem = {
  icon: LucideIcon
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { icon: HomeIcon, label: '홈', href: ROUTES.dashboard },
  { icon: CalendarDays, label: '캘린더', href: ROUTES.calendar },
  { icon: ChartColumn, label: '통계', href: ROUTES.stats },
  { icon: TextAlignJustify, label: '더보기', href: ROUTES.menu },
]

const LEFT_ITEMS = NAV_ITEMS.slice(0, 2)
const RIGHT_ITEMS = NAV_ITEMS.slice(2)

export function BottomNav() {
  const pathname = usePathname()
  const { addToast } = useToast()
  const mutation = useAddExpenseMutation()
  const [isScanning, setIsScanning] = useState(false)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    e.target.value = ''

    try {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp'

      const res = await fetch('/api/receipt/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType }),
      })

      if (!res.ok) throw new Error('parse_failed')

      const data = await res.json()
      const category = EXPENSE_CATEGORIES.includes(data.category) ? (data.category as ExpenseCategory) : 'ETC'

      if (!data.amount) throw new Error('no_amount')

      await mutation.mutateAsync({
        type: 'OUT',
        category,
        amount: Number(data.amount),
        isFixed: false,
        createdAt: data.date ? `${data.date}T00:00:00` : new Date().toISOString(),
        description: data.description ?? undefined,
      })

      addToast({ type: 'success', title: '거래내역이 추가됐어요', description: `${Number(data.amount).toLocaleString('ko-KR')}원 · ${data.description ?? ''}` })
    } catch {
      addToast({ type: 'error', title: '영수증 인식 실패', description: '다시 시도해 주세요.' })
    } finally {
      setIsScanning(false)
    }
  }

  const renderNavLink = ({ icon: Icon, label, href }: NavItem) => {
    const active = href === ROUTES.dashboard ? pathname === href : pathname.startsWith(href)
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? 'page' : undefined}
        className="flex flex-col items-center gap-2 px-3 pt-2 pb-1.5 min-w-0 self-end"
      >
        <Icon className={cn('size-5.5', active ? 'text-primary' : 'text-muted-foreground')} strokeWidth="2" />
        <span className={cn('text-[10px]', active ? 'text-primary font-semibold' : 'text-muted-foreground')}>
          {label}
        </span>
      </Link>
    )
  }

  return (
    <>
      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-107.5 mx-auto flex items-end justify-around px-2 pb-safe">
          {LEFT_ITEMS.map(renderNavLink)}

          {/* 영수증 스캔 버튼 */}
          <button
            type="button"
            onClick={() => !isScanning && cameraInputRef.current?.click()}
            className="flex flex-col items-center gap-2 px-3 pb-1.5 min-w-0"
          >
            <div className={cn(
              'w-11 h-11 rounded-2xl flex items-center justify-center -mt-4 shadow-lg transition-colors',
              isScanning ? 'bg-primary/70' : 'bg-primary',
            )}>
              {isScanning
                ? <Loader2 size={20} className="text-primary-foreground animate-spin" />
                : <ScanLine size={20} className="text-primary-foreground" />
              }
            </div>
            <span className="text-[10px] text-muted-foreground">스캔</span>
          </button>

          {RIGHT_ITEMS.map(renderNavLink)}
        </div>
      </nav>
    </>
  )
}
