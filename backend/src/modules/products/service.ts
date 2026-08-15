import { pageMeta, parsePagination } from '../../utils/pagination';
import { NotFoundError } from '../../utils/errors';
import { ensureUniqueSlug } from '../../utils/slug';
import { productRepo, type ProductImageRow, type ProductRow, type ProductVariantRow } from './repository';
import { categoryRepo } from '../categories/repository';
import type { ProductListQuery, UpsertProductInput, VariantInput } from './schema';

interface ProductSummary {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  sku: string;
  price: number;
  salePrice: number | null;
  stock: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  status: ProductRow['status'];
  ratingAvg: number;
  ratingCount: number;
  images: Array<{ id: number; imageUrl: string; altText: string | null; sortOrder: number }>;
}

interface ProductDetail extends ProductSummary {
  shortDescription: string | null;
  description: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  variants: Array<{ id: number; sku: string; size: string | null; color: string | null; price: number | null; stock: number }>;
  createdAt: Date;
  updatedAt: Date;
}

function toSummary(row: ProductRow, images: ProductImageRow[]): ProductSummary {
  const productImages = images
    .filter((image) => image.product_id === row.id)
    .map((image) => ({ id: image.id, imageUrl: image.image_url, altText: image.alt_text, sortOrder: image.sort_order }));
  return {
    id: row.id,
    categoryId: row.category_id,
    name: row.name,
    slug: row.slug,
    sku: row.sku,
    price: Number(row.price),
    salePrice: row.sale_price == null ? null : Number(row.sale_price),
    stock: row.stock,
    featured: !!row.featured,
    bestSeller: !!row.best_seller,
    newArrival: !!row.new_arrival,
    status: row.status,
    ratingAvg: Number(row.rating_avg),
    ratingCount: row.rating_count,
    images: productImages,
  };
}

function toDetail(row: ProductRow, images: ProductImageRow[], variants: ProductVariantRow[]): ProductDetail {
  return {
    ...toSummary(row, images),
    shortDescription: row.short_description,
    description: row.description,
    metaTitle: row.meta_title,
    metaDescription: row.meta_description,
    variants: variants
      .filter((variant) => variant.product_id === row.id)
      .map((variant) => ({
        id: variant.id,
        sku: variant.sku,
        size: variant.size,
        color: variant.color,
        price: variant.price == null ? null : Number(variant.price),
        stock: variant.stock,
      })),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function orderByClause(sort: ProductListQuery['sort']): string {
  switch (sort) {
    case 'price_asc': return 'ORDER BY COALESCE(sale_price, price) ASC, id DESC';
    case 'price_desc': return 'ORDER BY COALESCE(sale_price, price) DESC, id DESC';
    case 'rating': return 'ORDER BY rating_avg DESC, rating_count DESC, id DESC';
    case 'popular': return 'ORDER BY rating_count DESC, id DESC';
    default: return 'ORDER BY created_at DESC, id DESC';
  }
}

export const productService = {
  async listPublic(query: ProductListQuery) {
    const { page, limit, offset } = parsePagination({ page: query.page, limit: query.limit });
    const wheres: string[] = [`deleted_at IS NULL`, `status = 'published'`];
    const params: Record<string, unknown> = {};

    if (query.category) {
      const cat = await categoryRepo.findBySlug(query.category);
      if (!cat) return { items: [], meta: pageMeta(page, limit, 0) };
      wheres.push('category_id = :categoryId');
      params.categoryId = cat.id;
    }
    if (query.q) {
      wheres.push('MATCH(name, short_description, description) AGAINST (:q IN BOOLEAN MODE)');
      params.q = `${query.q.replace(/[+\-<>()~*"@]/g, ' ')}*`;
    }
    if (query.minPrice != null) { wheres.push('COALESCE(sale_price, price) >= :minPrice'); params.minPrice = query.minPrice; }
    if (query.maxPrice != null) { wheres.push('COALESCE(sale_price, price) <= :maxPrice'); params.maxPrice = query.maxPrice; }
    if (query.flag === 'featured') wheres.push('featured = 1');
    if (query.flag === 'best_seller') wheres.push('best_seller = 1');
    if (query.flag === 'new_arrival') wheres.push('new_arrival = 1');

    const where = `WHERE ${wheres.join(' AND ')}`;
    const total = await productRepo.count(where, params);
    const rows = await productRepo.list(where, params, orderByClause(query.sort), limit, offset);
    const images = await productRepo.imagesForProducts(rows.map((row) => row.id));
    return { items: rows.map((row) => toSummary(row, images)), meta: pageMeta(page, limit, total) };
  },

  async detailBySlug(slug: string) {
    const row = await productRepo.findBySlug(slug);
    if (!row || row.status !== 'published') throw new NotFoundError('Product not found.');
    const [images, variants] = await Promise.all([
      productRepo.imagesForProducts([row.id]),
      productRepo.variantsForProducts([row.id]),
    ]);
    return toDetail(row, images, variants);
  },

  async collection(key: string) {
    const flagMap: Record<string, ProductListQuery['flag']> = {
      'new-arrivals': 'new_arrival',
      'best-sellers': 'best_seller',
      featured: 'featured',
    };
    if (flagMap[key]) {
      const flag = flagMap[key];
      return this.listPublic({ page: 1, limit: 24, sort: 'newest', flag });
    }
    // Seasonal collections: match category or tag on name (safe fallback).
    return this.listPublic({ page: 1, limit: 24, sort: 'newest', q: key });
  },

  // ---------- admin ----------

  async adminList(query: ProductListQuery & { status?: ProductRow['status'] }) {
    const { page, limit, offset } = parsePagination({ page: query.page, limit: query.limit });
    const wheres = ['deleted_at IS NULL'];
    const params: Record<string, unknown> = {};
    if (query.status) { wheres.push('status = :status'); params.status = query.status; }
    if (query.q) { wheres.push('(name LIKE :q OR sku LIKE :q)'); params.q = `%${query.q}%`; }
    const where = `WHERE ${wheres.join(' AND ')}`;
    const total = await productRepo.count(where, params);
    const rows = await productRepo.list(where, params, orderByClause(query.sort), limit, offset);
    const images = await productRepo.imagesForProducts(rows.map((row) => row.id));
    return { items: rows.map((row) => toSummary(row, images)), meta: pageMeta(page, limit, total) };
  },

  async adminGet(id: number) {
    const row = await productRepo.findById(id);
    if (!row) throw new NotFoundError('Product not found.');
    const [images, variants] = await Promise.all([
      productRepo.imagesForProducts([id]),
      productRepo.variantsForProducts([id]),
    ]);
    return toDetail(row, images, variants);
  },

  async create(input: UpsertProductInput) {
    const slug = await ensureUniqueSlug(input.slug ?? input.name, productRepo.slugExists);
    const id = await productRepo.create({
      category_id: input.categoryId,
      name: input.name,
      slug,
      sku: input.sku,
      short_description: input.shortDescription ?? null,
      description: input.description ?? null,
      price: input.price,
      sale_price: input.salePrice ?? null,
      stock: input.stock,
      weight_grams: input.weightGrams ?? null,
      featured: input.featured ? 1 : 0,
      best_seller: input.bestSeller ? 1 : 0,
      new_arrival: input.newArrival ? 1 : 0,
      status: input.status,
      meta_title: input.metaTitle ?? null,
      meta_description: input.metaDescription ?? null,
    });
    return this.adminGet(id);
  },

  async update(id: number, input: Partial<UpsertProductInput>) {
    const row = await productRepo.findById(id);
    if (!row) throw new NotFoundError('Product not found.');
    const slug = input.slug ? await ensureUniqueSlug(input.slug, (s) => productRepo.slugExists(s, id)) : undefined;
    const patch: Partial<ProductRow> = {};
    if (input.categoryId != null) patch.category_id = input.categoryId;
    if (input.name != null) patch.name = input.name;
    if (slug) patch.slug = slug;
    if (input.sku != null) patch.sku = input.sku;
    if ('shortDescription' in input) patch.short_description = input.shortDescription ?? null;
    if ('description' in input) patch.description = input.description ?? null;
    if (input.price != null) patch.price = input.price;
    if ('salePrice' in input) patch.sale_price = input.salePrice ?? null;
    if (input.stock != null) patch.stock = input.stock;
    if (input.weightGrams != null) patch.weight_grams = input.weightGrams;
    if (input.featured != null) patch.featured = input.featured ? 1 : 0;
    if (input.bestSeller != null) patch.best_seller = input.bestSeller ? 1 : 0;
    if (input.newArrival != null) patch.new_arrival = input.newArrival ? 1 : 0;
    if (input.status) patch.status = input.status;
    if ('metaTitle' in input) patch.meta_title = input.metaTitle ?? null;
    if ('metaDescription' in input) patch.meta_description = input.metaDescription ?? null;
    await productRepo.patch(id, patch);
    return this.adminGet(id);
  },

  async remove(id: number) {
    const row = await productRepo.findById(id);
    if (!row) throw new NotFoundError();
    await productRepo.softDelete(id);
  },

  async publish(id: number, status: ProductRow['status']) {
    const row = await productRepo.findById(id);
    if (!row) throw new NotFoundError();
    await productRepo.patch(id, { status });
    return this.adminGet(id);
  },

  async adjustStock(id: number, delta: number) {
    const row = await productRepo.findById(id);
    if (!row) throw new NotFoundError();
    await productRepo.adjustStock(id, delta);
    return this.adminGet(id);
  },

  async addImage(productId: number, image: { secureUrl: string; publicId: string; alt?: string; sortOrder?: number }) {
    const row = await productRepo.findById(productId);
    if (!row) throw new NotFoundError();
    const count = await productRepo.countImages(productId);
    if (count >= 10) throw new NotFoundError('Maximum 10 images per product.');
    return productRepo.addImage(productId, {
      imageUrl: image.secureUrl,
      cloudId: image.publicId,
      altText: image.alt ?? null,
      sortOrder: image.sortOrder ?? count,
    });
  },

  async removeImage(imageId: number) {
    await productRepo.removeImage(imageId);
  },

  async createVariant(productId: number, input: VariantInput) {
    const row = await productRepo.findById(productId);
    if (!row) throw new NotFoundError();
    return productRepo.createVariant(productId, {
      sku: input.sku,
      size: input.size ?? null,
      color: input.color ?? null,
      price: input.price ?? null,
      stock: input.stock,
      is_active: input.isActive ? 1 : 0,
    });
  },

  async updateVariant(id: number, patch: Partial<VariantInput>) {
    const mapped: Partial<import('./repository').ProductVariantRow> = {};
    if (patch.sku != null) mapped.sku = patch.sku;
    if ('size' in patch) mapped.size = patch.size ?? null;
    if ('color' in patch) mapped.color = patch.color ?? null;
    if ('price' in patch) mapped.price = patch.price ?? null;
    if (patch.stock != null) mapped.stock = patch.stock;
    if (patch.isActive != null) mapped.is_active = patch.isActive ? 1 : 0;
    await productRepo.patchVariant(id, mapped);
  },

  async removeVariant(id: number) {
    await productRepo.removeVariant(id);
  },
};
