'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import adminOrderService from '@/services/admin/order.service';
import OrderStatusUpdater from '@/components/admin/OrderStatusUpdater';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function AdminOrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useQuery({
    queryKey: ['admin', 'order', id],
    queryFn: () => adminOrderService.byNumber(String(id)),
    enabled: Boolean(id),
  });

  if (isLoading || !order) {
    return <div data-testid="admin-order-detail-loading" className="h-40 animate-pulse rounded-2xl bg-surface-2" />;
  }

  const shipping = order.shippingAddressJson as Record<string, string>;

  return (
    <div data-testid="admin-order-detail-page" className="grid gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Order</p>
        <h1 className="mt-2 font-mono text-3xl text-ink">{order.orderNumber}</h1>
        <p className="mt-2 text-sm text-ink-2">
          Placed {order.placedAt ? new Date(order.placedAt).toLocaleString('en-IN') : '—'}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <section className="rounded-2xl border border-border bg-surface p-6">
          <h2 className="font-serif text-2xl text-ink">Line items</h2>
          <table className="mt-4 w-full text-sm">
            <thead className="text-[11px] uppercase tracking-wider2 text-ink-2">
              <tr>
                <th className="pb-3 text-left font-semibold">Item</th>
                <th className="pb-3 text-right font-semibold">Qty</th>
                <th className="pb-3 text-right font-semibold">Line total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {order.items?.map((item) => (
                <tr key={item.id}>
                  <td className="py-3">
                    <p className="font-serif text-base text-ink">{item.productName}</p>
                    <p className="text-xs uppercase tracking-wider2 text-ink-2">{item.productSku}</p>
                  </td>
                  <td className="py-3 text-right text-ink">{item.quantity}</td>
                  <td className="py-3 text-right text-ink">{inr(item.lineTotal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <dl className="mt-6 grid gap-2 border-t border-border pt-4 text-sm text-ink-2">
            <div className="flex justify-between"><dt>Subtotal</dt><dd>{inr(order.subtotal)}</dd></div>
            <div className="flex justify-between"><dt>Shipping</dt><dd>{inr(order.shippingAmount)}</dd></div>
            <div className="flex justify-between"><dt>Tax</dt><dd>{inr(order.taxAmount)}</dd></div>
            <div className="flex justify-between text-base font-semibold text-ink"><dt>Total</dt><dd data-testid="admin-order-total">{inr(order.totalAmount)}</dd></div>
          </dl>
        </section>

        <aside className="grid gap-6">
          <OrderStatusUpdater order={order} />
          <section className="rounded-2xl border border-border bg-surface p-6">
            <h3 className="font-serif text-xl text-ink">Shipping address</h3>
            <p className="mt-3 text-sm leading-6 text-ink-2">
              {shipping.fullName}<br />
              {shipping.addressLine1}
              {shipping.addressLine2 ? <>, {shipping.addressLine2}</> : null}<br />
              {shipping.city}, {shipping.state} · {shipping.pincode}<br />
              {shipping.phone}
            </p>
          </section>
          <section className="rounded-2xl border border-border bg-surface p-6 text-sm text-ink-2">
            <h3 className="font-serif text-xl text-ink">Payment</h3>
            <p className="mt-3 uppercase tracking-wider2 text-xs">Status: {order.paymentStatus}</p>
          </section>
        </aside>
      </div>
    </div>
  );
}
