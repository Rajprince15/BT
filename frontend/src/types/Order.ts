import { OrderItem } from './OrderItem';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: number;
  userId: number;
  orderNumber: string;
  subtotal: number;
  shippingAmount: number;
  taxAmount: number;
  totalAmount: number;
  currency: 'INR';
  shippingAddressJson: Record<string, unknown>;
  billingAddressJson?: Record<string, unknown>;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  notes?: string;
  placedAt?: string;
  cancelledAt?: string;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
  items?: OrderItem[];
}
