import React from 'react'
import cn from '@/shared/lib/cn'
import { Eye, EyeClosed } from 'lucide-react'

type InputVariant = 'default' | 'error'
type InputSize = 'sm' | 'md' | 'lg'

interface InputcontextValue {
  id: string
  variant: InputVariant
  size: InputSize
  messageId: string
  hasMessage: boolean
  setHasMessage: (v: boolean) => void

  /** password toggle */
  passwordVisible: boolean
  setPasswordVisible: (v: boolean) => void
}

const InputContext = React.createContext<InputcontextValue | null>(null)

const useInputContext = () => {
  const ctx = React.useContext(InputContext)
  if (!ctx) throw new Error('Input 서브 컴포넌트는 <Input> 안에 반드시 사용되어야합니다.')
  return ctx
}

/* Style System (통합) */
const inputStyles = {
  root: 'w-full',
  control: 'relative w-full',
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
  },
  right: {
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

type DisplayNameCarrier = { displayName?: string }

const isInputMessage = (node: React.ReactNode): node is React.ReactElement => {
  if (!React.isValidElement(node)) return false

  const type = node.type
  if (typeof type === 'string') return false

  const maybe = type as unknown as DisplayNameCarrier
  return maybe.displayName === 'InputMessage'
}

const InputRoot = ({
  children,
  variant = 'default',
  size = 'md',
  className,
}: InputRootProps) => {
  const id = React.useId()
  const messageId = `${id}-message`
  const [hasMessage, setHasMessage] = React.useState(false)

  // ✅ password visible state (Context로 공유)
  const [passwordVisible, setPasswordVisible] = React.useState(false)

  const childArray = React.Children.toArray(children)

  const messages: React.ReactNode[] = []
  const controlChildren: React.ReactNode[] = []

  childArray.forEach((child) => {
    if (isInputMessage(child)) messages.push(child)
    else controlChildren.push(child)
  })

  return (
    <InputContext
      value={{
        id,
        variant,
        size,
        messageId,
        hasMessage,
        setHasMessage,
        passwordVisible,
        setPasswordVisible,
      }}
    >
      <div className={cn(inputStyles.root, className)}>
        <div className={inputStyles.control}>{controlChildren}</div>
        {hasMessage ? <div>{messages}</div> : null}
      </div>
    </InputContext>
  )
}

/* Field */
type InputFieldProps = React.ComponentProps<'input'>

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({ className, type = 'text', 'aria-describedby': ariaDescribedBy, ...props }, ref) => {
    const { id, variant, size, messageId, hasMessage, passwordVisible } = useInputContext()

    const describedBy = hasMessage
      ? ariaDescribedBy
        ? `${ariaDescribedBy} ${messageId}`
        : messageId
      : ariaDescribedBy

    // type=password 인 경우에만 토글 반영
    const resolvedType = type === 'password' ? (passwordVisible ? 'text' : 'password') : type

    return (
      <input
        id={id}
        ref={ref}
        type={resolvedType}
        aria-invalid={variant === 'error' ? true : undefined}
        aria-describedby={describedBy}
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
InputIcon.displayName = 'InputIcon'

/* Password Toggle (Context 기반) */
const InputPasswordToggle = () => {
  const { passwordVisible, setPasswordVisible } = useInputContext()

  return (
    <button
      type="button"
      onClick={() => setPasswordVisible(!passwordVisible)}
      className={cn(
        inputStyles.right.base,
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      )}
      aria-label={passwordVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
      aria-pressed={passwordVisible}
    >
      {passwordVisible ? <Eye /> : <EyeClosed/>}
    </button>
  )
}
InputPasswordToggle.displayName = 'InputPasswordToggle'

/* Message */
interface InputMessageProps {
  children: React.ReactNode
  className?: string
}

const InputMessage = ({ children, className }: InputMessageProps) => {
  const { variant, messageId, setHasMessage } = useInputContext()

  React.useEffect(() => {
    setHasMessage(true)
    return () => setHasMessage(false)
  }, [setHasMessage])

  return (
    <p
      id={messageId}
      role={variant === 'error' ? 'alert' : undefined}
      aria-live={variant === 'error' ? 'polite' : undefined}
      className={cn(inputStyles.message.base, inputStyles.message.variants[variant], className)}
    >
      {children}
    </p>
  )
}
InputMessage.displayName = 'InputMessage'

export const Input = Object.assign(InputRoot, {
  Field: InputField,
  Icon: InputIcon,
  InputPasswordToggle,
  Message: InputMessage,
})
