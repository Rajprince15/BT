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
  { name: 'Sanganeri Cotton Bedsheet', category: 'Bed Linen', price: 5400, sku: 'BT-SANG-001', description: 'Hand-block printed on 300 TC cotton.' },
  { name: 'Maheshwari Silk Runner', category: 'Table & Kitchen', price: 2800, sku: 'BT-MAHE-002', description: 'Featherweight silk-cotton weave.' },
  { name: 'Kutch Mirror Cushion', category: 'Living', price: 1900, sku: 'BT-KUTC-003', description: 'Hand-mirrored square cushion cover.' },
  { name: 'Bagru Indigo Throw', category: 'Living', price: 4200, sku: 'BT-BAGR-004', description: 'Deep indigo natural dye.' },
  { name: 'Chanderi Curtain Pair', category: 'Curtains & Drapery', price: 8900, sku: 'BT-CHAN-005', description: 'Sheer weave, gold-thread border.' },
];

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

  for (const product of PRODUCTS) {
    const category = categoryByName.get(product.category);
    if (!category) continue;
    const slug = slugify(product.name);
    const [existing] = (await pool.query('SELECT id FROM products WHERE sku = ? LIMIT 1', [product.sku])) as unknown as [Array<{ id: number }>, unknown];
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
