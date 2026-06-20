import api from '@/lib/api';
import { products } from '@/mocks/products.mock';
import { categories } from '@/mocks/categories.mock';
import type { Product } from '@/types/Product';
import type { ApiResponse, ListResponse } from '@/types/api';
import { mockDelay, useMockService, paginate, simulateErrorRate } from '@/services/_mock-runtime';

/* -------------------------------------------------------------------------- */
/* PHASE-4 service contract (mock + real share it).                           */
/* -------------------------------------------------------------------------- */
export type ProductSort = 'new' | 'price_asc' | 'price_desc' | 'best_sellers' | 'rating';
export type ProductFlag = 'new_arrival' | 'best_seller' | 'featured';

export interface ProductListParams {
  /** Canonical (Phase 4): category slug + descendants. */
  category?: string;
  /** Free-text search. */
  q?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  sort?: ProductSort;
  page?: number;
  limit?: number;
  flag?: ProductFlag;
  /** True → in-stock products only. */
  inStock?: boolean;

  /* --- Back-compat aliases used by Phase 3 home sections (do not remove) --- */
  categoryId?: number;
  pageSize?: number;
  search?: string;
}

export type CollectionKey =
  | 'new-arrivals'
  | 'best-sellers'
  | 'featured'
  | 'sale'
  | 'summer-collection'
  | 'winter-collection'
  | 'festive-collection'
  | 'wedding-collection';

/* -------------------------------------------------------------------------- */
/* helpers                                                                    */
/* -------------------------------------------------------------------------- */
function descendantsOf(slug: string): Set<number> {
  const start = categories.find((c) => c.slug === slug);
  if (!start) return new Set();
  const ids = new Set<number>([start.id]);
  let added = true;
  while (added) {
    added = false;
    for (const c of categories) {
      if (c.parentId && ids.has(c.parentId) && !ids.has(c.id)) {
        ids.add(c.id);
        added = true;
      }
    }
  }
  return ids;
}

function finalPrice(p: Product): number {
  return typeof p.salePrice === 'number' && p.salePrice < p.price ? p.salePrice : p.price;
}

function matchesVariant(p: Product, color?: string, size?: string): boolean {
  if (!color && !size) return true;
  return p.variants.some((v) => {
    const colorOk = color ? (v.color ?? '').toLowerCase() === color.toLowerCase() : true;
    const sizeOk = size ? (v.size ?? '').toLowerCase() === size.toLowerCase() : true;
    return colorOk && sizeOk;
  });
}

function applyFilters(items: Product[], params: ProductListParams): Product[] {
  let out = items.filter((p) => p.status === 'published');

  // category — slug-based (preferred) OR id-based (back-compat)
  if (params.category) {
    const ids = descendantsOf(params.category);
    if (ids.size > 0) out = out.filter((p) => ids.has(p.categoryId));
    else out = [];
  } else if (params.categoryId) {
    out = out.filter((p) => p.categoryId === params.categoryId);
  }

  // free-text
  const q = (params.q ?? params.search)?.trim().toLowerCase();
  if (q) {
    out = out.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.shortDescription?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q),
    );
  }

  // price
  if (typeof params.minPrice === 'number') out = out.filter((p) => finalPrice(p) >= params.minPrice!);
  if (typeof params.maxPrice === 'number') out = out.filter((p) => finalPrice(p) <= params.maxPrice!);

  // color / size (variant join)
  if (params.color || params.size) out = out.filter((p) => matchesVariant(p, params.color, params.size));

  // flags
  if (params.flag === 'new_arrival') out = out.filter((p) => p.newArrival);
  if (params.flag === 'best_seller') out = out.filter((p) => p.bestSeller);
  if (params.flag === 'featured') out = out.filter((p) => p.featured);

  // availability
  if (params.inStock) out = out.filter((p) => p.stock > 0);

  // sort
  switch (params.sort) {
    case 'price_asc':
      out.sort((a, b) => finalPrice(a) - finalPrice(b));
      break;
    case 'price_desc':
      out.sort((a, b) => finalPrice(b) - finalPrice(a));
      break;
    case 'best_sellers':
      out.sort(
        (a, b) =>
          Number(b.bestSeller) - Number(a.bestSeller) || b.ratingCount - a.ratingCount,
      );
      break;
    case 'rating':
      out.sort((a, b) => b.ratingAvg - a.ratingAvg || b.ratingCount - a.ratingCount);
      break;
    case 'new':
    default:
      // newest-first by id (mock equivalent of created_at desc)
      out.sort((a, b) => b.id - a.id);
      break;
  }

  return out;
}

async function callApi<T>(path: string): Promise<T> {
  const response = await api.get<ApiResponse<T>>(path);
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

function buildQuery(params: ProductListParams): string {
  const qs = new URLSearchParams();
  if (params.category) qs.set('category', params.category);
  if (params.categoryId) qs.set('categoryId', String(params.categoryId));
  if (params.q ?? params.search) qs.set('q', (params.q ?? params.search)!);
  if (typeof params.minPrice === 'number') qs.set('minPrice', String(params.minPrice));
  if (typeof params.maxPrice === 'number') qs.set('maxPrice', String(params.maxPrice));
  if (params.color) qs.set('color', params.color);
  if (params.size) qs.set('size', params.size);
  if (params.sort) qs.set('sort', params.sort);
  if (params.flag) qs.set('flag', params.flag);
  if (params.inStock) qs.set('inStock', 'true');
  if (params.page) qs.set('page', String(params.page));
  const limit = params.limit ?? params.pageSize;
  if (limit) qs.set('limit', String(limit));
  return qs.toString();
}

/* -------------------------------------------------------------------------- */
/* service                                                                    */
/* -------------------------------------------------------------------------- */
export const productService = {
  async list(params: ProductListParams = {}): Promise<ListResponse<Product>> {
    if (useMockService) {
      await mockDelay();
      simulateErrorRate();
      const limit = params.limit ?? params.pageSize ?? 12;
      const filtered = applyFilters(products, params);
      return paginate(filtered, params.page ?? 1, limit);
    }
    return callApi<ListResponse<Product>>(`/products?${buildQuery(params)}`);
  },

  async bySlug(slug: string): Promise<Product> {
    if (useMockService) {
      await mockDelay();
      const product = products.find((item) => item.slug === slug);
      if (!product) throw new Error(`Product not found for slug ${slug}`);
      return product;
    }
    return callApi<Product>(`/products/${encodeURIComponent(slug)}`);
  },

  async related(productId: number): Promise<Product[]> {
    if (useMockService) {
      await mockDelay();
      const product = products.find((item) => item.id === productId);
      if (!product) return [];
      return products
        .filter((item) => item.categoryId === product.categoryId && item.id !== product.id)
        .slice(0, 6);
    }
    return callApi<Product[]>(`/products/${productId}/related`);
  },

  async search(query: string): Promise<ListResponse<Product>> {
    return this.list({ q: query, page: 1, limit: 24, sort: 'new' });
  },

  async allSlugs(): Promise<string[]> {
    if (useMockService) {
      await mockDelay();
      return products.map((item) => item.slug);
    }
    const result = await callApi<{ slugs: string[] }>('/products/slugs');
    return result.slugs;
  },

  /** Special Collections route helper. */
  async byCollection(
    key: CollectionKey,
    extra: Omit<ProductListParams, 'flag'> = {},
  ): Promise<ListResponse<Product>> {
    const params: ProductListParams = { ...extra };
    switch (key) {
      case 'new-arrivals':
        params.flag = 'new_arrival';
        break;
      case 'best-sellers':
        params.flag = 'best_seller';
        break;
      case 'featured':
        params.flag = 'featured';
        break;
      case 'sale':
        // mock-side: items with a salePrice; backend would set a flag/filter.
        if (useMockService) {
          await mockDelay();
          const limit = extra.limit ?? extra.pageSize ?? 12;
          const onSale = products.filter(
            (p) => typeof p.salePrice === 'number' && p.salePrice! < p.price,
          );
          const filtered = applyFilters(onSale, params);
          return paginate(filtered, extra.page ?? 1, limit);
        }
        break;
      case 'summer-collection':
      case 'winter-collection':
      case 'festive-collection':
      case 'wedding-collection':
        params.category = key;
        break;
    }
    return this.list(params);
  },

  /** Distinct facets derived from current catalogue (mock). Backend will return a real aggregation. */
  async facets(params: Omit<ProductListParams, 'page' | 'limit'> = {}): Promise<{
    colors: string[];
    sizes: string[];
    priceMin: number;
    priceMax: number;
  }> {
    if (useMockService) {
      await mockDelay();
      const filtered = applyFilters(products, { ...params, page: 1, limit: 9999 });
      const colors = new Set<string>();
      const sizes = new Set<string>();
      let lo = Number.POSITIVE_INFINITY;
      let hi = 0;
      for (const p of filtered) {
        for (const v of p.variants) {
          if (v.color) colors.add(v.color);
          if (v.size) sizes.add(v.size);
        }
        const fp = finalPrice(p);
        if (fp < lo) lo = fp;
        if (fp > hi) hi = fp;
      }
      return {
        colors: [...colors].sort(),
        sizes: [...sizes].sort(),
        priceMin: Number.isFinite(lo) ? Math.floor(lo) : 0,
        priceMax: hi > 0 ? Math.ceil(hi) : 0,
      };
    }
    return callApi<{ colors: string[]; sizes: string[]; priceMin: number; priceMax: number }>(
      `/products/facets?${buildQuery(params)}`,
    );
  },
};

export default productService;
