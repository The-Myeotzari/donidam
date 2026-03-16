'use client'

import { useEffect, useState } from 'react'
import { checkHasPin, verifyPinApi } from '../api/verifyPin'

const SESSION_KEY = 'pin_unlocked'

export function usePinLock() {
  const [locked, setLocked] = useState(false)
  // sessionStorage 확인은 클라이언트에서만 가능 → lazy initializer로 초기값 결정
  const [checking, setChecking] = useState(
    () => typeof window === 'undefined' || sessionStorage.getItem(SESSION_KEY) !== 'true',
  )
  const [digits, setDigits] = useState<string[]>([])
  const [error, setError] = useState('')
  const [isVerifying, setIsVerifying] = useState(false)

  // checking=true일 때만 PIN 설정 여부 조회 (세션 미인증 상태)
  useEffect(() => {
    if (!checking) return
    checkHasPin()
      .then((hasPin) => {
        if (hasPin) setLocked(true)
      })
      .catch(() => {
        // API 오류 시 안전하게 잠금 처리
        setLocked(true)
      })
      .finally(() => setChecking(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

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
