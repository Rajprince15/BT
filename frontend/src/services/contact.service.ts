import api from '@/lib/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';
import type { ApiResponse } from '@/types/api';

export interface ContactPayload {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

async function callApi<T>(path: string, payload: unknown) {
  const response = await api.post<ApiResponse<T>>(path, payload);
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const contactService = {
  async submit(payload: ContactPayload) {
    if (useMockService) {
      await mockDelay();
      return { success: true, receivedAt: new Date().toISOString() };
    }
    return callApi('/contact', payload);
  },
};

export default contactService;
