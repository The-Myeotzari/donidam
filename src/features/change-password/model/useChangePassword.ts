import { isApiRequestError } from '@/shared/lib/api/api'
import { useState } from 'react'
import { changePassword } from '../api/changePassword'

export function useChangePassword() {
  const [pin, setPin] = useState('')
  const [confirmPin, setConfirmPin] = useState('')
  const [pinError, setPinError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const validate = () => {
    let valid = true
    setPinError('')
    setConfirmError('')

    if (!/^\d{4}$/.test(pin)) {
      setPinError('4자리 숫자를 입력해주세요')
      valid = false
    }
    if (pin !== confirmPin) {
      setConfirmError('비밀번호가 일치하지 않아요')
      valid = false
    }
    return valid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setIsLoading(true)
    setSuccess(false)

    try {
      await changePassword(pin)
      setSuccess(true)
      setPin('')
      setConfirmPin('')
    } catch (e) {
      const msg = isApiRequestError(e) ? e.data.detail : '변경 중 오류가 발생했어요'
      setPinError(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    pinError,
    confirmError,
    isLoading,
    success,
    handleSubmit,
  }
}
