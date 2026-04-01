'use client'

import { useAddExpenseMutation } from '@/features/add-transaction/api/addTransaction.mutation'
import { ADD_EXPENSE_FORM_ID, AddExpenseForm } from '@/features/add-transaction/ui/AddExpenseForm'
import { isApiRequestError } from '@/shared/lib/api/api'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'
import { Camera, ImageIcon, Loader2, Plus, ScanLine } from 'lucide-react'
import { useRef, useState } from 'react'

type ScannedValues = {
  amount?: string
  category?: string | null
  description?: string
  date?: string
}

export function AddExpenseButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [showScanMenu, setShowScanMenu] = useState(false)
  const [scannedValues, setScannedValues] = useState<ScannedValues | undefined>()
  const [formKey, setFormKey] = useState(0)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const mutation = useAddExpenseMutation()

  const handleClose = () => {
    if (mutation.isPending) return
    setIsOpen(false)
    setScannedValues(undefined)
    setShowScanMenu(false)
    mutation.reset()
  }

  const handleOpen = () => {
    setScannedValues(undefined)
    setFormKey((k) => k + 1)
    setIsOpen(true)
  }

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    setShowScanMenu(false)
    e.target.value = ''

    try {
      const buffer = await file.arrayBuffer()
      const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)))
      const mediaType = file.type as 'image/jpeg' | 'image/png' | 'image/webp'

      const res = await fetch('/api/receipt/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64, mediaType }),
      })

      if (!res.ok) throw new Error()

      const data = await res.json()
      setScannedValues({
        amount: data.amount ? String(data.amount) : undefined,
        category: data.category ?? null,
        description: data.description ?? '',
        date: data.date ?? undefined,
      })
      setFormKey((k) => k + 1)
    } catch {
      alert('영수증을 인식하지 못했습니다. 다시 시도해 주세요.')
    } finally {
      setIsScanning(false)
    }
  }

  return (
    <>
      <Button
        onClick={handleOpen}
        className="flex-1 h-12 rounded-xl bg-card hover:bg-muted text-foreground card-shadow border-0 gap-1.5 px-3"
      >
        <Plus size={16} className="text-red-500" />
        <span className="text-sm">지출 추가</span>
      </Button>

      <input ref={cameraInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
      <input ref={galleryInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />

      <Modal isOpen={isOpen} onClose={handleClose}>
        <Modal.Header>
          <div className="flex items-center justify-between w-full pr-8">
            <span>지출 추가</span>
            <div className="relative">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowScanMenu((v) => !v)}
                disabled={isScanning}
                className="gap-1.5"
              >
                {isScanning ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    인식 중...
                  </>
                ) : (
                  <>
                    <ScanLine size={14} />
                    영수증 스캔
                  </>
                )}
              </Button>

              {showScanMenu && !isScanning && (
                <div className="absolute right-0 top-full mt-1 z-50 bg-background border border-border rounded-xl shadow-lg overflow-hidden min-w-35">
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted transition-colors"
                    onClick={() => { setShowScanMenu(false); cameraInputRef.current?.click() }}
                  >
                    <Camera size={15} />
                    카메라로 찍기
                  </button>
                  <button
                    type="button"
                    className="flex items-center gap-2 w-full px-4 py-3 text-sm hover:bg-muted transition-colors"
                    onClick={() => { setShowScanMenu(false); galleryInputRef.current?.click() }}
                  >
                    <ImageIcon size={15} />
                    앨범에서 선택
                  </button>
                </div>
              )}
            </div>
          </div>
        </Modal.Header>

        <Modal.Content className="max-h-[65vh] overflow-y-auto pt-4">
          <AddExpenseForm
            formKey={formKey}
            initialValues={scannedValues}
            onSubmitData={(payload) =>
              mutation.mutate(payload, {
                onSuccess: () => setIsOpen(false),
              })
            }
          />
        </Modal.Content>

        <Modal.Footer>
          {mutation.isError && (
            <p className="flex-1 text-sm text-destructive">
              {isApiRequestError(mutation.error)
                ? mutation.error.data.detail
                : '오류가 발생했습니다. 다시 시도해 주세요.'}
            </p>
          )}

          <Button variant="outline" size="md" onClick={handleClose} disabled={mutation.isPending}>
            취소
          </Button>
          <Button type="submit" form={ADD_EXPENSE_FORM_ID} size="md" disabled={mutation.isPending}>
            {mutation.isPending ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                추가 중...
              </>
            ) : (
              '추가하기'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}
