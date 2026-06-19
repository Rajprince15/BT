export type CouponDiscountType = 'flat' | 'percent';

export interface Coupon {
  id: number;
  code: string;
  description?: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minCartValue: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  perUserLimit?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
