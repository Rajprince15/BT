import api from '@/lib/api';
import { notifications } from '@/mocks/notifications.mock';
import { session } from '@/mocks/_session';
import type { Notification } from '@/types/Notification';
import type { ApiResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' = 'get') {
  const response = await api.request<ApiResponse<T>>({
    url: path,
    method,
    data: payload,
  });
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const notificationService = {
  async list() {
    if (useMockService) {
      await mockDelay();
      return notifications.filter((item) => item.type !== 'system' || !!session.userId);
    }
    return callApi<Notification[]>('/notifications', undefined, 'get');
  },

  async markRead(id: number) {
    if (useMockService) {
      await mockDelay();
      const notification = notifications.find((item) => item.id === id);
      if (notification) {
        notification.read = true;
      }
      return { success: true };
    }
    return callApi<{ success: boolean }>(`/notifications/${id}/read`, undefined, 'post');
  },

  async markAllRead() {
    if (useMockService) {
      await mockDelay();
      notifications.forEach((item) => {
        item.read = true;
      });
      return { success: true };
    }
    return callApi<{ success: boolean }>('/notifications/read-all', undefined, 'post');
  },
};

export default notificationService;
