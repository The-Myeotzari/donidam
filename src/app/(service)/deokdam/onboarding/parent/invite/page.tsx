'use client'

import { useConnectChildMutation } from '@/entities/deokdam/api/deokdam.mutations'
import { ROUTES } from '@/shared/constants/route'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { isApiRequestError } from '@/shared/lib/api/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ParentInvitePage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { mutate: connect, isPending } = useConnectChildMutation()

  const handleSubmit = () => {
    if (!email.trim()) return
    setError(null)

    connect(email.trim(), {
      onSuccess: () => {
        router.replace(ROUTES.deokdamParentDone)
      },
      onError: (err) => {
        if (isApiRequestError(err)) {
          setError(err.data.detail)
        } else {
          setError('연결에 실패했어요. 다시 시도해주세요.')
        }
      },
    })
  }

  return (
    <div className="flex flex-col min-h-[calc(100dvh-200px)]">
      <div className="mt-4">
        <p className="text-sm font-medium mb-1">자녀의 이메일을 입력하세요</p>
        

        <Input variant={error ? 'error' : 'default'}>
          <Input.Field
            type="email"
            placeholder="example@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && <Input.Message>{error}</Input.Message>}
        </Input>
      </div>

      <div className="mt-auto pt-6 grid grid-cols-2 gap-3">
        <Button
          fullWidth
          size="lg"
          variant="secondary"
          onClick={() => router.back()}
        >
          이전
        </Button>
        <Button
          fullWidth
          size="lg"
          variant="primary"
          disabled={!email.trim()}
          isLoading={isPending}
          onClick={handleSubmit}
        >
          시작하기
        </Button>
      </div>
    </div>
  )
}
