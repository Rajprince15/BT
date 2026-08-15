import { z } from 'zod';

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const slugParamSchema = z.object({
  slug: z.string().min(1).max(140).regex(/^[a-z0-9-]+$/, 'Invalid slug format.'),
});

export const upsertCategorySchema = z.object({
  parentId: z.coerce.number().int().positive().nullable().optional(),
  name: z.string().trim().min(2).max(120),
  slug: z.string().trim().min(2).max(140).regex(/^[a-z0-9-]+$/).optional(),
  description: z.string().trim().max(2000).optional(),
  imageUrl: z.string().url().max(500).optional(),
  sortOrder: z.coerce.number().int().min(0).default(0),
  isActive: z.coerce.boolean().default(true),
});
export type UpsertCategoryInput = z.infer<typeof upsertCategorySchema>;
