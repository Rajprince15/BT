import api from '@/lib/api';
import { users } from '@/mocks/users.mock';
import { orders } from '@/mocks/orders.mock';
import type { User, UserStatus } from '@/types/User';
import type { ApiResponse, ListResponse } from '@/types/api';
import { simulateLatency, useMockService, paginate } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' = 'get') {
  const response = await api.request<ApiResponse<T>>({ url: path, method, data: payload });
  if (!response.data.success) throw new Error(response.data.error.message);
  return response.data.data;
}

export interface AdminCustomerListParams {
  page?: number;
  pageSize?: number;
  status?: UserStatus;
  search?: string;
}

export interface AdminCustomerWithStats extends User {
  orderCount: number;
  totalSpent: number;
}

export const adminCustomerService = {
  async list(params: AdminCustomerListParams = {}) {
    if (useMockService) {
      await simulateLatency();
      let items: AdminCustomerWithStats[] = users
        .filter((u) => u.role === 'customer')
        .map((u) => {
          const userOrders = orders.filter((o) => o.userId === u.id && o.orderStatus !== 'cancelled');
          return {
            ...u,
            orderCount: userOrders.length,
            totalSpent: userOrders.reduce((sum, o) => sum + o.totalAmount, 0),
          };
        });
      if (params.status) items = items.filter((u) => u.status === params.status);
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q));
      }
      return paginate(items, params.page ?? 1, params.pageSize ?? 20);
    }
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.status) query.set('status', params.status);
    if (params.search) query.set('search', params.search);
    return callApi<ListResponse<AdminCustomerWithStats>>(`/admin/customers?${query.toString()}`);
  },

  async byId(id: number) {
    if (useMockService) {
      await simulateLatency();
      const u = users.find((item) => item.id === id);
      if (!u) throw new Error('Customer not found');
      return u;
    }
    return callApi<User>(`/admin/customers/${id}`);
  },

  async suspend(id: number) {
    if (useMockService) {
      await simulateLatency();
      const u = users.find((item) => item.id === id);
      if (!u) throw new Error('Customer not found');
      u.status = 'suspended';
      u.updatedAt = new Date().toISOString();
      return u;
    }
    return callApi<User>(`/admin/customers/${id}/suspend`, undefined, 'patch');
  },

  async activate(id: number) {
    if (useMockService) {
      await simulateLatency();
      const u = users.find((item) => item.id === id);
      if (!u) throw new Error('Customer not found');
      u.status = 'active';
      u.updatedAt = new Date().toISOString();
      return u;
    }
    return callApi<User>(`/admin/customers/${id}/activate`, undefined, 'patch');
  },
};

export default adminCustomerService;
