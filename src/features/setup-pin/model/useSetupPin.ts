'use client'

import { isApiRequestError } from '@/shared/lib/api/api'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { setupPin } from '../api/setupPin'

const SESSION_KEY = 'pin_unlocked'

type Stage = 'enter' | 'confirm'

export function useSetupPin() {
  const router = useRouter()
  const [stage, setStage] = useState<Stage>('enter')
  const [firstPin, setFirstPin] = useState('')
  const [digits, setDigits] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleDigit = async (digit: string) => {
    if (isLoading || digits.length >= 4) return
    setError('')

    const next = [...digits, digit]
    setDigits(next)

    if (next.length < 4) return

    const pin = next.join('')

    if (stage === 'enter') {
      setFirstPin(pin)
      setDigits([])
      setStage('confirm')
      return
    }

    // 확인 단계
    if (pin !== firstPin) {
      setError('비밀번호가 일치하지 않아요')
      setDigits([])
      setStage('enter')
      setFirstPin('')
      return
    }

    setIsLoading(true)
    try {
      await setupPin(pin)
      sessionStorage.setItem(SESSION_KEY, 'true')
      router.replace('/')
    } catch (e) {
      const msg = isApiRequestError(e) ? e.data.detail : '오류가 발생했습니다'
      setError(msg)
      setDigits([])
      setStage('enter')
      setFirstPin('')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = () => {
    if (isLoading) return
    setError('')
    setDigits((prev) => prev.slice(0, -1))
  }

  return { stage, digits, error, isLoading, handleDigit, handleDelete }
}
