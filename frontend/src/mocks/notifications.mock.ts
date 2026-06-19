import type { Notification } from '@/types/Notification';
import { orders } from '@/mocks/orders.mock';

const NOW = '2025-12-15T10:00:00.000Z';

function fromOrder(o: (typeof orders)[number], idx: number): Notification {
  const titleMap: Record<string, string> = {
    pending: 'Order placed',
    confirmed: 'Order confirmed',
    processing: 'Order being processed',
    shipped: 'Order shipped',
    delivered: 'Order delivered',
    cancelled: 'Order cancelled',
  };
  const messageMap: Record<string, string> = {
    pending: `Your order ${o.orderNumber} has been placed and is awaiting payment confirmation.`,
    confirmed: `Order ${o.orderNumber} has been confirmed. We will start processing it soon.`,
    processing: `Order ${o.orderNumber} is being prepared for dispatch.`,
    shipped: `Order ${o.orderNumber} has shipped. Track it from your account.`,
    delivered: `Order ${o.orderNumber} has been delivered. Hope you love it!`,
    cancelled: `Order ${o.orderNumber} has been cancelled. Refund (if any) will be processed shortly.`,
  };
  return {
    id: idx + 1,
    type: 'order',
    title: titleMap[o.orderStatus],
    message: messageMap[o.orderStatus],
    createdAt: o.updatedAt,
    read: o.orderStatus === 'delivered' || o.orderStatus === 'cancelled',
    relatedOrderId: o.id,
  };
}

const orderNotifs: Notification[] = orders.map(fromOrder);

const broadcasts: Notification[] = [
  {
    id: orderNotifs.length + 1,
    type: 'broadcast',
    title: 'New Arrivals — Handloom Heritage',
    message: 'Discover our newest hand-block-printed collection. Live now.',
    createdAt: NOW,
    read: false,
  },
  {
    id: orderNotifs.length + 2,
    type: 'broadcast',
    title: 'Festive Sale — Up to 30% off',
    message: 'Up to 30% off on select handloom pieces. Limited time only.',
    createdAt: NOW,
    read: false,
  },
];

export const notifications: Notification[] = [...orderNotifs, ...broadcasts];
