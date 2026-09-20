import type { Order } from '@/types/Order';
import type { OrderItem } from '@/types/OrderItem';
import type { OrderStatus, PaymentStatus } from '@/types/Order';

const SHIP_ADDR = {
  fullName: 'Aarav Sharma',
  phone: '+91-9810000001',
  addressLine1: '12, Lodhi Estate',
  addressLine2: 'Near Khan Market',
  city: 'New Delhi',
  state: 'Delhi',
  pincode: '110003',
  country: 'India',
};

const D = (daysAgo: number) => {
  const d = new Date('2025-12-15T10:00:00.000Z');
  d.setDate(d.getDate() - daysAgo);
  return d.toISOString();
};

interface OSeed {
  id: number;
  orderNumber: string;
  status: OrderStatus;
  payment: PaymentStatus;
  daysAgo: number;
  items: Array<{ id: number; productId: number; productName: string; productSku: string; quantity: number; price: number }>;
  cancelledDaysAgo?: number;
  deliveredDaysAgo?: number;
  placedDaysAgo?: number;
}

const seeds: OSeed[] = [
  // 1) pending
  {
    id: 1,
    orderNumber: 'BT-2025-100001',
    status: 'pending',
    payment: 'pending',
    daysAgo: 0,
    placedDaysAgo: 0,
    items: [
      { id: 1, productId: 1, productName: 'Dohar Double Bed', productSku: '', quantity: 1, price: 699 },
    ],
  },
  // 2) confirmed
  {
    id: 2,
    orderNumber: 'BT-2025-100002',
    status: 'confirmed',
    payment: 'paid',
    daysAgo: 1,
    placedDaysAgo: 1,
    items: [
      { id: 2, productId: 2, productName: 'Fleno Woolen Set with Satin', productSku: '', quantity: 2, price: 699 },
    ],
  },
  // 3) processing
  {
    id: 3,
    orderNumber: 'BT-2025-100003',
    status: 'processing',
    payment: 'paid',
    daysAgo: 3,
    placedDaysAgo: 3,
    items: [
      { id: 3, productId: 3, productName: '6 Piece Embroidery set', productSku: '', quantity: 1, price: 1999 },
      { id: 4, productId: 20, productName: 'A Grade Bath Towel 500 gm', productSku: '', quantity: 4, price: 230 },
    ],
  },
  // 4) shipped
  {
    id: 4,
    orderNumber: 'BT-2025-100004',
    status: 'shipped',
    payment: 'paid',
    daysAgo: 6,
    placedDaysAgo: 6,
    items: [
      { id: 5, productId: 4, productName: '5 Piece Lace set', productSku: '', quantity: 1, price: 699 },
    ],
  },
  // 5) delivered
  {
    id: 5,
    orderNumber: 'BT-2025-100005',
    status: 'delivered',
    payment: 'paid',
    daysAgo: 15,
    placedDaysAgo: 15,
    deliveredDaysAgo: 10,
    items: [
      { id: 6, productId: 5, productName: 'Snowberry 4 Piece set', productSku: '', quantity: 2, price: 1349 },
      { id: 7, productId: 6, productName: '6 Piece Comforter Set', productSku: '', quantity: 1, price: 1399 },
    ],
  },
  // 6) cancelled
  {
    id: 6,
    orderNumber: 'BT-2025-100006',
    status: 'cancelled',
    payment: 'refunded',
    daysAgo: 20,
    placedDaysAgo: 20,
    cancelledDaysAgo: 18,
    items: [
      { id: 8, productId: 17, productName: 'Gulliver Super Soft', productSku: '', quantity: 1, price: 270 },
    ],
  },
];

function totals(s: OSeed) {
  const subtotal = s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shippingAmount = 150;
  const taxAmount = Math.round(subtotal * 0.05 * 100) / 100;
  const totalAmount = Math.round((subtotal + shippingAmount + taxAmount) * 100) / 100;
  return { subtotal, shippingAmount, taxAmount, totalAmount };
}

export const orders: Order[] = seeds.map((s) => {
  const { subtotal, shippingAmount, taxAmount, totalAmount } = totals(s);
  const items: OrderItem[] = s.items.map((i) => ({
    id: i.id,
    orderId: s.id,
    productId: i.productId,
    productName: i.productName,
    productSku: i.productSku,
    quantity: i.quantity,
    price: i.price,
    lineTotal: i.price * i.quantity,
  }));
  return {
    id: s.id,
    userId: 1, // demo customer
    orderNumber: s.orderNumber,
    subtotal,
    shippingAmount,
    taxAmount,
    totalAmount,
    currency: 'INR',
    shippingAddressJson: { ...SHIP_ADDR },
    billingAddressJson: { ...SHIP_ADDR },
    paymentStatus: s.payment,
    orderStatus: s.status,
    placedAt: D(s.placedDaysAgo ?? s.daysAgo),
    cancelledAt: s.cancelledDaysAgo !== undefined ? D(s.cancelledDaysAgo) : undefined,
    deliveredAt: s.deliveredDaysAgo !== undefined ? D(s.deliveredDaysAgo) : undefined,
    createdAt: D(s.daysAgo),
    updatedAt: D(Math.max(0, s.daysAgo - 1)),
    items,
  };
});
