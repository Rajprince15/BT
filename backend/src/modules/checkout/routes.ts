import { Router } from 'express';
import { z } from 'zod';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { exec, query, withTransaction } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { authMiddleware } from '../../middleware/auth';
import { authReadLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import {
  BadRequestError, ConflictError, NotFoundError, UnauthorizedError,
} from '../../utils/errors';
import { generateOrderNumber, hmacSha256, timingSafeEqual } from '../../utils/tokens';
import { env } from '../../config/env';
import { paymentLogger } from '../../config/logger';
import { sendMail } from '../../config/mailer';
import { getCartForUser, clearCartForUser } from '../cart/routes';

const quoteSchema = z.object({
  addressId: z.coerce.number().int().positive(),
  paymentMethod: z.enum(['razorpay', 'cod']).default('razorpay'),
});

const orderSchema = z.object({
  quoteId: z.string().min(1),
  amount: z.coerce.number().min(1),
  currency: z.enum(['INR']).default('INR'),
});

const verifySchema = z.object({
  orderId: z.string().min(1),          // razorpay_order_id
  paymentId: z.string().min(1),        // razorpay_payment_id
  signature: z.string().min(1),        // razorpay_signature
  idempotencyKey: z.string().min(6).max(120).optional(),
});

const router = Router();
router.use(authMiddleware(), authReadLimiter);

// In-memory quote cache — production would use Redis / a signed token.
const quoteCache = new Map<string, { userId: number; addressId: number; total: number; expiresAt: number }>();
const QUOTE_TTL_MS = 15 * 60 * 1000;

function makeQuoteId(): string {
  return `qt_${crypto.randomBytes(9).toString('hex')}`;
}

// -------- POST /checkout/quote --------

router.post('/quote', validate({ body: quoteSchema }), asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const { addressId } = req.body as z.infer<typeof quoteSchema>;

  const addressRows = await query<{ id: number; user_id: number }>(
    `SELECT id, user_id FROM addresses WHERE id = :id LIMIT 1`, { id: addressId },
  );
  if (!addressRows[0] || addressRows[0].user_id !== req.user.id) {
    throw new NotFoundError('Address not found.');
  }

  const { cart } = await getCartForUser(req.user.id);
  if (cart.items.length === 0) throw new BadRequestError('Your cart is empty.');

  const quoteId = makeQuoteId();
  quoteCache.set(quoteId, {
    userId: req.user.id,
    addressId,
    total: cart.total,
    expiresAt: Date.now() + QUOTE_TTL_MS,
  });

  res.json(ok({
    quoteId,
    subtotal: cart.subtotal,
    shippingAmount: cart.shippingAmount,
    taxAmount: cart.taxAmount,
    total: cart.total,
    currency: cart.currency,
    itemsCount: cart.itemsCount,
    expiresAt: new Date(Date.now() + QUOTE_TTL_MS).toISOString(),
  }));
}));

// -------- POST /checkout/razorpay/order --------

function razorpayClient(): Razorpay {
  return new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET });
}

router.post('/razorpay/order', validate({ body: orderSchema }), asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const body = req.body as z.infer<typeof orderSchema>;
  const quote = quoteCache.get(body.quoteId);
  if (!quote || quote.userId !== req.user.id) throw new BadRequestError('Quote expired. Please retry.', {}, 'QUOTE_EXPIRED');
  if (Date.now() > quote.expiresAt) { quoteCache.delete(body.quoteId); throw new BadRequestError('Quote expired.', {}, 'QUOTE_EXPIRED'); }
  if (Math.abs(quote.total - body.amount) > 0.01) throw new BadRequestError('Amount mismatch.', {}, 'AMOUNT_MISMATCH');

  const receipt = generateOrderNumber();

  let rpOrder: { id: string; amount: number; currency: string };
  try {
    rpOrder = await razorpayClient().orders.create({
      amount: Math.round(quote.total * 100),
      currency: 'INR',
      receipt,
      notes: { userId: String(req.user.id), quoteId: body.quoteId },
    }) as never;
  } catch (error) {
    paymentLogger.error('rp.order.create.failed', { message: (error as Error).message, userId: req.user.id });
    throw new BadRequestError('Could not initialise payment.');
  }

  // Provisional payments row — status=created; the actual `orders` row is inserted on verify.
  await exec(
    `INSERT INTO payments (order_id, razorpay_order_id, amount, currency, status, raw_payload_json)
     VALUES (0, :rpOrderId, :amount, :currency, 'created', :payload)`,
    {
      rpOrderId: rpOrder.id, amount: quote.total, currency: 'INR',
      payload: JSON.stringify({ receipt, quoteId: body.quoteId }),
    },
  );

  paymentLogger.info('rp.order.created', { rpOrderId: rpOrder.id, userId: req.user.id, amount: quote.total });

  res.json(ok({
    orderId: rpOrder.id,
    amount: rpOrder.amount / 100,
    currency: rpOrder.currency,
    keyId: env.RAZORPAY_KEY_ID,
    receipt,
  }));
}));

// -------- POST /checkout/razorpay/verify --------

const idemCache = new Map<string, { orderNumber: string; at: number }>();

router.post('/razorpay/verify', validate({ body: verifySchema }), asyncWrap(async (req, res): Promise<void> => {
  if (!req.user) throw new UnauthorizedError();
  const { orderId, paymentId, signature, idempotencyKey } = req.body as z.infer<typeof verifySchema>;
  const idemKey = idempotencyKey ?? (req.header('idempotency-key') ?? '');

  if (idemKey && idemCache.has(idemKey)) {
    const cached = idemCache.get(idemKey)!;
    res.json(ok({ orderNumber: cached.orderNumber, replayed: true }));
    return;
  }

  const expected = hmacSha256(env.RAZORPAY_KEY_SECRET, `${orderId}|${paymentId}`);
  if (!timingSafeEqual(expected, signature)) {
    paymentLogger.warn('rp.verify.signature_mismatch', { orderId, paymentId, userId: req.user.id });
    throw new BadRequestError('Signature verification failed.', {}, 'SIGNATURE_MISMATCH');
  }

  // Guard replay via UNIQUE constraint on payments.razorpay_payment_id.
  const existing = await query<{ id: number; order_id: number }>(
    `SELECT id, order_id FROM payments WHERE razorpay_payment_id = :pid LIMIT 1`, { pid: paymentId },
  );
  if (existing[0]) {
    const orderRow = await query<{ order_number: string }>(
      `SELECT order_number FROM orders WHERE id = :id LIMIT 1`, { id: existing[0].order_id },
    );
    if (orderRow[0]) {
      res.json(ok({ orderNumber: orderRow[0].order_number, replayed: true }));
      return;
    }
  }

  const { cart, rawItems } = await getCartForUser(req.user.id);
  if (cart.items.length === 0) throw new BadRequestError('Your cart is empty.', {}, 'EMPTY_CART');

  const addressRows = await query<Record<string, unknown>>(
    `SELECT id, full_name, phone, address_line1, address_line2, city, state, pincode, country
     FROM addresses
     WHERE user_id = :userId AND (id = (SELECT COALESCE(MAX(id), 0) FROM addresses WHERE user_id = :userId AND is_default = 1)
                                  OR is_default = 1)
     ORDER BY is_default DESC LIMIT 1`,
    { userId: req.user.id },
  );
  const shipping = addressRows[0];
  if (!shipping) throw new BadRequestError('Please add a shipping address before checkout.');

  const orderNumber = await withTransaction(async (conn) => {
    // Stock check + lock
    for (const item of rawItems) {
      const [rows] = await conn.execute(
        item.variant_id
          ? `SELECT stock FROM product_variants WHERE id = ? FOR UPDATE`
          : `SELECT stock FROM products WHERE id = ? FOR UPDATE`,
        [item.variant_id ?? item.product_id],
      );
      const stock = (rows as Array<{ stock: number }>)[0]?.stock ?? 0;
      if (item.quantity > stock) {
        throw new ConflictError(`${item.product_name} is out of stock.`, 'OUT_OF_STOCK');
      }
    }

    const number = generateOrderNumber();
    const [orderResult] = await conn.execute(
      `INSERT INTO orders (user_id, order_number, subtotal, shipping_amount, tax_amount, total_amount,
                           currency, shipping_address_json, payment_status, order_status, placed_at)
       VALUES (?, ?, ?, ?, ?, ?, 'INR', ?, 'paid', 'confirmed', CURRENT_TIMESTAMP)`,
      [req.user!.id, number, cart.subtotal, cart.shippingAmount, cart.taxAmount, cart.total, JSON.stringify(shipping)],
    );
    const orderId = (orderResult as { insertId: number }).insertId;

    for (const item of rawItems) {
      const price = Number(item.variant_price ?? item.sale_price ?? item.unit_price);
      await conn.execute(
        `INSERT INTO order_items (order_id, product_id, variant_id, product_name, product_sku, quantity, price, line_total)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.variant_id, item.product_name, item.variant_sku ?? item.product_sku, item.quantity, price, price * item.quantity],
      );
      if (item.variant_id) {
        await conn.execute(`UPDATE product_variants SET stock = stock - ? WHERE id = ?`, [item.quantity, item.variant_id]);
      } else {
        await conn.execute(`UPDATE products SET stock = stock - ? WHERE id = ?`, [item.quantity, item.product_id]);
      }
    }

    await conn.execute(
      `UPDATE payments SET order_id = ?, razorpay_payment_id = ?, razorpay_signature = ?, status = 'captured', updated_at = CURRENT_TIMESTAMP
       WHERE razorpay_order_id = ?`,
      [orderId, paymentId, signature, orderId],
    );

    await conn.execute(`DELETE ci FROM cart_items ci JOIN carts c ON c.id = ci.cart_id WHERE c.user_id = ?`, [req.user!.id]);
    void clearCartForUser;

    return number;
  });

  if (idemKey) idemCache.set(idemKey, { orderNumber, at: Date.now() });

  paymentLogger.info('rp.verify.captured', { userId: req.user.id, orderNumber, paymentId });

  // Fire-and-forget email
  const userRows = await query<{ email: string; name: string }>(`SELECT email, name FROM users WHERE id = :id`, { id: req.user.id });
  if (userRows[0]) {
    await sendMail({
      to: userRows[0].email,
      subject: `Your order ${orderNumber} is confirmed`,
      template: 'order-placed',
      data: { name: userRows[0].name, orderNumber, totalAmount: cart.total.toLocaleString('en-IN'), year: new Date().getFullYear() },
    }).catch(() => undefined);
  }

  res.json(ok({ orderNumber }));
}));

export default router;
