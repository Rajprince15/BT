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
import PDFDocument from 'pdfkit';

const router = Router();

router.get('/filters', publicReadLimiter, asyncWrap(async (_req, res) => {
  const rows = await categoryRepo.publicWithCounts();
  const categories = rows.filter((r) => r.product_count > 0).map((r) => ({ id:r.id, parentId:r.parent_id, name:r.name, slug:r.slug, description:r.description, imageUrl:r.image_url, sortOrder:r.sort_order, isActive:!!r.is_active, productCount:Number(r.product_count), createdAt:r.created_at, updatedAt:r.updated_at }));
  const colors = await query<{value:string;count:number}>(`SELECT v.color value, COUNT(DISTINCT p.id) count FROM product_variants v JOIN products p ON p.id=v.product_id AND p.deleted_at IS NULL AND p.status='published' AND p.stock > 0 WHERE v.color IS NOT NULL AND v.is_active=1 GROUP BY v.color ORDER BY v.color`);
  const sizes = await query<{value:string;count:number}>(`SELECT v.size value, COUNT(DISTINCT p.id) count FROM product_variants v JOIN products p ON p.id=v.product_id AND p.deleted_at IS NULL AND p.status='published' AND p.stock > 0 WHERE v.size IS NOT NULL AND v.is_active=1 GROUP BY v.size ORDER BY v.size`);
  const price = await query<{min:number|null;max:number|null}>(`SELECT MIN(COALESCE(sale_price,price)) min, MAX(COALESCE(sale_price,price)) max FROM products WHERE deleted_at IS NULL AND status='published' AND stock > 0`);
  res.json(ok({ categories, colors, sizes, priceMin: price[0]?.min == null ? 0 : Math.floor(Number(price[0].min)), priceMax: price[0]?.max == null ? 0 : Math.ceil(Number(price[0].max)) }));
}));

/** Public, live catalogue. Products are queried at request time so future
 * published catalogue changes are included without regenerating a file. */
router.get('/catalogue.pdf', publicReadLimiter, asyncWrap(async (_req, res) => {
  const products = await query<{
    name: string; sku: string | null; price: number; sale_price: number | null;
    short_description: string | null; description: string | null; category_name: string;
  }>(`SELECT p.name, p.sku, p.price, p.sale_price, p.short_description, p.description,
            COALESCE(c.name, 'Textiles') AS category_name
       FROM products p LEFT JOIN categories c ON c.id = p.category_id
       WHERE p.deleted_at IS NULL AND p.status = 'published'
       ORDER BY c.sort_order, c.name, p.name`);

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename="bhavita-textiles-catalogue.pdf"');
  res.setHeader('Cache-Control', 'no-store');
  const doc = new PDFDocument({ size: 'A4', margin: 48, bufferPages: true });
  doc.pipe(res);
  const gold = '#AD8247'; const green = '#0C3832'; const ink = '#2A2620'; const cream = '#F9F4EC';
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(green);
  doc.fillColor(gold).font('Times-Roman').fontSize(13).text('BHAVITA TEXTILES', 48, 105, { characterSpacing: 3 });
  doc.fillColor(cream).font('Times-Roman').fontSize(36).text('Wholesale\nCatalogue', 48, 145, { lineGap: 3 });
  doc.moveDown(1.2).font('Helvetica').fontSize(11).fillColor('#E7DECE').text('Woven with tradition. Delivered at scale.\nA live selection of our published home-textile collection.');
  doc.fillColor(gold).fontSize(9).text(`Generated ${new Date().toLocaleDateString('en-IN')}`, 48, 690);
  let category = '';
  for (const product of products) {
    if (doc.y > 660) doc.addPage();
    if (category !== product.category_name) {
      category = product.category_name;
      doc.moveDown(1);
      doc.fillColor(green).font('Times-Roman').fontSize(22).text(category);
      doc.moveTo(48, doc.y + 7).lineTo(547, doc.y + 7).strokeColor(gold).lineWidth(0.7).stroke();
      doc.moveDown(1.1);
    }
    const y = doc.y;
    doc.roundedRect(48, y, 499, 76, 3).fillAndStroke('#F9F4EC', '#E7DECE');
    doc.fillColor(ink).font('Times-Roman').fontSize(15).text(product.name, 64, y + 13, { width: 295 });
    const copy = product.short_description ?? product.description ?? 'Premium home textile for wholesale supply.';
    doc.font('Helvetica').fontSize(8.5).fillColor('#706958').text(copy, 64, y + 35, { width: 295, height: 28, ellipsis: true });
    const price = Number(product.sale_price ?? product.price);
    doc.fillColor(gold).font('Times-Roman').fontSize(16).text(`₹${price.toLocaleString('en-IN')}`, 385, y + 18, { width: 145, align: 'right' });
    if (product.sku) doc.font('Helvetica').fontSize(7.5).fillColor('#706958').text(`SKU ${product.sku}`, 385, y + 45, { width: 145, align: 'right' });
    doc.y = y + 86;
  }
  const pages = doc.bufferedPageRange();
  for (let i = 0; i < pages.count; i += 1) {
    doc.switchToPage(i);
    doc.font('Helvetica').fontSize(8).fillColor('#706958').text(`Bhavita Textiles  |  ${i + 1} / ${pages.count}`, 48, 795, { width: 499, align: 'center' });
  }
  doc.end();
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
