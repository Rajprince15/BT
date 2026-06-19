import api from '@/lib/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';
import type { ApiResponse } from '@/types/api';

export interface WholesalePayload {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType?: string;
  productInterest?: string;
  quantityRequirement?: string;
  message?: string;
}

async function callApi<T>(path: string, payload: unknown) {
  const response = await api.post<ApiResponse<T>>(path, payload);
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const wholesaleService = {
  async submit(payload: WholesalePayload) {
    if (useMockService) {
      await mockDelay();
      return { success: true, inquiryId: `wholesale_${Date.now()}` };
    }
    return callApi('/wholesale', payload);
  },
};

export default wholesaleService;
