import api from '@/lib/api';
import { banners } from '@/mocks/banners.mock';
import type { Banner, BannerPlacement } from '@/types/Banner';
import type { ApiResponse } from '@/types/api';
import { simulateLatency, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' | 'delete' = 'get') {
  const response = await api.request<ApiResponse<T>>({ url: path, method, data: payload });
  if (!response.data.success) throw new Error(response.data.error.message);
  return response.data.data;
}

export interface AdminBannerPayload {
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  placement: BannerPlacement;
  categoryId?: number;
  sortOrder?: number;
  startAt?: string;
  endAt?: string;
  isActive?: boolean;
}

export const adminBannerService = {
  async list() {
    if (useMockService) {
      await simulateLatency();
      return [...banners].sort((a, b) => a.sortOrder - b.sortOrder);
    }
    return callApi<Banner[]>('/admin/banners');
  },

  async create(payload: AdminBannerPayload) {
    if (useMockService) {
      await simulateLatency();
      const nextId = Math.max(0, ...banners.map((b) => b.id)) + 1;
      const now = new Date().toISOString();
      const banner: Banner = {
        id: nextId,
        title: payload.title,
        subtitle: payload.subtitle,
        imageUrl: payload.imageUrl,
        linkUrl: payload.linkUrl,
        placement: payload.placement,
        categoryId: payload.categoryId,
        sortOrder: payload.sortOrder ?? 0,
        startAt: payload.startAt,
        endAt: payload.endAt,
        isActive: payload.isActive ?? true,
        createdAt: now,
        updatedAt: now,
      };
      banners.push(banner);
      return banner;
    }
    return callApi<Banner>('/admin/banners', payload, 'post');
  },

  async update(id: number, payload: Partial<AdminBannerPayload>) {
    if (useMockService) {
      await simulateLatency();
      const b = banners.find((item) => item.id === id);
      if (!b) throw new Error('Banner not found');
      Object.assign(b, payload, { updatedAt: new Date().toISOString() });
      return b;
    }
    return callApi<Banner>(`/admin/banners/${id}`, payload, 'patch');
  },

  async remove(id: number) {
    if (useMockService) {
      await simulateLatency();
      const i = banners.findIndex((b) => b.id === id);
      if (i >= 0) banners.splice(i, 1);
      return { success: true };
    }
    return callApi<{ success: boolean }>(`/admin/banners/${id}`, undefined, 'delete');
  },
};

export default adminBannerService;
