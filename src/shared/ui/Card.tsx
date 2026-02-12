'use client'

import cn from '@/shared/lib/cn'
import React, { createContext, useContext, useId } from 'react'

interface CardContextProps {
  labelId: string
  layout: 'vertical' | 'horizontal'
}

const CardContext = createContext<CardContextProps | null>(null)

const useCardContext = () => {
  const context = useContext(CardContext)
  if (!context) {
    throw new Error('Card 서브 컴포넌트는 Card 내부에서 사용되어야 합니다.')
  }
  return context
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: 'default' | 'primary' | 'secondary' | 'family' | 'success'
  layout?: 'vertical' | 'horizontal'
  hoverable?: boolean
  onClick?: React.MouseEventHandler<HTMLElement>
}

const variants = {
  default: 'bg-card text-card-foreground',
  primary: 'gradient-mint text-primary-foreground',
  secondary: 'gradient-sky text-secondary-foreground',
  family: 'gradient-family text-family-foreground',
  success: 'gradient-success text-success-foreground',
} as const

// 메인 Card 컴포넌트
export const Card = ({
  children,
  className,
  variant = 'default',
  layout = 'vertical',
  hoverable = false,
  onClick,
  ...props
}: CardProps) => {
  const labelId = useId()

  const isClickable = !!onClick || hoverable

  return (
    <CardContext value={{ labelId, layout }}>
      <article
        role={isClickable ? 'button' : undefined}
        tabIndex={isClickable ? 0 : undefined}
        aria-labelledby={labelId}
        onClick={onClick}
        onKeyDown={(e) => {
          if (isClickable && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            onClick?.(e as unknown as React.MouseEvent<HTMLElement>)
          }
        }}
        className={cn(
          'overflow-hidden rounded-2xl bg-card text-card-foreground card-shadow',
          'animate-slide-up transition-all duration-300',
          layout === 'horizontal' && 'flex items-center',
          variants[variant],
          hoverable && 'hover:float-shadow hover:-translate-y-1 cursor-pointer',
          className,
        )}
        {...props}
      >
        {children}
      </article>
    </CardContext>
  )
}

// CardHeader
const CardHeader = ({ children, className, ...props }: CardProps) => {
  const { layout } = useCardContext()
  return (
    <header
      className={cn(
        'flex flex-col space-y-1.5 p-5',
        layout === 'horizontal' && 'pr-0 shrink-0',
        className,
      )}
      {...props}
    >
      {children}
    </header>
  )
}

// CardTitle (Header 내부용)
const CardTitle = ({ children, className, ...props }: CardProps) => {
  useCardContext()
  return (
    <h2 className={cn('font-semibold leading-none tracking-tight', className)} {...props}>
      {children}
    </h2>
  )
}

// CardContent
const CardContent = ({ children, className, ...props }: CardProps) => {
  const { layout } = useCardContext()
  return (
    <div
      className={cn('p-5 pt-0', layout === 'horizontal' && 'pt-5 pl-4 flex-1 min-w-0', className)}
      {...props}
    >
      {children}
    </div>
  )
}

// CardFooter
const CardFooter = ({ children, className, ...props }: CardProps) => {
  const { layout } = useCardContext()
  return (
    <footer
      className={cn('p-5 pt-0', layout === 'horizontal' && 'pt-5 pl-0 shrink-0', className)}
      {...props}
    >
      {children}
    </footer>
  )
}

// 서브 컴포넌트 등록
Card.Header = CardHeader
Card.Title = CardTitle
Card.Content = CardContent
Card.Footer = CardFooter
