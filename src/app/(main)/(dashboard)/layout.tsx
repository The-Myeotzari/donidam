import { BottomNav } from '@/shared/layout/BottomNav'
import { Header } from '@/shared/layout/header/Header'
import { Bell } from 'lucide-react'

// 동적 라우트 커스텀 타이틀 작업으로 인해 폴더 별로 레이아웃을 분리했습니다.
// 레이아웃 작업이 필요한 경우 해당 작업 폴더 내 layout.tsx를 사용해 주세요.
export default function Layout({ children }: { children: React.ReactNode }) {
  const currentDate = new Date()
  return (
    <>
      <Header
        className="relative"
        title={
          <span className="text-muted-foreground text-sm">
            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
          </span>
        }
        subtitle={
          <span className="text-2xl font-bold mt-0.5 text-accent-foreground">
            돈이담 <span aria-hidden>💰</span>
          </span>
        }
        right={
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <button className="w-10 h-10 rounded-full bg-card card-shadow flex items-center justify-center">
              <Bell size={20} className="text-muted-foreground" />
            </button>
          </div>
        }
      />
      <main className="px-4 pb-4">{children}</main>
      <BottomNav />
    </>
  )
}
