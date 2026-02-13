import * as React from 'react'
import cn from '@/shared/lib/cn'

/* Types */

type BadgeVariant = 'sky' | 'green' | 'gray' | 'yellow' | 'red' | 'primarySoft'
type BadgeSize = 'xs' | 'sm' | 'md'

type BadgeBaseProps = {
  variant?: BadgeVariant
  size?: BadgeSize
}

type BadgeSpanProps = BadgeBaseProps &
  React.HTMLAttributes<HTMLSpanElement> & { onClick?: undefined }
type BadgeButtonProps = BadgeBaseProps &
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    onClick: React.MouseEventHandler<HTMLButtonElement>
  }

type BadgeProps = BadgeSpanProps | BadgeButtonProps

/* Style System (통합) */

const badgeStyles = {
  base: 'inline-flex items-center gap-1.5 rounded-full font-medium whitespace-nowrap transition-colors select-none',
  focus:
    'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
  variants: {
    sky: 'bg-sky-100 text-sky-700',
    green: 'bg-green-100 text-green-700',
    gray: 'bg-gray-100 text-gray-600',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-700',
    primarySoft: 'bg-primary/10 text-primary',
  },
  sizes: {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1',
    md: 'text-sm px-3 py-1.5',
  },
  icon: 'inline-flex items-center justify-center shrink-0 [&>svg]:h-3.5 [&>svg]:w-3.5',
  action: {
    base: 'ml-0.5 inline-flex items-center justify-center rounded-full',
    focus:
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    state: 'hover:opacity-80 active:opacity-70',
  },
} as const

/* Root */

const BadgeRoot = React.forwardRef<HTMLSpanElement | HTMLButtonElement, BadgeProps>(
  (props, ref) => {
    const { variant = 'gray', size = 'sm', className } = props

    const rootClass = cn(
      badgeStyles.base,
      badgeStyles.variants[variant],
      badgeStyles.sizes[size],
      className,
    )

    // onClick이 있으면 button으로 렌더 (타입도 button으로 좁혀짐)
    if ('onClick' in props && typeof props.onClick === 'function') {
      const { onClick, ...rest } = props as BadgeButtonProps
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          onClick={onClick}
          className={cn(rootClass, badgeStyles.focus)}
          {...rest}
        />
      )
    }

    // ✅ 아니면 span
    const rest = props as BadgeSpanProps
    return <span ref={ref as React.Ref<HTMLSpanElement>} className={rootClass} {...rest} />
  },
)

BadgeRoot.displayName = 'Badge'

/* Text */

const BadgeText = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn('truncate', className)} {...props} />
  ),
)

BadgeText.displayName = 'BadgeText'

/* Icons */

const BadgeLeftIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden className={cn(badgeStyles.icon, className)} {...props} />
  ),
)

BadgeLeftIcon.displayName = 'BadgeLeftIcon'

const BadgeRightIcon = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement>>(
  ({ className, ...props }, ref) => (
    <span ref={ref} aria-hidden className={cn(badgeStyles.icon, className)} {...props} />
  ),
)

BadgeRightIcon.displayName = 'BadgeRightIcon'

/* Action (아이콘 버튼용) */

interface BadgeActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  'aria-label': string
}

const BadgeAction = React.forwardRef<HTMLButtonElement, BadgeActionProps>(
  ({ className, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      className={cn(
        badgeStyles.action.base,
        badgeStyles.action.focus,
        badgeStyles.action.state,
        badgeStyles.icon,
        className,
      )}
      {...props}
    />
  ),
)

BadgeAction.displayName = 'BadgeAction'

export const Badge = Object.assign(BadgeRoot, {
  Text: BadgeText,
  LeftIcon: BadgeLeftIcon,
  RightIcon: BadgeRightIcon,
  Action: BadgeAction,
})
