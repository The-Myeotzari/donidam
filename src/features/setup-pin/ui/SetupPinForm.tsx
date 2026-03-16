'use client'

import { Delete, KeyRound } from 'lucide-react'
import { useSetupPin } from '../model/useSetupPin'

const KEYPAD = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '', '0', 'del'] as const

export function SetupPinForm() {
  const { stage, digits, error, isLoading, handleDigit, handleDelete } = useSetupPin()

  return (
    <div className="flex flex-col items-center gap-10 pt-8">
      {/* 아이콘 + 타이틀 */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
          <KeyRound size={26} className="text-primary" />
        </div>
        <p className="text-xl font-bold mt-3">
          {stage === 'enter' ? '비밀번호를 설정하세요' : '비밀번호를 한 번 더 입력하세요'}
        </p>
        <p className="text-sm text-muted-foreground">
          {stage === 'enter'
            ? '앱 접근 시 사용할 4자리 비밀번호를 입력해주세요'
            : '입력한 비밀번호를 다시 한번 확인해주세요'}
        </p>
      </div>

      {/* 4자리 도트 */}
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
      <p className={`text-sm text-destructive h-4 -mt-6 ${error ? 'opacity-100' : 'opacity-0'}`}>
        {error || ' '}
      </p>

      {/* 키패드 */}
      <div className="grid grid-cols-3 gap-4 w-full max-w-xs">
        {KEYPAD.map((key, idx) => {
          if (key === '') return <div key="empty" />
          if (key === 'del') {
            return (
              <button
                key="del"
                type="button"
                onClick={handleDelete}
                disabled={isLoading || digits.length === 0}
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
              disabled={isLoading}
              className="h-16 rounded-2xl bg-muted/50 flex items-center justify-center text-xl font-semibold active:bg-muted transition-colors disabled:opacity-50"
            >
              {key}
            </button>
          )
        })}
      </div>
    </div>
  )
}
