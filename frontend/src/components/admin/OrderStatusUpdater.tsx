'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import type { Order, OrderStatus } from '@/types/Order';
import adminOrderService from '@/services/admin/order.service';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLE: Record<OrderStatus, string> = {
  pending: 'bg-surface-2 text-ink-2',
  confirmed: 'bg-gold-soft text-ink',
  processing: 'bg-gold-soft text-ink',
  shipped: 'bg-navy text-bg',
  delivered: 'bg-success/15 text-success',
  cancelled: 'bg-danger/15 text-danger',
};

interface OrderStatusUpdaterProps {
  order: Order;
}

export default function OrderStatusUpdater({ order }: OrderStatusUpdaterProps) {
  const client = useQueryClient();
  const [next, setNext] = useState<OrderStatus>(order.orderStatus);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (next === order.orderStatus) return;
    setBusy(true);
    try {
      await adminOrderService.updateStatus(order.orderNumber, next);
      await client.invalidateQueries({ queryKey: ['admin', 'orders'] });
      await client.invalidateQueries({ queryKey: ['admin', 'order', order.orderNumber] });
      toast.success(`Order ${order.orderNumber} marked as ${next}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update status');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section
      data-testid={`order-status-updater-${order.orderNumber}`}
      className="rounded-xl border border-border bg-surface p-5"
    >
      <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Order status</p>
      <div className="mt-3 flex items-center gap-3">
        <span
          data-testid="order-status-current"
          className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider2 ${STATUS_STYLE[order.orderStatus]}`}
        >
          {order.orderStatus}
        </span>
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          data-testid="order-status-select"
          value={next}
          onChange={(event) => setNext(event.target.value as OrderStatus)}
          className="h-11 rounded border border-border bg-bg px-3 text-sm outline-none focus:border-gold"
        >
          {STATUS_FLOW.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <button
          type="button"
          data-testid="order-status-save"
          disabled={busy || next === order.orderStatus}
          onClick={submit}
          className="inline-flex h-11 items-center justify-center rounded-full bg-ink px-5 text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold disabled:opacity-50"
        >
          {busy ? 'Updating…' : 'Update status'}
        </button>
      </div>
    </section>
  );
}
