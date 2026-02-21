'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import cn from '@/shared/lib/cn'

type SelectSize = 'sm' | 'md' | 'lg'

type ItemRecord = {
  id: string
  value: string
  label: string
  disabled?: boolean
  ref: React.RefObject<HTMLDivElement | null>
}

type Align = 'start' | 'center' | 'end'
type Side = 'bottom' | 'top'

interface Ctx {
  size: SelectSize
  disabled: boolean

  open: boolean
  setOpen: (v: boolean) => void

  value?: string
  setValue: (v: string) => void
  placeholder?: string

  // value -> label 캐시 (Content 닫혀도 표시 유지)
  labelMap: Record<string, string>

  // a11y
  triggerId: string
  listboxId: string
  descriptionId: string
  messageId: string
  hasDescription: boolean
  hasMessage: boolean
  setHasDescription: (v: boolean) => void
  setHasMessage: (v: boolean) => void

  // positioning
  side: Side
  align: Align
  offset: number
  contentWidth: 'trigger' | number

  triggerRef: React.MutableRefObject<HTMLButtonElement | null>
  contentRef: React.MutableRefObject<HTMLDivElement | null>

  items: ItemRecord[]
  registerItem: (item: ItemRecord) => void
  unregisterItem: (id: string) => void

  activeIndex: number
  setActiveIndex: (i: number) => void

  closeAndFocusTrigger: () => void
}

const SelectContext = React.createContext<Ctx | null>(null)

const useSelect = () => {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error('Select 서브 컴포넌트는 <SelectRoot> 안에서만 사용할 수 있습니다.')
  return ctx
}

const styles = {
  root: 'w-full',
  triggerBase: cn(
    'flex w-full items-center justify-between',
    'rounded-3xl border bg-background ring-offset-background',
    'placeholder:text-muted-foreground',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:cursor-not-allowed disabled:opacity-50',
    '[&>span]:line-clamp-1',
  ),
  triggerSize: {
    sm: 'h-9 px-3 text-sm',
    md: 'h-11 px-4 text-sm',
    lg: 'h-12 px-4 text-base',
  } satisfies Record<SelectSize, string>,

  // viewport padding
  content: cn(
    'z-50 max-h-72 overflow-auto rounded-2xl border bg-popover text-popover-foreground shadow-md outline-none',
    'p-2',
  ),

  label: 'px-3 py-2 text-sm font-semibold text-foreground',
  item: cn(
    'relative flex w-full select-none items-center rounded-xl px-3 py-2 text-sm outline-none',
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
  ),
  itemActive: 'bg-accent text-accent-foreground',
  itemSelectedIconWrap: 'absolute left-2 flex h-4 w-4 items-center justify-center',
  separator: 'my-1 h-px bg-muted',
  helperText: 'mt-1 px-2 text-xs text-muted-foreground',
  messageText: 'mt-1 px-2 text-xs text-muted-foreground',
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max))

function computePos(args: {
  rect: DOMRect
  side: Side
  align: Align
  offset: number
  contentWidth: 'trigger' | number
}) {
  const { rect, side, align, offset, contentWidth } = args
  const width = contentWidth === 'trigger' ? rect.width : contentWidth

  const top = side === 'bottom' ? rect.bottom + offset : rect.top - offset
  let left = rect.left
  if (align === 'center') left = rect.left + rect.width / 2 - width / 2
  if (align === 'end') left = rect.right - width

  const pad = 8
  left = clamp(left, pad, window.innerWidth - width - pad)

  return { top, left, width }
}

/** Root */
interface SelectRootProps {
  children: React.ReactNode
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  disabled?: boolean
  placeholder?: string
  size?: SelectSize

  side?: Side
  align?: Align
  offset?: number
  contentWidth?: 'trigger' | number

  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

const SelectRoot = ({
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  placeholder,
  size = 'md',
  side = 'bottom',
  align = 'start',
  offset = 8,
  contentWidth = 'trigger',
  open: openProp,
  defaultOpen,
  onOpenChange,
}: SelectRootProps) => {
  const triggerId = React.useId()
  const listboxId = React.useId()
  const descriptionId = React.useId()
  const messageId = React.useId()

  const triggerRef = React.useRef<HTMLButtonElement | null>(null)
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  const [hasDescription, setHasDescription] = React.useState(false)
  const [hasMessage, setHasMessage] = React.useState(false)

  const [items, setItems] = React.useState<ItemRecord[]>([])
  const [labelMap, setLabelMap] = React.useState<Record<string, string>>({})

  const registerItem = React.useCallback((item: ItemRecord) => {
    setItems((prev) => (prev.some((p) => p.id === item.id) ? prev : [...prev, item]))
    setLabelMap((prev) => (prev[item.value] === item.label ? prev : { ...prev, [item.value]: item.label }))
  }, [])

  const unregisterItem = React.useCallback((id: string) => {
    setItems((prev) => prev.filter((p) => p.id !== id))
  }, [])

  const isValueControlled = valueProp !== undefined
  const [uncontrolledValue, setUncontrolledValue] = React.useState<string | undefined>(defaultValue)
  const value = isValueControlled ? valueProp : uncontrolledValue
  const setValue = React.useCallback(
    (v: string) => {
      if (!isValueControlled) setUncontrolledValue(v)
      onValueChange?.(v)
    },
    [isValueControlled, onValueChange],
  )

  const isOpenControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen ?? false)
  const open = isOpenControlled ? openProp : uncontrolledOpen
  const setOpen = React.useCallback(
    (v: boolean) => {
      if (!isOpenControlled) setUncontrolledOpen(v)
      onOpenChange?.(v)
    },
    [isOpenControlled, onOpenChange],
  )

  const [activeIndex, setActiveIndex] = React.useState(-1)

  const closeAndFocusTrigger = React.useCallback(() => {
    setOpen(false)
    requestAnimationFrame(() => triggerRef.current?.focus())
  }, [setOpen])

  React.useEffect(() => {
    if (!open) return

    const enabledIndices = items
      .map((it, idx) => ({ it, idx }))
      .filter(({ it }) => !it.disabled)
      .map(({ idx }) => idx)

    const selectedIndex = value ? items.findIndex((it) => it.value === value && !it.disabled) : -1
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : enabledIndices[0] ?? -1)

    requestAnimationFrame(() => contentRef.current?.focus())
  }, [open, items, value])

  React.useEffect(() => {
    if (!open) return
    if (activeIndex < 0) return
    items[activeIndex]?.ref.current?.scrollIntoView({ block: 'nearest' })
  }, [activeIndex, items, open])

  React.useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent | TouchEvent) => {
      const t = e.target as Node
      if (triggerRef.current?.contains(t)) return
      if (contentRef.current?.contains(t)) return
      closeAndFocusTrigger()
    }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('touchstart', onDown, { passive: true })
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('touchstart', onDown)
    }
  }, [open, closeAndFocusTrigger])

  const ctx: Ctx = {
    size,
    disabled,
    open,
    setOpen,
    value,
    setValue,
    placeholder,
    labelMap,

    triggerId,
    listboxId,
    descriptionId,
    messageId,
    hasDescription,
    hasMessage,
    setHasDescription,
    setHasMessage,

    side,
    align,
    offset,
    contentWidth,

    triggerRef,
    contentRef,

    items,
    registerItem,
    unregisterItem,

    activeIndex,
    setActiveIndex,

    closeAndFocusTrigger,
  }

  return (
    <SelectContext.Provider value={ctx}>
      <div className={styles.root}>{children}</div>
    </SelectContext.Provider>
  )
}
SelectRoot.displayName = 'SelectRoot'

/** Trigger */
type SelectTriggerProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, onKeyDown, onClick, ...props }, forwardedRef) => {
    const {
      size,
      disabled,
      open,
      setOpen,
      triggerId,
      listboxId,
      descriptionId,
      messageId,
      hasDescription,
      hasMessage,
      triggerRef,
    } = useSelect()

    const setRefs = (node: HTMLButtonElement | null) => {
      triggerRef.current = node
      if (typeof forwardedRef === 'function') forwardedRef(node)
      else if (forwardedRef) (forwardedRef as React.MutableRefObject<HTMLButtonElement | null>).current = node
    }

    const describedBy = [hasDescription ? descriptionId : null, hasMessage ? messageId : null]
      .filter(Boolean)
      .join(' ')
    const ariaDescribedBy = describedBy.length > 0 ? describedBy : undefined

    const openDropdown = () => {
      if (disabled) return
      setOpen(true)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
      onKeyDown?.(e)
      if (e.defaultPrevented) return
      if (disabled) return

      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault()
        openDropdown()
      }
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(e)
      if (e.defaultPrevented) return
      if (disabled) return
      setOpen(!open)
    }

    return (
      <button
        type="button"
        id={triggerId}
        ref={setRefs}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listboxId : undefined}
        aria-describedby={ariaDescribedBy}
        className={cn(styles.triggerBase, styles.triggerSize[size], 'border-input', className)}
        onKeyDown={handleKeyDown}
        onClick={handleClick}
        {...props}
      >
        {children}
        <ChevronDown className="h-4 w-4 opacity-60" aria-hidden="true" />
      </button>
    )
  },
)
SelectTrigger.displayName = 'SelectTrigger'

/** Value */
interface SelectValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string
}
const SelectValue = ({ className, placeholder: placeholderProp, ...props }: SelectValueProps) => {
  const { value, placeholder, labelMap } = useSelect()
  const ph = placeholderProp ?? placeholder ?? '선택'
  const label = value ? labelMap[value] : undefined

  return (
    <span className={cn('min-w-0 text-left', className)} {...props}>
      {label ?? <span className="text-muted-foreground">{ph}</span>}
    </span>
  )
}
SelectValue.displayName = 'SelectValue'

/** Content */
interface SelectContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const SelectContent = ({ className, children, ...props }: SelectContentProps) => {
  const { open, setOpen, disabled, listboxId, triggerRef, contentRef, items, activeIndex, setActiveIndex, closeAndFocusTrigger, side, align, offset, contentWidth, setValue } =
    useSelect()

  const [mounted, setMounted] = React.useState(false)
  const [pos, setPos] = React.useState<{ top: number; left: number; width: number } | null>(null)

  React.useEffect(() => setMounted(true), [])

  const updatePos = React.useCallback(() => {
    const el = triggerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    setPos(computePos({ rect, side, align, offset, contentWidth }))
  }, [align, contentWidth, offset, side, triggerRef])

  React.useEffect(() => {
    if (!open) return
    updatePos()
    const onScroll = () => updatePos()
    const onResize = () => updatePos()
    window.addEventListener('scroll', onScroll, true)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('scroll', onScroll, true)
      window.removeEventListener('resize', onResize)
    }
  }, [open, updatePos])

  const move = (dir: 1 | -1) => {
    if (items.length === 0) return
    let next = activeIndex
    for (let step = 0; step < items.length; step++) {
      next = (next + dir + items.length) % items.length
      if (!items[next]?.disabled) {
        setActiveIndex(next)
        return
      }
    }
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return

    if (e.key === 'Escape') {
      e.preventDefault()
      closeAndFocusTrigger()
      return
    }

    if (e.key === 'Tab') {
      setOpen(false)
      return
    }

    if (e.key === 'Home') {
      e.preventDefault()
      const idx = items.findIndex((it) => !it.disabled)
      setActiveIndex(idx >= 0 ? idx : -1)
      return
    }

    if (e.key === 'End') {
      e.preventDefault()
      for (let i = items.length - 1; i >= 0; i--) {
        if (!items[i]?.disabled) {
          setActiveIndex(i)
          break
        }
      }
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      move(1)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      move(-1)
      return
    }

    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      const it = items[activeIndex]
      if (!it || it.disabled) return
      setValue(it.value)
      closeAndFocusTrigger()
    }
  }

  if (!mounted) return null

  const activeId = activeIndex >= 0 ? items[activeIndex]?.id : undefined

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: pos?.top ?? 0,
        left: pos?.left ?? 0,
        width: pos?.width ?? undefined,
        display: open ? 'block' : 'none',
      }}
    >
      <div
        ref={contentRef}
        id={listboxId}
        role="listbox"
        tabIndex={-1}
        aria-activedescendant={activeId}
        aria-hidden={!open}
        className={cn(styles.content, className)}
        onKeyDown={onKeyDown}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body,
  )
}
SelectContent.displayName = 'SelectContent'

/** Group/Label/Separator */
const SelectGroup = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('py-1', className)} {...props} />
)
SelectGroup.displayName = 'SelectGroup'

const SelectLabel = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn(styles.label, className)} {...props} />
)
SelectLabel.displayName = 'SelectLabel'

const SelectSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div role="separator" className={cn(styles.separator, className)} {...props} />
)
SelectSeparator.displayName = 'SelectSeparator'

/** Item */
interface SelectItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
  disabled?: boolean
  children: React.ReactNode
}

const SelectItem = ({ value, disabled = false, className, children, ...props }: SelectItemProps) => {
  const { items, registerItem, unregisterItem, activeIndex, setActiveIndex, setValue, closeAndFocusTrigger, value: selected } =
    useSelect()

  const id = React.useId()
  const ref = React.useRef<HTMLDivElement | null>(null)
  const label = React.useMemo(() => (typeof children === 'string' ? children : String(value)), [children, value])

  React.useEffect(() => {
    registerItem({ id, value, label, disabled, ref })
    return () => unregisterItem(id)
  }, [disabled, id, label, registerItem, unregisterItem, value])

  const index = items.findIndex((it) => it.id === id)
  const isActive = index >= 0 && index === activeIndex
  const isSelected = selected === value

  return (
    <div
      id={id}
      ref={ref}
      role="option"
      aria-selected={isSelected}
      data-disabled={disabled ? 'true' : 'false'}
      className={cn(styles.item, isActive && styles.itemActive, className)}
      onMouseEnter={() => {
        if (disabled) return
        if (index >= 0) setActiveIndex(index)
      }}
      onMouseDown={(e) => {
        e.preventDefault()
      }}
      onClick={() => {
        if (disabled) return
        setValue(value)
        closeAndFocusTrigger()
      }}
      {...props}
    >
      <span className={styles.itemSelectedIconWrap} aria-hidden="true">
        {isSelected ? <Check className="h-4 w-4" /> : null}
      </span>
      <span className="pl-4">{children}</span>
    </div>
  )
}
SelectItem.displayName = 'SelectItem'

/** Description/Message */
const SelectDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { descriptionId, setHasDescription } = useSelect()
  React.useEffect(() => {
    setHasDescription(true)
    return () => setHasDescription(false)
  }, [setHasDescription])
  return <p id={descriptionId} className={cn(styles.helperText, className)} {...props} />
}
SelectDescription.displayName = 'SelectDescription'

const SelectMessage = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => {
  const { messageId, setHasMessage } = useSelect()
  React.useEffect(() => {
    setHasMessage(true)
    return () => setHasMessage(false)
  }, [setHasMessage])
  return <p id={messageId} className={cn(styles.messageText, className)} {...props} />
}
SelectMessage.displayName = 'SelectMessage'

export {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectDescription,
  SelectMessage,
}
