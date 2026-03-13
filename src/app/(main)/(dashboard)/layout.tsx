'use client'

import { FilterButton } from '@/features/transaction-filter/ui/FilterButton'
import { TransactionsHeaderTitle } from '@/features/transaction-filter/ui/TransactionsHeaderTitle'
import { ROUTES } from '@/shared/constants/route'
import { BottomNav } from '@/shared/layout/BottomNav'
import { Header } from '@/shared/layout/header/Header'
import { Bell } from 'lucide-react'
import { usePathname } from 'next/navigation'
import { Suspense } from 'react'

// 라우트별 헤더 설정
type DashboardHeaderConfig = {
  subtitle: string
  titleNode?: React.ReactNode
  right?: React.ReactNode
}

const currentDate = new Date()
const defaultTitle = (
  <span className="text-muted-foreground text-sm">
    {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
  </span>
)

const HEADER_CONFIG: Record<string, DashboardHeaderConfig> = {
  [ROUTES.dashboard]: {
    subtitle: '돈이담 💰',
    right: (
      <button className="w-10 h-10 rounded-full bg-card card-shadow flex items-center justify-center">
        <Bell size={20} className="text-muted-foreground" />
      </button>
    ),
  },
  [ROUTES.dashboardMonthly]: {
    subtitle: '이번 달 지출',
  },
  [ROUTES.dashboardTransactions]: {
    subtitle: '전체 거래 내역',
    titleNode: (
      <Suspense fallback={`${currentDate.getFullYear()}년 ${currentDate.getMonth() + 1}월`}>
        <TransactionsHeaderTitle />
      </Suspense>
    ),
    right: (
      <Suspense fallback={<div className="w-10 h-10" />}>
        <FilterButton />
      </Suspense>
    ),
  },
}

// 동적 라우트 커스텀 타이틀 작업으로 인해 폴더 별로 레이아웃을 분리했습니다.
// 레이아웃 작업이 필요한 경우 해당 작업 폴더 내 layout.tsx를 사용해 주세요.
export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const config = HEADER_CONFIG[pathname]

  return (
    <>
      {config && (
        <Header
          className="relative"
          title={
            <span className="text-muted-foreground text-sm">
              {config.titleNode ?? defaultTitle}
            </span>
          }
          subtitle={
            <span className="text-2xl font-bold mt-0.5 text-(--foreground)">{config.subtitle}</span>
          }
          right={
            config.right && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2">{config.right}</div>
            )
          }
        />
      )}
      <main className="px-4 pb-4">{children}</main>
      <BottomNav />
    </>
  )
}
