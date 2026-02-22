'use client'

import cn from '@/shared/lib/cn'
import React, {
  createContext,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'

interface TooltipContextProps {
  open: boolean
  setOpen: (open: boolean) => void
  disabled: boolean
  delayDuration: number
  closeDelayDuration: number
  tooltipId: string
  openTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>
  closeTimerRef: React.RefObject<ReturnType<typeof setTimeout> | null>
  triggerRef: React.RefObject<HTMLElement | null>
}

const TooltipContext = createContext<TooltipContextProps | null>(null)

const useTooltipContext = () => {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('Tooltip 서브 컴포넌트는 Tooltip 내부에서 사용되어야 합니다.')
  }
  return context
}

const useSharedTimers = () => {
  const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const openTimer = openTimerRef
    const closeTimer = closeTimerRef
    return () => {
      if (openTimer.current) clearTimeout(openTimer.current)
      if (closeTimer.current) clearTimeout(closeTimer.current)
    }
  }, [])

  return { openTimerRef, closeTimerRef }
}

interface TooltipProviderProps {
  children: React.ReactNode
  delayDuration?: number
  skipDelayDuration?: number
  disableHoverableContent?: boolean
}

export const TooltipProvider = ({ children }: TooltipProviderProps) => {
  return <>{children}</>
}

interface TooltipProps {
  children: React.ReactNode
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  delayDuration?: number
  closeDelayDuration?: number
  disabled?: boolean
}

export const Tooltip = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delayDuration = 200,
  closeDelayDuration = 100,
  disabled = false,
}: TooltipProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const tooltipId = useId()
  const { openTimerRef, closeTimerRef } = useSharedTimers()
  const triggerRef = useRef<HTMLElement | null>(null)

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen

  const setOpen = (newOpen: boolean) => {
    if (disabled) return
    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const contextValue: TooltipContextProps = {
    open,
    setOpen,
    disabled,
    delayDuration,
    closeDelayDuration,
    tooltipId,
    openTimerRef,
    closeTimerRef,
    triggerRef,
  }

  return <TooltipContext value={contextValue}>{children}</TooltipContext>
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
  ref?: React.Ref<HTMLButtonElement>
}

const TooltipTrigger = ({
  asChild = false,
  children,
  onMouseEnter,
  onMouseLeave,
  onFocus,
  onBlur,
  ref,
  ...props
}: TooltipTriggerProps) => {
  const {
    open,
    setOpen,
    disabled,
    delayDuration,
    closeDelayDuration,
    tooltipId,
    openTimerRef,
    closeTimerRef,
    triggerRef,
  } = useTooltipContext()

  const scheduleOpen = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    openTimerRef.current = setTimeout(() => {
      setOpen(true)
    }, delayDuration)
  }

  const scheduleClose = () => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
    }, closeDelayDuration)
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) scheduleOpen()
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    scheduleClose()
    onMouseLeave?.(e)
  }

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    if (!disabled) setOpen(true)
    onFocus?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
    setOpen(false)
    onBlur?.(e)
  }

  const setRefs = (node: HTMLButtonElement | null) => {
    triggerRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ;(ref as React.MutableRefObject<HTMLButtonElement | null>).current = node
    }
  }

  const commonProps = {
    onMouseEnter: handleMouseEnter,
    onMouseLeave: handleMouseLeave,
    onFocus: handleFocus,
    onBlur: handleBlur,
    'aria-describedby': open ? tooltipId : undefined,
  }

  if (asChild && React.isValidElement(children)) {
    const { ref: _ref, ...restProps } = props as { ref?: unknown } & typeof props
    void _ref

    const child = children as React.ReactElement<Record<string, unknown>>
    const childProps = child.props as Record<string, unknown>

    const mergedProps: Record<string, unknown> = {
      ...childProps,
      ...restProps,
      ...commonProps,
      ref: setRefs,
    }

    return <child.type {...mergedProps} />
  }

  return (
    <button ref={setRefs} type="button" disabled={disabled} {...commonProps} {...props}>
      {children}
    </button>
  )
}

TooltipTrigger.displayName = 'TooltipTrigger'

type Side = 'top' | 'right' | 'bottom' | 'left'
type Align = 'start' | 'center' | 'end'

interface Position {
  top: number
  left: number
}

interface TooltipContentProps extends React.HTMLAttributes<HTMLDivElement> {
  side?: Side
  sideOffset?: number
  align?: Align
  alignOffset?: number
  children: React.ReactNode
  ref?: React.Ref<HTMLDivElement>
}

const TooltipContent = ({
  side = 'top',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  className,
  children,
  onMouseEnter,
  onMouseLeave,
  ref,
  ...props
}: TooltipContentProps) => {
  const { open, setOpen, tooltipId, closeDelayDuration, openTimerRef, closeTimerRef, triggerRef } =
    useTooltipContext()

  const internalRef = useRef<HTMLDivElement>(null)

  const setRefs = (node: HTMLDivElement | null) => {
    internalRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ;(ref as React.MutableRefObject<HTMLDivElement | null>).current = node
    }
  }

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    onMouseEnter?.(e)
  }

  const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    if (openTimerRef.current) {
      clearTimeout(openTimerRef.current)
      openTimerRef.current = null
    }
    closeTimerRef.current = setTimeout(() => {
      setOpen(false)
    }, closeDelayDuration)
    onMouseLeave?.(e)
  }

  const [position, setPosition] = useState<Position>({ top: 0, left: 0 })

  useLayoutEffect(() => {
    if (!open || !internalRef.current || !triggerRef.current) return

    const triggerRect = triggerRef.current.getBoundingClientRect()
    const contentRect = internalRef.current.getBoundingClientRect()

    let top = 0
    let left = 0

    switch (side) {
      case 'top':
        top = triggerRect.top - contentRect.height - sideOffset
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
        break
      case 'bottom':
        top = triggerRect.bottom + sideOffset
        left = triggerRect.left + triggerRect.width / 2 - contentRect.width / 2
        break
      case 'left':
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
        left = triggerRect.left - contentRect.width - sideOffset
        break
      case 'right':
        top = triggerRect.top + triggerRect.height / 2 - contentRect.height / 2
        left = triggerRect.right + sideOffset
        break
    }

    if (side === 'top' || side === 'bottom') {
      switch (align) {
        case 'start':
          left = triggerRect.left + alignOffset
          break
        case 'end':
          left = triggerRect.right - contentRect.width - alignOffset
          break
      }
    } else {
      switch (align) {
        case 'start':
          top = triggerRect.top + alignOffset
          break
        case 'end':
          top = triggerRect.bottom - contentRect.height - alignOffset
          break
      }
    }

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight

    if (left < 0) left = 8
    if (left + contentRect.width > viewportWidth) left = viewportWidth - contentRect.width - 8
    if (top < 0) top = 8
    if (top + contentRect.height > viewportHeight) top = viewportHeight - contentRect.height - 8

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPosition({ top, left })
  }, [open, side, sideOffset, align, alignOffset, triggerRef])

  useEffect(() => {
    if (!open) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open, setOpen])

  useEffect(() => {
    if (!open) return
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        internalRef.current &&
        !internalRef.current.contains(target) &&
        triggerRef.current &&
        !triggerRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open, setOpen, triggerRef])

  if (!open) return null

  return createPortal(
    <div
      ref={setRefs}
      id={tooltipId}
      role="tooltip"
      aria-hidden={!open}
      style={{
        position: 'fixed',
        top: `${position.top}px`,
        left: `${position.left}px`,
        zIndex: 50,
      }}
      className={cn(
        'overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md',
        'animate-in fade-in-0 zoom-in-95',
        side === 'bottom' && 'slide-in-from-top-2',
        side === 'left' && 'slide-in-from-right-2',
        side === 'right' && 'slide-in-from-left-2',
        side === 'top' && 'slide-in-from-bottom-2',
        className,
      )}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </div>,
    document.body,
  )
}

TooltipContent.displayName = 'TooltipContent'

Tooltip.Trigger = TooltipTrigger
Tooltip.Content = TooltipContent
