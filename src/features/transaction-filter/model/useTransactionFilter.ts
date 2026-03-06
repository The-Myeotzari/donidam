'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

export function useTransactionFilter() {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // 현재 URL에서 읽기
  const currentCategories = searchParams.get('categories')?.split(',').filter(Boolean) ?? []
  const currentFrom = searchParams.get('from') ?? ''
  const currentTo = searchParams.get('to') ?? ''
  const filterCount = currentCategories.length + (currentFrom || currentTo ? 1 : 0)

  // 시트 내 편집 상태
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')

  // URL 업데이트 헬퍼
  const pushParams = (updater: (p: URLSearchParams) => void) => {
    const params = new URLSearchParams(searchParams.toString())
    updater(params)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  // 핸들러
  const handleOpen = () => {
    // 열 때 URL 상태를 로컬 상태에 동기화
    setSelectedCategories(searchParams.get('categories')?.split(',').filter(Boolean) ?? [])
    setFrom(searchParams.get('from') ?? '')
    setTo(searchParams.get('to') ?? '')
    setOpen(true)
  }

  const handleApply = () => {
    pushParams((p) => {
      if (selectedCategories.length > 0) p.set('categories', selectedCategories.join(','))
      else p.delete('categories')

      if (from) p.set('from', from)
      else p.delete('from')

      if (to) p.set('to', to)
      else p.delete('to')
    })
    setOpen(false)
  }

  const handleReset = () => {
    setSelectedCategories([])
    setFrom('')
    setTo('')
    pushParams((p) => {
      p.delete('categories')
      p.delete('from')
      p.delete('to')
    })
    setOpen(false)
  }

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    )
  }

  return {
    // 시트 열림 상태
    open,
    setOpen,
    // 뱃지 카운트 (URL 기준)
    filterCount,
    // 편집 상태 (시트 내부)
    selectedCategories,
    from,
    to,
    setFrom,
    setTo,
    // 핸들러
    handleOpen,
    handleApply,
    handleReset,
    toggleCategory,
  }
}
