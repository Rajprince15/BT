'use client';

import { useQuery } from '@tanstack/react-query';
import bannerService from '@/services/banner.service';

export function useBanners(placement?: string) {
  return useQuery({
    queryKey: ['banners', placement ?? null],
    queryFn: () => bannerService.list({ placement }),
  });
}
