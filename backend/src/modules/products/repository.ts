import { exec, query } from '../../config/db';

export interface ProductRow {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  sku: string;
  short_description: string | null;
  description: string | null;
  price: number;
  sale_price: number | null;
  stock: number;
  weight_grams: number | null;
  featured: 0 | 1;
  best_seller: 0 | 1;
  new_arrival: 0 | 1;
  status: 'draft' | 'published' | 'archived';
  rating_avg: number;
  rating_count: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export interface ProductImageRow {
  id: number;
  product_id: number;
  image_url: string;
  cloud_id: string | null;
  alt_text: string | null;
  sort_order: number;
  created_at: Date;
}

export interface ProductVariantRow {
  id: number;
  product_id: number;
  sku: string;
  size: string | null;
  color: string | null;
  price: number | null;
  stock: number;
  is_active: 0 | 1;
  created_at: Date;
  updated_at: Date;
}

export const productRepo = {
  async findBySlug(slug: string): Promise<ProductRow | undefined> {
    const rows = await query<ProductRow>(
      `SELECT * FROM products WHERE slug = :slug AND deleted_at IS NULL LIMIT 1`,
      { slug },
    );
    return rows[0];
  },
  async findById(id: number): Promise<ProductRow | undefined> {
    const rows = await query<ProductRow>(
      `SELECT * FROM products WHERE id = :id AND deleted_at IS NULL LIMIT 1`,
      { id },
    );
    return rows[0];
  },
  async imagesForProducts(productIds: number[]): Promise<ProductImageRow[]> {
    if (productIds.length === 0) return [];
    const placeholders = productIds.map(() => '?').join(',');
    return query<ProductImageRow>(
      `SELECT * FROM product_images WHERE product_id IN (${placeholders}) ORDER BY sort_order, id`,
      productIds,
    );
  },
  async variantsForProducts(productIds: number[]): Promise<ProductVariantRow[]> {
    if (productIds.length === 0) return [];
    const placeholders = productIds.map(() => '?').join(',');
    return query<ProductVariantRow>(
      `SELECT * FROM product_variants WHERE product_id IN (${placeholders}) AND is_active = 1 ORDER BY id`,
      productIds,
    );
  },
  async slugExists(slug: string, ignoreId?: number): Promise<boolean> {
    const rows = await query<{ id: number }>(
      `SELECT id FROM products WHERE slug = :slug AND deleted_at IS NULL ${ignoreId ? 'AND id <> :ignore' : ''} LIMIT 1`,
      { slug, ignore: ignoreId },
    );
    return rows.length > 0;
  },
  async count(where: string, params: Record<string, unknown>): Promise<number> {
    const rows = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM products ${where}`, params);
    return rows[0]?.n ?? 0;
  },
  async list(where: string, params: Record<string, unknown>, orderBy: string, limit: number, offset: number): Promise<ProductRow[]> {
    return query<ProductRow>(
      `SELECT * FROM products ${where} ${orderBy} LIMIT ${limit} OFFSET ${offset}`,
      params,
    );
  },
  async create(input: Omit<ProductRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at' | 'rating_avg' | 'rating_count'>): Promise<number> {
    const result = await exec(
      `INSERT INTO products
       (category_id, name, slug, sku, short_description, description, price, sale_price, stock, weight_grams,
        featured, best_seller, new_arrival, status, meta_title, meta_description)
       VALUES (:categoryId, :name, :slug, :sku, :shortDescription, :description, :price, :salePrice, :stock, :weightGrams,
               :featured, :bestSeller, :newArrival, :status, :metaTitle, :metaDescription)`,
      {
        categoryId: input.category_id,
        name: input.name,
        slug: input.slug,
        sku: input.sku,
        shortDescription: input.short_description,
        description: input.description,
        price: input.price,
        salePrice: input.sale_price,
        stock: input.stock,
        weightGrams: input.weight_grams,
        featured: input.featured,
        bestSeller: input.best_seller,
        newArrival: input.new_arrival,
        status: input.status,
        metaTitle: input.meta_title,
        metaDescription: input.meta_description,
      },
    );
    return result.insertId;
  },
  async patch(id: number, patch: Partial<ProductRow>): Promise<void> {
    const cols: string[] = [];
    const params: Record<string, unknown> = { id };
    for (const [k, v] of Object.entries(patch)) {
      cols.push(`\`${k}\` = :${k}`);
      params[k] = v;
    }
    if (!cols.length) return;
    await exec(`UPDATE products SET ${cols.join(', ')} WHERE id = :id`, params);
  },
  async softDelete(id: number): Promise<void> {
    await exec(`UPDATE products SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id`, { id });
  },
  async addImage(productId: number, image: { imageUrl: string; cloudId: string | null; altText: string | null; sortOrder: number }): Promise<number> {
    const result = await exec(
      `INSERT INTO product_images (product_id, image_url, cloud_id, alt_text, sort_order)
       VALUES (:productId, :imageUrl, :cloudId, :altText, :sortOrder)`,
      { productId, ...image },
    );
    return result.insertId;
  },
  async removeImage(id: number): Promise<void> {
    await exec(`DELETE FROM product_images WHERE id = :id`, { id });
  },
  async countImages(productId: number): Promise<number> {
    const rows = await query<{ n: number }>(`SELECT COUNT(*) AS n FROM product_images WHERE product_id = :id`, { id: productId });
    return rows[0]?.n ?? 0;
  },
  async createVariant(productId: number, input: Omit<ProductVariantRow, 'id' | 'product_id' | 'created_at' | 'updated_at'>): Promise<number> {
    const result = await exec(
      `INSERT INTO product_variants (product_id, sku, size, color, price, stock, is_active)
       VALUES (:productId, :sku, :size, :color, :price, :stock, :isActive)`,
      { productId, ...input },
    );
    return result.insertId;
  },
  async patchVariant(id: number, patch: Partial<ProductVariantRow>): Promise<void> {
    const cols: string[] = [];
    const params: Record<string, unknown> = { id };
    for (const [k, v] of Object.entries(patch)) {
      cols.push(`\`${k}\` = :${k}`);
      params[k] = v;
    }
    if (!cols.length) return;
    await exec(`UPDATE product_variants SET ${cols.join(', ')} WHERE id = :id`, params);
  },
  async removeVariant(id: number): Promise<void> {
    await exec(`DELETE FROM product_variants WHERE id = :id`, { id });
  },
  async adjustStock(id: number, delta: number): Promise<void> {
    await exec(`UPDATE products SET stock = GREATEST(0, stock + :delta) WHERE id = :id`, { delta, id });
  },
  async recomputeRating(productId: number): Promise<void> {
    await exec(
      `UPDATE products p
       SET p.rating_avg = COALESCE((SELECT ROUND(AVG(rating),2) FROM reviews WHERE product_id = p.id AND status = 'approved'), 0),
           p.rating_count = (SELECT COUNT(*) FROM reviews WHERE product_id = p.id AND status = 'approved')
       WHERE p.id = :id`,
      { id: productId },
    );
  },
};
