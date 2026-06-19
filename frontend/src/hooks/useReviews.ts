'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import reviewService from '@/services/review.service';

export function useProductReviews(productId: number) {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => reviewService.listForProduct(productId),
    enabled: Boolean(productId),
  });
}

export function useCanReview(productId: number) {
  return useQuery({
    queryKey: ['reviews', productId, 'canReview'],
    queryFn: () => reviewService.canReview(productId),
    enabled: Boolean(productId),
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: number; rating: number; title?: string; review?: string }) =>
      reviewService.submit(payload),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
    },
  });
}
