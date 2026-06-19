import api from '@/lib/api';
import { categories } from '@/mocks/categories.mock';
import type { Category } from '@/types/Category';
import type { ApiResponse } from '@/types/api';
import { simulateLatency, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' | 'delete' = 'get') {
  const response = await api.request<ApiResponse<T>>({ url: path, method, data: payload });
  if (!response.data.success) throw new Error(response.data.error.message);
  return response.data.data;
}

export interface AdminCategoryPayload {
  name: string;
  slug: string;
  parentId?: number;
  description?: string;
  imageUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export const adminCategoryService = {
  async list() {
    if (useMockService) {
      await simulateLatency();
      return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return callApi<Category[]>('/admin/categories');
  },

  async create(payload: AdminCategoryPayload) {
    if (useMockService) {
      await simulateLatency();
      const nextId = Math.max(0, ...categories.map((c) => c.id)) + 1;
      const now = new Date().toISOString();
      const cat: Category = {
        id: nextId,
        parentId: payload.parentId,
        name: payload.name,
        slug: payload.slug,
        description: payload.description,
        imageUrl: payload.imageUrl,
        sortOrder: payload.sortOrder ?? 0,
        isActive: payload.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      categories.push(cat);
      return cat;
    }
    return callApi<Category>('/admin/categories', payload, 'post');
  },

  async update(id: number, payload: Partial<AdminCategoryPayload>) {
    if (useMockService) {
      await simulateLatency();
      const c = categories.find((item) => item.id === id);
      if (!c) throw new Error('Category not found');
      Object.assign(c, payload, { updatedAt: new Date().toISOString() });
      return c;
    }
    return callApi<Category>(`/admin/categories/${id}`, payload, 'patch');
  },

  async remove(id: number) {
    if (useMockService) {
      await simulateLatency();
      const i = categories.findIndex((c) => c.id === id);
      if (i >= 0) categories.splice(i, 1);
      return { success: true };
    }
    return callApi<{ success: boolean }>(`/admin/categories/${id}`, undefined, 'delete');
  },
};

export default adminCategoryService;
