import type { Product } from '@/types/Product';
import type { Category } from '@/types/Category';

export interface FilterValue { value: string; count: number }
export interface AvailableFilters {
  categories: Array<Category & { productCount: number }>;
  colors: FilterValue[];
  sizes: FilterValue[];
  priceMin: number;
  priceMax: number;
}

const priceOf = (p: Product) => typeof p.salePrice === 'number' && p.salePrice < p.price ? p.salePrice : p.price;

export function getAvailableFilters(products: Product[], taxonomy: Category[]): AvailableFilters {
  const available = products.filter((p) => p.status === 'published' && p.stock > 0);
  const count = new Map<number, number>();
  // Walk only child links and track visited IDs. The previous recursive
  // implementation included the starting node in its own children and could
  // recurse forever when a category referenced itself (directly or indirectly).
  const descendants = (id: number): Set<number> => {
    const result = new Set<number>([id]);
    const pending = [id];
    while (pending.length) {
      const parentId = pending.pop()!;
      for (const category of taxonomy) {
        if (category.parentId === parentId && !result.has(category.id)) {
          result.add(category.id);
          pending.push(category.id);
        }
      }
    }
    return result;
  };
  taxonomy.forEach((c) => {
    const ids = descendants(c.id);
    count.set(c.id, available.filter((p) => ids.has(p.categoryId)).length);
  });
  const categories = taxonomy.filter((c) => (count.get(c.id) ?? 0) > 0).map((c) => ({ ...c, productCount: count.get(c.id)! }));
  const values = (key: 'color' | 'size') => {
    const counts = new Map<string, number>();
    available.forEach((p) => p.variants.forEach((v) => { const value = v[key]; if (value) counts.set(value, (counts.get(value) ?? 0) + 1); }));
    return [...counts].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value));
  };
  const prices = available.map(priceOf);
  return { categories, colors: values('color'), sizes: values('size'), priceMin: prices.length ? Math.floor(Math.min(...prices)) : 0, priceMax: prices.length ? Math.ceil(Math.max(...prices)) : 0 };
}
