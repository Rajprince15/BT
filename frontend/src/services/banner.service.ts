import api from '@/lib/api';
import { banners } from '@/mocks/banners.mock';
import type { Banner } from '@/types/Banner';
import type { ApiResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

type BannerListParams = { placement?: string };

async function callApi<T>(path: string) {
  const response = await api.get<ApiResponse<T>>(path);
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const bannerService = {
  async list(params: BannerListParams = {}) {
    if (useMockService) {
      await mockDelay();
      let items = [...banners].filter((banner) => banner.isActive);
      if (params.placement) {
        items = items.filter((banner) => banner.placement === params.placement);
      }
      return items.sort((a, b) => a.sortOrder - b.sortOrder);
    }

    const path = params.placement ? `/banners?placement=${encodeURIComponent(params.placement)}` : '/banners';
    return callApi<Banner[]>(path);
  },
};

export default bannerService;
