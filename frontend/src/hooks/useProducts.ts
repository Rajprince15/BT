'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';
import type { ProductListParams } from '@/services/product.service';

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.list(params),
    placeholderData: keepPreviousData,
  });
}
