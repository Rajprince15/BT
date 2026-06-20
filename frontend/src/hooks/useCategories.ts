'use client';

import { useQuery } from '@tanstack/react-query';
import categoryService from '@/services/category.service';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.tree,
    staleTime: 60_000,
  });
}
export function useFeaturedCategories(limit = 8) {
  return useQuery({
    queryKey: ['categories', 'featured', limit],
    queryFn: () => categoryService.getFeatured(limit),
    staleTime: 60_000,
  });
}