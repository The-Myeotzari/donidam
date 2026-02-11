import type { Metadata, Viewport } from 'next'
import QueryProvider from '@/lib/react-query/QueryProvider'
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

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  )
}
