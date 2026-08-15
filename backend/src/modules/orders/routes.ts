import { Router } from 'express';
import { z } from 'zod';
import PDFDocument from 'pdfkit';
import { exec, query, withTransaction } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok, camelize } from '../../utils/envelope';
import { authMiddleware } from '../../middleware/auth';
import { authReadLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import { pageMeta, parsePagination } from '../../utils/pagination';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../utils/errors';
import { sendMail } from '../../config/mailer';

const router = Router();
router.use(authMiddleware(), authReadLimiter);

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
});

async function fetchOrderDetail(userId: number | null, orderNumber: string) {
  const rows = await query<Record<string, unknown>>(
    `SELECT * FROM orders WHERE order_number = :n ${userId ? 'AND user_id = :u' : ''} LIMIT 1`,
    userId ? { n: orderNumber, u: userId } : { n: orderNumber },
  );
  const order = rows[0];
  if (!order) throw new NotFoundError('Order not found.');
  const items = await query(
    `SELECT * FROM order_items WHERE order_id = :id ORDER BY id`,
    { id: order.id },
  );
  const enriched = camelize<Record<string, unknown>>({ ...order, items });
  // shipping_address_json is stored as JSON; MySQL returns it as string, so parse.
  const shipping = order.shipping_address_json as unknown;
  (enriched as { shippingAddressJson?: unknown }).shippingAddressJson =
    typeof shipping === 'string' ? JSON.parse(shipping) : shipping;
  return enriched;
}

router.get('/', validate({ query: listQuerySchema }), asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const q = req.query as unknown as z.infer<typeof listQuerySchema>;
  const { page, limit, offset } = parsePagination(q);
  const wheres = ['user_id = :userId'];
  const params: Record<string, unknown> = { userId: req.user.id };
  if (q.status) { wheres.push('order_status = :status'); params.status = q.status; }
  const where = `WHERE ${wheres.join(' AND ')}`;
  const totalRows = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM orders ${where}`, params);
  const orders = await query(
    `SELECT o.*, (SELECT COUNT(*) FROM order_items WHERE order_id = o.id) AS items_count
     FROM orders o ${where} ORDER BY o.placed_at DESC, o.id DESC LIMIT ${limit} OFFSET ${offset}`,
    params,
  );
  res.json(ok(camelize(orders), pageMeta(page, limit, totalRows[0]?.n ?? 0)));
}));

router.get('/:orderNumber', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const detail = await fetchOrderDetail(req.user.role === 'admin' || req.user.role === 'super_admin' ? null : req.user.id, req.params.orderNumber);
  res.json(ok(detail));
}));

router.post('/:orderNumber/cancel', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const rows = await query<{ id: number; user_id: number; order_status: string; payment_status: string; total_amount: number }>(
    `SELECT id, user_id, order_status, payment_status, total_amount FROM orders WHERE order_number = :n LIMIT 1`,
    { n: req.params.orderNumber },
  );
  const order = rows[0];
  if (!order) throw new NotFoundError('Order not found.');
  if (order.user_id !== req.user.id && req.user.role === 'customer') throw new ForbiddenError();
  if (!['pending', 'confirmed'].includes(order.order_status)) {
    throw new BadRequestError('This order can no longer be cancelled.', {}, 'CANNOT_CANCEL');
  }
  await withTransaction(async (conn) => {
    const [items] = await conn.execute(
      `SELECT product_id, variant_id, quantity FROM order_items WHERE order_id = ?`, [order.id],
    );
    for (const item of items as Array<{ product_id: number; variant_id: number | null; quantity: number }>) {
      if (item.variant_id) {
        await conn.execute(`UPDATE product_variants SET stock = stock + ? WHERE id = ?`, [item.quantity, item.variant_id]);
      } else {
        await conn.execute(`UPDATE products SET stock = stock + ? WHERE id = ?`, [item.quantity, item.product_id]);
      }
    }
    await conn.execute(
      `UPDATE orders SET order_status='cancelled', updated_at=CURRENT_TIMESTAMP WHERE id = ?`, [order.id],
    );
  });

  const user = await query<{ email: string; name: string }>(`SELECT email, name FROM users WHERE id = :id`, { id: order.user_id });
  if (user[0]) {
    await sendMail({
      to: user[0].email,
      subject: `Your order ${req.params.orderNumber} was cancelled`,
      template: 'order-cancelled',
      data: { name: user[0].name, orderNumber: req.params.orderNumber, year: new Date().getFullYear() },
    }).catch(() => undefined);
  }
  res.json(ok({ cancelled: true }));
}));

router.get('/:orderNumber/invoice', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const isStaff = req.user.role === 'admin' || req.user.role === 'super_admin';
  const detail = await fetchOrderDetail(isStaff ? null : req.user.id, req.params.orderNumber);
  const d = detail as {
    orderNumber: string; placedAt: string; subtotal: number; shippingAmount: number;
    taxAmount: number; totalAmount: number; items: Array<{ productName: string; productSku: string; quantity: number; price: number; lineTotal: number }>;
    shippingAddressJson: Record<string, string>;
  };

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="bhavita-invoice-${d.orderNumber}.pdf"`);

  const doc = new PDFDocument({ margin: 50, size: 'A4' });
  doc.pipe(res);
  doc.fillColor('#1A1611').font('Times-Roman').fontSize(20).text('BHAVITA TEXTILES', { align: 'left' });
  doc.moveDown(0.2).fontSize(10).fillColor('#8C7B57').text('Handcrafted at our Jaipur atelier');
  doc.moveDown();
  doc.fillColor('#1A1611').fontSize(14).text(`Invoice · ${d.orderNumber}`);
  doc.fontSize(10).fillColor('#4A3F2A').text(`Placed: ${new Date(d.placedAt).toLocaleString('en-IN')}`);
  doc.moveDown();
  const s = d.shippingAddressJson;
  doc.text(`Shipping to: ${s.full_name || s.fullName || ''}`);
  doc.text(`${s.address_line1 || s.addressLine1 || ''}${s.address_line2 || s.addressLine2 ? ', ' + (s.address_line2 || s.addressLine2) : ''}`);
  doc.text(`${s.city || ''}, ${s.state || ''} — ${s.pincode || ''}`);
  doc.moveDown().moveTo(50, doc.y).lineTo(545, doc.y).strokeColor('#E8D9B0').stroke();
  doc.moveDown();
  const tableTop = doc.y;
  doc.fontSize(10).fillColor('#8C7B57')
    .text('Item', 50, tableTop)
    .text('SKU', 260, tableTop)
    .text('Qty', 360, tableTop, { width: 40, align: 'right' })
    .text('Price', 410, tableTop, { width: 60, align: 'right' })
    .text('Total', 480, tableTop, { width: 65, align: 'right' });
  doc.moveDown();
  doc.fillColor('#1A1611');
  for (const item of d.items) {
    const y = doc.y;
    doc.text(item.productName, 50, y, { width: 200 });
    doc.text(item.productSku, 260, y);
    doc.text(String(item.quantity), 360, y, { width: 40, align: 'right' });
    doc.text(`₹${item.price.toLocaleString('en-IN')}`, 410, y, { width: 60, align: 'right' });
    doc.text(`₹${item.lineTotal.toLocaleString('en-IN')}`, 480, y, { width: 65, align: 'right' });
    doc.moveDown();
  }
  doc.moveTo(50, doc.y).lineTo(545, doc.y).stroke();
  doc.moveDown();
  doc.fontSize(10).text(`Subtotal: ₹${d.subtotal.toLocaleString('en-IN')}`, { align: 'right' });
  doc.text(`Shipping: ₹${d.shippingAmount.toLocaleString('en-IN')}`, { align: 'right' });
  doc.text(`Tax: ₹${d.taxAmount.toLocaleString('en-IN')}`, { align: 'right' });
  doc.fontSize(12).text(`Total: ₹${d.totalAmount.toLocaleString('en-IN')}`, { align: 'right' });
  doc.moveDown(3).fontSize(9).fillColor('#8C7B57').text('Thank you for supporting India\'s handloom weavers.', { align: 'center' });
  doc.end();
}));

// Reorder helper — passes items to cart (used by frontend "buy again").
router.post('/:orderNumber/reorder', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const rows = await query<{ id: number; user_id: number }>(
    `SELECT id, user_id FROM orders WHERE order_number = :n LIMIT 1`, { n: req.params.orderNumber },
  );
  if (!rows[0] || rows[0].user_id !== req.user.id) throw new NotFoundError('Order not found.');
  const items = await query<{ product_id: number; variant_id: number | null; quantity: number }>(
    `SELECT product_id, variant_id, quantity FROM order_items WHERE order_id = :id`, { id: rows[0].id },
  );
  const cartRows = await query<{ id: number }>(`SELECT id FROM carts WHERE user_id = :u LIMIT 1`, { u: req.user.id });
  const cartId = cartRows[0]?.id ?? (await exec(`INSERT INTO carts (user_id) VALUES (:u)`, { u: req.user.id })).insertId;
  for (const item of items) {
    await exec(
      `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity)
       VALUES (:cartId, :pid, :vid, :qty)
       ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
      { cartId, pid: item.product_id, vid: item.variant_id, qty: item.quantity },
    );
  }
  res.json(ok({ reordered: true, itemsCount: items.length }));
}));

export default router;
