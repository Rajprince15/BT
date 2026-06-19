import type { AxiosResponse } from 'axios';
import api from '@/lib/api';
import env from '@/lib/env';
import { products } from '@/mocks/products.mock';
import type { Product } from '@/types/Product';
import type { ApiResponse, ListResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

export type ProductListParams = {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  flag?: 'new_arrival' | 'best_seller';
  search?: string;
};

function applyFilters(items: Product[], params: ProductListParams) {
  let filtered = [...items];
  if (params.categoryId) {
    filtered = filtered.filter((item) => item.categoryId === params.categoryId);
  }

  if (params.flag) {
    const flagKey = params.flag === 'new_arrival' ? 'newArrival' : 'bestSeller';
    filtered = filtered.filter((item) => Boolean(item[flagKey]));
  }

  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (item) =>
        item.name.toLowerCase().includes(search) ||
        item.shortDescription?.toLowerCase().includes(search) ||
        item.description?.toLowerCase().includes(search)
    );
  }

  return filtered;
}

async function callApi<T>(path: string) {
  const response = await api.get<ApiResponse<T>>(path);
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const productService = {
  async list(params: ProductListParams = {}) {
    if (useMockService) {
      await mockDelay();
      const page = params.page ?? 1;
      const pageSize = params.pageSize ?? 12;
      const filtered = applyFilters(products, params);
      const start = (page - 1) * pageSize;
      const items = filtered.slice(start, start + pageSize);
      return {
        items,
        meta: {
          page,
          pageSize,
          total: filtered.length,
          totalPages: Math.max(1, Math.ceil(filtered.length / pageSize)),
        },
      };
    }

    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.categoryId) query.set('categoryId', String(params.categoryId));
    if (params.flag) query.set('flag', params.flag);
    if (params.search) query.set('search', params.search);

    return callApi<ListResponse<Product>>(`/products?${query.toString()}`);
  },

  async bySlug(slug: string) {
    if (useMockService) {
      await mockDelay();
      const product = products.find((item) => item.slug === slug);
      if (!product) {
        throw new Error(`Product not found for slug ${slug}`);
      }
      return product;
    }

    return callApi<Product>(`/products/${encodeURIComponent(slug)}`);
  },

  async related(productId: number) {
    if (useMockService) {
      await mockDelay();
      const product = products.find((item) => item.id === productId);
      if (!product) {
        return [];
      }
      return products.filter((item) => item.categoryId === product.categoryId && item.id !== product.id).slice(0, 6);
    }

    return callApi<Product[]>(`/products/${productId}/related`);
  },

  async search(query: string) {
    if (useMockService) {
      return this.list({ search: query, page: 1, pageSize: 24 });
    }

    return callApi<ListResponse<Product>>(`/products/search?query=${encodeURIComponent(query)}`);
  },

  async allSlugs() {
    if (useMockService) {
      await mockDelay();
      return products.map((item) => item.slug);
    }

    const result = await callApi<{ slugs: string[] }>('/products/slugs');
    return result.slugs;
  },
};

export default productService;
