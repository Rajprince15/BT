'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import orderService from '@/services/order.service';

export function useOrders() {
  return useQuery(['orders'], orderService.listMine, {
    staleTime: 20_000,
  });
}

export function useOrder(orderNumber?: string) {
  return useQuery(['order', orderNumber], () => orderService.byNumber(orderNumber ?? ''), {
    enabled: Boolean(orderNumber),
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation((orderNumber: string) => orderService.cancel(orderNumber), {
    onSuccess() {
      queryClient.invalidateQueries(['orders']);
    },
  });
}

export function useDownloadInvoice() {
  return useMutation((orderNumber: string) => orderService.downloadInvoice(orderNumber));
}
