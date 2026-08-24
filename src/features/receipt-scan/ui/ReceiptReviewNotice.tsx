import type { ReceiptField } from '@/features/receipt-scan/model/receipt.schema'
import { CircleAlert } from 'lucide-react'

const FIELD_LABELS: Record<ReceiptField, string> = {
  amount: '금액',
  category: '카테고리',
  description: '내용',
  date: '날짜',
}

export function ReceiptReviewNotice({ fields }: { fields: ReceiptField[] }) {
  const labels = fields.map((field) => FIELD_LABELS[field]).join(', ')

  return (
    <div role="status" className="mb-4 flex gap-2 rounded-2xl bg-accent/40 p-3 text-sm">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <p>
        <strong>{labels}</strong> 정보를 정확히 읽지 못했어요. 기본값을 확인하고 비어 있는 값은 직접 입력해 주세요.
      </p>
    </div>
  )
}
