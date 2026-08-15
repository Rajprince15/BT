'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import DataTable from '@/components/admin/DataTable';
import adminOrderService from '@/services/admin/order.service';
import type { Order, OrderStatus, PaymentStatus } from '@/types/Order';

const ORDER_STATUS: Array<OrderStatus | ''> = ['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
const PAYMENT_STATUS: Array<PaymentStatus | ''> = ['', 'pending', 'paid', 'failed', 'refunded'];

export default function AdminOrdersPage() {
  const [status, setStatus] = useState<OrderStatus | ''>('');
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus | ''>('');
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'orders', { status, paymentStatus, search }],
    queryFn: () =>
      adminOrderService.list({
        status: status || undefined,
        paymentStatus: paymentStatus || undefined,
        search: search || undefined,
      }),
  });

  return (
    <div data-testid="admin-orders-page" className="grid gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Fulfilment</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Orders</h1>
      </header>

      <div className="flex flex-wrap gap-3">
        <input
          data-testid="admin-orders-search"
          placeholder="Search by order #"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="h-11 flex-1 min-w-[220px] rounded border border-border bg-surface px-4 text-sm outline-none focus:border-gold"
        />
        <select
          data-testid="admin-orders-status"
          value={status}
          onChange={(event) => setStatus(event.target.value as OrderStatus | '')}
          className="h-11 rounded border border-border bg-surface px-3 text-sm outline-none focus:border-gold"
        >
          {ORDER_STATUS.map((option) => (
            <option key={option || 'all'} value={option}>
              {option || 'All statuses'}
            </option>
          ))}
        </select>
        <select
          data-testid="admin-orders-payment"
          value={paymentStatus}
          onChange={(event) => setPaymentStatus(event.target.value as PaymentStatus | '')}
          className="h-11 rounded border border-border bg-surface px-3 text-sm outline-none focus:border-gold"
        >
          {PAYMENT_STATUS.map((option) => (
            <option key={option || 'all'} value={option}>
              {option || 'All payments'}
            </option>
          ))}
        </select>
      </div>

      <DataTable<Order>
        testId="admin-orders-table"
        loading={isLoading}
        rows={data?.items ?? []}
        getRowId={(row) => row.orderNumber}
        columns={[
          { key: 'orderNumber', header: 'Order #', render: (row) => (
            <Link href={`/admin/orders/${row.orderNumber}`} className="font-mono text-xs text-gold hover:text-gold-2">
              {row.orderNumber}
            </Link>
          ) },
          { key: 'items', header: 'Items', render: (row) => row.items?.length ?? 0 },
          { key: 'total', header: 'Total', align: 'right', render: (row) => `₹${row.totalAmount.toLocaleString('en-IN')}` },
          { key: 'orderStatus', header: 'Order', render: (row) => (
            <span className="uppercase tracking-wider2 text-xs text-ink-2">{row.orderStatus}</span>
          ) },
          { key: 'paymentStatus', header: 'Payment', render: (row) => (
            <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-wider2 ${row.paymentStatus === 'paid' ? 'bg-success/15 text-success' : row.paymentStatus === 'refunded' ? 'bg-danger/15 text-danger' : 'bg-surface-2 text-ink-2'}`}>
              {row.paymentStatus}
            </span>
          ) },
        ]}
      />
    </div>
  );
}
