import api from '@/lib/api';
import { categories } from '@/mocks/categories.mock';
import type { Category } from '@/types/Category';
import type { ApiResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string) {
  const response = await api.get<ApiResponse<T>>(path);
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const categoryService = {
  async tree() {
    if (useMockService) {
      await mockDelay();
      return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    }

    return callApi<Category[]>('/categories');
  },

  async getFeatured(limit = 8) {
    if (useMockService) {
      await mockDelay();
      return [...categories].filter((category) => category.isActive).slice(0, limit);
    }

    return callApi<Category[]>('/categories/featured');
  },
};

export default categoryService;
