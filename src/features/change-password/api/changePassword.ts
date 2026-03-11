import { Api } from '@/shared/lib/api/api'
import { z } from 'zod'

export async function changePassword(pin: string): Promise<void> {
  await Api.patch('/auth/password', z.unknown(), { pin })
}
