'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import cartService from '@/services/cart.service';

export function useCart() {
  return useQuery({
    queryKey: ['cart'],
    queryFn: cartService.get,
    staleTime: 10_000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: number; variantId?: number; quantity: number }) =>
      cartService.addItem(payload),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, quantity }: { id: number; quantity: number }) =>
      cartService.updateItem(id, { quantity }),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cartService.removeItem(id),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useBulkAddToCart() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: Array<{ productId: number; variantId?: number; quantity: number }>) =>
      cartService.bulkAdd(items),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
