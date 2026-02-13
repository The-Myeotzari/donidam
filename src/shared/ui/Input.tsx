import React from 'react'
import cn from '../lib/cn'

type InputVariant = 'default' | 'error'
type InputSize = 'sm' | 'md' | 'lg'

interface InputcontextValue {
  id: string
  variant: InputVariant
  size: InputSize
}

const InputContext = React.createContext<InputcontextValue | null>(null)

const useInputContext = () => {
  const ctx = React.useContext(InputContext)
  if (!ctx) throw new Error('Input 서브 컴포넌트는 <Input> 안에 반드시 사용되어야합니다.')
  return ctx
}

/* Style System (통합) */
const inputStyles = {
  root: 'relative w-full',
  field: {
    base: cn(
      'w-full rounded-3xl border bg-background ring-offset-background',
      'placeholder:text-muted-foreground',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
    ),
    variants: {
      default: 'border-input focus-visible:ring-ring',
      error: 'border-red-500 focus-visible:ring-red-500',
    },
    sizes: {
      sm: 'h-8 text-sm px-2',
      md: 'h-10 text-base px-3',
      lg: 'h-12 text-lg px-4',
    },
    // 옵션: 오른쪽 요소 있을 때 텍스트 겹침 방지용
    withRight: 'pr-10',
    withRightWide: 'pr-12',
  },
  right: {
    // 아이콘/토글 공통 위치
    base: 'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground',
  },
  message: {
    base: 'mt-1 ml-2 text-sm',
    variants: {
      default: 'text-muted-foreground',
      error: 'text-red-500',
    },
  },
} as const

/* Root */
interface InputRootProps {
  children: React.ReactNode
  variant?: InputVariant
  size?: InputSize
  className?: string
}

const InputRoot = ({ children, variant = 'default', size = 'md', className }: InputRootProps) => {
  const id = React.useId()

  return (
    <InputContext.Provider value={{ id, variant, size }}>
      <div className={cn(inputStyles.root, className)}>{children}</div>
    </InputContext.Provider>
  )
}

/* Field */
type InputFieldProps = React.ComponentProps<'input'>

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type = 'text', ...props }, ref) => {
    const { id, variant, size } = useInputContext()

    return (
      <input
        id={id}
        ref={ref}
        type={type}
        className={cn(
          inputStyles.field.base,
          inputStyles.field.variants[variant],
          inputStyles.field.sizes[size],
          className,
        )}
        {...props}
      />
    )
  },
)

InputField.displayName = 'InputField'

/* Right Icon */
interface InputIconProps {
  children: React.ReactNode
  className?: string
}

const InputIcon = ({ children, className }: InputIconProps) => {
  return <div className={cn(inputStyles.right.base, className)}>{children}</div>
}

/* Password Toggle (정렬만 담당 — 토글 기능은 별도 개선 필요) */
const InputPasswordToggle = () => {
  const [visible, setVisible] = React.useState(false)

  return (
    <button
      type="button"
      onClick={() => setVisible((p) => !p)}
      className={cn(
        inputStyles.right.base,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
      aria-label={visible ? '비밀번호 숨기기' : '비밀번호 보기'}
    >
      👁
    </button>
  )
}

/* Message */
interface InputMessageProps {
  children: React.ReactNode
  className?: string
}

const InputMessage = ({ children, className }: InputMessageProps) => {
  const { variant } = useInputContext()

  return (
    <p
      className={cn(
        inputStyles.message.base,
        inputStyles.message.variants[variant],
        className,
      )}
    >
      {children}
    </p>
  )
}

export const Input = Object.assign(InputRoot, {
  Field: InputField,
  Icon: InputIcon,
  InputPasswordToggle,
  Message: InputMessage,
})
