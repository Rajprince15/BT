/**
 * Seed script — idempotent.
 *
 *   pnpm seed
 *
 * Seeds:
 *   - Super admin, admin, and a demo customer (from ADMIN_EMAIL / ADMIN_PASSWORD env)
 *   - A small catalog of categories, products, images, variants
 *   - A featured banner
 */
import bcrypt from 'bcrypt';
import { pool } from '../config/db';
import { env } from '../config/env';
import { logger } from '../config/logger';
import { slugify } from '../utils/slug';

const CATEGORIES = [
  { name: 'Bed Linen', description: 'Sheets, quilts, pillow covers.' },
  { name: 'Bath Linen', description: 'Towels, robes.' },
  { name: 'Table & Kitchen', description: 'Runners, napkins, aprons.' },
  { name: 'Living', description: 'Cushions, throws, rugs.' },
  { name: 'Curtains & Drapery', description: 'Handloom curtains.' },
];

const PRODUCTS = [
  ['Dohar Double Bed', 699, 'Size: 90x100 inches. Price: Rs 699 + GST.'],
  ['Fleno Woolen Set with Satin', 699, 'Includes: 1 Double Bedsheet; 2 Pillow Covers.'],
  ['6 Piece Embroidery set', 1999, 'Includes: 1 Comforter; 1 Double Bedsheet; 2 Cushions; 2 Pillow Covers.'],
  ['5 Piece Lace set', 699, 'Includes: 1 Double Bedsheet; 2 Cushions; 2 Pillow Covers.'],
  ['Snowberry 4 Piece set', 1349, 'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['6 Piece Comforter Set', 1399, 'Includes: 1 Comforter; 1 Double Bedsheet; 2 Cushions; 2 Pillow Covers.'],
  ['La Mour 4 Piece set', 1299, 'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['White Pearls 4 Piece set', 1299, 'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Plash 4 Piece set', 1299, 'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Occasion Dohar Double Bed Set', 1399, 'Includes: 1 AC Dohar Double bed; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Dior Comforter Double bed', 549, ''], ['Plano Woolen Set', 499, 'Includes: 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Celebration 4 Piece Set', 799, 'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Calvin Print 4 Piece Set', 999, 'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Calvin Solid 4 Piece Set', 1199, 'Includes: 1 Comforter; 1 Double Bedsheet; 2 Pillow Covers.'],
  ['Pum-Pum 5 Piece Set', 499, 'Includes: 1 Double Bedsheet; 2 Cushions; 2 Pillow Covers.'],
  ['Gulliver Super Soft', 270, 'Rs 270/KG + GST + BAG EXTRA'], ['Mink Blanket', 230, 'Rs 230/KG + GST + BAG EXTRA'], ['Mink Cloudy', 300, 'Rs 300/KG + GST + BAG EXTRA'],
  ['A Grade Towels', 455, 'Rs 455/kg. GST included.'], ['A Grade Bath Towel 500 gm', 230, '500 gm. Rs 230/pc. GST included.'], ['A Grade Bath Towel 650 gm', 300, '650 gm. Rs 300/pc. GST included.'], ["A Grade Women's / Baby Towel", 150, '24 x 48 inches approximately; average weight 330 gm. Rs 150/pc. GST included.'], ['A Grade Hand Towel', 78, '170 gm. Rs 78/pc. GST included.'], ['A Grade Face Towel', 23, '50 gm. Rs 23/pc. GST included.'], ['A Grade Beach Towel', 360, '800 gm. Rs 360/pc. GST included.'],
  ['B+ Grade Towels', 335, 'Rs 335/kg. GST included.'], ['B+ Grade Bath Towel 500 gm', 168, '500 gm. Rs 168/pc. GST included.'], ['B+ Grade Bath Towel 650 gm', 218, '650 gm. Rs 218/pc. GST included.'], ["B+ Grade Women's / Baby Towel", 117, '24 x 48 inches approximately; average weight 330 gm. Rs 117/pc. GST included.'], ['B+ Grade Hand Towel', 57, '170 gm. Rs 57/pc. GST included.'], ['B+ Grade Face Towel', 17, '50 gm. Rs 17/pc. GST included.'], ['B+ Grade Beach Towel', 268, '800 gm. Rs 268/pc. GST included.'],
].map(([name, price, description]) => ({ name: name as string, category: name.toString().includes('Towel') || name.toString().includes('Grade') ? 'Bath Linen' : 'Bed Linen', price: price as number, sku: null, description: description as string }));

async function main(): Promise<void> {
  logger.info('Starting seed…');

  const passwordHash = await bcrypt.hash('Bhavita@2026', env.BCRYPT_ROUNDS);

  await pool.query(
    `INSERT INTO users (name, email, phone, password_hash, role, email_verified, status)
     VALUES
       ('Super Admin', 'super@bhavita.test', NULL, ?, 'super_admin', 1, 'active'),
       ('Store Admin', 'admin@bhavita.test', NULL, ?, 'admin', 1, 'active'),
       ('Demo Customer', 'customer@bhavita.test', NULL, ?, 'customer', 1, 'active')
     ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash), status = 'active'`,
    [passwordHash, passwordHash, passwordHash],
  );
  logger.info('✓ Users seeded');

  const [catRows] = (await pool.query('SELECT id, name FROM categories')) as unknown as [Array<{ id: number; name: string }>, unknown];
  const existingCategoryNames = new Set(catRows.map((row) => row.name));
  for (const cat of CATEGORIES) {
    if (existingCategoryNames.has(cat.name)) continue;
    await pool.query(
      `INSERT INTO categories (name, slug, description, is_active) VALUES (?, ?, ?, 1)`,
      [cat.name, slugify(cat.name), cat.description],
    );
  }
  logger.info('✓ Categories seeded');

  const [catAll] = (await pool.query('SELECT id, name, slug FROM categories')) as unknown as [Array<{ id: number; name: string; slug: string }>, unknown];
  const categoryByName = new Map(catAll.map((row) => [row.name, row]));

  await pool.query(
    `UPDATE products SET deleted_at = CURRENT_TIMESTAMP
     WHERE sku IN ('BT-SANG-001', 'BT-MAHE-002', 'BT-KUTC-003', 'BT-BAGR-004', 'BT-CHAN-005')`,
  );

  for (const product of PRODUCTS) {
    const category = categoryByName.get(product.category);
    if (!category) continue;
    const slug = slugify(product.name);
    const [existing] = (await pool.query('SELECT id FROM products WHERE slug = ? LIMIT 1', [slug])) as unknown as [Array<{ id: number }>, unknown];
    if ((existing as unknown[]).length > 0) continue;
    const [insert] = await pool.query(
      `INSERT INTO products (category_id, name, slug, sku, short_description, description, price, stock, status, featured, new_arrival)
       VALUES (?, ?, ?, ?, ?, ?, ?, 25, 'published', 1, 1)`,
      [category.id, product.name, slug, product.sku, product.description, product.description, product.price],
    );
    const productId = (insert as { insertId: number }).insertId;
    await pool.query(
      `INSERT INTO product_images (product_id, image_url, alt_text, sort_order)
       VALUES (?, ?, ?, 0)`,
      [productId, `https://placehold.co/1200x1500/1A1611/F5EFE1?text=${encodeURIComponent(product.name)}`, product.name],
    );
    if (['Gulliver Super Soft', 'Mink Blanket', 'Mink Cloudy'].includes(product.name)) {
      const weights = ['1.3 kg', '1.5 kg', '2 kg', '2.5 kg', '3 kg', '4 kg', '5 kg', '6 kg', '7 kg', '8 kg'];
      for (const weight of weights) for (const bedType of ['Double Bed', 'Single Bed']) {
        await pool.query(
          `INSERT INTO product_variants (product_id, sku, weight, bed_type, stock, is_active) VALUES (?, NULL, ?, ?, 0, 1)`,
          [productId, weight, bedType],
        );
      }
    }
  }
  logger.info('✓ Products seeded');

  await pool.query(
    `INSERT INTO banners (title, subtitle, image_url, link_url, placement, sort_order, is_active)
     VALUES ('Handwoven Heritage', 'Discover the atelier''s winter capsule',
             'https://placehold.co/2000x800/1A1611/F5EFE1?text=Bhavita+Textiles',
             '/shop', 'home_hero', 0, 1)
     ON DUPLICATE KEY UPDATE updated_at = CURRENT_TIMESTAMP`,
  );
  logger.info('✓ Banners seeded');

  await pool.end();
  logger.info('Seed complete.');
}

main().catch((error) => {
  logger.error('Seed failed', { message: (error as Error).message, stack: (error as Error).stack });
  process.exitCode = 1;
});
