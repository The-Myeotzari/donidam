import { MESSAGES } from '@/shared/constants/message'
import { apiError } from '@/shared/lib/api/apiError'
import { createServer } from '@/shared/lib/supabase/server'

export async function getUser(request: Request) {
  const supabase = await createServer()
  const { data, error } = await supabase.auth.getUser()
  const user = data.user

  if (error || !user) {
    return {
      response: apiError(request, 'UNAUTHORIZED', 401, MESSAGES.AUTH.ERROR.UNAUTHORIZED_USER),
    }
  }
  return { supabase, user }
}
