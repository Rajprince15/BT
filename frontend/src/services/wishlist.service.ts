import api from '@/lib/api';
import { wishlist } from '@/mocks/wishlist.mock';
import { session } from '@/mocks/_session';
import type { Wishlist } from '@/types/Wishlist';
import type { ApiResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'delete' = 'get') {
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

function refreshUserWishlist() {
  return wishlist.filter((item) => item.userId === session.userId);
}

export const wishlistService = {
  async get() {
    if (useMockService) {
      await mockDelay();
      return refreshUserWishlist();
    }

    return callApi<Wishlist[]>('/wishlist', undefined, 'get');
  },

  async add(productId: number) {
    if (useMockService) {
      await mockDelay();
      if (!session.userId) {
        throw new Error('Not authenticated');
      }
      const existing = wishlist.find((entry) => entry.userId === session.userId && entry.productId === productId);
      if (existing) {
        return existing;
      }
      const nextId = Math.max(0, ...wishlist.map((entry) => entry.id)) + 1;
      const item = {
        id: nextId,
        userId: session.userId,
        productId,
        createdAt: new Date().toISOString(),
      };
      wishlist.push(item);
      return item;
    }

    return callApi<Wishlist>('/wishlist', { productId }, 'post');
  },

  async remove(productId: number) {
    if (useMockService) {
      await mockDelay();
      if (!session.userId) {
        throw new Error('Not authenticated');
      }
      const index = wishlist.findIndex((entry) => entry.userId === session.userId && entry.productId === productId);
      if (index >= 0) {
        wishlist.splice(index, 1);
      }
      return { success: true };
    }

    return callApi<{ success: boolean }>(`/wishlist/${productId}`, undefined, 'delete');
  },

  async toggle(productId: number) {
    if (useMockService) {
      await mockDelay();
      const existing = wishlist.find((entry) => entry.userId === session.userId && entry.productId === productId);
      if (existing) {
        const index = wishlist.indexOf(existing);
        wishlist.splice(index, 1);
        return { removed: true };
      }
      const nextId = Math.max(0, ...wishlist.map((entry) => entry.id)) + 1;
      const item = {
        id: nextId,
        userId: session.userId!,
        productId,
        createdAt: new Date().toISOString(),
      };
      wishlist.push(item);
      return { removed: false, item };
    }

    return callApi<{ removed: boolean; item?: Wishlist }>('/wishlist/toggle', { productId }, 'post');
  },
};

export default wishlistService;
