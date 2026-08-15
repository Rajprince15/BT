import { Router } from 'express';
import { z } from 'zod';
import { exec, query } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { authMiddleware } from '../../middleware/auth';
import { authReadLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';
import { NotFoundError, UnauthorizedError } from '../../utils/errors';

const router = Router();
router.use(authMiddleware(), authReadLimiter);

router.get('/', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const rows = await query(
    `SELECT w.product_id, p.name, p.slug, p.price, p.sale_price, p.stock, p.rating_avg, p.rating_count,
            (SELECT image_url FROM product_images WHERE product_id = p.id ORDER BY sort_order, id LIMIT 1) AS image_url
     FROM wishlists w JOIN products p ON p.id = w.product_id AND p.deleted_at IS NULL
     WHERE w.user_id = :userId ORDER BY w.created_at DESC`,
    { userId: req.user.id },
  );
  res.json(ok(rows));
}));

router.post('/', validate({ body: z.object({ productId: z.coerce.number().int().positive() }) }),
  asyncWrap(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    await exec(
      `INSERT IGNORE INTO wishlists (user_id, product_id) VALUES (:userId, :productId)`,
      { userId: req.user.id, productId: req.body.productId },
    );
    res.status(201).json(ok({ productId: req.body.productId, added: true }));
  }),
);

router.delete('/:productId', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  await exec(
    `DELETE FROM wishlists WHERE user_id = :userId AND product_id = :pid`,
    { userId: req.user.id, pid: req.params.productId },
  );
  res.json(ok({ removed: true }));
}));

router.post('/:productId/move-to-cart', asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const productId = Number(req.params.productId);
  const rows = await query<{ id: number; stock: number }>(
    `SELECT id, stock FROM products WHERE id = :id AND status='published' AND deleted_at IS NULL LIMIT 1`,
    { id: productId },
  );
  if (!rows[0]) throw new NotFoundError('Product unavailable.');
  const cartRows = await query<{ id: number }>(`SELECT id FROM carts WHERE user_id = :u LIMIT 1`, { u: req.user.id });
  const cartId = cartRows[0]?.id ?? (await exec(`INSERT INTO carts (user_id) VALUES (:u)`, { u: req.user.id })).insertId;
  await exec(
    `INSERT INTO cart_items (cart_id, product_id, quantity)
     VALUES (:cartId, :pid, 1)
     ON DUPLICATE KEY UPDATE quantity = LEAST(quantity + 1, :stock)`,
    { cartId, pid: productId, stock: rows[0].stock },
  );
  await exec(`DELETE FROM wishlists WHERE user_id = :u AND product_id = :pid`, { u: req.user.id, pid: productId });
  res.json(ok({ moved: true }));
}));

export default router;
