import api from '@/lib/api';
import { coupons } from '@/mocks/coupons.mock';
import type { Coupon } from '@/types/Coupon';
import type { ApiResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string) {
  const response = await api.get<ApiResponse<T>>(path);
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const couponService = {
  async validate(code: string) {
    if (useMockService) {
      await mockDelay();
      const coupon = coupons.find((item) => item.code.toLowerCase() === code.toLowerCase());
      if (!coupon) {
        throw new Error('Coupon not found');
      }
      if (!coupon.isActive || new Date() > new Date(coupon.endDate)) {
        throw new Error('Coupon has expired');
      }
      return coupon;
    }
    return callApi<Coupon>(`/coupons/${encodeURIComponent(code)}`);
  },
};

export default couponService;
