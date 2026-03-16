import { Api, isApiRequestError } from '@/shared/lib/api/api'
import { z } from 'zod'

const HasPinSchema = z.object({ hasPin: z.boolean() })
const VerifySchema = z.object({ verified: z.boolean() })

export async function checkHasPin(): Promise<boolean> {
  const data = await Api.get('/auth/pin/verify', HasPinSchema)
  return data.hasPin
}

export async function verifyPinApi(pin: string): Promise<{ ok: boolean; message?: string }> {
  try {
    await Api.post('/auth/pin/verify', VerifySchema, { pin })
    return { ok: true }
  } catch (e) {
    const message = isApiRequestError(e) ? e.data.detail : '오류가 발생했습니다'
    return { ok: false, message }
  }
}
