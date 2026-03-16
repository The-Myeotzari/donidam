'use client'

import { useEffect, useState } from 'react'
import { checkHasPin, verifyPinApi } from '../api/verifyPin'

const SESSION_KEY = 'pin_unlocked'

export function usePinLock() {
  const [locked, setLocked] = useState(false) // 초기에는 잠금 아님 (로딩 중에도 화면 안 막음)
  const [checking, setChecking] = useState(true)
  const [digits, setDigits] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // 앱 진입 시 PIN 필요 여부 확인
  useEffect(() => {
    const alreadyUnlocked = sessionStorage.getItem(SESSION_KEY) === 'true'
    if (alreadyUnlocked) {
      setChecking(false)
      return
    }
    checkHasPin()
      .then((hasPin) => {
        if (hasPin) setLocked(true)
      })
      .finally(() => setChecking(false))
  }, [])

  const handleDigit = async (digit: string) => {
    if (isVerifying || digits.length >= 4) return
    setError('')

    const next = [...digits, digit]
    setDigits(next)

    if (next.length < 4) return

    setIsVerifying(true)
    const { ok, message } = await verifyPinApi(next.join(''))
    setIsVerifying(false)

    if (ok) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setLocked(false)
    } else {
      setError(message ?? '비밀번호가 틀렸습니다')
      setDigits([])
    }
  }

  const handleDelete = () => {
    if (isVerifying) return
    setError('')
    setDigits((prev) => prev.slice(0, -1))
  }

  return { locked, checking, digits, error, isVerifying, handleDigit, handleDelete }
}
