import api from '@/lib/api';
import { orders } from '@/mocks/orders.mock';
import { session } from '@/mocks/_session';
import type { Order } from '@/types/Order';
import type { ApiResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' = 'get') {
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

export const orderService = {
  async listMine() {
    if (useMockService) {
      await mockDelay();
      return orders.filter((order) => order.userId === session.userId);
    }
    return callApi<Order[]>('/orders', undefined, 'get');
  },

  async byNumber(orderNumber: string) {
    if (useMockService) {
      await mockDelay();
      const order = orders.find((item) => item.orderNumber === orderNumber);
      if (!order) {
        throw new Error('Order not found');
      }
      return order;
    }
    return callApi<Order>(`/orders/${encodeURIComponent(orderNumber)}`, undefined, 'get');
  },

  async cancel(orderNumber: string) {
    if (useMockService) {
      await mockDelay();
      const order = orders.find((item) => item.orderNumber === orderNumber);
      if (!order) {
        throw new Error('Order not found');
      }
      if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
        throw new Error('Order cannot be cancelled');
      }
      order.orderStatus = 'cancelled';
      order.updatedAt = new Date().toISOString();
      return order;
    }
    return callApi<Order>(`/orders/${encodeURIComponent(orderNumber)}/cancel`, undefined, 'patch');
  },

  async downloadInvoice(orderNumber: string) {
    if (useMockService) {
      await mockDelay();
      const order = orders.find((item) => item.orderNumber === orderNumber);
      if (!order) {
        throw new Error('Order not found');
      }
      const invoiceText = `Invoice for ${order.orderNumber} | Total: ${order.totalAmount}`;
      return new Blob([invoiceText], { type: 'application/pdf' });
    }
    const response = await api.get(`/orders/${encodeURIComponent(orderNumber)}/invoice`, { responseType: 'blob' });
    return response.data as Blob;
  },
};

export default orderService;
