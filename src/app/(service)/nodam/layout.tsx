import { BottomNav } from '@/shared/layout/BottomNav'
import { Header } from '@/shared/layout/header/Header'

// 동적 라우트 커스텀 타이틀 작업으로 인해 폴더 별로 레이아웃을 분리했습니다.
// 레이아웃 작업이 필요한 경우 해당 작업 폴더 내 layout.tsx를 사용해 주세요.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header back={true} title={"노담 시작하기"} subtitle={"담배 끊고, 돈도 모으고!"} />
      <main className="px-4 pb-4">{children}</main>
      <BottomNav />
    </>
  )
}
