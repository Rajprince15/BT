import { Router } from 'express';
import { asyncWrap } from '../../utils/asyncWrap';
import { ok } from '../../utils/envelope';
import { validate } from '../../middleware/validate';
import { publicReadLimiter } from '../../middleware/rateLimit';
import { collectionParamSchema, productListQuerySchema } from './schema';
import { slugParamSchema } from '../categories/schema';
import { productService } from './service';
import { categoryRepo } from '../categories/repository';
import { query } from '../../config/db';

const router = Router();

router.get('/filters', publicReadLimiter, asyncWrap(async (_req, res) => {
  const rows = await categoryRepo.publicWithCounts();
  const categories = rows.filter((r) => r.product_count > 0).map((r) => ({ id:r.id, parentId:r.parent_id, name:r.name, slug:r.slug, description:r.description, imageUrl:r.image_url, sortOrder:r.sort_order, isActive:!!r.is_active, productCount:Number(r.product_count), createdAt:r.created_at, updatedAt:r.updated_at }));
  const colors = await query<{value:string;count:number}>(`SELECT v.color value, COUNT(DISTINCT p.id) count FROM product_variants v JOIN products p ON p.id=v.product_id AND p.deleted_at IS NULL AND p.status='published' AND p.stock > 0 WHERE v.color IS NOT NULL AND v.is_active=1 GROUP BY v.color ORDER BY v.color`);
  const sizes = await query<{value:string;count:number}>(`SELECT v.size value, COUNT(DISTINCT p.id) count FROM product_variants v JOIN products p ON p.id=v.product_id AND p.deleted_at IS NULL AND p.status='published' AND p.stock > 0 WHERE v.size IS NOT NULL AND v.is_active=1 GROUP BY v.size ORDER BY v.size`);
  const price = await query<{min:number|null;max:number|null}>(`SELECT MIN(COALESCE(sale_price,price)) min, MAX(COALESCE(sale_price,price)) max FROM products WHERE deleted_at IS NULL AND status='published' AND stock > 0`);
  res.json(ok({ categories, colors, sizes, priceMin: price[0]?.min == null ? 0 : Math.floor(Number(price[0].min)), priceMax: price[0]?.max == null ? 0 : Math.ceil(Number(price[0].max)) }));
}));

router.get(
  '/',
  publicReadLimiter,
  validate({ query: productListQuerySchema }),
  asyncWrap(async (req, res) => {
    res.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=300');
    const result = await productService.listPublic(req.query as unknown as import('./schema').ProductListQuery);
    res.json(ok({ items: result.items, meta: result.meta, isEmpty: result.items.length === 0 }));
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
