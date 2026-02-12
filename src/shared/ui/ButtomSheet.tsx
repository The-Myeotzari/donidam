'use client'

import cn from '@/shared/lib/cn'
import React, { createContext, useContext, useEffect, useRef, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

// [린트 오류 해결용] 서버 사이드와 클라이언트 사이드의 마운트 상태를 동기화하기 위한 유틸리티
const emptySubscribe = () => () => {}
const useMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true, // 클라이언트 사이드 값
    () => false, // 서버 사이드(하이드레이션) 값
  )
}

// 내부 Context 전용
interface ButtomSheetContextValue {
  isOpen: boolean
  onClose: () => void
  headerId: string
}

const ButtomSheetContext = createContext<ButtomSheetContextValue | undefined>(undefined)

const useButtomSheetContext = () => {
  const context = useContext(ButtomSheetContext)
  if (!context)
    throw new Error('ButtomSheet 서브 컴포넌트는 ButtomSheet 내부에서 사용되어야 합니다.')
  return context
}

// 외부 Props 타입
interface ButtomSheetProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

// ButtomSheet 컴포넌트
export const ButtomSheet = ({ isOpen, onClose, children, className }: ButtomSheetProps) => {
  const isMounted = useMounted()
  const sheetRef = useRef<HTMLDivElement>(null)
  const headerId = React.useId()

  useEffect(() => {
    if (!isOpen) return
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'

    // 열릴 때 시트 내부로 포커스 이동
    const focusableElements = sheetRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const firstElement = focusableElements?.[0] as HTMLElement
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC 닫기
      if (e.key === 'Escape') onClose()

      // Tab 키 포커스 가두기
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          // Shift + Tab
          if (document.activeElement === firstElement) {
            e.preventDefault()
            lastElement?.focus()
          }
        } else {
          // Tab
          if (document.activeElement === lastElement) {
            e.preventDefault()
            firstElement?.focus()
          }
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = originalStyle
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  if (!isMounted || !isOpen) return null

  return createPortal(
    <ButtomSheetContext.Provider value={{ isOpen, onClose, headerId }}>
      <div className="fixed inset-0 z-50 flex items-end justify-center">
        <div className="fixed inset-0 bg-black/40" onClick={onClose} />
        <div
          ref={sheetRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={headerId}
          tabIndex={-1}
          className={cn(
            'relative z-50 w-full p-6 bg-background rounded-t-3xl animate-slide-up',
            className,
          )}
        >
          {children}
        </div>
      </div>
    </ButtomSheetContext.Provider>,
    document.body,
  )
}

// Header
interface ButtomSheetHeaderProps {
  children: React.ReactNode
  className?: string
}

const ButtomSheetHeader = ({ children, className }: ButtomSheetHeaderProps) => {
  const { headerId } = useButtomSheetContext()
  return (
    <h2
      id={headerId}
      className={cn('mb-4 flex items-center justify-between space-y-1.5', className)}
    >
      {children}
    </h2>
  )
}

// Content (Body)
const ButtomSheetContent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  return <div className={cn('min-h-10 overflow-y-auto', className)}>{children}</div>
}

// Close (닫기 버튼)
const ButtomSheetClose = ({
  children,
}: {
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>
}) => {
  const { onClose } = useButtomSheetContext()

  return React.cloneElement(children, {
    onClick: (e: React.MouseEvent<HTMLElement>) => {
      children.props.onClick?.(e)
      onClose()
    },
  })
}

ButtomSheet.Header = ButtomSheetHeader
ButtomSheet.Content = ButtomSheetContent
ButtomSheet.Close = ButtomSheetClose
