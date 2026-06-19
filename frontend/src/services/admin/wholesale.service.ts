import api from '@/lib/api';
import { wholesaleInquiries } from '@/mocks/wholesale.mock';
import type { WholesaleInquiry, WholesaleInquiryStatus } from '@/types/WholesaleInquiry';
import type { ApiResponse, ListResponse } from '@/types/api';
import { simulateLatency, useMockService, paginate } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' = 'get') {
  const response = await api.request<ApiResponse<T>>({ url: path, method, data: payload });
  if (!response.data.success) throw new Error(response.data.error.message);
  return response.data.data;
}

export interface AdminWholesaleListParams {
  page?: number;
  pageSize?: number;
  status?: WholesaleInquiryStatus;
}

export const adminWholesaleService = {
  async list(params: AdminWholesaleListParams = {}) {
    if (useMockService) {
      await simulateLatency();
      let items = [...wholesaleInquiries];
      if (params.status) items = items.filter((w) => w.status === params.status);
      return paginate(items, params.page ?? 1, params.pageSize ?? 20);
    }
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.status) query.set('status', params.status);
    return callApi<ListResponse<WholesaleInquiry>>(`/admin/wholesale?${query.toString()}`);
  },

  async updateStatus(id: number, status: WholesaleInquiryStatus, notes?: string) {
    if (useMockService) {
      await simulateLatency();
      const w = wholesaleInquiries.find((item) => item.id === id);
      if (!w) throw new Error('Inquiry not found');
      w.status = status;
      if (notes !== undefined) w.notes = notes;
      w.updatedAt = new Date().toISOString();
      return w;
    }
    return callApi<WholesaleInquiry>(`/admin/wholesale/${id}/status`, { status, notes }, 'patch');
  },
};

export default adminWholesaleService;
