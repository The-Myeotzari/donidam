'use client'

import cn from '@/shared/lib/cn'
import React, { createContext, useContext, useId } from 'react'

interface ToggleContextProps {
  checked: boolean
  onChange: () => void
  id: string
  disabled?: boolean
  ariaLabel?: string
}

const ToggleContext = createContext<ToggleContextProps | null>(null)

const useToggleContext = () => {
  const context = useContext(ToggleContext)
  if (!context) throw new Error('Toggle 컴포넌트는 Toggle.Root 내부에서 사용되어야 합니다.')
  return context
}

interface ToggleRootProps {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
  disabled?: boolean
  label: string
  labelable?: boolean
  labelPosition?: 'left' | 'right'
  children?: React.ReactNode
  className?: string
}

const ToggleRoot = ({
  checked,
  onCheckedChange,
  disabled = false,
  label,
  labelable = false,
  labelPosition = 'left',
  children,
  className,
}: ToggleRootProps) => {
  const id = useId()
  const onChange = () => !disabled && onCheckedChange(!checked)
  const shouldShowLabel = !!(label && labelable)

  return (
    <ToggleContext
      value={{ checked, onChange, id, disabled, ariaLabel: !labelable ? label : undefined }}
    >
      <div className={cn('flex items-center gap-2.5', className)}>
        {children ? (
          <>{children}</>
        ) : (
          <>
            {shouldShowLabel && labelPosition === 'left' && <Label>{label}</Label>}
            <Track>
              <Thumb />
            </Track>
            {shouldShowLabel && labelPosition === 'right' && <Label>{label}</Label>}
          </>
        )}
      </div>
    </ToggleContext>
  )
}

const Track = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, ...props }, ref) => {
    const { checked, onChange, id, disabled, ariaLabel } = useToggleContext()

    const hasExternalAriaLabel = !!props['aria-label']
    const isNoVisibleLabelMode = !!ariaLabel
    const isVisibleLabelMode = !isNoVisibleLabelMode
    return (
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-labelledby={isVisibleLabelMode && !hasExternalAriaLabel ? `${id}-label` : undefined}
        aria-label={props['aria-label'] || ariaLabel}
        id={id}
        ref={ref}
        disabled={disabled}
        onClick={onChange}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'disabled:cursor-not-allowed disabled:opacity-50',
          checked ? 'bg-primary' : 'bg-input',
          className,
        )}
        {...props}
      />
    )
  },
)
Track.displayName = 'Toggle.Track'

const Thumb = ({ className }: { className?: string }) => {
  const { checked } = useToggleContext()
  return (
    <span
      className={cn(
        'pointer-events-none block h-4.5 w-4.5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out',
        checked ? 'translate-x-5.5' : 'translate-x-0.5',
        className,
      )}
    />
  )
}
Thumb.displayName = 'Toggle.Thumb'

const Label = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const { id, checked, disabled, onChange } = useToggleContext()
  return (
    <label
      id={`${id}-label`}
      onClick={() => {
        if (!disabled) onChange()
      }}
      className={cn(
        'text-sm font-medium select-none cursor-pointer transition-colors',
        checked ? 'text-primary' : 'text-muted-foreground',
        className,
      )}
    >
      {children}
    </label>
  )
}
Label.displayName = 'Toggle.Label'

export const Toggle = Object.assign(ToggleRoot, {
  Track,
  Thumb,
  Label,
})
