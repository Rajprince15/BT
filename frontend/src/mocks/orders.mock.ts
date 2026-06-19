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
      { id: 1, productId: 23, productName: 'Hand-Embroidered Table Runner', productSku: 'BT-TL-001', quantity: 1, price: 2299 },
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
      { id: 2, productId: 12, productName: 'Silk Damask Luxury Curtain (Pair)', productSku: 'BT-LC-001', quantity: 2, price: 6499 },
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
      { id: 3, productId: 1, productName: 'Ivory Pure Cotton King Bedsheet', productSku: 'BT-CB-001', quantity: 1, price: 3299 },
      { id: 4, productId: 18, productName: 'Egyptian Cotton Bath Towel', productSku: 'BT-BT-001', quantity: 4, price: 1099 },
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
      { id: 5, productId: 13, productName: 'Premium Blackout Curtain (Pair)', productSku: 'BT-BC-001', quantity: 1, price: 4299 },
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
      { id: 6, productId: 9, productName: 'Velvet Royal Cushion Cover (Set of 2)', productSku: 'BT-CC-001', quantity: 2, price: 999 },
      { id: 7, productId: 26, productName: 'Festive Gift Hamper — Premium', productSku: 'BT-GC-001', quantity: 1, price: 3799 },
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
      { id: 8, productId: 7, productName: 'Cashmere-Wool Royal Blanket', productSku: 'BT-WB-001', quantity: 1, price: 6999 },
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
