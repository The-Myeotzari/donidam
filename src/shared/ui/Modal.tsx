'use client'

import cn from '@/shared/lib/cn'
import { X } from 'lucide-react'
import React, { createContext, useContext, useEffect, useId, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

const emptySubscribe = () => () => {}
const useIsMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

interface ModalContextProps {
  labelId: string
  onClose: () => void
}

const ModalContext = createContext<ModalContextProps | null>(null)

const useModalContext = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('Modal 서브 컴포넌트는 Modal 내부에서 사용되어야 합니다.')
  }
  return context
}

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  isOpen: boolean
  onClose: () => void
}

// 메인 Modal 컴포넌트
export const Modal = ({ children, isOpen, onClose, className, ...props }: ModalProps) => {
  const labelId = useId()
  const isMounted = useIsMounted()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isMounted || !isOpen) return null

  return createPortal(
    <ModalContext value={{ labelId, onClose }}>
      <div
        className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm animate-fade-in transition-all"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby={labelId}
          className={cn(
            'fixed left-[50%] top-[50%] z-50 grid w-[calc(100%-2rem)] max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-0 shadow-lg duration-200 rounded-2xl overflow-hidden animate-scale-in',
            className,
          )}
          onClick={(e) => e.stopPropagation()}
          {...props}
        >
          {children}
        </div>
      </div>
    </ModalContext>,
    document.body,
  )
}

// ModalHeader
const ModalHeader = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  const { labelId, onClose } = useModalContext()
  return (
    <header className={cn('flex items-center justify-between p-6 pb-2', className)}>
      <h2
        id={labelId}
        className="text-lg font-semibold leading-none tracking-tight text-foreground"
      >
        {children}
      </h2>
      <button type="button" onClick={onClose} aria-label="닫기" className="rounded-sm">
        <X className="h-5 w-5" aria-hidden="true" />
      </button>
    </header>
  )
}

// ModalContent
const ModalContent = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  useModalContext()
  return <div className={cn('p-6 pt-0', className)}>{children}</div>
}

// ModalFooter
const ModalFooter = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => {
  useModalContext()
  return (
    <footer className={cn('flex items-center justify-end gap-2 p-6 pt-0', className)}>
      {children}
    </footer>
  )
}

Modal.Header = ModalHeader
Modal.Content = ModalContent
Modal.Footer = ModalFooter
