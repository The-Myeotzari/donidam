'use client'

import { useState } from 'react'
import { SlidersHorizontal, Search } from 'lucide-react'
import cn from '@/shared/lib/cn'
import { Input } from '@/shared/ui/Input'
import { TabsList, TabsRoot, TabsTrigger } from '@/shared/ui/Tabs'

type Props = {
  searchQuery: string
  onSearchChange: (query: string) => void
}

type BarMode = 'filter' | 'search' | null

export function TransactionFilterBar({ searchQuery, onSearchChange }: Props) {
  const [barMode, setBarMode] = useState<BarMode>(null)

  const toggleBar = (mode: Exclude<BarMode, null>) => {
    setBarMode((prev) => (prev === mode ? null : mode))
  }

  return (
    <div>
      {/* 필터 / 검색 토글 바 */}
      <div className="flex items-center justify-between border-b border-border py-3">
        <button
          className={cn(
            'flex items-center gap-1.5 text-sm',
            barMode === 'filter' ? 'font-medium text-foreground' : 'text-muted-foreground',
          )}
          onClick={() => toggleBar('filter')}
        >
          <SlidersHorizontal size={15} />
          필터
        </button>
        <button
          className={cn(
            'flex items-center gap-1.5 text-sm',
            barMode === 'search' ? 'font-medium text-foreground' : 'text-muted-foreground',
          )}
          onClick={() => toggleBar('search')}
        >
          검색
          <Search size={15} />
        </button>
      </div>

      {/* 필터 칩 (capsule Tabs) */}
      {barMode === 'filter' && (
        <div className="border-b border-border py-3">
          <TabsRoot variant="capsule" defaultValue="all" searchParamKey="filter">
            <TabsList className="justify-start">
              <TabsTrigger value="all">전체</TabsTrigger>
              <TabsTrigger value="income">수입</TabsTrigger>
              <TabsTrigger value="expense">지출</TabsTrigger>
            </TabsList>
          </TabsRoot>
        </div>
      )}

      {/* 검색 입력 */}
      {barMode === 'search' && (
        <div className="border-b border-border py-3">
          <Input size="sm">
            <Input.Icon className="left-3 right-auto">
              <Search size={15} />
            </Input.Icon>
            <Input.Field
              autoFocus
              placeholder="거래 내역 검색"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-9"
            />
          </Input>
        </div>
      )}
    </div>
  )
}
