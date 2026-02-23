'use client'

import { ToastItem, useToast } from '@/app/_providers/ToastProvier'
import cn from '@/shared/lib/cn'
import { X } from 'lucide-react'
import { useEffect, useSyncExternalStore } from 'react'
import { createPortal } from 'react-dom'

const emptySubscribe = () => () => {}
const useMounted = () => {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )
}

// ToastContainer
export const ToastContainer = () => {
  const isMounted = useMounted()
  const { toasts } = useToast()
  if (!isMounted) return null

  return createPortal(
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3 w-fit max-w-[calc(100vw-2rem)]">
      {toasts.map((toast) => (
        <ToastRoot key={toast.id} {...toast} />
      ))}
    </div>,
    document.body,
  )
}

// ToastRoot
const TOAST_VARIANTS = {
  success: 'bg-success text-success-foreground',
  error: 'bg-family text-family-foreground',
  info: 'bg-secondary text-secondary-foreground',
  warning: 'bg-accent text-accent-foreground',
} as const

export const ToastRoot = ({ id, type, title, description, duration = 3000 }: ToastItem) => {
  const { removeToast } = useToast()

  useEffect(() => {
    const timer = setTimeout(() => removeToast(id), duration)
    return () => clearTimeout(timer)
  }, [id, duration, removeToast])

  return (
    <div
      className={cn(
        'group pointer-events-auto relative w-full flex items-center justify-between space-x-4 overflow-hidden rounded-xl p-3',
        'transition-all animate-in animate-fade-in',
        TOAST_VARIANTS[type],
      )}
      role="alert"
    >
      <div className="grid gap-1">
        <ToastTitle>{title}</ToastTitle>
        {description && <ToastDescription>{description}</ToastDescription>}
      </div>
      <ToastClose onClick={() => removeToast(id)} />
    </div>
  )
}

export const ToastTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="text-sm font-semibold leading-none">{children}</div>
)

export const ToastDescription = ({ children }: { children: React.ReactNode }) => (
  <div className="text-xs opacity-70 leading-relaxed">{children}</div>
)

export const ToastClose = ({ onClick }: { onClick: () => void }) => (
  <button type="button" onClick={onClick} aria-label="닫기" className="rounded-sm">
    <X className="h-5 w-5" aria-hidden="true" />
  </button>
)

// Compound Namespace
export const Toast = {
  Root: ToastRoot,
  Title: ToastTitle,
  Description: ToastDescription,
  Close: ToastClose,
}
