import { Api } from '@/shared/lib/api/api'
import { z } from 'zod'

export async function setupPin(pin: string): Promise<void> {
  await Api.patch('/auth/password', z.unknown(), { pin })
}
