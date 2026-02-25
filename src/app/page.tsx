'use client'

import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/shared/ui/Button'
import { useQuery } from '@tanstack/react-query'

export default function Home() {
  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: async () => 'react-query-ok',
  })

  const signOut = async() => {
    const supabase = createClient()
    await supabase.auth.signOut()

const { data } = await supabase.auth.getSession()
console.log(data.session) // null이면 로그아웃 OK
    location.href='/auth'
  }

  
  return (
    <Button onClick={signOut}>로그아웃</Button>
  )
}
