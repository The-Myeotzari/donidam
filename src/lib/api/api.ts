import { notFound } from "next/navigation";
import { z } from "zod";

/* 돈이담 공통 Error 스키마 */
export const ApiErrorSchema = z
  .object({
    type: z.string().describe('Problem type URI (기본: "about:blank")'),
    title: z
      .string()
      .describe("에러 코드 (예: UNAUTHORIZED, INVALID_REQUEST, TYPE_MISMATCH 등)"),
    status: z.number().int().describe("HTTP 상태 코드"),
    detail: z.string().describe("에러 상세 메시지"),
    timestamp: z.string().describe("에러 발생 시각 (ISO-8601)"),
    path: z.string().describe('요청 path (예: "/api/me")'),
  })
  .describe("돈이담 공통 에러 응답");

export type ApiError = z.infer<typeof ApiErrorSchema>;

export class ApiRequestError extends Error {
  data: ApiError;

  constructor(data: ApiError) {
    super(data.detail);
    this.name = "ApiRequestError";
    this.data = data;
  }
}

function fallbackApiError(url: string, status: number): ApiError {
  return {
    type: "about:blank",
    title: "INTERNAL_SERVER_ERROR",
    status,
    detail: `서버 오류가 발생했습니다. (Status: ${status})`,
    timestamp: new Date().toISOString(),
    path: url.startsWith("/api/") ? url : `/api${url}`,
  };
}

async function request<T>(
  url: string,
  options: RequestInit,
  schema: z.ZodSchema<T>,
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  // Headers 객체로 변환
  const headers = new Headers(options.headers);

  const res = await fetch(`${baseUrl}${url}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!res.ok) {
    let errorData: ApiError;

    try {
      const rawError = await res.json();
      errorData = ApiErrorSchema.parse(rawError);
    } catch {
      errorData = fallbackApiError(url, res.status);
    }

    if (errorData.status === 404 || errorData.status === 422) {
      notFound();
    }

    throw new ApiRequestError(errorData);
  }

  if (res.status === 204) return {} as T;

  const data = await res.json();
  return schema.parse(data);
}

const createRequestOptions = (
  method: string,
  body?: unknown,
  options?: RequestInit,
): RequestInit => ({
  ...options,
  method,
  headers: {
    "Content-Type": "application/json",
    ...options?.headers,
  },
  ...(body ? { body: JSON.stringify(body) } : {}),
});

export const Api = {
  get: <T>(url: string, schema: z.ZodSchema<T>, options?: RequestInit) =>
    request<T>(url, { ...options, method: "GET" }, schema),

  post: <T>(
    url: string,
    schema: z.ZodSchema<T>,
    body?: unknown,
    options?: RequestInit,
  ) => request<T>(url, createRequestOptions("POST", body, options), schema),

  put: <T>(
    url: string,
    schema: z.ZodSchema<T>,
    body?: unknown,
    options?: RequestInit,
  ) => request<T>(url, createRequestOptions("PUT", body, options), schema),

  patch: <T>(
    url: string,
    schema: z.ZodSchema<T>,
    body?: unknown,
    options?: RequestInit,
  ) => request<T>(url, createRequestOptions("PATCH", body, options), schema),

  delete: <T>(url: string, schema: z.ZodSchema<T>, options?: RequestInit) =>
    request<T>(url, { ...options, method: "DELETE" }, schema),
};
