'use client'

import { createContext, useContext, useState } from 'react'

type ManageModeContextType = {
  isManageMode: boolean
  toggleManageMode: () => void
  selectedIds: Set<string>
  toggleSelect: (id: string) => void
}

const ManageModeContext = createContext<ManageModeContextType | null>(null)

export function ManageModeProvider({ children }: { children: React.ReactNode }) {
  const [isManageMode, setIsManageMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const toggleManageMode = () => {
    setIsManageMode((prev) => !prev)
    setSelectedIds(new Set())
  }

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <ManageModeContext.Provider value={{ isManageMode, toggleManageMode, selectedIds, toggleSelect }}>
      {children}
    </ManageModeContext.Provider>
  )
}

export function useManageMode() {
  const ctx = useContext(ManageModeContext)
  if (!ctx) throw new Error('useManageMode must be used within ManageModeProvider')
  return ctx
}
