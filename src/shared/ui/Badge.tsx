import * as React from 'react'
import cn from '@/shared/lib/cn'

type BadgeVariant = 'sky' | 'green' | 'gray' | 'yellow' | 'red' | 'primarySoft'
type BadgeSize = 'xs' | 'sm' | 'md'

type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
  size?: BadgeSize
  onClick?: undefined
}

type BadgeButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BadgeVariant
  size?: BadgeSize
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

type BadgeRootProps = BadgeProps | BadgeButtonProps

const variantClasses: Record<BadgeVariant, string> = {
  sky: 'bg-sky-100 text-sky-700',
  green: 'bg-green-100 text-green-700',
  gray: 'bg-gray-100 text-gray-600',
  yellow: 'bg-yellow-100 text-yellow-800',
  red: 'bg-red-100 text-red-700',
  primarySoft: 'bg-primary/10 text-primary',
}

const sizeClasses: Record<BadgeSize, string> = {
  xs: 'text-[10px] px-2 py-0.5',
  sm: 'text-xs px-2.5 py-1',
  md: 'text-sm px-3 py-1.5',
}

const baseClass =
  'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors select-none'

const focusClass =
  'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

const BadgeRoot = React.forwardRef<HTMLSpanElement | HTMLButtonElement, BadgeRootProps>(
  (props, ref) => {
    const { className, variant = 'gray', size = 'sm' } = props

    const common = cn(baseClass, variantClasses[variant], sizeClasses[size], className)

    if ('onClick' in props && typeof props.onClick === 'function') {
      const { onClick, ...rest } = props as BadgeButtonProps
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={cn(common, focusClass)}
          {...rest}
        />
      )
    }

    const { ...rest } = props as BadgeProps
    return <span ref={ref as React.Ref<HTMLSpanElement>} className={common} {...rest} />
  },
)

BadgeRoot.displayName = 'Badge'

const BadgeText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  (props, ref) => <span ref={ref} className={cn('truncate', props.className)} {...props} />,
)
BadgeText.displayName = 'BadgeText'

const iconBase = 'inline-flex items-center justify-center shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5'

const BadgeLeftIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  (props, ref) => <span ref={ref} aria-hidden className={cn(iconBase, props.className)} {...props} />,
)
BadgeLeftIcon.displayName = 'BadgeLeftIcon'

const BadgeRightIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  (props, ref) => <span ref={ref} aria-hidden className={cn(iconBase, props.className)} {...props} />,
)
BadgeRightIcon.displayName = 'BadgeRightIcon'

/** ✅ 2) 빈 interface 제거: type alias로 교체 */
export type BadgeActionProps = React.ButtonHTMLAttributes<HTMLButtonElement>

const BadgeAction = React.forwardRef<HTMLButtonElement, BadgeActionProps>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        'ml-0.5 inline-flex items-center justify-center rounded-full',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'hover:opacity-80 active:opacity-70',
        '[&>svg]:h-3.5 [&>svg]:w-3.5',
        className,
      )}
      {...props}
    />
  )
})
BadgeAction.displayName = 'BadgeAction'

export const Badge = Object.assign(BadgeRoot, {
  Text: BadgeText,
  LeftIcon: BadgeLeftIcon,
  RightIcon: BadgeRightIcon,
  Action: BadgeAction,
})
