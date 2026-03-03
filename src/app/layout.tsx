import QueryProvider from '@/app/_providers/QueryProvider'
import { ToastProvider } from '@/app/_providers/ToastProvier'
import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '돈이담',
  description: '돈이담 - 가계부',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    title: '돈이담',
    statusBarStyle: 'default',
  },
  icons: {
    apple: '/apple-touch-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0b0f17',
}

// 동적 라우트 커스텀 타이틀 작업으로 인해 폴더 별로 레이아웃을 분리했습니다.
// 레이아웃 작업이 필요한 경우 해당 작업 폴더 내 layout.tsx를 사용해 주세요.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ToastProvider>
            <div className="max-w-md mx-auto bg-background">{children}</div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
