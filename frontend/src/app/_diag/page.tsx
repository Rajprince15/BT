/* eslint-disable @next/next/no-async-client-component */
// PHASE 1B SMOKE-TEST PAGE — DEV ONLY.
// Will be deleted as called out in PHASE 10B of frontend_workflow.md.
// This page calls every public service function once with safe defaults and
// prints the resulting counts/shapes so that we can verify all services are
// wired before any UI consumes them.

import authService from '@/services/auth.service';
import productService from '@/services/product.service';
import categoryService from '@/services/category.service';
import bannerService from '@/services/banner.service';
import cartService from '@/services/cart.service';
import wishlistService from '@/services/wishlist.service';
import orderService from '@/services/order.service';
import reviewService from '@/services/review.service';
import userService from '@/services/user.service';
import notificationService from '@/services/notification.service';
import checkoutService from '@/services/checkout.service';
import uploadService from '@/services/upload.service';
import wholesaleService from '@/services/wholesale.service';
import newsletterService from '@/services/newsletter.service';
import contactService from '@/services/contact.service';
import adminProductService from '@/services/admin/product.service';
import adminCategoryService from '@/services/admin/category.service';
import adminOrderService from '@/services/admin/order.service';
import adminCustomerService from '@/services/admin/customer.service';
import adminDashboardService from '@/services/admin/dashboard.service';
import adminBannerService from '@/services/admin/banner.service';
import adminReviewService from '@/services/admin/review.service';
import adminWholesaleService from '@/services/admin/wholesale.service';
import adminAuditService from '@/services/admin/audit.service';
import adminSettingsService from '@/services/admin/settings.service';

export const dynamic = 'force-dynamic';

type Row = { service: string; result: string };

async function safe<T>(label: string, fn: () => Promise<T>, fmt: (v: T) => string): Promise<Row> {
  try {
    const v = await fn();
    return { service: label, result: fmt(v) };
  } catch (e) {
    const err = e as Error;
    return { service: label, result: `ERROR: ${err.message ?? String(err)}` };
  }
}

async function runChecks(): Promise<Row[]> {
  // Establish a mock session for services that require auth.
  await safe('authService.login', () => authService.login({ email: 'customer@bhavita.test', password: 'Customer@123' }), (v) => `user=${v.user.email}`);

  const checks: Array<Promise<Row>> = [
    safe('authService.me', () => authService.me(), (v) => `me=${v.email}`),
    safe('productService.list', () => productService.list({ page: 1, pageSize: 10 }), (v) => `items=${v.items.length}, total=${v.meta.total}`),
    safe('productService.bySlug', () => productService.bySlug('ivory-cotton-king-bedsheet'), (v) => `name=${v.name}`),
    safe('productService.related', () => productService.related(1), (v) => `related=${v.length}`),
    safe('productService.search', () => productService.search('cotton'), (v) => `hits=${v.items.length}`),
    safe('productService.allSlugs', () => productService.allSlugs(), (v) => `slugs=${v.length}`),
    safe('categoryService.tree', () => categoryService.tree(), (v) => `categories=${v.length}`),
    safe('categoryService.getFeatured', () => categoryService.getFeatured(8), (v) => `featured=${v.length}`),
    safe('bannerService.list (home_hero)', () => bannerService.list({ placement: 'home_hero' }), (v) => `banners=${v.length}`),
    safe('cartService.get', () => cartService.get(), (v) => `items=${v.items.length}, total=${v.total}`),
    safe('wishlistService.get', () => wishlistService.get(), (v) => `wishlist=${v.length}`),
    safe('orderService.listMine', () => orderService.listMine(), (v) => `orders=${v.length}`),
    safe('orderService.byNumber', () => orderService.byNumber('BT-2025-100005'), (v) => `status=${v.orderStatus}`),
    safe('reviewService.listForProduct(1)', () => reviewService.listForProduct(1), (v) => `reviews=${v.items.length}`),
    safe('reviewService.canReview(1)', () => reviewService.canReview(1), (v) => `canReview=${v}`),
    safe('reviewService.toWrite', () => reviewService.toWrite(), (v) => `pending=${v.length}`),
    safe('userService.profile', () => userService.profile(), (v) => `name=${v.name}`),
    safe('userService.addresses.list', () => userService.addresses.list(), (v) => `addresses=${v.length}`),
    safe('notificationService.list', () => notificationService.list(), (v) => `notifications=${v.length}`),
    safe('checkoutService.quote', () => checkoutService.quote({ addressId: 1, paymentMethod: 'razorpay' }), (v) => `total=${(v as { total: number }).total}`),
    safe('uploadService.getSignature', () => uploadService.getSignature('test'), (v) => `folder=${v.folder}`),
    safe('wholesaleService.submit', () => wholesaleService.submit({ companyName: 'Smoke Co', contactPerson: 'Diag', email: 'diag@x.in', phone: '+91-9000000000' }), () => 'ok'),
    safe('newsletterService.subscribe', () => newsletterService.subscribe({ email: 'diag@x.in' }), (v) => `subscribed=${(v as { subscribed: boolean }).subscribed}`),
    safe('contactService.submit', () => contactService.submit({ name: 'Diag', email: 'diag@x.in', message: 'smoke' }), () => 'ok'),
    safe('adminProductService.list', () => adminProductService.list({ page: 1, pageSize: 5 }), (v) => `items=${v.items.length}`),
    safe('adminCategoryService.list', () => adminCategoryService.list(), (v) => `cats=${v.length}`),
    safe('adminOrderService.list', () => adminOrderService.list(), (v) => `orders=${v.items.length}`),
    safe('adminCustomerService.list', () => adminCustomerService.list(), (v) => `customers=${v.items.length}`),
    safe('adminDashboardService.kpis', () => adminDashboardService.kpis(), (v) => `revenue=${v.totalRevenue}`),
    safe('adminBannerService.list', () => adminBannerService.list(), (v) => `banners=${v.length}`),
    safe('adminReviewService.list', () => adminReviewService.list(), (v) => `reviews=${v.items.length}`),
    safe('adminWholesaleService.list', () => adminWholesaleService.list(), (v) => `inquiries=${v.items.length}`),
    safe('adminAuditService.list', () => adminAuditService.list(), (v) => `logs=${v.items.length}`),
    safe('adminSettingsService.get', () => adminSettingsService.get(), (v) => `site=${v.siteName}`),
  ];

  return Promise.all(checks);
}

export default async function DiagPage() {
  const rows = await runChecks();
  const errorCount = rows.filter((r) => r.result.startsWith('ERROR')).length;

  return (
    <main
      data-testid="diag-page"
      style={{
        padding: '2rem',
        fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        color: '#1a1a1a',
        background: '#fafaf6',
        minHeight: '100vh',
      }}
    >
      <header style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'serif', fontSize: '1.75rem', marginBottom: '0.25rem' }}>
          Bhavita Textiles — Service Smoke Test (Phase 1B)
        </h1>
        <p data-testid="diag-summary" style={{ color: errorCount === 0 ? '#0a6b3d' : '#a4262c' }}>
          {rows.length} services called · {errorCount} error{errorCount === 1 ? '' : 's'}
        </p>
        <p style={{ fontSize: '0.85rem', color: '#666' }}>
          Dev-only. This page is removed in Phase 10B before launch.
        </p>
      </header>
      <table data-testid="diag-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ textAlign: 'left', borderBottom: '1px solid #d8d2c4' }}>
            <th style={{ padding: '0.5rem 0.75rem' }}>Service call</th>
            <th style={{ padding: '0.5rem 0.75rem' }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.service} style={{ borderBottom: '1px solid #ece6d6' }}>
              <td style={{ padding: '0.4rem 0.75rem' }}>{r.service}</td>
              <td
                style={{
                  padding: '0.4rem 0.75rem',
                  color: r.result.startsWith('ERROR') ? '#a4262c' : '#1a1a1a',
                }}
              >
                {r.result}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
