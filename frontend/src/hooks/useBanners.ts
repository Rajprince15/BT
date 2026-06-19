'use client';

import { useQuery } from '@tanstack/react-query';
import bannerService from '@/services/banner.service';

export function useBanners(placement?: string) {
  return useQuery(['banners', placement], () => bannerService.list({ placement }));
}
