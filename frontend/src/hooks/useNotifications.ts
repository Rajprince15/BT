'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import notificationService from '@/services/notification.service';

export function useNotifications() {
  return useQuery(['notifications'], notificationService.list, {
    staleTime: 15_000,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation((id: number) => notificationService.markRead(id), {
    onSuccess() {
      queryClient.invalidateQueries(['notifications']);
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation(notificationService.markAllRead, {
    onSuccess() {
      queryClient.invalidateQueries(['notifications']);
    },
  });
}
