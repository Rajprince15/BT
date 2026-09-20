import { camelize } from '../../utils/envelope';
import { NotFoundError } from '../../utils/errors';
import { ensureUniqueSlug, slugify } from '../../utils/slug';
import { categoryRepo, type CategoryRow } from './repository';
import type { UpsertCategoryInput } from './schema';

export interface CategoryNode {
  id: number;
  parentId: number | null;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  children: CategoryNode[];
}

function toNode(row: CategoryRow): CategoryNode {
  return {
    id: row.id,
    parentId: row.parent_id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    imageUrl: row.image_url,
    sortOrder: row.sort_order,
    isActive: !!row.is_active,
    children: [],
  };
}

function buildTree(rows: CategoryRow[]): CategoryNode[] {
  const nodes = new Map<number, CategoryNode>();
  const roots: CategoryNode[] = [];
  for (const row of rows) nodes.set(row.id, toNode(row));
  for (const row of rows) {
    const node = nodes.get(row.id)!;
    if (row.parent_id && nodes.has(row.parent_id)) {
      nodes.get(row.parent_id)!.children.push(node);
    } else {
      roots.push(node);
    }
  }
  return roots;
}

export const categoryService = {
  async publicWithCounts() {
    const rows = await categoryRepo.publicWithCounts();
    const counts = new Map(rows.map((r) => [r.id, Number(r.product_count)]));
    const parentOf = new Map(rows.map((r) => [r.id, r.parent_id]));
    const depth = (id: number) => { let value = 0; let parent = parentOf.get(id); const seen = new Set<number>(); while (parent && !seen.has(parent)) { seen.add(parent); value += 1; parent = parentOf.get(parent); } return value; };
    for (const row of [...rows].sort((a, b) => depth(b.id) - depth(a.id))) {
      if (row.parent_id) counts.set(row.parent_id, (counts.get(row.parent_id) ?? 0) + (counts.get(row.id) ?? 0));
    }
    return rows.filter((r) => (counts.get(r.id) ?? 0) > 0).map((r) => ({ ...toNode(r), productCount: counts.get(r.id) }));
  },
  async publicTree() {
    const rows = await categoryRepo.listActive();
    return buildTree(rows);
  },
  async publicBySlug(slug: string) {
    const row = await categoryRepo.findBySlug(slug);
    if (!row || !row.is_active) throw new NotFoundError('Category not found.');
    const children = (await categoryRepo.listActive()).filter((c) => c.parent_id === row.id);
    return { ...toNode(row), children: children.map(toNode) };
  },
  async adminList() {
    return categoryRepo.listAll().then((rows) => rows.map((r) => camelize<CategoryNode>(r)));
  },
  async create(input: UpsertCategoryInput) {
    const slug = await ensureUniqueSlug(input.slug ?? input.name, categoryRepo.slugExists);
    const id = await categoryRepo.create({
      parent_id: input.parentId ?? null,
      name: input.name,
      slug,
      description: input.description ?? null,
      image_url: input.imageUrl ?? null,
      sort_order: input.sortOrder,
      is_active: input.isActive ? 1 : 0,
    });
    const row = await categoryRepo.findById(id);
    if (!row) throw new NotFoundError();
    return toNode(row);
  },
  async update(id: number, input: Partial<UpsertCategoryInput>) {
    const row = await categoryRepo.findById(id);
    if (!row) throw new NotFoundError('Category not found.');
    const nextSlug = input.slug ? await ensureUniqueSlug(input.slug, (s) => categoryRepo.slugExists(s, id)) : undefined;
    await categoryRepo.update(id, {
      parent_id: input.parentId ?? row.parent_id,
      name: input.name ?? row.name,
      slug: nextSlug ?? row.slug,
      description: input.description ?? row.description,
      image_url: input.imageUrl ?? row.image_url,
      sort_order: input.sortOrder ?? row.sort_order,
      is_active: input.isActive === undefined ? row.is_active : input.isActive ? 1 : 0,
    });
    const updated = await categoryRepo.findById(id);
    return toNode(updated!);
  },
  async remove(id: number) {
    const row = await categoryRepo.findById(id);
    if (!row) throw new NotFoundError('Category not found.');
    await categoryRepo.softDelete(id);
  },
  slugify,
};
