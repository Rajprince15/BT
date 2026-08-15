'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Download, RotateCcw, XCircle, Loader2 } from 'lucide-react';
import orderService from '@/services/order.service';
import { useCancelOrder } from '@/hooks/useOrders';
import { useBulkAddToCart } from '@/hooks/useCart';
import { downloadInvoice } from '@/lib/invoice';
import type { OrderStatus } from '@/types/Order';

const STATUS_FLOW: OrderStatus[] = ['pending', 'confirmed', 'processing', 'shipped', 'delivered'];
const inr = (value: number) => `₹${value.toLocaleString('en-IN')}`;

export default function OrderDetailPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const router = useRouter();
  const { data: order, isLoading, refetch } = useQuery({
    queryKey: ['order', orderNumber],
    queryFn: () => orderService.byNumber(orderNumber),
  });
  const cancelOrder = useCancelOrder();
  const bulkAdd = useBulkAddToCart();
  const [downloading, setDownloading] = useState(false);

  if (isLoading || !order) {
    return <div data-testid="order-detail-loading" className="h-64 rounded-xl bg-surface-2" />;
  }

  const cancellable = order.orderStatus === 'pending' || order.orderStatus === 'confirmed';
  const cancelled = order.orderStatus === 'cancelled';

  const handleCancel = async () => {
    if (!cancellable) return;
    if (!confirm(`Cancel order ${order.orderNumber}? This action cannot be undone.`)) return;
    cancelOrder.mutate(order.orderNumber, {
      onSuccess: () => {
        toast.success('Order cancelled. Any charge will be refunded within 5–7 business days.');
        void refetch();
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const handleReorder = async () => {
    const items = (order.items ?? [])
      .filter((item) => item.productId)
      .map((item) => ({
        productId: item.productId,
        variantId: item.variantId ?? undefined,
        quantity: item.quantity,
      }));
    if (items.length === 0) {
      toast.error('No re-orderable items on this order.');
      return;
    }
    bulkAdd.mutate(items, {
      onSuccess: () => {
        toast.success('Items added to your cart.');
        router.push('/cart');
      },
      onError: (error) => toast.error(error.message),
    });
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadInvoice(order.orderNumber);
      toast.success('Invoice downloaded');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Could not download invoice');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div data-testid="order-detail-page">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider2 text-gold">Order {order.orderNumber}</p>
          <h2 className="mt-2 font-serif text-4xl text-ink">Your order journey</h2>
          <p className="mt-1 text-xs uppercase tracking-wider2 text-ink-2">
            Placed {order.placedAt ? new Date(order.placedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            data-testid="order-detail-invoice"
            onClick={handleDownload}
            disabled={downloading}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-border px-4 text-xs font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-gold disabled:opacity-60"
          >
            {downloading ? <Loader2 className="size-4 animate-spin" /> : <Download className="size-4" />}
            Invoice
          </button>
          <button
            type="button"
            data-testid="order-detail-reorder"
            onClick={handleReorder}
            disabled={bulkAdd.isPending || cancelled}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-gold px-4 text-xs font-semibold uppercase tracking-wider2 text-ink transition-colors hover:bg-gold hover:text-bg disabled:opacity-50"
          >
            {bulkAdd.isPending ? <Loader2 className="size-4 animate-spin" /> : <RotateCcw className="size-4" />}
            Re-order
          </button>
          {cancellable ? (
            <button
              type="button"
              data-testid="order-detail-cancel"
              onClick={handleCancel}
              disabled={cancelOrder.isPending}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-danger/40 bg-danger/10 px-4 text-xs font-semibold uppercase tracking-wider2 text-danger transition-colors hover:bg-danger hover:text-bg disabled:opacity-50"
            >
              {cancelOrder.isPending ? <Loader2 className="size-4 animate-spin" /> : <XCircle className="size-4" />}
              Cancel order
            </button>
          ) : null}
        </div>
      </header>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_300px]">
        <section className="rounded-xl border border-border bg-surface p-6">
          <div className="flex flex-wrap gap-2">
            {cancelled ? (
              <span data-testid="order-status-cancelled" className="rounded-full bg-danger/15 px-3 py-1 text-xs uppercase tracking-wider2 text-danger">
                Cancelled
              </span>
            ) : (
              STATUS_FLOW.map((step) => (
                <span
                  key={step}
                  data-testid={`order-status-${step}`}
                  className={`rounded-full px-3 py-1 text-xs uppercase tracking-wider2 ${step === order.orderStatus ? 'bg-gold text-bg' : 'bg-bg text-ink-2'}`}
                >
                  {step}
                </span>
              ))
            )}
          </div>

          <div className="mt-8 divide-y divide-border">
            {order.items?.map((item) => (
              <div key={item.id} className="flex justify-between gap-4 py-4 text-sm">
                <div>
                  <p className="font-serif text-base text-ink">{item.productName}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider2 text-ink-2">SKU {item.productSku} · × {item.quantity}</p>
                </div>
                <span className="text-ink">{inr(item.lineTotal)}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="grid gap-3 rounded-xl border border-border bg-surface p-6">
          <p className="text-xs uppercase tracking-wider2 text-ink-2">Total</p>
          <p data-testid="order-detail-total" className="font-serif text-3xl text-ink">{inr(order.totalAmount)}</p>
          <p className="text-xs uppercase tracking-wider2 text-ink-2">Payment · {order.paymentStatus}</p>
          <hr className="border-border" />
          <div className="text-xs leading-6 text-ink-2">
            <p className="font-semibold text-ink">Subtotal</p>
            <p>{inr(order.subtotal)}</p>
          </div>
          <div className="text-xs leading-6 text-ink-2">
            <p className="font-semibold text-ink">Shipping</p>
            <p>{inr(order.shippingAmount)}</p>
          </div>
          <div className="text-xs leading-6 text-ink-2">
            <p className="font-semibold text-ink">Tax</p>
            <p>{inr(order.taxAmount)}</p>
          </div>
        </aside>
      </div>
    </div>
  );
}
