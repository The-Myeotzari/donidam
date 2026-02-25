'use client'
import { createClient } from '@/shared/lib/supabase/client'
import { Button } from '@/shared/ui/Button'
import { useQuery } from '@tanstack/react-query'
import Image from 'next/image'

export default function Auth() {
    const supabase = createClient()

    const signInWithKakao = async () => {
        const {error} = await supabase.auth.signInWithOAuth({
            provider: 'kakao',
        })
        if(error) alert(error.message)
    }
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Image src="/logo.png" alt="로고" width={120} height={120} />
      <div className="text-2xl font-bold">덕담</div>
      <Button className='bg-[#FEE500] text-black w-72 mt-6' leftIcon={<Image src="/kakao.png" alt='kakao' width={20} height={10}/>} onClick={signInWithKakao}> Kakao로 로그인하기</Button>
      

    </div>
  )
}
