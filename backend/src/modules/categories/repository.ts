import { exec, query, withTransaction } from '../../config/db';
import type { PoolConnection } from 'mysql2/promise';

export interface CategoryRow {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  sort_order: number;
  is_active: 0 | 1;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
}

export const categoryRepo = {
  async listActive(): Promise<CategoryRow[]> {
    return query<CategoryRow>(
      `SELECT * FROM categories WHERE deleted_at IS NULL AND is_active = 1 ORDER BY sort_order, name`,
    );
  },
  async listAll(): Promise<CategoryRow[]> {
    return query<CategoryRow>(`SELECT * FROM categories WHERE deleted_at IS NULL ORDER BY sort_order, name`);
  },
  async findBySlug(slug: string): Promise<CategoryRow | undefined> {
    const rows = await query<CategoryRow>(
      `SELECT * FROM categories WHERE slug = :slug AND deleted_at IS NULL LIMIT 1`,
      { slug },
    );
    return rows[0];
  },
  async findById(id: number): Promise<CategoryRow | undefined> {
    const rows = await query<CategoryRow>(
      `SELECT * FROM categories WHERE id = :id AND deleted_at IS NULL LIMIT 1`,
      { id },
    );
    return rows[0];
  },
  async slugExists(slug: string, ignoreId?: number): Promise<boolean> {
    const rows = await query<{ id: number }>(
      `SELECT id FROM categories WHERE slug = :slug AND deleted_at IS NULL ${ignoreId ? 'AND id <> :ignore' : ''} LIMIT 1`,
      { slug, ignore: ignoreId },
    );
    return rows.length > 0;
  },
  async create(input: Omit<CategoryRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>): Promise<number> {
    const result = await exec(
      `INSERT INTO categories (parent_id, name, slug, description, image_url, sort_order, is_active)
       VALUES (:parentId, :name, :slug, :description, :imageUrl, :sortOrder, :isActive)`,
      {
        parentId: input.parent_id,
        name: input.name,
        slug: input.slug,
        description: input.description,
        imageUrl: input.image_url,
        sortOrder: input.sort_order,
        isActive: input.is_active,
      },
    );
    return result.insertId;
  },
  async update(id: number, patch: Partial<Omit<CategoryRow, 'id' | 'created_at' | 'updated_at' | 'deleted_at'>>): Promise<void> {
    const fields: string[] = [];
    const params: Record<string, unknown> = { id };
    for (const [key, value] of Object.entries(patch)) {
      fields.push(`\`${key}\` = :${key}`);
      params[key] = value;
    }
    if (fields.length === 0) return;
    await exec(`UPDATE categories SET ${fields.join(', ')} WHERE id = :id`, params);
  },
  async softDelete(id: number, conn?: PoolConnection): Promise<void> {
    const runner = conn ?? { execute: exec } as never;
    if (conn) {
      await conn.execute(`UPDATE categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [id]);
    } else {
      await exec(`UPDATE categories SET deleted_at = CURRENT_TIMESTAMP WHERE id = :id`, { id });
      void runner;
    }
  },
  withTransaction,
};
