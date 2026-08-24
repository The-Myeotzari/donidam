'use client'

import { useAddExpenseMutation } from '@/features/add-transaction/api/addTransaction.mutation'
import { ADD_EXPENSE_FORM_ID, AddExpenseForm } from '@/features/add-transaction/ui/AddExpenseForm'
import { parseReceipt } from '@/features/receipt-scan/api/parseReceipt'
import type { ReceiptField } from '@/features/receipt-scan/model/receipt.schema'
import { ReceiptReviewNotice } from '@/features/receipt-scan/ui/ReceiptReviewNotice'
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
  const [reviewFields, setReviewFields] = useState<ReceiptField[]>([])
  const [formKey, setFormKey] = useState(0)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const galleryInputRef = useRef<HTMLInputElement>(null)
  const mutation = useAddExpenseMutation()

  const handleClose = () => {
    if (mutation.isPending) return
    setIsOpen(false)
    setScannedValues(undefined)
    setReviewFields([])
    setShowScanMenu(false)
    mutation.reset()
  }

  const handleOpen = () => {
    setScannedValues(undefined)
    setReviewFields([])
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
      const result = await parseReceipt(file)
      const data = result.data
      setScannedValues({
        amount: data.amount ? String(data.amount) : '',
        category: data.category,
        description: data.description,
        date: data.date,
      })
      setReviewFields(result.reviewFields)
      setFormKey((k) => k + 1)
    } catch {
      alert('지원하는 이미지인지 확인한 뒤 다시 시도해 주세요.')
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

      <input ref={cameraInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" capture="environment" className="hidden" onChange={handleImageChange} />
      <input ref={galleryInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleImageChange} />

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
          {reviewFields.length > 0 && <ReceiptReviewNotice fields={reviewFields} />}
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
