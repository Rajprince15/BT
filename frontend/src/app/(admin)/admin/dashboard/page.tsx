'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ShoppingBag, Users, Package, IndianRupee, Star, Briefcase } from 'lucide-react';
import KpiCard from '@/components/admin/KpiCard';
import adminDashboardService from '@/services/admin/dashboard.service';

const inr = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export default function AdminDashboardPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: adminDashboardService.kpis,
  });

  return (
    <div data-testid="admin-dashboard-page" className="grid gap-8">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Overview</p>
        <h1 className="mt-2 font-serif text-4xl text-ink">Dashboard</h1>
        <p className="mt-2 text-sm text-ink-2">Snapshot of orders, inventory, customers and content.</p>
      </header>

      {isLoading || !data ? (
        <div className="h-40 animate-pulse rounded-2xl bg-surface-2" data-testid="admin-dashboard-loading" />
      ) : (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Revenue" value={inr(data.totalRevenue)} icon={<IndianRupee className="size-4 text-gold" />} tone="gold" />
            <KpiCard label="Orders" value={data.totalOrders} icon={<ShoppingBag className="size-4" />} tone="navy" delta={`${data.pendingOrders} pending`} />
            <KpiCard label="Customers" value={data.totalCustomers} icon={<Users className="size-4" />} tone="neutral" />
            <KpiCard label="Products" value={data.totalProducts} icon={<Package className="size-4" />} tone="neutral" delta={`${data.lowStockProducts} low stock`} />
          </section>

          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Shipped" value={data.shippedOrders} tone="neutral" />
            <KpiCard label="Delivered" value={data.deliveredOrders} tone="success" />
            <KpiCard label="Cancelled" value={data.cancelledOrders} tone="danger" />
            <KpiCard label="Pending reviews" value={data.pendingReviews} icon={<Star className="size-4" />} tone="gold" />
          </section>

          <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <article className="rounded-2xl border border-border bg-surface p-6">
              <header className="flex items-center justify-between">
                <h2 className="font-serif text-2xl text-ink">Recent orders</h2>
                <Link href="/admin/orders" className="text-xs uppercase tracking-wider2 text-gold hover:text-gold-2">
                  View all
                </Link>
              </header>
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-surface-2 text-[11px] uppercase tracking-wider2 text-ink-2">
                    <tr>
                      <th className="px-3 py-2 text-left font-semibold">Order #</th>
                      <th className="px-3 py-2 text-left font-semibold">Status</th>
                      <th className="px-3 py-2 text-right font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {data.recentOrders.map((row) => (
                      <tr key={row.orderNumber} data-testid={`admin-recent-order-${row.orderNumber}`}>
                        <td className="px-3 py-2 font-mono text-xs text-ink">
                          <Link href={`/admin/orders/${row.orderNumber}`} className="hover:text-gold">
                            {row.orderNumber}
                          </Link>
                        </td>
                        <td className="px-3 py-2 uppercase tracking-wider2 text-xs text-ink-2">{row.status}</td>
                        <td className="px-3 py-2 text-right text-sm text-ink">{inr(row.total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>
            <article className="grid gap-4 rounded-2xl border border-border bg-surface p-6">
              <h2 className="font-serif text-2xl text-ink">Operational alerts</h2>
              <div className="grid gap-3 text-sm">
                <Link href="/admin/wholesale-inquiries" className="flex items-center justify-between rounded-lg border border-border bg-bg p-4 hover:border-gold">
                  <span className="inline-flex items-center gap-2 text-ink"><Briefcase className="size-4 text-gold" /> New wholesale inquiries</span>
                  <span className="font-mono text-lg text-gold">{data.newWholesaleInquiries}</span>
                </Link>
                <Link href="/admin/reviews" className="flex items-center justify-between rounded-lg border border-border bg-bg p-4 hover:border-gold">
                  <span className="inline-flex items-center gap-2 text-ink"><Star className="size-4 text-gold" /> Reviews awaiting moderation</span>
                  <span className="font-mono text-lg text-gold">{data.pendingReviews}</span>
                </Link>
              </div>
            </article>
          </section>
        </>
      )}
    </div>
  );
}
