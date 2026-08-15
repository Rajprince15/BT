import { Router } from 'express';
import { z } from 'zod';
import { query } from '../../config/db';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok, camelize } from '../../utils/envelope';
import { publicReadLimiter } from '../../middleware/rateLimit';
import { validate } from '../../middleware/validate';

const router = Router();

router.get(
  '/',
  publicReadLimiter,
  validate({ query: z.object({ placement: z.enum(['home_hero', 'home_promo', 'category', 'sidebar']).optional() }) }),
  asyncWrap(async (req, res) => {
    const placement = (req.query.placement as string) || undefined;
    const now = new Date();
    const rows = await query(
      `SELECT * FROM banners
       WHERE is_active = 1
         AND (start_at IS NULL OR start_at <= :now)
         AND (end_at IS NULL OR end_at >= :now)
         ${placement ? 'AND placement = :placement' : ''}
       ORDER BY sort_order ASC, id DESC`,
      { now, placement },
    );
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(ok(camelize(rows)));
  }),
);

export default router;
