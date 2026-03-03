'use client'

import cn from '@/shared/lib/cn'
import { ArrowLeft } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { getHeaderConfig } from './getHeaderConfig'

type AppHeaderProps = {
  title?: React.ReactNode // 커스텀 페이지에서 타이틀을 주입하고 싶을 때
  subtitle?: React.ReactNode
  backTo?: string // 커스텀 페이지에서 뒤로가기를 주입하고 싶을 때
  back?: boolean // true면 router.back()으로 동작하는 뒤로가기 버튼을 강제로 표시
  right?: React.ReactNode // 우측 슬롯(설정 버튼 등)
  hide?: boolean // 강제 숨김
  className?: string
}

export function Header(props: AppHeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  const config = getHeaderConfig(pathname)

  const hide = props.hide ?? config?.hide ?? false
  if (hide) return null

  const backTo = props.backTo ?? config?.backTo
  const showBack = props.back ?? Boolean(backTo)

  const title = props.title ?? config?.title
  const subtitle = props.subtitle ?? config?.subtitle

  const onBack = () => {
    if (backTo) router.push(backTo)
    else router.back()
  }

  return (
    <header className={cn('sticky top-0 z-50 w-full p-4', props.className ?? '')}>
      <div className={cn('flex items-center', showBack ? 'gap-3' : '')}>
        {/* Left: Back */}
        <div>
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-card card-shadow flex items-center justify-center"
            >
              <ArrowLeft size={20} className="text-muted-foreground" onClick={onBack} />
            </button>
          )}
        </div>

        {/* Center: Title/Sub */}
        <div className="flex min-w-0 flex-col items-start justify-center">
          {title && <div className="text-2xl font-bold">{title}</div>}
          {subtitle && <div className="text-muted-foreground text-sm mt-1">{subtitle}</div>}
        </div>

        {/* Right slot */}
        <div className="w-10">{props.right}</div>
      </div>
    </header>
  )
}
