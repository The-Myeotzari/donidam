import { z } from 'zod'

/* 돈이담 공통 Error 스키마 */
export const ApiErrorSchema = z
  .object({
    type: z.string().describe('Problem type URI (기본: "about:blank")'),
    title: z.string().describe('에러 코드 (예: UNAUTHORIZED, INVALID_REQUEST, TYPE_MISMATCH 등)'),
    status: z.number().int().describe('HTTP 상태 코드'),
    detail: z.string().describe('에러 상세 메시지'),
    timestamp: z.string().describe('에러 발생 시각 (ISO-8601)'),
    path: z.string().describe('요청 path (예: "/api/me")'),
  })
  .describe('돈이담 공통 에러 응답')

export type ApiError = z.infer<typeof ApiErrorSchema>

export class ApiRequestError extends Error {
  data: ApiError

  constructor(data: ApiError) {
    super(data.detail)
    this.name = 'ApiRequestError'
    this.data = data
  }
}

export function isApiRequestError(e: unknown): e is ApiRequestError {
  return e instanceof ApiRequestError
}

export function isNotFoundLikeError(e: unknown) {
  return isApiRequestError(e) && (e.data.status === 404 || e.data.status === 422)
}

function fallbackApiError(url: string, status: number): ApiError {
  return {
    type: 'about:blank',
    title: 'INTERNAL_SERVER_ERROR',
    status,
    detail: `서버 오류가 발생했습니다. (Status: ${status})`,
    timestamp: new Date().toISOString(),
    path: url.startsWith('/api/') ? url : `/api${url}`,
  }
}

async function parseApiError(res: Response, url: string): Promise<ApiError> {
  try {
    const raw = await res.json()
    return ApiErrorSchema.parse(raw)
  } catch {
    return fallbackApiError(url, res.status)
  }
}

async function request<T>(url: string, options: RequestInit, schema: z.ZodSchema<T>): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!baseUrl) {
    throw new Error('NEXT_PUBLIC_API_BASE_URL is not set')
  }

  // Headers 객체로 변환
  const headers = new Headers(options.headers)

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (!res.ok) {
    const errorData = await parseApiError(res, url)
    throw new ApiRequestError(errorData)
  }

  if (res.status === 204) return {} as T

  const data = await res.json()
  return schema.parse(data)
}

const createRequestOptions = (
  method: string,
  body?: unknown,
  options?: RequestInit,
): RequestInit => ({
  ...options,
  method,
  headers: {
    'Content-Type': 'application/json',
    ...options?.headers,
  },
  ...(body ? { body: JSON.stringify(body) } : {}),
})

export const Api = {
  get: <T>(url: string, schema: z.ZodSchema<T>, options?: RequestInit) =>
    request<T>(url, { ...options, method: 'GET' }, schema),

  post: <T>(url: string, schema: z.ZodSchema<T>, body?: unknown, options?: RequestInit) =>
    request<T>(url, createRequestOptions('POST', body, options), schema),

  put: <T>(url: string, schema: z.ZodSchema<T>, body?: unknown, options?: RequestInit) =>
    request<T>(url, createRequestOptions('PUT', body, options), schema),

  patch: <T>(url: string, schema: z.ZodSchema<T>, body?: unknown, options?: RequestInit) =>
    request<T>(url, createRequestOptions('PATCH', body, options), schema),

  delete: <T>(url: string, schema: z.ZodSchema<T>, options?: RequestInit) =>
    request<T>(url, { ...options, method: 'DELETE' }, schema),
}
