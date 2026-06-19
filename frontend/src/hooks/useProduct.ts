'use client';

import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.bySlug(slug),
    enabled: Boolean(slug),
  });
}
