'use client';

import { keepPreviousData, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';
import type { CollectionKey, ProductListParams } from '@/services/product.service';

export function useProducts(params: ProductListParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useInfiniteProducts(params: ProductListParams) {
  const { page: _ignored, ...rest } = params;
  return useInfiniteQuery({
    queryKey: ['products', 'infinite', rest],
    queryFn: ({ pageParam = 1 }) => productService.list({ ...rest, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  });
}

export function useCollection(key: CollectionKey, params: Omit<ProductListParams, 'flag'> = {}) {
  return useQuery({
    queryKey: ['collection', key, params],
    queryFn: () => productService.byCollection(key, params),
    placeholderData: keepPreviousData,
  });
}

export function useProductFacets(params: Omit<ProductListParams, 'page' | 'limit'> = {}) {
  return useQuery({
    queryKey: ['products', 'facets', params],
    queryFn: () => productService.facets(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
