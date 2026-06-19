import api from '@/lib/api';
import { products } from '@/mocks/products.mock';
import type { Product, ProductStatus } from '@/types/Product';
import type { ApiResponse, ListResponse } from '@/types/api';
import { simulateLatency, simulateErrorRate, useMockService, paginate } from '@/services/_mock-runtime';

export interface AdminProductListParams {
  page?: number;
  pageSize?: number;
  status?: ProductStatus;
  categoryId?: number;
  search?: string;
}

export interface AdminProductPayload {
  name: string;
  slug: string;
  sku: string;
  categoryId: number;
  shortDescription?: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock: number;
  featured?: boolean;
  bestSeller?: boolean;
  newArrival?: boolean;
  status?: ProductStatus;
}

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' | 'delete' = 'get') {
  const response = await api.request<ApiResponse<T>>({ url: path, method, data: payload });
  if (!response.data.success) {
    throw new Error(response.data.error.message);
  }
  return response.data.data;
}

export const adminProductService = {
  async list(params: AdminProductListParams = {}) {
    if (useMockService) {
      await simulateLatency();
      simulateErrorRate();
      let items = [...products];
      if (params.status) items = items.filter((p) => p.status === params.status);
      if (params.categoryId) items = items.filter((p) => p.categoryId === params.categoryId);
      if (params.search) {
        const q = params.search.toLowerCase();
        items = items.filter((p) => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
      }
      return paginate(items, params.page ?? 1, params.pageSize ?? 20);
    }
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.pageSize) query.set('pageSize', String(params.pageSize));
    if (params.status) query.set('status', params.status);
    if (params.categoryId) query.set('categoryId', String(params.categoryId));
    if (params.search) query.set('search', params.search);
    return callApi<ListResponse<Product>>(`/admin/products?${query.toString()}`);
  },

  async byId(id: number) {
    if (useMockService) {
      await simulateLatency();
      const p = products.find((item) => item.id === id);
      if (!p) throw new Error('Product not found');
      return p;
    }
    return callApi<Product>(`/admin/products/${id}`);
  },

  async create(payload: AdminProductPayload) {
    if (useMockService) {
      await simulateLatency();
      const nextId = Math.max(0, ...products.map((p) => p.id)) + 1;
      const now = new Date().toISOString();
      const newProduct: Product = {
        id: nextId,
        categoryId: payload.categoryId,
        name: payload.name,
        slug: payload.slug,
        sku: payload.sku,
        shortDescription: payload.shortDescription,
        description: payload.description,
        price: payload.price,
        salePrice: payload.salePrice,
        stock: payload.stock,
        featured: !!payload.featured,
        bestSeller: !!payload.bestSeller,
        newArrival: !!payload.newArrival,
        status: payload.status ?? 'draft',
        ratingAvg: 0,
        ratingCount: 0,
        createdAt: now,
        updatedAt: now,
        images: [],
        variants: [],
        aggregateRating: 0,
        reviewCount: 0,
      };
      products.push(newProduct);
      return newProduct;
    }
    return callApi<Product>('/admin/products', payload, 'post');
  },

  async update(id: number, payload: Partial<AdminProductPayload>) {
    if (useMockService) {
      await simulateLatency();
      const p = products.find((item) => item.id === id);
      if (!p) throw new Error('Product not found');
      Object.assign(p, payload, { updatedAt: new Date().toISOString() });
      return p;
    }
    return callApi<Product>(`/admin/products/${id}`, payload, 'patch');
  },

  async remove(id: number) {
    if (useMockService) {
      await simulateLatency();
      const i = products.findIndex((p) => p.id === id);
      if (i >= 0) products.splice(i, 1);
      return { success: true };
    }
    return callApi<{ success: boolean }>(`/admin/products/${id}`, undefined, 'delete');
  },
};

export default adminProductService;
