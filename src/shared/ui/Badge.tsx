import * as React from 'react'
import cn from '@/shared/lib/cn'

/* Types */

type BadgeVariant = 'sky' | 'green' | 'gray' | 'yellow' | 'red' | 'primarySoft'

type BadgeSize = 'xs' | 'sm' | 'md'

interface BadgeProps extends React.HTMLAttributes<HTMLElement> {
  variant?: BadgeVariant
  size?: BadgeSize
}

/* Style Maps */

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

/* Root */

const BadgeRoot = React.forwardRef<HTMLElement, BadgeProps>(
  ({ className, variant = 'gray', size = 'sm', onClick, ...props }, ref) => {
    const Comp = onClick ? 'button' : 'span'

    return (
      <Comp
        ref={ref as any}
        type={onClick ? 'button' : undefined}
        onClick={onClick}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap',
          'transition-colors select-none',
          onClick &&
            'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        {...props}
      />
    )
  },
)

BadgeRoot.displayName = 'Badge'

/* Text */

const BadgeText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  (props, ref) => {
    return <span ref={ref} className="truncate" {...props} />
  },
)

BadgeText.displayName = 'BadgeText'

/* Icons */

const iconBase = 'inline-flex items-center justify-center shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5'

const BadgeLeftIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  (props, ref) => {
    return <span ref={ref} aria-hidden className={cn(iconBase, props.className)} {...props} />
  },
)

BadgeLeftIcon.displayName = 'BadgeLeftIcon'

const BadgeRightIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  (props, ref) => {
    return <span ref={ref} aria-hidden className={cn(iconBase, props.className)} {...props} />
  },
)

BadgeRightIcon.displayName = 'BadgeRightIcon'

/* Action (X 버튼용) */

interface BadgeActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {

}

const BadgeAction = React.forwardRef<HTMLButtonElement, BadgeActionProps>(
  ({ className, ...props }, ref) => {
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
  },
)

BadgeAction.displayName = 'BadgeAction'

export const Badge = Object.assign(BadgeRoot, {
  Text: BadgeText,
  LeftIcon: BadgeLeftIcon,
  RightIcon: BadgeRightIcon,
  Action: BadgeAction,
})
