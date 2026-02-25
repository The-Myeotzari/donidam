import QueryProvider from '@/app/_providers/QueryProvider'
import { ToastProvider } from '@/app/_providers/ToastProvier'
import { Header } from '@/shared/layout/header/Header'
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>
          <ToastProvider>
            <div className="max-w-md mx-auto bg-background">
              <Header />
              <main className="px-4 pb-4">{children}</main>
            </div>
          </ToastProvider>
        </QueryProvider>
      </body>
    </html>
  )
}
