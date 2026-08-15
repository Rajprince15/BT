import { Router } from 'express';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { validate } from '../../middleware/validate';
import { publicReadLimiter } from '../../middleware/rateLimit';
import { collectionParamSchema, productListQuerySchema } from './schema';
import { slugParamSchema } from '../categories/schema';
import { productService } from './service';

const router = Router();

router.get(
  '/',
  publicReadLimiter,
  validate({ query: productListQuerySchema }),
  asyncWrap(async (req, res) => {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    const result = await productService.listPublic(req.query as unknown as import('./schema').ProductListQuery);
    res.json(ok(result.items, result.meta));
  }),
);

router.get(
  '/:slug',
  publicReadLimiter,
  validate({ params: slugParamSchema }),
  asyncWrap(async (req, res) => {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    const product = await productService.detailBySlug(req.params.slug);
    res.json(ok(product));
  }),
);

// mounted under /api/collections in routes/index.ts as well; :key resolves either way
router.get(
  '/collection/:key',
  publicReadLimiter,
  validate({ params: collectionParamSchema }),
  asyncWrap(async (req, res) => {
    const result = await productService.collection(req.params.key);
    res.json(ok(result.items, result.meta));
  }),
);

export default router;
