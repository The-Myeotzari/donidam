'use client'

import cn from '@/shared/lib/cn'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createContext, useCallback, useContext } from 'react'

type TabsVariant = 'box' | 'capsule'

interface TabsContextProps {
  activeTab: string
  changeTab: (value: string) => void
  variant: TabsVariant
}

const TabsContext = createContext<TabsContextProps | undefined>(undefined)

const useTabsContext = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs 하위 컴포넌트는 Tabs 컨테이너 안에서 사용되어야 합니다.')
  }
  return context
}

// tab container
interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
  searchParamKey?: string
  variant?: TabsVariant
}

export const TabsRoot = ({
  defaultValue,
  children,
  className,
  searchParamKey = 'tab',
  variant = 'box',
}: TabsProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const activeTab = searchParams.get(searchParamKey) || defaultValue

  const changeTab = useCallback(
    (value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(searchParamKey, value)
      router.push(`${pathname}?${params.toString()}`, { scroll: false })
    },
    [pathname, router, searchParams, searchParamKey],
  )
  return (
    <TabsContext value={{ activeTab, changeTab, variant }}>
      <div className={cn('flex flex-col w-full gap-2', className)}>{children}</div>
    </TabsContext>
  )
}

// tab list
interface TabsListProps {
  children: React.ReactNode
  className?: string
}

export const TabsList = ({ children, className }: TabsListProps) => {
  const { variant } = useTabsContext()

  return (
    <div
      role="tablist"
      className={cn(
        'w-full flex gap-1.5items-center justify-center rounded-md p-1 text-muted-foreground',
        variant === 'box' && 'bg-muted rounded-xl p-1',
        variant === 'capsule' && 'gap-2',
        className,
      )}
    >
      {children}
    </div>
  )
}

// tab button triger
const TRIGGER_VARIANTS = {
  base: 'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  box: 'flex-1 rounded-lg py-2 text-muted-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
  capsule:
    'px-3 py-1.5 rounded-full text-sm font-medium transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=inactive]:bg-muted data-[state=inactive]:text-muted-foreground',
}

interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

export const TabsTrigger = ({ value, children, className }: TabsTriggerProps) => {
  const { activeTab, changeTab, variant } = useTabsContext()
  const isActive = activeTab === value

  return (
    <button
      role="tab"
      aria-selected={isActive}
      data-state={isActive ? 'active' : 'inactive'}
      onClick={() => changeTab(value)}
      className={cn(TRIGGER_VARIANTS.base, TRIGGER_VARIANTS[variant], className)}
    >
      {children}
    </button>
  )
}

// tab content
interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}
export const TabsContent = ({ value, children, className }: TabsContentProps) => {
  const { activeTab } = useTabsContext()
  if (activeTab !== value) return null

  return (
    <div
      role="tabpanel"
      className={cn(
        'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        className,
      )}
    >
      {children}
    </div>
  )
}
