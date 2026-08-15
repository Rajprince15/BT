import { Router } from 'express';
import { z } from 'zod';
import { exec, query } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok, camelize } from '../../utils/envelope';
import { authMiddleware } from '../../middleware/auth';
import { requireAdmin, requireSuperAdmin } from '../../middleware/role';
import { adminLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import { pageMeta, parsePagination } from '../../utils/pagination';
import { audit } from '../../utils/audit';
import { NotFoundError } from '../../utils/errors';
import { productService } from '../products/service';
import { categoryService } from '../categories/service';
import {
  upsertProductSchema, stockAdjustSchema, publishSchema, variantSchema,
} from '../products/schema';
import { upsertCategorySchema } from '../categories/schema';
import { sendMail } from '../../config/mailer';
import { sanitizeHtml } from '../../utils/sanitize';

const router = Router();
router.use(authMiddleware(), requireAdmin, adminLimiter);

// ---------- Dashboard ----------

router.get('/dashboard', asyncWrap(async (_req, res) => {
  const [rev, orders, statusCounts, customers, products, pendingReviews, newInquiries, recent] = await Promise.all([
    query<{ n: number }>(`SELECT COALESCE(SUM(total_amount), 0) AS n FROM orders WHERE order_status IN ('confirmed', 'processing', 'shipped', 'delivered')`),
    query<{ n: number }>(`SELECT COUNT(*) AS n FROM orders`),
    query<{ order_status: string; n: number }>(`SELECT order_status, COUNT(*) AS n FROM orders GROUP BY order_status`),
    query<{ n: number }>(`SELECT COUNT(*) AS n FROM users WHERE role = 'customer' AND deleted_at IS NULL`),
    query<{ total: number; low: number }>(`SELECT COUNT(*) AS total, SUM(CASE WHEN stock < 5 THEN 1 ELSE 0 END) AS low FROM products WHERE deleted_at IS NULL`),
    query<{ n: number }>(`SELECT COUNT(*) AS n FROM reviews WHERE status = 'pending'`),
    query<{ n: number }>(`SELECT COUNT(*) AS n FROM wholesale_inquiries WHERE status = 'new'`),
    query(`SELECT order_number, order_status AS status, total_amount AS total, placed_at FROM orders ORDER BY placed_at DESC LIMIT 10`),
  ]);
  const statusMap = new Map(statusCounts.map((row) => [row.order_status, row.n]));
  res.json(ok({
    totalRevenue: Number(rev[0]?.n ?? 0),
    totalOrders: orders[0]?.n ?? 0,
    pendingOrders: Number(statusMap.get('pending') ?? 0) + Number(statusMap.get('confirmed') ?? 0),
    processingOrders: Number(statusMap.get('processing') ?? 0),
    shippedOrders: Number(statusMap.get('shipped') ?? 0),
    deliveredOrders: Number(statusMap.get('delivered') ?? 0),
    cancelledOrders: Number(statusMap.get('cancelled') ?? 0),
    totalCustomers: customers[0]?.n ?? 0,
    totalProducts: products[0]?.total ?? 0,
    lowStockProducts: Number(products[0]?.low ?? 0),
    pendingReviews: pendingReviews[0]?.n ?? 0,
    newWholesaleInquiries: newInquiries[0]?.n ?? 0,
    recentOrders: camelize(recent),
  }));
}));

// ---------- Categories ----------

router.get('/categories', asyncWrap(async (_req, res) => {
  res.json(ok(await categoryService.adminList()));
}));
router.post('/categories', validate({ body: upsertCategorySchema }), asyncWrap(async (req, res) => {
  const result = await categoryService.create(req.body);
  await audit(req, { action: 'category.create', entity: 'category', entityId: result.id, after: result });
  res.status(201).json(ok(result));
}));
router.patch('/categories/:id', validate({ body: upsertCategorySchema.partial() }), asyncWrap(async (req, res) => {
  const result = await categoryService.update(Number(req.params.id), req.body);
  await audit(req, { action: 'category.update', entity: 'category', entityId: result.id, after: result });
  res.json(ok(result));
}));
router.delete('/categories/:id', asyncWrap(async (req, res) => {
  await categoryService.remove(Number(req.params.id));
  await audit(req, { action: 'category.delete', entity: 'category', entityId: req.params.id });
  res.json(ok({ removed: true }));
}));

// ---------- Products ----------

router.get('/products', asyncWrap(async (req, res) => {
  const result = await productService.adminList(req.query as never);
  res.json(ok(result.items, result.meta));
}));
router.get('/products/:id', asyncWrap(async (req, res) => {
  res.json(ok(await productService.adminGet(Number(req.params.id))));
}));
router.post('/products', validate({ body: upsertProductSchema }), asyncWrap(async (req, res) => {
  const result = await productService.create(req.body);
  await audit(req, { action: 'product.create', entity: 'product', entityId: result.id, after: result });
  res.status(201).json(ok(result));
}));
router.patch('/products/:id', validate({ body: upsertProductSchema.partial() }), asyncWrap(async (req, res) => {
  const result = await productService.update(Number(req.params.id), req.body);
  await audit(req, { action: 'product.update', entity: 'product', entityId: result.id, after: result });
  res.json(ok(result));
}));
router.delete('/products/:id', asyncWrap(async (req, res) => {
  await productService.remove(Number(req.params.id));
  await audit(req, { action: 'product.delete', entity: 'product', entityId: req.params.id });
  res.json(ok({ removed: true }));
}));
router.post('/products/:id/publish', validate({ body: publishSchema }), asyncWrap(async (req, res) => {
  const result = await productService.publish(Number(req.params.id), req.body.status);
  await audit(req, { action: 'product.publish', entity: 'product', entityId: req.params.id, after: { status: req.body.status } });
  res.json(ok(result));
}));
router.post('/products/:id/stock-adjust', validate({ body: stockAdjustSchema }), asyncWrap(async (req, res) => {
  const result = await productService.adjustStock(Number(req.params.id), req.body.delta);
  await audit(req, { action: 'product.stock_adjust', entity: 'product', entityId: req.params.id, after: { delta: req.body.delta } });
  res.json(ok(result));
}));
router.post(
  '/products/:id/images',
  validate({ body: z.object({ secureUrl: z.string().url(), publicId: z.string().min(1), alt: z.string().max(180).optional(), sortOrder: z.number().int().min(0).optional() }) }),
  asyncWrap(async (req, res) => {
    const id = await productService.addImage(Number(req.params.id), req.body);
    res.status(201).json(ok({ id }));
  }),
);
router.delete('/products/images/:imageId', asyncWrap(async (req, res) => {
  await productService.removeImage(Number(req.params.imageId));
  res.json(ok({ removed: true }));
}));
router.post('/products/:id/variants', validate({ body: variantSchema }), asyncWrap(async (req, res) => {
  const id = await productService.createVariant(Number(req.params.id), req.body);
  res.status(201).json(ok({ id }));
}));
router.patch('/products/variants/:variantId', validate({ body: variantSchema.partial() }), asyncWrap(async (req, res) => {
  await productService.updateVariant(Number(req.params.variantId), req.body);
  res.json(ok({ updated: true }));
}));
router.delete('/products/variants/:variantId', asyncWrap(async (req, res) => {
  await productService.removeVariant(Number(req.params.variantId));
  res.json(ok({ removed: true }));
}));

// ---------- Orders ----------

router.get(
  '/orders',
  validate({ query: z.object({
    status: z.string().optional(),
    paymentStatus: z.string().optional(),
    q: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
  }) }),
  asyncWrap(async (req, res) => {
    const q = req.query as unknown as { status?: string; paymentStatus?: string; q?: string; page: number; limit: number };
    const { page, limit, offset } = parsePagination(q);
    const wheres: string[] = ['1=1'];
    const params: Record<string, unknown> = {};
    if (q.status) { wheres.push('order_status = :status'); params.status = q.status; }
    if (q.paymentStatus) { wheres.push('payment_status = :ps'); params.ps = q.paymentStatus; }
    if (q.q) { wheres.push('order_number LIKE :q'); params.q = `%${q.q}%`; }
    const where = `WHERE ${wheres.join(' AND ')}`;
    const total = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM orders ${where}`, params);
    const rows = await query(
      `SELECT o.*, (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS items_count
       FROM orders o ${where} ORDER BY placed_at DESC LIMIT ${limit} OFFSET ${offset}`,
      params,
    );
    res.json(ok(camelize(rows), pageMeta(page, limit, total[0]?.n ?? 0)));
  }),
);

router.patch(
  '/orders/:orderNumber/status',
  validate({ body: z.object({ status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']), trackingNumber: z.string().max(120).optional() }) }),
  asyncWrap(async (req, res) => {
    const { status, trackingNumber } = req.body as { status: string; trackingNumber?: string };
    const rows = await query<{ id: number; user_id: number }>(
      `SELECT id, user_id FROM orders WHERE order_number = :n LIMIT 1`, { n: req.params.orderNumber },
    );
    if (!rows[0]) throw new NotFoundError('Order not found.');
    await exec(
      `UPDATE orders SET order_status = :status,
                         shipped_at = CASE WHEN :status='shipped' THEN CURRENT_TIMESTAMP ELSE shipped_at END,
                         delivered_at = CASE WHEN :status='delivered' THEN CURRENT_TIMESTAMP ELSE delivered_at END,
                         updated_at = CURRENT_TIMESTAMP
       WHERE id = :id`,
      { status, id: rows[0].id },
    );
    await audit(req, { action: 'order.status', entity: 'order', entityId: rows[0].id, after: { status, trackingNumber } });
    // notification email
    const user = await query<{ email: string; name: string }>(`SELECT email, name FROM users WHERE id = :id`, { id: rows[0].user_id });
    if (user[0]) {
      if (status === 'shipped') {
        await sendMail({ to: user[0].email, subject: `Your order ${req.params.orderNumber} is on its way`,
          template: 'order-shipped', data: { name: user[0].name, orderNumber: req.params.orderNumber, trackingNumber: trackingNumber ?? '—', year: new Date().getFullYear() },
        }).catch(() => undefined);
      } else if (status === 'delivered') {
        await sendMail({ to: user[0].email, subject: `Your order ${req.params.orderNumber} has arrived`,
          template: 'order-delivered', data: { name: user[0].name, orderNumber: req.params.orderNumber, year: new Date().getFullYear() },
        }).catch(() => undefined);
      }
    }
    res.json(ok({ updated: true }));
  }),
);

// ---------- Customers ----------

router.get(
  '/customers',
  validate({ query: z.object({ q: z.string().optional(), status: z.enum(['active', 'suspended', 'deleted']).optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) }) }),
  asyncWrap(async (req, res) => {
    const q = req.query as unknown as { q?: string; status?: string; page: number; limit: number };
    const { page, limit, offset } = parsePagination(q);
    const wheres: string[] = ["role = 'customer'", 'deleted_at IS NULL'];
    const params: Record<string, unknown> = {};
    if (q.status) { wheres.push('status = :status'); params.status = q.status; }
    if (q.q) { wheres.push('(name LIKE :q OR email LIKE :q OR phone LIKE :q)'); params.q = `%${q.q}%`; }
    const where = `WHERE ${wheres.join(' AND ')}`;
    const total = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM users ${where}`, params);
    const rows = await query(
      `SELECT u.id, u.name, u.email, u.phone, u.status, u.last_login_at, u.created_at,
              (SELECT COUNT(*) FROM orders WHERE user_id = u.id) AS order_count,
              COALESCE((SELECT SUM(total_amount) FROM orders WHERE user_id = u.id AND order_status IN ('delivered','shipped','processing','confirmed')), 0) AS total_spent
       FROM users u ${where} ORDER BY u.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      params,
    );
    res.json(ok(camelize(rows), pageMeta(page, limit, total[0]?.n ?? 0)));
  }),
);
router.post('/customers/:id/suspend', asyncWrap(async (req, res) => {
  await exec(`UPDATE users SET status = 'suspended' WHERE id = :id AND role = 'customer'`, { id: req.params.id });
  await audit(req, { action: 'customer.suspend', entity: 'user', entityId: req.params.id });
  res.json(ok({ suspended: true }));
}));
router.post('/customers/:id/activate', asyncWrap(async (req, res) => {
  await exec(`UPDATE users SET status = 'active' WHERE id = :id AND role = 'customer'`, { id: req.params.id });
  await audit(req, { action: 'customer.activate', entity: 'user', entityId: req.params.id });
  res.json(ok({ activated: true }));
}));

// ---------- Wholesale inquiries ----------

router.get(
  '/wholesale-inquiries',
  validate({ query: z.object({ status: z.enum(['new', 'contacted', 'qualified', 'won', 'lost']).optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) }) }),
  asyncWrap(async (req, res) => {
    const q = req.query as unknown as { status?: string; page: number; limit: number };
    const { page, limit, offset } = parsePagination(q);
    const wheres = q.status ? ['status = :status'] : ['1=1'];
    const params: Record<string, unknown> = q.status ? { status: q.status } : {};
    const where = `WHERE ${wheres.join(' AND ')}`;
    const total = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM wholesale_inquiries ${where}`, params);
    const rows = await query(`SELECT * FROM wholesale_inquiries ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params);
    res.json(ok(camelize(rows), pageMeta(page, limit, total[0]?.n ?? 0)));
  }),
);
router.patch(
  '/wholesale-inquiries/:id',
  validate({ body: z.object({ status: z.enum(['new', 'contacted', 'qualified', 'won', 'lost']), notes: z.string().max(2000).optional() }) }),
  asyncWrap(async (req, res) => {
    const body = req.body as { status: string; notes?: string };
    await exec(
      `UPDATE wholesale_inquiries SET status = :status, admin_notes = COALESCE(:notes, admin_notes), updated_at = CURRENT_TIMESTAMP WHERE id = :id`,
      { status: body.status, notes: body.notes ? sanitizeHtml(body.notes) : null, id: req.params.id },
    );
    await audit(req, { action: 'wholesale.status', entity: 'wholesale_inquiry', entityId: req.params.id, after: body });
    res.json(ok({ updated: true }));
  }),
);

// ---------- Banners ----------

const bannerSchema = z.object({
  title: z.string().max(180),
  subtitle: z.string().max(255).optional(),
  imageUrl: z.string().url(),
  linkUrl: z.string().url().optional(),
  placement: z.enum(['home_hero', 'home_promo', 'category', 'sidebar']),
  categoryId: z.coerce.number().int().positive().optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  startAt: z.string().datetime().optional(),
  endAt: z.string().datetime().optional(),
  isActive: z.coerce.boolean().default(true),
});
router.get('/banners', asyncWrap(async (_req, res) => {
  const rows = await query(`SELECT * FROM banners ORDER BY sort_order, id DESC`);
  res.json(ok(camelize(rows)));
}));
router.post('/banners', validate({ body: bannerSchema }), asyncWrap(async (req, res) => {
  const b = req.body as z.infer<typeof bannerSchema>;
  const result = await exec(
    `INSERT INTO banners (title, subtitle, image_url, link_url, placement, category_id, sort_order, start_at, end_at, is_active)
     VALUES (:title, :subtitle, :imageUrl, :linkUrl, :placement, :categoryId, :sortOrder, :startAt, :endAt, :isActive)`,
    {
      title: b.title, subtitle: b.subtitle ?? null, imageUrl: b.imageUrl, linkUrl: b.linkUrl ?? null,
      placement: b.placement, categoryId: b.categoryId ?? null, sortOrder: b.sortOrder,
      startAt: b.startAt ?? null, endAt: b.endAt ?? null, isActive: b.isActive ? 1 : 0,
    },
  );
  await audit(req, { action: 'banner.create', entity: 'banner', entityId: result.insertId, after: b });
  res.status(201).json(ok({ id: result.insertId }));
}));
router.patch('/banners/:id', validate({ body: bannerSchema.partial() }), asyncWrap(async (req, res) => {
  const patch = req.body as Partial<z.infer<typeof bannerSchema>>;
  const cols: string[] = []; const params: Record<string, unknown> = { id: req.params.id };
  const map: Record<string, string> = {
    title: 'title', subtitle: 'subtitle', imageUrl: 'image_url', linkUrl: 'link_url', placement: 'placement',
    categoryId: 'category_id', sortOrder: 'sort_order', startAt: 'start_at', endAt: 'end_at', isActive: 'is_active',
  };
  for (const [k, col] of Object.entries(map)) {
    if (k in patch) {
      cols.push(`${col} = :${k}`);
      params[k] = k === 'isActive' ? (patch.isActive ? 1 : 0) : (patch as Record<string, unknown>)[k] ?? null;
    }
  }
  if (cols.length) await exec(`UPDATE banners SET ${cols.join(', ')} WHERE id = :id`, params);
  await audit(req, { action: 'banner.update', entity: 'banner', entityId: req.params.id, after: patch });
  res.json(ok({ updated: true }));
}));
router.delete('/banners/:id', asyncWrap(async (req, res) => {
  await exec(`DELETE FROM banners WHERE id = :id`, { id: req.params.id });
  await audit(req, { action: 'banner.delete', entity: 'banner', entityId: req.params.id });
  res.json(ok({ removed: true }));
}));

// ---------- Reviews moderation ----------

router.get(
  '/reviews',
  validate({ query: z.object({ status: z.enum(['pending', 'approved', 'rejected']).optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(100).default(20) }) }),
  asyncWrap(async (req, res) => {
    const q = req.query as unknown as { status?: string; page: number; limit: number };
    const { page, limit, offset } = parsePagination(q);
    const where = q.status ? 'WHERE status = :status' : '';
    const total = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM reviews ${where}`, { status: q.status });
    const rows = await query(`SELECT * FROM reviews ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, { status: q.status });
    res.json(ok(camelize(rows), pageMeta(page, limit, total[0]?.n ?? 0)));
  }),
);
router.post(
  '/reviews/:id/moderate',
  validate({ body: z.object({ status: z.enum(['approved', 'rejected']) }) }),
  asyncWrap(async (req, res) => {
    const rows = await query<{ id: number; product_id: number }>(`SELECT id, product_id FROM reviews WHERE id = :id LIMIT 1`, { id: req.params.id });
    if (!rows[0]) throw new NotFoundError('Review not found.');
    await exec(`UPDATE reviews SET status = :status, updated_at = CURRENT_TIMESTAMP WHERE id = :id`, { status: req.body.status, id: req.params.id });
    // Recompute the product's rating summary after a moderation flip.
    const { productRepo } = await import('../products/repository');
    await productRepo.recomputeRating(rows[0].product_id);
    await audit(req, { action: `review.${req.body.status}`, entity: 'review', entityId: req.params.id });
    res.json(ok({ moderated: true }));
  }),
);

// ---------- Users (super admin) ----------

router.get('/users', requireSuperAdmin, asyncWrap(async (_req, res) => {
  const rows = await query(`SELECT id, name, email, role, status, last_login_at, created_at FROM users WHERE deleted_at IS NULL ORDER BY id`);
  res.json(ok(camelize(rows)));
}));
router.post(
  '/users/:id/role',
  requireSuperAdmin,
  validate({ body: z.object({ role: z.enum(['customer', 'admin', 'super_admin']) }) }),
  asyncWrap(async (req, res) => {
    await exec(`UPDATE users SET role = :role, updated_at = CURRENT_TIMESTAMP WHERE id = :id`, { role: req.body.role, id: req.params.id });
    await audit(req, { action: 'user.role', entity: 'user', entityId: req.params.id, after: { role: req.body.role } });
    res.json(ok({ updated: true }));
  }),
);

// ---------- Audit log ----------

router.get(
  '/audit-logs',
  requireSuperAdmin,
  validate({ query: z.object({ entity: z.string().optional(), action: z.string().optional(), page: z.coerce.number().int().min(1).default(1), limit: z.coerce.number().int().min(1).max(200).default(50) }) }),
  asyncWrap(async (req, res) => {
    const q = req.query as unknown as { entity?: string; action?: string; page: number; limit: number };
    const { page, limit, offset } = parsePagination(q);
    const wheres: string[] = ['1=1']; const params: Record<string, unknown> = {};
    if (q.entity) { wheres.push('entity = :entity'); params.entity = q.entity; }
    if (q.action) { wheres.push('action LIKE :action'); params.action = `%${q.action}%`; }
    const where = `WHERE ${wheres.join(' AND ')}`;
    const total = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM audit_logs ${where}`, params);
    const rows = await query(`SELECT * FROM audit_logs ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params);
    res.json(ok(camelize(rows), pageMeta(page, limit, total[0]?.n ?? 0)));
  }),
);

// ---------- Settings (super admin) — in-memory persistence stub ----------
// Coupons / promotions live outside the shipped schema, so settings that write
// to key-value pairs are stored in a dedicated `site_settings` table if you
// add one via a future migration. For now the endpoint accepts and echoes the
// payload so the frontend admin/settings page has a matching contract.

let settingsCache: Record<string, unknown> = {
  siteName: 'BHAVITA TEXTILES',
  contactEmail: 'hello@bhavitatextiles.com',
  contactPhone: '+91-141-000-1000',
  shippingFlatRate: 150,
  freeShippingThreshold: 5000,
  taxRate: 0.05,
  razorpayEnabled: true,
  codEnabled: false,
  maintenanceMode: false,
};
router.get('/settings', requireSuperAdmin, asyncWrap(async (_req, res) => {
  res.json(ok(settingsCache));
}));
router.patch(
  '/settings',
  requireSuperAdmin,
  validate({ body: z.record(z.string(), z.unknown()) }),
  asyncWrap(async (req, res) => {
    settingsCache = { ...settingsCache, ...(req.body as Record<string, unknown>) };
    await audit(req, { action: 'settings.update', entity: 'settings', after: req.body });
    res.json(ok(settingsCache));
  }),
);

export default router;
