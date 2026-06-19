export type PaymentStatus = 'created' | 'authorized' | 'captured' | 'failed' | 'refunded';

export interface Payment {
  id: number;
  orderId: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: 'INR';
  status: PaymentStatus;
  rawPayloadJson?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}
