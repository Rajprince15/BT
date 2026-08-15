export interface PaginationInput {
  page?: number | string;
  limit?: number | string;
  pageSize?: number | string;
}

export interface PageMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export function parsePagination(input: PaginationInput): { page: number; limit: number; offset: number } {
  const rawLimit = Number(input.pageSize ?? input.limit ?? DEFAULT_LIMIT);
  const rawPage = Number(input.page ?? 1);
  const limit = Math.max(1, Math.min(Number.isFinite(rawLimit) ? Math.trunc(rawLimit) : DEFAULT_LIMIT, MAX_LIMIT));
  const page = Math.max(1, Number.isFinite(rawPage) ? Math.trunc(rawPage) : 1);
  return { page, limit, offset: (page - 1) * limit };
}

export function pageMeta(page: number, limit: number, total: number): PageMeta {
  return { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) };
}
