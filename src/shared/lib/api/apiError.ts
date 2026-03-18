import { NextResponse } from 'next/server'

export function apiError(request: Request, title: string, status: number, detail: string) {
  return NextResponse.json(
    {
      type: 'about:blank',
      title,
      status,
      detail,
      timestamp: new Date().toISOString(),
      path: new URL(request.url).pathname,
    },
    { status },
  )
}
