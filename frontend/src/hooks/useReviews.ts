'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import reviewService from '@/services/review.service';

export function useProductReviews(productId: number) {
  return useQuery(['reviews', productId], () => reviewService.listForProduct(productId), {
    enabled: Boolean(productId),
  });
}

export function useCanReview(productId: number) {
  return useQuery(['reviews', productId, 'canReview'], () => reviewService.canReview(productId), {
    enabled: Boolean(productId),
  });
}

export function useSubmitReview() {
  const queryClient = useQueryClient();
  return useMutation(reviewService.submit, {
    onSuccess() {
      queryClient.invalidateQueries(['reviews']);
    },
  });
}
