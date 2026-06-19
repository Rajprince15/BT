'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import cartService from '@/services/cart.service';

export function useApplyCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (code: string) => cartService.applyCoupon(code),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}

export function useRemoveCoupon() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => cartService.removeCoupon(),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });
}
