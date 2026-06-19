import api from '@/lib/api';
import { orders } from '@/mocks/orders.mock';
import { products } from '@/mocks/products.mock';
import { users } from '@/mocks/users.mock';
import { reviews } from '@/mocks/reviews.mock';
import { wholesaleInquiries } from '@/mocks/wholesale.mock';
import type { ApiResponse } from '@/types/api';
import { simulateLatency, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string) {
  const response = await api.get<ApiResponse<T>>(path);
  if (!response.data.success) throw new Error(response.data.error.message);
  return response.data.data;
}

export interface AdminDashboardKpis {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockProducts: number;
  pendingReviews: number;
  newWholesaleInquiries: number;
  recentOrders: Array<{ orderNumber: string; total: number; status: string; placedAt?: string }>;
}

export const adminDashboardService = {
  async kpis(): Promise<AdminDashboardKpis> {
    if (useMockService) {
      await simulateLatency();
      const paidOrders = orders.filter((o) => o.paymentStatus === 'paid');
      return {
        totalRevenue: paidOrders.reduce((s, o) => s + o.totalAmount, 0),
        totalOrders: orders.length,
        pendingOrders: orders.filter((o) => o.orderStatus === 'pending').length,
        shippedOrders: orders.filter((o) => o.orderStatus === 'shipped').length,
        deliveredOrders: orders.filter((o) => o.orderStatus === 'delivered').length,
        cancelledOrders: orders.filter((o) => o.orderStatus === 'cancelled').length,
        totalCustomers: users.filter((u) => u.role === 'customer').length,
        totalProducts: products.length,
        lowStockProducts: products.filter((p) => p.stock < 20).length,
        pendingReviews: reviews.filter((r) => r.status === 'pending').length,
        newWholesaleInquiries: wholesaleInquiries.filter((w) => w.status === 'new').length,
        recentOrders: orders
          .slice()
          .sort((a, b) => (b.placedAt ?? '').localeCompare(a.placedAt ?? ''))
          .slice(0, 5)
          .map((o) => ({
            orderNumber: o.orderNumber,
            total: o.totalAmount,
            status: o.orderStatus,
            placedAt: o.placedAt,
          })),
      };
    }
    return callApi<AdminDashboardKpis>('/admin/dashboard');
  },
};

export default adminDashboardService;
