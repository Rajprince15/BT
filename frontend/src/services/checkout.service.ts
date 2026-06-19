import api from '@/lib/api';
import { cartService } from '@/services/cart.service';
import { session } from '@/mocks/_session';
import type { ApiResponse } from '@/types/api';
import type { Cart } from '@/types/Cart';
import { mockDelay, useMockService } from '@/services/_mock-runtime';
import env from '@/lib/env';

export interface CheckoutQuotePayload {
  addressId: number;
  paymentMethod: 'razorpay' | 'cod';
}

export interface RazorpayOrderResponse {
  orderId: string;
  amount: number;
  currency: 'INR';
  keyId: string;
}

export interface VerifyPaymentPayload {
  orderId: string;
  paymentId: string;
  signature: string;
  idempotencyKey?: string;
}

async function callApi<T>(path: string, payload?: unknown, method: 'post' | 'get' = 'post') {
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

export const checkoutService = {
  async quote(payload: CheckoutQuotePayload) {
    if (useMockService) {
      await mockDelay();
      const cart = await cartService.get();
      const quote = {
        quoteId: `quote-${Date.now()}`,
        subtotal: cart.subtotal,
        discount: cart.discount,
        shipping: cart.shipping,
        tax: cart.tax,
        total: cart.total,
        currency: 'INR' as const,
        addressId: payload.addressId,
        paymentMethod: payload.paymentMethod,
      };
      return quote;
    }
    return callApi('/checkout/quote', payload, 'post');
  },

  async createRazorpayOrder(payload: { quoteId: string; amount: number; currency: 'INR' }) {
    if (useMockService) {
      await mockDelay();
      return {
        orderId: `razorpay_order_${Date.now()}`,
        amount: payload.amount,
        currency: payload.currency,
        keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock',
      };
    }
    return callApi<RazorpayOrderResponse>('/checkout/razorpay/order', payload, 'post');
  },

  async verifyPayment(payload: VerifyPaymentPayload) {
    if (useMockService) {
      await mockDelay();
      return {
        success: true,
        orderId: payload.orderId,
        paymentId: payload.paymentId,
      };
    }
    return callApi<{ success: boolean }>('/checkout/razorpay/verify', payload, 'post');
  },
};

export default checkoutService;
