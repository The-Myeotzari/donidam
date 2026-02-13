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

/**
 * children에서 <Input.Message>만 자동 분리해서
 * - control(relative) 안에는 Field/Icon/Toggle만
 * - message는 아래에 렌더
 */

const isInputMessage = (node: React.ReactNode): node is React.ReactElement => {
  if (!React.isValidElement(node)) return false

  const type = node.type

  return (
    typeof type !== 'string' &&
    'displayName' in type &&
    type.displayName === 'InputMessage'
  )
}

const InputRoot = ({ children, variant = 'default', size = 'md', className }: InputRootProps) => {
  const id = React.useId()

  const childArray = React.Children.toArray(children)

  const messages: React.ReactNode[] = []
  const controlChildren: React.ReactNode[] = []

 childArray.forEach((child) => {
  if (isInputMessage(child)) {
    messages.push(child)
  } else {
    controlChildren.push(child)
  }
})


  return (
    <InputContext.Provider value={{ id, variant, size }}>
      <div className={cn(inputStyles.root, className)}>
        <div className={inputStyles.control}>{controlChildren}</div>
        {messages.length > 0 ? <div>{messages}</div> : null}
      </div>
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
InputIcon.displayName = 'InputIcon'

/* Password Toggle */
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
InputPasswordToggle.displayName = 'InputPasswordToggle'

/* Message */
interface InputMessageProps {
  children: React.ReactNode
  className?: string
}

const InputMessage = ({ children, className }: InputMessageProps) => {
  const { variant } = useInputContext()

  return (
    <p className={cn(inputStyles.message.base, inputStyles.message.variants[variant], className)}>
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
