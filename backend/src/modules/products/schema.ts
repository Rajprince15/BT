import { z } from 'zod';

export const productListQuerySchema = z.object({
  category: z.string().optional(),           // slug
  q: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  color: z.string().optional(),
  size: z.string().optional(),
  flag: z.enum(['featured', 'best_seller', 'new_arrival']).optional(),
  sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating', 'popular']).default('newest'),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(24),
});
export type ProductListQuery = z.infer<typeof productListQuerySchema>;

export const collectionParamSchema = z.object({
  key: z.enum(['new-arrivals', 'best-sellers', 'featured', 'summer', 'winter', 'festive', 'wedding']),
});

export const upsertProductSchema = z.object({
  name: z.string().trim().min(2).max(200),
  slug: z.string().trim().max(220).regex(/^[a-z0-9-]+$/).optional(),
  sku: z.string().trim().min(1).max(80),
  categoryId: z.coerce.number().int().positive(),
  shortDescription: z.string().max(500).optional(),
  description: z.string().max(20000).optional(),
  price: z.coerce.number().min(0),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0),
  weightGrams: z.coerce.number().int().min(0).optional(),
  featured: z.coerce.boolean().default(false),
  bestSeller: z.coerce.boolean().default(false),
  newArrival: z.coerce.boolean().default(false),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
  metaTitle: z.string().max(180).optional(),
  metaDescription: z.string().max(320).optional(),
});
export type UpsertProductInput = z.infer<typeof upsertProductSchema>;

export const variantSchema = z.object({
  sku: z.string().trim().min(1).max(80),
  size: z.string().max(40).optional(),
  color: z.string().max(40).optional(),
  price: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});
export type VariantInput = z.infer<typeof variantSchema>;

export const stockAdjustSchema = z.object({
  delta: z.coerce.number().int(),
  reason: z.string().max(200).optional(),
});

export const publishSchema = z.object({
  status: z.enum(['draft', 'published', 'archived']),
});
