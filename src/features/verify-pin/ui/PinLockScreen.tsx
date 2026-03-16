'use client'

import { Delete } from 'lucide-react'
import { usePinLock } from '../model/usePinLock'

const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const

export function PinLockScreen({ children }: { children: React.ReactNode }) {
  const { locked, checking, digits, error, isVerifying, handleDigit, handleDelete } = usePinLock()

  if (checking) return null // 확인 중에는 children도 락도 아무것도 렌더링 안 함

  if (!locked) return <>{children}</>

  return (
    <>
      {/* 잠금 화면 오버레이 */}
      <div className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-background">
        <div className="w-full max-w-md px-8 flex flex-col items-center gap-10">
          {/* 타이틀 */}
          <div className="text-center space-y-1">
            <p className="text-2xl font-bold">돈이담</p>
            <p className="text-sm text-muted-foreground">비밀번호를 입력하세요</p>
          </div>

          {/* 4자리 도트 인디케이터 */}
          <div className="flex gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`w-4 h-4 rounded-full border-2 transition-colors duration-150 ${
                  i < digits.length
                    ? 'bg-primary border-primary'
                    : 'bg-transparent border-muted-foreground/40'
                }`}
              />
            ))}
          </div>

          {/* 오류 메시지 */}
          <p className={`text-sm text-destructive h-4 ${error ? 'opacity-100' : 'opacity-0'}`}>
            {error || ' '}
          </p>

          {/* 키패드 */}
          <div className="grid grid-cols-3 gap-4 w-full">
            {KEYPAD.map((key, idx) => {
              if (key === '') {
                return <div key="empty" />
              }
              if (key === 'del') {
                return (
                  <button
                    key="del"
                    type="button"
                    onClick={handleDelete}
                    disabled={isVerifying || digits.length === 0}
                    className="h-16 rounded-2xl flex items-center justify-center text-foreground active:bg-muted transition-colors disabled:opacity-30"
                  >
                    <Delete size={22} />
                  </button>
                )
              }
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleDigit(key)}
                  disabled={isVerifying}
                  className="h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-xl font-semibold active:bg-muted transition-colors disabled:opacity-50"
                >
                  {key}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
