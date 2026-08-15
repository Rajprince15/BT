/**
 * Reviews — one review per (user, product) after a delivered order.
 * Public read for approved reviews; auth-only write; verified-purchaser flag.
 */
import { Router } from 'express';
import { z } from 'zod';
import { exec, query } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok, camelize } from '../../utils/envelope';
import { validate } from '../../middleware/validate';
import { authMiddleware } from '../../middleware/auth';
import { publicReadLimiter, authReadLimiter } from '../../middleware/rateLimit';
import { BadRequestError, ForbiddenError, NotFoundError, UnauthorizedError } from '../../utils/errors';
import { productRepo } from '../products/repository';
import { pageMeta, parsePagination } from '../../utils/pagination';
import { sanitizeHtml } from '../../utils/sanitize';

const router = Router();

const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
});
const writeSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().trim().max(180).optional(),
  review: z.string().trim().max(4000).optional(),
});

// Public listing (approved only)
router.get(
  '/product/:productId',
  publicReadLimiter,
  validate({ params: z.object({ productId: z.coerce.number().int().positive() }), query: listQuerySchema }),
  asyncWrap(async (req, res) => {
    const { productId } = req.params as unknown as { productId: number };
    const { page, limit, offset } = parsePagination(req.query as unknown as z.infer<typeof listQuerySchema>);
    const total = await query<{ n: number }>(
      `SELECT COUNT(*) AS n FROM reviews WHERE product_id = :pid AND status = 'approved'`,
      { pid: productId },
    );
    const rows = await query(
      `SELECT r.*, u.name AS user_name FROM reviews r JOIN users u ON u.id = r.user_id
       WHERE r.product_id = :pid AND r.status = 'approved'
       ORDER BY r.created_at DESC LIMIT ${limit} OFFSET ${offset}`,
      { pid: productId },
    );
    res.json(ok(camelize(rows), pageMeta(page, limit, total[0]?.n ?? 0)));
  }),
);

// Testimonials for the homepage (approved, 5-star, most recent).
router.get('/testimonials', publicReadLimiter, asyncWrap(async (_req, res) => {
  const rows = await query(
    `SELECT r.rating, r.title, r.review, r.created_at, u.name AS user_name, p.name AS product_name
     FROM reviews r JOIN users u ON u.id = r.user_id JOIN products p ON p.id = r.product_id
     WHERE r.status = 'approved' AND r.rating >= 4
     ORDER BY r.created_at DESC LIMIT 8`,
  );
  res.json(ok(camelize(rows)));
}));

// Write review — verified purchaser only.
router.post(
  '/product/:productId',
  authMiddleware(), authReadLimiter,
  validate({ params: z.object({ productId: z.coerce.number().int().positive() }), body: writeSchema }),
  asyncWrap(async (req, res) => {
    if (!req.user) throw new UnauthorizedError();
    const productId = Number((req.params as unknown as { productId: number }).productId);

    // Verified-purchaser: user must have a delivered order containing this product.
    const purchase = await query<{ id: number }>(
      `SELECT o.id FROM orders o JOIN order_items oi ON oi.order_id = o.id
       WHERE o.user_id = :userId AND oi.product_id = :pid AND o.order_status = 'delivered'
       LIMIT 1`,
      { userId: req.user.id, pid: productId },
    );
    if (!purchase[0]) throw new ForbiddenError('You can only review products you have received.', 'NOT_VERIFIED_PURCHASER');

    const existing = await query<{ id: number }>(
      `SELECT id FROM reviews WHERE user_id = :u AND product_id = :p LIMIT 1`,
      { u: req.user.id, p: productId },
    );
    if (existing[0]) throw new BadRequestError('You have already reviewed this product.', {}, 'REVIEW_EXISTS');

    const body = req.body as z.infer<typeof writeSchema>;
    const result = await exec(
      `INSERT INTO reviews (product_id, user_id, order_id, rating, title, review, status)
       VALUES (:pid, :uid, :oid, :rating, :title, :review, 'pending')`,
      {
        pid: productId,
        uid: req.user.id,
        oid: purchase[0].id,
        rating: body.rating,
        title: body.title ? sanitizeHtml(body.title) : null,
        review: body.review ? sanitizeHtml(body.review) : null,
      },
    );
    await productRepo.recomputeRating(productId);
    res.status(201).json(ok({ id: result.insertId, status: 'pending' }));
  }),
);

router.delete('/:id', authMiddleware(), asyncWrap(async (req, res) => {
  if (!req.user) throw new UnauthorizedError();
  const rows = await query<{ user_id: number; product_id: number }>(
    `SELECT user_id, product_id FROM reviews WHERE id = :id LIMIT 1`, { id: req.params.id },
  );
  if (!rows[0]) throw new NotFoundError('Review not found.');
  if (rows[0].user_id !== req.user.id && req.user.role === 'customer') throw new ForbiddenError();
  await exec(`DELETE FROM reviews WHERE id = :id`, { id: req.params.id });
  await productRepo.recomputeRating(rows[0].product_id);
  res.json(ok({ removed: true }));
}));

export default router;
