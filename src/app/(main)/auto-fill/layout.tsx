'use client'

import { Header } from '@/shared/layout/header/Header'
import { Button } from '@/shared/ui/Button'
import { usePathname } from 'next/navigation'
import { ManageModeProvider, useManageMode } from '@/features/autofill/model/manage-mode'

// 동적 라우트 커스텀 타이틀 작업으로 인해 폴더 별로 레이아웃을 분리했습니다.
// 레이아웃 작업이 필요한 경우 해당 작업 폴더 내 layout.tsx를 사용해 주세요.
function ManageButton() {
  const { isManageMode, toggleManageMode } = useManageMode()
  return (
    <Button
      variant={isManageMode ? 'primary' : 'outline'}
      size="sm"
      className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full"
      onClick={toggleManageMode}
    >
      {isManageMode ? '완료' : '관리'}
    </Button>
  )
}

function AutoFillLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAccountDetail = /^\/auto-fill\/accounts\/[^/]+/.test(pathname)

  return (
    <>
      <Header right={isAccountDetail ? <ManageButton /> : undefined} />
      <main className="px-4 pb-4">{children}</main>
    </>
  )
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ManageModeProvider>
      <AutoFillLayout>{children}</AutoFillLayout>
    </ManageModeProvider>
  )
}
