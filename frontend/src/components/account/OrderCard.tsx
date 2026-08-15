'use client';

import Link from 'next/link';
import type { Order } from '@/types/Order';

const STATUS_COLOUR: Record<string, string> = {
  pending: 'bg-surface-2 text-ink-2',
  confirmed: 'bg-gold-soft text-ink',
  processing: 'bg-gold-soft text-ink',
  shipped: 'bg-navy text-bg',
  delivered: 'bg-success/15 text-success',
  cancelled: 'bg-danger/15 text-danger',
};

interface OrderCardProps {
  order: Order;
  href?: string;
}

export default function OrderCard({ order, href }: OrderCardProps) {
  const target = href ?? `/account/orders/${order.orderNumber}`;
  const itemCount = order.items?.length ?? 0;

  return (
    <Link
      href={target}
      data-testid={`order-card-${order.orderNumber}`}
      className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-border bg-surface p-5 transition-colors hover:border-gold"
    >
      <div className="min-w-0">
        <p data-testid="order-card-number" className="font-mono text-xs uppercase tracking-wider2 text-gold">
          {order.orderNumber}
        </p>
        <p className="mt-2 font-serif text-xl text-ink">
          {itemCount} {itemCount === 1 ? 'piece' : 'pieces'}
        </p>
        {order.placedAt ? (
          <p className="mt-1 text-xs text-ink-2">
            Placed {new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        ) : null}
      </div>
      <div className="flex flex-col items-end gap-2">
        <p data-testid="order-card-total" className="text-sm font-semibold text-ink">
          ₹{order.totalAmount.toLocaleString('en-IN')}
        </p>
        <span
          data-testid="order-card-status"
          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider2 ${STATUS_COLOUR[order.orderStatus] ?? 'bg-surface-2 text-ink-2'}`}
        >
          {order.orderStatus}
        </span>
      </div>
    </Link>
  );
}
