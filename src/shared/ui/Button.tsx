'use client'
import React from 'react'
import cn from '@/shared/lib/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'dashed'
  size?: 'sm' | 'md' | 'lg' | 'xl'
  fullWidth?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
  loadingText?: string
  children?: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      leftIcon,
      rightIcon,
      isLoading = false,
      loadingText = '로딩 중',
      disabled,
      className,
      children,
      type = 'button', 
      'aria-label': ariaLabel,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type} 
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          isLoading && 'cursor-wait', 
          {
            'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm':
              variant === 'primary',
            'bg-background text-foreground border border-border hover:bg-muted':
              variant === 'secondary',
            'border border-border bg-transparent hover:bg-muted': variant === 'outline',
            'hover:bg-muted': variant === 'ghost',
            'border-2 border-dashed border-border bg-transparent text-muted-foreground hover:border-primary hover:text-primary':
              variant === 'dashed',
          },
          {
            'h-8 px-3 text-xs rounded-lg': size === 'sm',
            'h-10 px-4 text-sm rounded-xl': size === 'md',
            'h-12 px-6 text-base rounded-xl': size === 'lg',
            'h-14 px-8 text-lg rounded-2xl': size === 'xl',
          },
          fullWidth && 'w-full',
          className,
        )}
        {...props}
      >
        {isLoading ? (
          <>
            <span
              className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
              aria-hidden="true"
            />
            <span className="sr-only">{loadingText}</span>
          </>
        ) : (
          <>
            {leftIcon && <span aria-hidden="true">{leftIcon}</span>}
            {children}
            {rightIcon && <span aria-hidden="true">{rightIcon}</span>}
          </>
        )}
      </button>
    )
  },
)

Button.displayName = 'Button'
