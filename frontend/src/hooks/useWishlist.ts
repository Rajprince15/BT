'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import wishlistService from '@/services/wishlist.service';

export function useWishlist() {
  return useQuery(['wishlist'], wishlistService.get, {
    staleTime: 10_000,
  });
}

export function useAddToWishlist() {
  const queryClient = useQueryClient();
  return useMutation((productId: number) => wishlistService.add(productId), {
    onSuccess() {
      queryClient.invalidateQueries(['wishlist']);
    },
  });
}

export function useRemoveFromWishlist() {
  const queryClient = useQueryClient();
  return useMutation((productId: number) => wishlistService.remove(productId), {
    onSuccess() {
      queryClient.invalidateQueries(['wishlist']);
    },
  });
}

export function useToggleWishlist() {
  const queryClient = useQueryClient();
  return useMutation((productId: number) => wishlistService.toggle(productId), {
    onSuccess() {
      queryClient.invalidateQueries(['wishlist']);
    },
  });
}
