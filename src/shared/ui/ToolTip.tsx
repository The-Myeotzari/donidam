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

interface TooltipContextProps {
  open: boolean
  setOpen: (open: boolean) => void
  disabled: boolean
  delayDuration: number
  tooltipId: string
}

const TooltipContext = createContext<TooltipContextProps | null>(null)

const useTooltipContext = () => {
  const context = useContext(TooltipContext)
  if (!context) {
    throw new Error('Tooltip 서브 컴포넌트는 Tooltip 내부에서 사용되어야 합니다.')
  }
  return context
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
  disabled?: boolean
}

export const Tooltip = ({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  delayDuration = 200,
  disabled = false,
}: TooltipProps) => {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen)
  const tooltipId = useId()

  const open = controlledOpen !== undefined ? controlledOpen : uncontrolledOpen
  const setOpen = (newOpen: boolean) => {
    if (disabled) return

    if (controlledOpen === undefined) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  const contextValue = {
    open,
    setOpen,
    disabled,
    delayDuration,
    tooltipId,
  }

  return <TooltipContext value={contextValue}>{children}</TooltipContext>
}

interface TooltipTriggerProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  children: React.ReactNode
}

const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  (
    { asChild = false, children, onMouseEnter, onMouseLeave, onFocus, onBlur, onClick, ...props },
    ref,
  ) => {
    const { open, setOpen, disabled, delayDuration, tooltipId } = useTooltipContext()
    const openTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
    const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled) return

      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
      openTimerRef.current = setTimeout(() => {
        setOpen(true)
      }, delayDuration)

      onMouseEnter?.(e)
    }

    const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (openTimerRef.current) {
        clearTimeout(openTimerRef.current)
      }
      closeTimerRef.current = setTimeout(() => {
        setOpen(false)
      }, 100)

      onMouseLeave?.(e)
    }

    const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
      if (disabled) return
      setOpen(true)
      onFocus?.(e)
    }

    const handleBlur = (e: React.FocusEvent<HTMLButtonElement>) => {
      setOpen(false)
      onBlur?.(e)
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!disabled) {
        setOpen(!open)
      }
      onClick?.(e)
    }

    useEffect(() => {
      return () => {
        if (openTimerRef.current) {
          clearTimeout(openTimerRef.current)
        }
        if (closeTimerRef.current) {
          clearTimeout(closeTimerRef.current)
        }
      }
    }, [])

    if (asChild && React.isValidElement(children)) {
      return React.cloneElement(children, {
        ref,
        onMouseEnter: handleMouseEnter,
        onMouseLeave: handleMouseLeave,
        onFocus: handleFocus,
        onBlur: handleBlur,
        onClick: handleClick,
        'aria-describedby': open ? tooltipId : undefined,
        ...props,
      } as Record<string, unknown>)
    }

    return (
      <button
        ref={ref}
        type="button"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onClick={handleClick}
        aria-describedby={open ? tooltipId : undefined}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    )
  },
)

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
}

const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  (
    {
      side = 'top',
      sideOffset = 4,
      align = 'center',
      alignOffset = 0,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const { open, tooltipId, setOpen } = useTooltipContext()
    const contentRef = useRef<HTMLDivElement>(null)
    const [position, setPosition] = useState<Position>({ top: 0, left: 0 })

    React.useImperativeHandle(ref, () => contentRef.current as HTMLDivElement)

    useLayoutEffect(() => {
      if (!open || !contentRef.current) return

      const trigger = contentRef.current.previousElementSibling as HTMLElement | null
      if (!trigger) return

      const triggerRect = trigger.getBoundingClientRect()
      const contentRect = contentRef.current.getBoundingClientRect()

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
      if (left + contentRect.width > viewportWidth) {
        left = viewportWidth - contentRect.width - 8
      }
      if (top < 0) top = 8
      if (top + contentRect.height > viewportHeight) {
        top = viewportHeight - contentRect.height - 8
      }

      setPosition({ top, left })
    }, [open, side, sideOffset, align, alignOffset])

    useEffect(() => {
      if (!open) return

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setOpen(false)
        }
      }

      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    }, [open, setOpen])

    useEffect(() => {
      if (!open) return

      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as Node
        if (contentRef.current && !contentRef.current.contains(target)) {
          const trigger = contentRef.current.previousElementSibling
          if (trigger && !trigger.contains(target)) {
            setOpen(false)
          }
        }
      }

      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [open, setOpen])

    if (!open) return null

    return (
      <div
        ref={contentRef}
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
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          side === 'bottom' && 'slide-in-from-top-2',
          side === 'left' && 'slide-in-from-right-2',
          side === 'right' && 'slide-in-from-left-2',
          side === 'top' && 'slide-in-from-bottom-2',
          className,
        )}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}
      >
        {children}
      </div>
    )
  },
)

TooltipContent.displayName = 'TooltipContent'

Tooltip.Trigger = TooltipTrigger
Tooltip.Content = TooltipContent
