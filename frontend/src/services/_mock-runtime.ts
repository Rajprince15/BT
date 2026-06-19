import env from '@/lib/env';
import type { ListResponse, PaginationMeta } from '@/types/api';

/* ---------------------------------------------------------------------------
 * Mock runtime helpers — INTERNAL to the service layer.
 *
 * Rules:
 *   - Only files under `src/services/**` may import this module.
 *   - All exports here exist purely so a mock service can mimic the shape,
 *     latency, error-rate, pagination and filter behaviour of the real API.
 * ------------------------------------------------------------------------- */

export const useMockService = env.NEXT_PUBLIC_USE_MOCKS;

/** Simulate realistic backend latency (200–400 ms by default). */
export function simulateLatency(min = 200, max = 400): Promise<void> {
  const ms = Math.floor(min + Math.random() * Math.max(0, max - min));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Back-compat alias — older services call `mockDelay()`. */
export const mockDelay = simulateLatency;

/**
 * Toggleable error simulation. Defaults to 0 — flip via `setMockErrorRate(0.1)`
 * from QA hooks or a dev panel to exercise error states without backend changes.
 */
let mockErrorRate = 0;

export function setMockErrorRate(rate: number): void {
  mockErrorRate = Math.max(0, Math.min(1, rate));
}

export function getMockErrorRate(): number {
  return mockErrorRate;
}

export function simulateErrorRate(code = 'MOCK_RANDOM_ERROR', message = 'Simulated mock failure'): void {
  if (mockErrorRate > 0 && Math.random() < mockErrorRate) {
    const err = new Error(message) as Error & { code?: string; status?: number };
    err.code = code;
    err.status = 500;
    throw err;
  }
}

/** Page-and-slice an array into the same `ListResponse<T>` envelope the real API returns. */
export function paginate<T>(items: T[], page = 1, pageSize = 20): ListResponse<T> {
  const total = items.length;
  const safePage = Math.max(1, page);
  const safePageSize = Math.max(1, pageSize);
  const totalPages = Math.max(1, Math.ceil(total / safePageSize));
  const start = (safePage - 1) * safePageSize;
  const sliced = items.slice(start, start + safePageSize);
  const meta: PaginationMeta = {
    page: safePage,
    pageSize: safePageSize,
    total,
    totalPages,
  };
  return { items: sliced, meta };
}

/**
 * Filter an array of products/etc. by direct `categoryId` OR by a category subtree
 * (caller supplies the descendant id set). Real backend joins on `category_id` —
 * mock keeps the same consumer signature.
 */
export function filterByCategory<T extends { categoryId: number }>(
  items: T[],
  categoryId: number | undefined,
  descendantIds?: ReadonlySet<number>,
): T[] {
  if (!categoryId) return items;
  if (descendantIds && descendantIds.size > 0) {
    return items.filter((item) => descendantIds.has(item.categoryId));
  }
  return items.filter((item) => item.categoryId === categoryId);
}
