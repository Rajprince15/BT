'use client';

import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';
import type { ProductListParams } from '@/services/product.service';

export function useProducts(params: ProductListParams) {
  return useQuery(['products', params], () => productService.list(params), {
    keepPreviousData: true,
  });
}
