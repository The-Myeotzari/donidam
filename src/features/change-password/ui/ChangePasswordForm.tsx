'use client'

import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useChangePassword } from '../model/useChangePassword'

export function ChangePasswordForm() {
  const {
    pin,
    setPin,
    confirmPin,
    setConfirmPin,
    pinError,
    confirmError,
    isLoading,
    success,
    handleSubmit,
  } = useChangePassword()

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 새 비밀번호 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">새 비밀번호</label>
        <Input variant={pinError ? 'error' : 'default'} size="lg">
          <Input.Field
            type="password"
            placeholder="••••"
            maxLength={4}
            inputMode="numeric"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            className="bg-muted border-0 rounded-xl pr-10"
          />
          <Input.InputPasswordToggle />
          {pinError && <Input.Message>{pinError}</Input.Message>}
        </Input>
      </div>

      {/* 비밀번호 확인 */}
      <div className="space-y-1.5">
        <label className="text-sm font-medium">비밀번호 확인</label>
        <Input variant={confirmError ? 'error' : 'default'} size="lg">
          <Input.Field
            type="password"
            placeholder="••••"
            maxLength={4}
            inputMode="numeric"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
            className="bg-muted border-0 rounded-xl"
          />
          {confirmError && <Input.Message>{confirmError}</Input.Message>}
        </Input>
      </div>

      {success && <p className="text-sm text-primary text-center">비밀번호가 변경되었어요 ✓</p>}

      <Button
        type="submit"
        fullWidth
        size="xl"
        isLoading={isLoading}
        loadingText="변경 중..."
        className="rounded-xl"
      >
        비밀번호 변경
      </Button>
    </form>
  )
}
