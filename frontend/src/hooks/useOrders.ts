'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import orderService from '@/services/order.service';

export function useOrders() {
  return useQuery({
    queryKey: ['orders'],
    queryFn: orderService.listMine,
    staleTime: 20_000,
  });
}

export function useOrder(orderNumber?: string) {
  return useQuery({
    queryKey: ['order', orderNumber ?? ''],
    queryFn: () => orderService.byNumber(orderNumber ?? ''),
    enabled: Boolean(orderNumber),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (orderNumber: string) => orderService.cancel(orderNumber),
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}

export function useDownloadInvoice() {
  return useMutation({
    mutationFn: (orderNumber: string) => orderService.downloadInvoice(orderNumber),
  });
}
