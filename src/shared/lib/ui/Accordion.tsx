import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import cn from '@/shared/lib/cn'

interface AccordionContextValue {
  openItems: Set<string>
  toggleItem: (value: string) => void
  type: 'single' | 'multiple'
  disabled?: boolean
}

interface AccordionItemContextValue {
  value: string
  isOpen: boolean
  isDisabled: boolean
  triggerId: string
  contentId: string
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)
const AccordionItemContext = React.createContext<AccordionItemContextValue | null>(null)

const useAccordionContext = () => {
  const context = React.useContext(AccordionContext)
  if (!context) {
    throw new Error('Accordion components must be used within Accordion')
  }
  return context
}

const useAccordionItemContext = () => {
  const context = React.useContext(AccordionItemContext)
  if (!context) {
    throw new Error('AccordionTrigger and AccordionContent must be used within AccordionItem')
  }
  return context
}

export interface AccordionProps {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      type = 'single',
      defaultValue,
      value: controlledValue,
      onValueChange,
      disabled = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    // Uncontrolled state
    const [uncontrolledValue, setUncontrolledValue] = React.useState<Set<string>>(() => {
      if (defaultValue) {
        return new Set(Array.isArray(defaultValue) ? defaultValue : [defaultValue])
      }
      return new Set()
    })

    const isControlled = controlledValue !== undefined
    const openItems = React.useMemo(() => {
      if (isControlled) {
        return new Set(Array.isArray(controlledValue) ? controlledValue : [controlledValue])
      }
      return uncontrolledValue
    }, [isControlled, controlledValue, uncontrolledValue])

    const toggleItem = React.useCallback(
      (value: string) => {
        const newOpenItems = new Set(openItems)

        if (type === 'single') {
          if (newOpenItems.has(value)) {
            newOpenItems.clear()
          } else {
            newOpenItems.clear()
            newOpenItems.add(value)
          }
        } else {
          if (newOpenItems.has(value)) {
            newOpenItems.delete(value)
          } else {
            newOpenItems.add(value)
          }
        }

        if (!isControlled) {
          setUncontrolledValue(newOpenItems)
        }

        if (onValueChange) {
          const newValue =
            type === 'single' ? Array.from(newOpenItems)[0] || '' : Array.from(newOpenItems)
          onValueChange(newValue)
        }
      },
      [openItems, type, isControlled, onValueChange],
    )

    const contextValue = React.useMemo(
      () => ({
        openItems,
        toggleItem,
        type,
        disabled,
      }),
      [openItems, toggleItem, type, disabled],
    )

    return (
      <AccordionContext.Provider value={contextValue}>
        <div ref={ref} className={cn('divide-y divide-border bg-background', className)} {...props}>
          {children}
        </div>
      </AccordionContext.Provider>
    )
  },
)

Accordion.displayName = 'Accordion'

export interface AccordionItemProps {
  value: string
  disabled?: boolean
  children: React.ReactNode
  className?: string
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ value, disabled: itemDisabled = false, children, className, ...props }, ref) => {
    const { openItems, disabled: accordionDisabled } = useAccordionContext()
    const isOpen = openItems.has(value)
    const isDisabled = accordionDisabled || itemDisabled

    const triggerId = React.useId()
    const contentId = React.useId()

    const contextValue = React.useMemo(
      () => ({
        value,
        isOpen,
        isDisabled,
        triggerId,
        contentId,
      }),
      [value, isOpen, isDisabled, triggerId, contentId],
    )

    return (
      <AccordionItemContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn('border-b border-border', className)}
          data-state={isOpen ? 'open' : 'closed'}
          data-disabled={isDisabled ? '' : undefined}
          {...props}
        >
          {children}
        </div>
      </AccordionItemContext.Provider>
    )
  },
)

AccordionItem.displayName = 'AccordionItem'

export interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  hideIcon?: boolean
}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  ({ children, className, hideIcon = false, ...props }, ref) => {
    const { toggleItem } = useAccordionContext()
    const { value, isOpen, isDisabled, triggerId, contentId } = useAccordionItemContext()

    const handleClick = () => {
      if (!isDisabled) {
        toggleItem(value)
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault()
        const allTriggers = document.querySelectorAll(
          '[role="button"][aria-controls]',
        ) as NodeListOf<HTMLButtonElement>
        const triggerArray = Array.from(allTriggers)
        const targetIndex = e.key === 'Home' ? 0 : triggerArray.length - 1
        triggerArray[targetIndex]?.focus()
      }
    }

    return (
      <h3 className="flex">
        <button
          ref={ref}
          id={triggerId}
          type="button"
          className={cn(
            'flex flex-1 items-center justify-between py-4 font-medium transition-all',
            'text-foreground hover:text-primary hover:underline',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
            '[&[data-state=open]>svg]:rotate-180',
            isDisabled && 'cursor-not-allowed opacity-50 text-muted-foreground',
            className,
          )}
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-disabled={isDisabled}
          disabled={isDisabled}
          data-state={isOpen ? 'open' : 'closed'}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
          {!hideIcon && (
            <ChevronDown
              className="h-4 w-4 shrink-0 transition-transform duration-200"
              aria-hidden="true"
            />
          )}
        </button>
      </h3>
    )
  },
)

AccordionTrigger.displayName = 'AccordionTrigger'

export interface AccordionContentProps {
  children: React.ReactNode
  className?: string
}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  ({ children, className, ...props }, ref) => {
    const { isOpen, triggerId, contentId } = useAccordionItemContext()
    const contentRef = React.useRef<HTMLDivElement>(null)
    const [height, setHeight] = React.useState<number | undefined>(isOpen ? undefined : 0)

    React.useImperativeHandle(ref, () => contentRef.current!)

    React.useEffect(() => {
      if (!contentRef.current) return

      if (isOpen) {
        const contentHeight = contentRef.current.scrollHeight
        setHeight(contentHeight)

        const timer = setTimeout(() => {
          setHeight(undefined)
        }, 200)

        return () => clearTimeout(timer)
      } else {
        const contentHeight = contentRef.current.scrollHeight
        setHeight(contentHeight)

        requestAnimationFrame(() => {
          setHeight(0)
        })
      }
    }, [isOpen])

    return (
      <div
        ref={contentRef}
        id={contentId}
        role="region"
        aria-labelledby={triggerId}
        hidden={!isOpen}
        className={cn(
          'overflow-hidden text-sm text-muted-foreground transition-all duration-200 ease-in-out',
          className,
        )}
        style={{
          height: height !== undefined ? `${height}px` : undefined,
        }}
        data-state={isOpen ? 'open' : 'closed'}
        {...props}
      >
        <div className="pb-4 pt-0">{children}</div>
      </div>
    )
  },
)

AccordionContent.displayName = 'AccordionContent'
