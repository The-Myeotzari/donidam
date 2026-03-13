'use client'

import { ROUTES } from '@/shared/constants/route'
import { Button } from '@/shared/ui/Button'
import { CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function ParentDonePage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100dvh-200px)] text-center">
      <CheckCircle size={64} className="text-primary mb-4" />
      <h2 className="text-xl font-bold mb-2">연결 완료!</h2>
      <p className="text-sm text-muted-foreground mb-8">
        자녀와 덕담이 연결되었어요.
        <br />
        이제 용돈과 약속을 관리해보세요.
      </p>
      <Button
        fullWidth
        size="xl"
        variant="primary"
        onClick={() => router.replace(ROUTES.deokdamParentHome)}
      >
        덕담 시작하기
      </Button>
    </div>
  )
}
