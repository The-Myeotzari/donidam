import { z } from 'zod'

export const addPaymentMethodSchema = z.object({
  type: z.enum(['card', 'account']),
  bankName: z.string().trim().min(1, '은행/카드사를 선택해주세요'),
  name: z.string().trim().min(1, '별칭을 입력해주세요').max(50, '50자 이내로 입력해주세요'),
  lastFour: z.string().regex(/^\d{4}$/, '뒷자리 4자리 숫자를 입력해주세요'),
})

export type AddPaymentMethodInput = z.infer<typeof addPaymentMethodSchema>
