'use client'

import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { Api } from '@/shared/lib/api/api'
import { QUERY_KEYS } from '@/shared/constants/queryKey'
import { z } from 'zod'
import cn from '@/shared/lib/cn'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

const ChildrenSchema = z
  .object({
    ok: z.literal(true),
    data: z.object({
      children: z.array(z.object({ id: z.string(), name: z.string() })),
    }),
  })
  .transform((v) => v.data)

const SendResultSchema = z.object({ ok: z.literal(true) })

const QUICK_AMOUNTS = [5000, 10000, 50000]
const PRESET_MESSAGES = ['시험 잘 봤다며? 자랑스러워!', '맛있는 거 사먹어!']

type Props = {
  isOpen: boolean
  onClose: () => void
}

export function DeokdamSendModal({ isOpen, onClose }: Props) {
  const queryClient = useQueryClient()
  const [selectedChildId, setSelectedChildId] = useState<string | null>(null)
  const [amount, setAmount] = useState(0)
  const [message, setMessage] = useState('')

  const { data } = useQuery({
    queryKey: QUERY_KEYS.DEOKDAM.children,
    queryFn: () => Api.get('/deokdam/parent/children', ChildrenSchema),
    enabled: isOpen,
    staleTime: 1000 * 60 * 5,
  })

  const children = data?.children ?? []

  const { mutate: sendAllowance, isPending } = useMutation({
    mutationFn: () =>
      Api.post('/deokdam/parent/allowances', SendResultSchema, {
        receiverId: selectedChildId,
        amount,
        message: message.trim() || null,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEOKDAM.all })
      handleClose()
    },
  })

  const handleClose = () => {
    setSelectedChildId(null)
    setAmount(0)
    setMessage('')
    onClose()
  }

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '')
    setAmount(Number(val))
  }

  const canSend = selectedChildId !== null && amount > 0

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <Modal.Header>덕담 보내기</Modal.Header>
      <Modal.Content className="space-y-5">
        {/* 자녀 선택 */}
        <div>
          <p className="text-sm font-medium mb-3">누구에게 보낼까요?</p>
          <div className="grid grid-cols-2 gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                type="button"
                onClick={() => setSelectedChildId(child.id)}
                className={cn(
                  'flex flex-col items-center gap-2 rounded-2xl p-4 transition-all',
                  selectedChildId === child.id
                    ? 'bg-primary/10 ring-2 ring-primary'
                    : 'bg-muted ring-1 ring-transparent',
                )}
              >
                <div className="w-14 h-14 rounded-full bg-muted-foreground/20" />
                <p className="text-sm font-semibold">{child.name}</p>
              </button>
            ))}
          </div>
        </div>

        {/* 금액 입력 */}
        <div>
          <p className="text-sm font-medium mb-2">얼마를 보낼까요?</p>
          <div className="flex items-center gap-2 rounded-2xl border bg-background px-4 py-3">
            <input
              type="text"
              inputMode="numeric"
              value={amount === 0 ? '' : amount.toLocaleString('ko-KR')}
              onChange={handleAmountInput}
              placeholder="0"
              className="flex-1 text-right text-lg font-semibold bg-transparent outline-none placeholder:text-muted-foreground"
            />
            <span className="text-sm text-muted-foreground shrink-0">원</span>
          </div>
          <div className="flex gap-2 mt-2">
            {QUICK_AMOUNTS.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setAmount((prev) => prev + v)}
                className="flex-1 rounded-full border bg-background py-2 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
              >
                +{v >= 10000 ? `${v / 10000}만` : `0.5만`}
              </button>
            ))}
          </div>
        </div>

        {/* 메시지 */}
        <div>
          <p className="text-sm font-medium mb-2">따뜻한 한마디</p>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="마음을 담아 메시지를 써보세요..."
            rows={3}
            className="w-full rounded-2xl border bg-background px-4 py-3 text-sm resize-none outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground"
          />
          <div className="flex gap-2 mt-2 flex-wrap">
            {PRESET_MESSAGES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setMessage(preset)}
                className="rounded-full border px-3 py-1.5 text-xs text-muted-foreground hover:bg-muted transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      </Modal.Content>

      <Modal.Footer className="px-6 pb-6 pt-0">
        <Button
          fullWidth
          size="lg"
          variant="primary"
          className="bg-rose-400 hover:bg-rose-500"
          disabled={!canSend}
          isLoading={isPending}
          onClick={() => sendAllowance()}
        >
          덕담 보내기
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
