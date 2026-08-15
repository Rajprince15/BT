import { Router } from 'express';
import { z } from 'zod';
import { exec, query, withTransaction } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { authMiddleware } from '../../middleware/auth';
import { authReadLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import { BadRequestError, NotFoundError, UnauthorizedError, ConflictError } from '../../utils/errors';

interface CartRow { id: number; user_id: number; }
interface CartItemRow {
  id: number; cart_id: number; product_id: number; variant_id: number | null; quantity: number;
  product_name: string; product_slug: string; product_sku: string;
  unit_price: number; sale_price: number | null; stock: number; image_url: string | null; variant_sku: string | null;
  variant_size: string | null; variant_color: string | null; variant_price: number | null;
}

const SHIPPING_FLAT = 150;
const FREE_SHIPPING_THRESHOLD = 5000;
const TAX_RATE = 0.05;

const addItemSchema = z.object({
  productId: z.coerce.number().int().positive(),
  variantId: z.coerce.number().int().positive().optional(),
  quantity: z.coerce.number().int().min(1).max(20).default(1),
});
const patchItemSchema = z.object({ quantity: z.coerce.number().int().min(1).max(20) });

async function getOrCreateCart(userId: number): Promise<number> {
  const rows = await query<CartRow>(`SELECT id FROM carts WHERE user_id = :userId LIMIT 1`, { userId });
  if (rows[0]) return rows[0].id;
  const result = await exec(`INSERT INTO carts (user_id) VALUES (:userId)`, { userId });
  return result.insertId;
}

async function fetchCartItems(cartId: number): Promise<CartItemRow[]> {
  return query<CartItemRow>(
    `SELECT ci.id, ci.cart_id, ci.product_id, ci.variant_id, ci.quantity,
            p.name AS product_name, p.slug AS product_slug, p.sku AS product_sku,
            p.price AS unit_price, p.sale_price AS sale_price, p.stock AS stock,
            (SELECT image_url FROM product_images pi WHERE pi.product_id = p.id ORDER BY sort_order, id LIMIT 1) AS image_url,
            v.sku AS variant_sku, v.size AS variant_size, v.color AS variant_color, v.price AS variant_price
     FROM cart_items ci
     JOIN products p ON p.id = ci.product_id AND p.deleted_at IS NULL
     LEFT JOIN product_variants v ON v.id = ci.variant_id
     WHERE ci.cart_id = :cartId
     ORDER BY ci.id`,
    { cartId },
  );
}

function priceOf(item: CartItemRow): number {
  const base = Number(item.variant_price ?? item.sale_price ?? item.unit_price);
  return Number.isFinite(base) ? base : 0;
}

function computeCart(userId: number, cartId: number, items: CartItemRow[]) {
  let subtotal = 0;
  const cartItems = items.map((item) => {
    const price = priceOf(item);
    const lineTotal = price * item.quantity;
    subtotal += lineTotal;
    return {
      id: item.id,
      productId: item.product_id,
      variantId: item.variant_id,
      quantity: item.quantity,
      price,
      lineTotal,
      productName: item.product_name,
      productSlug: item.product_slug,
      productSku: item.product_sku,
      imageUrl: item.image_url,
      stock: item.stock,
      variantSku: item.variant_sku,
      variantSize: item.variant_size,
      variantColor: item.variant_color,
    };
  });
  const shippingAmount = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FLAT;
  const taxAmount = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shippingAmount + taxAmount) * 100) / 100;
  return {
    id: cartId, userId, items: cartItems,
    subtotal: Math.round(subtotal * 100) / 100,
    shippingAmount, taxAmount, total,
    currency: 'INR' as const,
    itemsCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  };
}

const router = Router();

router.use(authMiddleware(), authReadLimiter);

router.get('/', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const cartId = await getOrCreateCart(req.user.id);
  const items = await fetchCartItems(cartId);
  res.json(ok(computeCart(req.user.id, cartId, items)));
}));

router.post('/items', validate({ body: addItemSchema }), asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const { productId, variantId, quantity } = req.body as z.infer<typeof addItemSchema>;
  const cartId = await getOrCreateCart(req.user.id);
  const productRows = await query<{ stock: number }>(
    `SELECT stock FROM products WHERE id = :id AND status = 'published' AND deleted_at IS NULL LIMIT 1`,
    { id: productId },
  );
  if (!productRows[0]) throw new NotFoundError('Product unavailable.');
  const stock = variantId
    ? (await query<{ stock: number }>(`SELECT stock FROM product_variants WHERE id = :id AND is_active = 1 LIMIT 1`, { id: variantId }))[0]?.stock
    : productRows[0].stock;
  if (stock == null) throw new NotFoundError('Variant unavailable.');
  if (quantity > stock) throw new ConflictError('Not enough stock available.', 'OUT_OF_STOCK');

  await withTransaction(async (conn) => {
    // Upsert on (cart_id, product_id, variant_id).
    // MySQL NULL uniqueness caveat handled by conditional update pattern.
    const [rows] = await conn.execute(
      `SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ? AND (variant_id <=> ?)`,
      [cartId, productId, variantId ?? null],
    );
    const existing = (rows as Array<{ id: number; quantity: number }>)[0];
    if (existing) {
      const next = Math.min(stock, existing.quantity + quantity);
      await conn.execute(`UPDATE cart_items SET quantity = ? WHERE id = ?`, [next, existing.id]);
    } else {
      await conn.execute(
        `INSERT INTO cart_items (cart_id, product_id, variant_id, quantity) VALUES (?, ?, ?, ?)`,
        [cartId, productId, variantId ?? null, quantity],
      );
    }
  });
  const items = await fetchCartItems(cartId);
  res.status(201).json(ok(computeCart(req.user.id, cartId, items)));
}));

router.patch('/items/:id', validate({ body: patchItemSchema }), asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const cartId = await getOrCreateCart(req.user.id);
  const itemRows = await query<{ id: number; product_id: number; variant_id: number | null }>(
    `SELECT id, product_id, variant_id FROM cart_items WHERE id = :id AND cart_id = :cartId LIMIT 1`,
    { id: req.params.id, cartId },
  );
  const target = itemRows[0];
  if (!target) throw new NotFoundError('Cart item not found.');
  const { quantity } = req.body as z.infer<typeof patchItemSchema>;
  const stockRows = target.variant_id
    ? await query<{ stock: number }>(`SELECT stock FROM product_variants WHERE id = :id LIMIT 1`, { id: target.variant_id })
    : await query<{ stock: number }>(`SELECT stock FROM products WHERE id = :id LIMIT 1`, { id: target.product_id });
  const stock = stockRows[0]?.stock ?? 0;
  if (quantity > stock) throw new ConflictError('Not enough stock available.', 'OUT_OF_STOCK');
  await exec(`UPDATE cart_items SET quantity = :q WHERE id = :id`, { q: quantity, id: target.id });
  const items = await fetchCartItems(cartId);
  res.json(ok(computeCart(req.user.id, cartId, items)));
}));

router.delete('/items/:id', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const cartId = await getOrCreateCart(req.user.id);
  const result = await exec(`DELETE FROM cart_items WHERE id = :id AND cart_id = :cartId`, { id: req.params.id, cartId });
  if (!result.affectedRows) throw new NotFoundError('Cart item not found.');
  const items = await fetchCartItems(cartId);
  res.json(ok(computeCart(req.user.id, cartId, items)));
}));

// Internal helper exported for checkout module.
export async function getCartForUser(userId: number) {
  const cartId = await getOrCreateCart(userId);
  const items = await fetchCartItems(cartId);
  return { cart: computeCart(userId, cartId, items), rawItems: items };
}

export async function clearCartForUser(userId: number, conn?: import('mysql2/promise').PoolConnection) {
  const cartId = await getOrCreateCart(userId);
  if (conn) await conn.execute(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
  else await exec(`DELETE FROM cart_items WHERE cart_id = :cartId`, { cartId });
}

// Placeholder — allows a caller to force-reject if quote does not match cart.
export function isServerAmount(computed: number, provided: number): boolean {
  return Math.abs(computed - provided) < 0.01;
}

if (!isServerAmount) throw new BadRequestError('unreachable');

export default router;
