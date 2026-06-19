import api from '@/lib/api';
import { orders } from '@/mocks/orders.mock';
import type { Order, OrderStatus, PaymentStatus } from '@/types/Order';
import type { ApiResponse, ListResponse } from '@/types/api';
import { simulateLatency, useMockService, paginate } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' = 'get') {
  const response = await api.request<ApiResponse<T>>({ url: path, method, data: payload });
  if (!response.data.success) throw new Error(response.data.error.message);
  return response.data.data;
}

export interface AdminOrderListParams {
  page?: number;
  pageSize?: number;
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
  search?: string;
}

export const adminOrderService = {
  async list(params: AdminOrderListParams = {}) {
    if (useMockService) {
      await simulateLatency();
      let items = [...orders];
      if (params.status) items = items.filter((o) => o.orderStatus === params.status);
      if (params.paymentStatus) items = items.filter((o) => o.paymentStatus === params.paymentStatus);
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter((o) => o.orderNumber.toLowerCase().includes(q));
      }
      return paginate(items, params.page ?? 1, params.pageSize ?? 20);
    }
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.status) query.set('status', params.status);
    if (params.paymentStatus) query.set('paymentStatus', params.paymentStatus);
    if (params.search) query.set('search', params.search);
    return callApi<ListResponse<Order>>(`/admin/orders?${query.toString()}`);
  },

  async byNumber(orderNumber: string) {
    if (useMockService) {
      await simulateLatency();
      const o = orders.find((item) => item.orderNumber === orderNumber);
      if (!o) throw new Error('Order not found');
      return o;
    }
    return callApi<Order>(`/admin/orders/${encodeURIComponent(orderNumber)}`);
  },

  async updateStatus(orderNumber: string, status: OrderStatus) {
    if (useMockService) {
      await simulateLatency();
      const o = orders.find((item) => item.orderNumber === orderNumber);
      if (!o) throw new Error('Order not found');
      o.orderStatus = status;
      o.updatedAt = new Date().toISOString();
      if (status === 'delivered') o.deliveredAt = o.updatedAt;
      if (status === 'cancelled') o.cancelledAt = o.updatedAt;
      return o;
    }
    return callApi<Order>(`/admin/orders/${encodeURIComponent(orderNumber)}/status`, { status }, 'patch');
  },
};

export default adminOrderService;
