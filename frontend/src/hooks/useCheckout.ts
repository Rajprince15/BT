'use client';

import { useMutation } from '@tanstack/react-query';
import checkoutService from '@/services/checkout.service';

export function useCheckoutQuote() {
  return useMutation(checkoutService.quote);
}

export function useCreateRazorpayOrder() {
  return useMutation(checkoutService.createRazorpayOrder);
}

export function useVerifyPayment() {
  return useMutation(checkoutService.verifyPayment);
}
