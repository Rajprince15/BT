'use client';

import { useMutation } from '@tanstack/react-query';
import checkoutService from '@/services/checkout.service';
import type {
  CheckoutQuotePayload,
  VerifyPaymentPayload,
} from '@/services/checkout.service';

export function useCheckoutQuote() {
  return useMutation({
    mutationFn: (payload: CheckoutQuotePayload) => checkoutService.quote(payload),
  });
}

export function useCreateRazorpayOrder() {
  return useMutation({
    mutationFn: (payload: { quoteId: string; amount: number; currency: 'INR' }) =>
      checkoutService.createRazorpayOrder(payload),
  });
}

export function useVerifyPayment() {
  return useMutation({
    mutationFn: (payload: VerifyPaymentPayload) => checkoutService.verifyPayment(payload),
  });
}
