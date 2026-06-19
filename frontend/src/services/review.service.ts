import api from '@/lib/api';
import { reviews } from '@/mocks/reviews.mock';
import { orders } from '@/mocks/orders.mock';
import { session } from '@/mocks/_session';
import type { Review } from '@/types/Review';
import type { ApiResponse, ListResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' = 'get') {
  const response = await api.request<ApiResponse<T>>({
    url: path,
    method,
    data: payload,
  });
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const reviewService = {
  async listForProduct(productId: number, params: { page?: number; pageSize?: number } = {}) {
    if (useMockService) {
      await mockDelay();
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 10;
      const approvedReviews = reviews.filter((review) => review.productId === productId && review.status === 'approved');
      const offset = (page - 1) * pageSize;
      return {
        items: approvedReviews.slice(offset, offset + pageSize),
        meta: {
          page,
          pageSize,
          total: approvedReviews.length,
          totalPages: Math.max(1, Math.ceil(approvedReviews.length / pageSize)),
        },
      };
    }
    return callApi<ListResponse<Review>>(`/reviews/product/${productId}?page=${params.page ?? 1}&pageSize=${params.pageSize ?? 10}`);
  },

  async canReview(productId: number) {
    if (useMockService) {
      await mockDelay();
      if (!session.userId) {
        return false;
      }
      const hasPurchased = orders.some((order) =>
        order.userId === session.userId &&
        order.items?.some((item) => item.productId === productId) &&
        order.orderStatus === 'delivered'
      );
      const alreadyReviewed = reviews.some((review) => review.userId === session.userId && review.productId === productId);
      return hasPurchased && !alreadyReviewed;
    }
    return callApi<boolean>(`/reviews/product/${productId}/can-review`, undefined, 'get');
  },

  async toWrite() {
    if (useMockService) {
      await mockDelay();
      if (!session.userId) {
        return [];
      }
      const deliveredItems = orders
        .filter((order) => order.userId === session.userId && order.orderStatus === 'delivered')
        .flatMap((order) => order.items ?? []);
      return deliveredItems.filter(
        (item) => !reviews.some((review) => review.userId === session.userId && review.productId === item.productId)
      );
    }
    return callApi<unknown[]>('/reviews/to-write', undefined, 'get');
  },

  async submit(payload: { productId: number; rating: number; title?: string; review?: string }) {
    if (useMockService) {
      await mockDelay();
      if (!session.userId) {
        throw new Error('Not authenticated');
      }
      const nextId = Math.max(0, ...reviews.map((review) => review.id)) + 1;
      const review: Review = {
        id: nextId,
        userId: session.userId,
        productId: payload.productId,
        rating: payload.rating,
        title: payload.title,
        review: payload.review,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      reviews.push(review);
      return review;
    }
    return callApi<Review>('/reviews', payload, 'post');
  },
};

export default reviewService;
