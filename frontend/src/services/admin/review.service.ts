import api from '@/lib/api';
import { reviews } from '@/mocks/reviews.mock';
import type { Review, ReviewStatus } from '@/types/Review';
import type { ApiResponse, ListResponse } from '@/types/api';
import { simulateLatency, useMockService, paginate } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' | 'delete' = 'get') {
  const response = await api.request<ApiResponse<T>>({ url: path, method, data: payload });
  if (!response.data.success) throw new Error(response.data.error.message);
  return response.data.data;
}

export interface AdminReviewListParams {
  page?: number;
  pageSize?: number;
  status?: ReviewStatus;
  productId?: number;
}

export const adminReviewService = {
  async list(params: AdminReviewListParams = {}) {
    if (useMockService) {
      await simulateLatency();
      let items = [...reviews];
      if (params.status) items = items.filter((r) => r.status === params.status);
      if (params.productId) items = items.filter((r) => r.productId === params.productId);
      return paginate(items, params.page ?? 1, params.pageSize ?? 20);
    }
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.status) query.set('status', params.status);
    if (params.productId) query.set('productId', String(params.productId));
    return callApi<ListResponse<Review>>(`/admin/reviews?${query.toString()}`);
  },

  async moderate(id: number, status: ReviewStatus) {
    if (useMockService) {
      await simulateLatency();
      const r = reviews.find((item) => item.id === id);
      if (!r) throw new Error('Review not found');
      r.status = status;
      r.updatedAt = new Date().toISOString();
      return r;
    }
    return callApi<Review>(`/admin/reviews/${id}/moderate`, { status }, 'patch');
  },

  async remove(id: number) {
    if (useMockService) {
      await simulateLatency();
      const i = reviews.findIndex((r) => r.id === id);
      if (i >= 0) reviews.splice(i, 1);
      return { success: true };
    }
    return callApi<{ success: boolean }>(`/admin/reviews/${id}`, undefined, 'delete');
  },
};

export default adminReviewService;
