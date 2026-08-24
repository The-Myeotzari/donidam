'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HomeIcon, CalendarDays, ChartColumn, TextAlignJustify, ScanLine, Loader2 } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { ROUTES } from '@/shared/constants/route'
import cn from '@/shared/lib/cn'
import { useRef, useState } from 'react'
import { useToast } from '@/app/_providers/ToastProvier'
import { useAddExpenseMutation } from '@/features/add-transaction/api/addTransaction.mutation'
import { ADD_EXPENSE_FORM_ID, AddExpenseForm } from '@/features/add-transaction/ui/AddExpenseForm'
import { parseReceipt } from '@/features/receipt-scan/api/parseReceipt'
import type { ReceiptParseResponse } from '@/features/receipt-scan/model/receipt.schema'
import { ReceiptReviewNotice } from '@/features/receipt-scan/ui/ReceiptReviewNotice'
import { Button } from '@/shared/ui/Button'
import { Modal } from '@/shared/ui/Modal'

type NavItem = {
  icon: LucideIcon
  label: string
  href: string
}

const NAV_ITEMS: NavItem[] = [
  { icon: HomeIcon, label: '홈', href: ROUTES.dashboard },
  { icon: CalendarDays, label: '캘린더', href: ROUTES.calendar },
  { icon: ChartColumn, label: '통계', href: ROUTES.stats },
  { icon: TextAlignJustify, label: '더보기', href: ROUTES.menu },
]

const LEFT_ITEMS = NAV_ITEMS.slice(0, 2)
const RIGHT_ITEMS = NAV_ITEMS.slice(2)

export function BottomNav() {
  const pathname = usePathname()
  const { addToast } = useToast()
  const mutation = useAddExpenseMutation()
  const [isScanning, setIsScanning] = useState(false)
  const [reviewResult, setReviewResult] = useState<ReceiptParseResponse | null>(null)
  const [reviewFormKey, setReviewFormKey] = useState(0)
  const cameraInputRef = useRef<HTMLInputElement>(null)

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsScanning(true)
    mutation.reset()
    e.target.value = ''

    try {
      const result = await parseReceipt(file)
      setReviewResult(result)
      setReviewFormKey((key) => key + 1)
    } catch {
      addToast({ type: 'error', title: '영수증 인식 실패', description: '다시 시도해 주세요.' })
    } finally {
      setIsScanning(false)
    }
  }

  const closeReview = () => {
    if (mutation.isPending) return
    setReviewResult(null)
    mutation.reset()
  }

  const renderNavLink = ({ icon: Icon, label, href }: NavItem) => {
    const active = href === ROUTES.dashboard ? pathname === href : pathname.startsWith(href)
    return (
      <Link
        key={href}
        href={href}
        aria-current={active ? 'page' : undefined}
        className="flex flex-col items-center gap-2 px-3 pt-2 pb-1.5 min-w-0 self-end"
      >
        <Icon className={cn('size-5.5', active ? 'text-primary' : 'text-muted-foreground')} strokeWidth="2" />
        <span className={cn('text-[10px]', active ? 'text-primary font-semibold' : 'text-muted-foreground')}>
          {label}
        </span>
      </Link>
    )
  }

  return (
    <>
      <input ref={cameraInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" capture="environment" className="hidden" onChange={handleImageChange} />

      <Modal isOpen={reviewResult !== null} onClose={closeReview}>
        <Modal.Header>인식한 영수증 확인</Modal.Header>
        <Modal.Content className="max-h-[65vh] overflow-y-auto pt-4">
          {reviewResult && (
            <>
              {reviewResult.reviewFields.length > 0 ? (
                <ReceiptReviewNotice fields={reviewResult.reviewFields} />
              ) : (
                <p className="mb-4 rounded-2xl bg-muted/60 p-3 text-sm">
                  인식된 내용을 확인한 뒤 거래내역에 추가해 주세요.
                </p>
              )}
              <AddExpenseForm
                formKey={reviewFormKey}
                initialValues={{
                  amount: reviewResult.data.amount ? String(reviewResult.data.amount) : '',
                  category: reviewResult.data.category,
                  description: reviewResult.data.description,
                  date: reviewResult.data.date,
                }}
                onSubmitData={(payload) => mutation.mutate(payload, {
                  onSuccess: () => {
                    setReviewResult(null)
                    addToast({
                      type: 'success',
                      title: '거래내역이 추가됐어요',
                      description: `${payload.amount.toLocaleString('ko-KR')}원 · ${payload.description ?? ''}`,
                    })
                  },
                })}
              />
            </>
          )}
        </Modal.Content>
        <Modal.Footer>
          {mutation.isError && <p className="flex-1 text-sm text-destructive">저장하지 못했어요. 다시 시도해 주세요.</p>}
          <Button variant="outline" size="md" onClick={closeReview} disabled={mutation.isPending}>
            취소
          </Button>
          <Button type="submit" form={ADD_EXPENSE_FORM_ID} size="md" disabled={mutation.isPending}>
            {mutation.isPending ? '추가 중...' : '확인 후 추가'}
          </Button>
        </Modal.Footer>
      </Modal>

      <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border">
        <div className="max-w-107.5 mx-auto flex items-end justify-around px-2 pb-safe">
          {LEFT_ITEMS.map(renderNavLink)}

          {/* 영수증 스캔 버튼 */}
          <button
            type="button"
            onClick={() => !isScanning && cameraInputRef.current?.click()}
            className="flex flex-col items-center gap-2 px-3 pb-1.5 min-w-0"
          >
            <div className={cn(
              'w-11 h-11 rounded-2xl flex items-center justify-center -mt-4 shadow-lg transition-colors',
              isScanning ? 'bg-primary/70' : 'bg-primary',
            )}>
              {isScanning
                ? <Loader2 size={20} className="text-primary-foreground animate-spin" />
                : <ScanLine size={20} className="text-primary-foreground" />
              }
            </div>
            <span className="text-[10px] text-muted-foreground">스캔</span>
          </button>

          {RIGHT_ITEMS.map(renderNavLink)}
        </div>
      </nav>
    </>
  )
}
