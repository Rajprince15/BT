import { Router } from 'express';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { validate } from '../../middleware/validate';
import { publicReadLimiter } from '../../middleware/rateLimit';
import { slugParamSchema } from './schema';
import { categoryService } from './service';

const router = Router();

router.get(
  '/',
  publicReadLimiter,
  asyncWrap(async (_req, res) => {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(ok(await categoryService.publicTree()));
  }),
);

router.get(
  '/:slug',
  publicReadLimiter,
  validate({ params: slugParamSchema }),
  asyncWrap(async (req, res) => {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    res.json(ok(await categoryService.publicBySlug(req.params.slug)));
  }),
);

export default router;
