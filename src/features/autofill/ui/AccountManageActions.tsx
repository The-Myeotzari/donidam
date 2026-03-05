'use client'

import { Plus, Trash2 } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { useManageMode } from '../model/manage-mode'

export function AccountManageActions() {
  const { isManageMode, selectedIds } = useManageMode()

  if (!isManageMode) return null

  return (
    <div className="flex justify-between gap-2 pb-4">
      <Button
        variant="outline"
        size="md"
        leftIcon={<Plus size={14} />}
        className="w-full rounded-xl"
      >
        추가
      </Button>
      <Button
        variant="outline"
        size="md"
        leftIcon={<Trash2 size={14} />}
        className="w-full rounded-xl border-rose-200 bg-rose-400 text-white hover:bg-rose-100"
      >
        삭제 ({selectedIds.size})
      </Button>
    </div>
  )
}
