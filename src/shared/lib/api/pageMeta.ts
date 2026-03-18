import { z } from "zod";

/* 페이지네이션 메타데이터 스키마 */
export const PageMetaSchema = z
  .object({
    page: z.number().int().describe("0부터 시작하는 페이지 번호"),
    size: z.number().int().describe("페이지 크기"),
    totalElements: z.number().int().describe("전체 아이템 수"),
    totalPages: z.number().int().describe("전체 페이지 수"),
  })
  .describe("페이지네이션 메타데이터");

export type PageMeta = z.infer<typeof PageMetaSchema>;

/**
 * items + meta 형태의 페이지 응답 스키마 헬퍼
 * - 사용: PageResponseSchema(ItemSchema)
 */
export const PageResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z
    .object({
      items: z.array(itemSchema).describe("아이템 목록"),
      meta: PageMetaSchema.describe("페이지네이션 메타데이터"),
    })
    .describe("페이지네이션 응답");

export type PageResponse<T> = {
  items: T[];
  meta: PageMeta;
};
