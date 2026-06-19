'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import cartService from '@/services/cart.service';

export function useCart() {
  return useQuery(['cart'], cartService.get, {
    staleTime: 10_000,
  });
}

export function useAddToCart() {
  const queryClient = useQueryClient();
  return useMutation(cartService.addItem, {
    onSuccess() {
      queryClient.invalidateQueries(['cart']);
    },
  });
}

export function useUpdateCartItem() {
  const queryClient = useQueryClient();
  return useMutation(({ id, quantity }: { id: number; quantity: number }) => cartService.updateItem(id, { quantity }), {
    onSuccess() {
      queryClient.invalidateQueries(['cart']);
    },
  });
}

export function useRemoveCartItem() {
  const queryClient = useQueryClient();
  return useMutation((id: number) => cartService.removeItem(id), {
    onSuccess() {
      queryClient.invalidateQueries(['cart']);
    },
  });
}

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  return useMutation((code: string) => cartService.applyCoupon(code), {
    onSuccess() {
      queryClient.invalidateQueries(['cart']);
    },
  });
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient();
  return useMutation(() => cartService.removeCoupon(), {
    onSuccess() {
      queryClient.invalidateQueries(['cart']);
    },
  });
}

export function useBulkAddToCart() {
  const queryClient = useQueryClient();
  return useMutation(cartService.bulkAdd, {
    onSuccess() {
      queryClient.invalidateQueries(['cart']);
    },
  });
}
