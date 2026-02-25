'use client'

import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/shared/ui/Button'
import { useQuery } from '@tanstack/react-query'

export default function Home() {
  // 리액트 쿼리 연결 테스트
  const { data } = useQuery({
    queryKey: ['test'],
    queryFn: async () => 'react-query-ok',
  })

  // 로그아웃 예시
  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()

    const { data } = await supabase.auth.getSession()
    console.log(data.session) // null이면 로그아웃 OK
    location.href = '/auth'
  }

  return (
    <>
      <p>Query Test</p>
      <div>{data}</div>
      <Button onClick={signOut}>로그아웃</Button>
    </>
  )
}
