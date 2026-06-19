import api from '@/lib/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';
import type { ApiResponse } from '@/types/api';

export interface NewsletterPayload {
  email: string;
}

async function callApi<T>(path: string, payload?: unknown) {
  const response = await api.post<ApiResponse<T>>(path, payload);
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const newsletterService = {
  async subscribe(payload: NewsletterPayload) {
    if (useMockService) {
      await mockDelay();
      return { email: payload.email, subscribed: true };
    }
    return callApi('/newsletter/subscribe', payload);
  },
};

export default newsletterService;
