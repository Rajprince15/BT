'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import cartService from '@/services/cart.service';

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
