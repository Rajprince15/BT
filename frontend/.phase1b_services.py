from pathlib import Path
import textwrap

base = Path(__file__).resolve().parent

files = {
    'src/mocks/_session.ts': textwrap.dedent('''
        import { User } from '@/types/User';
        import { users } from '@/mocks/users.mock';

        export interface MockSession {
          userId: number | null;
          accessToken: string | null;
        }

        export const session: MockSession = {
          userId: users[0]?.id ?? null,
          accessToken: 'mock-session-token',
        };

        export function setSession(userId: number | null, accessToken: string | null) {
          session.userId = userId;
          session.accessToken = accessToken;
        }

        export function getCurrentUser(): User | undefined {
          return users.find((user) => user.id === session.userId);
        }
    ''').strip(),
    'src/services/_mock-runtime.ts': textwrap.dedent('''
        import env from '@/lib/env';

        export const useMockService = env.NEXT_PUBLIC_USE_MOCKS;

        export function mockDelay(ms = 120) {
          return new Promise<void>((resolve) => setTimeout(resolve, ms));
        }
    ''').strip(),
    'src/services/auth.service.ts': textwrap.dedent('''
        import type { AxiosResponse } from 'axios';
        import api, { setAccessToken } from '@/lib/api';
        import env from '@/lib/env';
        import { users } from '@/mocks/users.mock';
        import { session, setSession, getCurrentUser } from '@/mocks/_session';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';
        import type { User } from '@/types/User';
        import type { ApiResponse } from '@/types/api';

        export interface AuthPayload {
          email: string;
          password: string;
        }

        export interface AuthRegisterPayload extends AuthPayload {
          name: string;
          phone?: string;
        }

        export interface AuthChangePasswordPayload {
          currentPassword: string;
          newPassword: string;
        }

        export interface AuthResponse {
          accessToken: string;
          user: User;
        }

        async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' = 'post') {
          const response = await api.request<ApiResponse<T>>({
            url: path,
            method,
            data: payload,
          });

          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }

          return response.data.data;
        }

        export const authService = {
          async login(payload: AuthPayload) {
            if (useMockService) {
              await mockDelay();
              const user = users.find((candidate) => candidate.email === payload.email);
              if (!user) {
                throw new Error('Invalid email or password.');
              }
              const token = `mock-token-${user.id}`;
              setSession(user.id, token);
              setAccessToken(token);
              return { accessToken: token, user };
            }

            const data = await callApi<AuthResponse>('/auth/login', payload, 'post');
            setAccessToken(data.accessToken);
            return data;
          },

          async register(payload: AuthRegisterPayload) {
            if (useMockService) {
              await mockDelay();
              const exists = users.some((user) => user.email === payload.email);
              if (exists) {
                throw new Error('Email already registered.');
              }

              const nextId = Math.max(0, ...users.map((user) => user.id)) + 1;
              const user: User = {
                id: nextId,
                name: payload.name,
                email: payload.email,
                phone: payload.phone,
                role: 'customer',
                emailVerified: false,
                status: 'active',
                lastLoginAt: new Date().toISOString(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              users.push(user);
              const token = `mock-token-${user.id}`;
              setSession(user.id, token);
              setAccessToken(token);
              return { accessToken: token, user };
            }

            const data = await callApi<AuthResponse>('/auth/register', payload, 'post');
            setAccessToken(data.accessToken);
            return data;
          },

          async refresh() {
            if (useMockService) {
              await mockDelay();
              const user = getCurrentUser();
              if (!user) {
                throw new Error('Session expired.');
              }
              const token = `mock-token-${user.id}`;
              setSession(user.id, token);
              setAccessToken(token);
              return { accessToken: token, user };
            }

            return callApi<AuthResponse>('/auth/refresh', undefined, 'post');
          },

          async logout() {
            if (useMockService) {
              await mockDelay();
              setSession(null, null);
              setAccessToken(null);
              return { success: true };
            }

            const data = await callApi<{ success: boolean }>('/auth/logout', undefined, 'post');
            setAccessToken(null);
            return data;
          },

          async me() {
            if (useMockService) {
              await mockDelay();
              const user = getCurrentUser();
              if (!user) {
                throw new Error('Not authenticated.');
              }
              return user;
            }

            return callApi<User>('/auth/me', undefined, 'get');
          },

          async changePassword(payload: AuthChangePasswordPayload) {
            if (useMockService) {
              await mockDelay();
              if (!getCurrentUser()) {
                throw new Error('Not authenticated.');
              }
              return { success: true };
            }

            return callApi<{ success: boolean }>('/auth/change-password', payload, 'post');
          },
        };

        export default authService;
    ''').strip(),
    'src/services/product.service.ts': textwrap.dedent('''
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
            filtered = filtered.filter((item) => item[params.flag]);
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
    ''').strip(),
    'src/services/category.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { categories } from '@/mocks/categories.mock';
        import type { Category } from '@/types/Category';
        import type { ApiResponse } from '@/types/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        async function callApi<T>(path: string) {
          const response = await api.get<ApiResponse<T>>(path);
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const categoryService = {
          async tree() {
            if (useMockService) {
              await mockDelay();
              return [...categories].sort((a, b) => a.sortOrder - b.sortOrder);
            }

            return callApi<Category[]>('/categories');
          },

          async getFeatured(limit = 8) {
            if (useMockService) {
              await mockDelay();
              return [...categories].filter((category) => category.isActive).slice(0, limit);
            }

            return callApi<Category[]>('/categories/featured');
          },
        };

        export default categoryService;
    ''').strip(),
    'src/services/banner.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { banners } from '@/mocks/banners.mock';
        import type { Banner } from '@/types/Banner';
        import type { ApiResponse } from '@/types/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        type BannerListParams = { placement?: string };

        async function callApi<T>(path: string) {
          const response = await api.get<ApiResponse<T>>(path);
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const bannerService = {
          async list(params: BannerListParams = {}) {
            if (useMockService) {
              await mockDelay();
              let items = [...banners].filter((banner) => banner.isActive);
              if (params.placement) {
                items = items.filter((banner) => banner.placement === params.placement);
              }
              return items.sort((a, b) => a.sortOrder - b.sortOrder);
            }

            const path = params.placement ? `/banners?placement=${encodeURIComponent(params.placement)}` : '/banners';
            return callApi<Banner[]>(path);
          },
        };

        export default bannerService;
    ''').strip(),
    'src/services/cart.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { carts } from '@/mocks/cart.mock';
        import { coupons } from '@/mocks/coupons.mock';
        import { products } from '@/mocks/products.mock';
        import { session } from '@/mocks/_session';
        import type { Cart, CartItem } from '@/types/Cart';
        import type { Coupon } from '@/types/Coupon';
        import type { ApiResponse } from '@/types/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        async function callApi<T>(path: string, payload?: unknown, method: 'post' | 'patch' | 'delete' = 'post') {
          const response = await api.request<ApiResponse<T>>({
            url: path,
            method,
            data: payload,
          });
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        function computeTotals(cart: Cart) {
          const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
          const discount = cart.discount;
          const shipping = 150;
          const tax = Math.round((subtotal - discount) * 0.05 * 100) / 100;
          const total = subtotal - discount + shipping + tax;

          cart.subtotal = subtotal;
          cart.shipping = shipping;
          cart.tax = tax;
          cart.total = total;
          return cart;
        }

        function findCart() {
          const userId = session.userId;
          if (!userId) {
            throw new Error('Not authenticated');
          }
          let cart = carts.find((item) => item.userId === userId);
          if (!cart) {
            cart = {
              id: Math.max(0, ...carts.map((item) => item.id)) + 1,
              userId,
              items: [],
              subtotal: 0,
              discount: 0,
              shipping: 150,
              tax: 0,
              total: 0,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            carts.push(cart);
          }
          return cart;
        }

        export const cartService = {
          async get() {
            if (useMockService) {
              await mockDelay();
              return computeTotals({ ...findCart() });
            }

            return callApi<Cart>('/cart', undefined, 'get');
          },

          async addItem(payload: { productId: number; variantId?: number; quantity: number }) {
            if (useMockService) {
              await mockDelay();
              const cart = findCart();
              const product = products.find((item) => item.id === payload.productId);
              if (!product) {
                throw new Error('Product not found');
              }
              const existing = cart.items.find((item) => item.productId === payload.productId && item.variantId === payload.variantId);
              if (existing) {
                existing.quantity += payload.quantity;
                existing.price = product.salePrice ?? product.price;
              } else {
                cart.items.push({
                  id: Math.max(0, ...cart.items.map((item) => item.id)) + 1,
                  cartId: cart.id,
                  productId: product.id,
                  variantId: payload.variantId,
                  quantity: payload.quantity,
                  price: product.salePrice ?? product.price,
                  productName: product.name,
                  productSku: product.sku,
                  imageUrl: product.images[0]?.imageUrl,
                });
              }
              cart.updatedAt = new Date().toISOString();
              return computeTotals({ ...cart });
            }

            return callApi<Cart>('/cart/items', payload, 'post');
          },

          async updateItem(id: number, payload: { quantity: number }) {
            if (useMockService) {
              await mockDelay();
              const cart = findCart();
              const item = cart.items.find((entry) => entry.id === id);
              if (!item) {
                throw new Error('Cart item not found');
              }
              item.quantity = Math.max(1, payload.quantity);
              cart.updatedAt = new Date().toISOString();
              return computeTotals({ ...cart });
            }

            return callApi<Cart>(`/cart/items/${id}`, payload, 'patch');
          },

          async removeItem(id: number) {
            if (useMockService) {
              await mockDelay();
              const cart = findCart();
              cart.items = cart.items.filter((entry) => entry.id !== id);
              cart.updatedAt = new Date().toISOString();
              return computeTotals({ ...cart });
            }

            return callApi<Cart>(`/cart/items/${id}`, undefined, 'delete');
          },

          async applyCoupon(code: string) {
            if (useMockService) {
              await mockDelay();
              const cart = findCart();
              const coupon = coupons.find((item) => item.code.toLowerCase() === code.toLowerCase());
              if (!coupon) {
                throw new Error('Invalid coupon code');
              }
              if (!coupon.isActive || new Date() > new Date(coupon.endDate)) {
                throw new Error('Coupon is not available');
              }
              let discount = 0;
              if (coupon.discountType === 'flat') {
                discount = coupon.discountValue;
              } else {
                discount = Math.min((cart.subtotal * coupon.discountValue) / 100, coupon.maxDiscount ?? Number.POSITIVE_INFINITY);
              }
              cart.discount = Math.round(discount * 100) / 100;
              cart.updatedAt = new Date().toISOString();
              return computeTotals({ ...cart });
            }

            return callApi<Cart>('/cart/coupon', { code }, 'post');
          },

          async removeCoupon() {
            if (useMockService) {
              await mockDelay();
              const cart = findCart();
              cart.discount = 0;
              cart.updatedAt = new Date().toISOString();
              return computeTotals({ ...cart });
            }

            return callApi<Cart>('/cart/coupon', undefined, 'delete');
          },

          async bulkAdd(items: Array<{ productId: number; variantId?: number; quantity: number }>) {
            if (useMockService) {
              await mockDelay();
              const cart = findCart();
              for (const payload of items) {
                const product = products.find((item) => item.id === payload.productId);
                if (!product) continue;
                const existing = cart.items.find((entry) => entry.productId === payload.productId && entry.variantId === payload.variantId);
                if (existing) {
                  existing.quantity += payload.quantity;
                } else {
                  cart.items.push({
                    id: Math.max(0, ...cart.items.map((item) => item.id)) + 1,
                    cartId: cart.id,
                    productId: product.id,
                    variantId: payload.variantId,
                    quantity: payload.quantity,
                    price: product.salePrice ?? product.price,
                    productName: product.name,
                    productSku: product.sku,
                    imageUrl: product.images[0]?.imageUrl,
                  });
                }
              }
              cart.updatedAt = new Date().toISOString();
              return computeTotals({ ...cart });
            }

            return callApi<Cart>('/cart/bulk', { items }, 'post');
          },
        };

        export default cartService;
    ''').strip(),
    'src/services/wishlist.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { wishlist } from '@/mocks/wishlist.mock';
        import { session } from '@/mocks/_session';
        import type { Wishlist } from '@/types/Wishlist';
        import type { ApiResponse } from '@/types/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'delete' = 'get') {
          const response = await api.request<ApiResponse<T>>({
            url: path,
            method,
            data: payload,
          });
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        function refreshUserWishlist() {
          return wishlist.filter((item) => item.userId === session.userId);
        }

        export const wishlistService = {
          async get() {
            if (useMockService) {
              await mockDelay();
              return refreshUserWishlist();
            }

            return callApi<Wishlist>('/wishlist', undefined, 'get');
          },

          async add(productId: number) {
            if (useMockService) {
              await mockDelay();
              if (!session.userId) {
                throw new Error('Not authenticated');
              }
              const existing = wishlist.find((entry) => entry.userId === session.userId && entry.productId === productId);
              if (existing) {
                return existing;
              }
              const nextId = Math.max(0, ...wishlist.map((entry) => entry.id)) + 1;
              const item = {
                id: nextId,
                userId: session.userId,
                productId,
                createdAt: new Date().toISOString(),
              };
              wishlist.push(item);
              return item;
            }

            return callApi<Wishlist>('/wishlist', { productId }, 'post');
          },

          async remove(productId: number) {
            if (useMockService) {
              await mockDelay();
              if (!session.userId) {
                throw new Error('Not authenticated');
              }
              const index = wishlist.findIndex((entry) => entry.userId === session.userId && entry.productId === productId);
              if (index >= 0) {
                wishlist.splice(index, 1);
              }
              return { success: true };
            }

            return callApi<{ success: boolean }>(`/wishlist/${productId}`, undefined, 'delete');
          },

          async toggle(productId: number) {
            if (useMockService) {
              await mockDelay();
              const existing = wishlist.find((entry) => entry.userId === session.userId && entry.productId === productId);
              if (existing) {
                const index = wishlist.indexOf(existing);
                wishlist.splice(index, 1);
                return { removed: true };
              }
              const nextId = Math.max(0, ...wishlist.map((entry) => entry.id)) + 1;
              const item = {
                id: nextId,
                userId: session.userId!,
                productId,
                createdAt: new Date().toISOString(),
              };
              wishlist.push(item);
              return { removed: false, item };
            }

            return callApi<{ removed: boolean; item?: Wishlist }>('/wishlist/toggle', { productId }, 'post');
          },
        };

        export default wishlistService;
    ''').strip(),
    'src/services/order.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { orders } from '@/mocks/orders.mock';
        import { session } from '@/mocks/_session';
        import type { Order } from '@/types/Order';
        import type { ApiResponse } from '@/types/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' = 'get') {
          const response = await api.request<ApiResponse<T>>({
            url: path,
            method,
            data: payload,
          });
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const orderService = {
          async listMine() {
            if (useMockService) {
              await mockDelay();
              return orders.filter((order) => order.userId === session.userId);
            }
            return callApi<Order[]>('/orders', undefined, 'get');
          },

          async byNumber(orderNumber: string) {
            if (useMockService) {
              await mockDelay();
              const order = orders.find((item) => item.orderNumber === orderNumber);
              if (!order) {
                throw new Error('Order not found');
              }
              return order;
            }
            return callApi<Order>(`/orders/${encodeURIComponent(orderNumber)}`, undefined, 'get');
          },

          async cancel(orderNumber: string) {
            if (useMockService) {
              await mockDelay();
              const order = orders.find((item) => item.orderNumber === orderNumber);
              if (!order) {
                throw new Error('Order not found');
              }
              if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
                throw new Error('Order cannot be cancelled');
              }
              order.orderStatus = 'cancelled';
              order.updatedAt = new Date().toISOString();
              return order;
            }
            return callApi<Order>(`/orders/${encodeURIComponent(orderNumber)}/cancel`, undefined, 'patch');
          },

          async downloadInvoice(orderNumber: string) {
            if (useMockService) {
              await mockDelay();
              const order = orders.find((item) => item.orderNumber === orderNumber);
              if (!order) {
                throw new Error('Order not found');
              }
              const invoiceText = `Invoice for ${order.orderNumber} | Total: ${order.totalAmount}`;
              return new Blob([invoiceText], { type: 'application/pdf' });
            }
            const response = await api.get(`/orders/${encodeURIComponent(orderNumber)}/invoice`, { responseType: 'blob' });
            return response.data as Blob;
          },
        };

        export default orderService;
    ''').strip(),
    'src/services/review.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { reviews } from '@/mocks/reviews.mock';
        import { orders } from '@/mocks/orders.mock';
        import { session } from '@/mocks/_session';
        import type { Review } from '@/types/Review';
        import type { ApiResponse, ListResponse } from '@/types/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' = 'get') {
          const response = await api.request<ApiResponse<T>>({
            url: path,
            method,
            data: payload,
          });
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const reviewService = {
          async listForProduct(productId: number, params: { page?: number; pageSize?: number } = {}) {
            if (useMockService) {
              await mockDelay();
              const page = params.page ?? 1;
              const pageSize = params.pageSize ?? 10;
              const approvedReviews = reviews.filter((review) => review.productId === productId && review.status === 'approved');
              const offset = (page - 1) * pageSize;
              return {
                items: approvedReviews.slice(offset, offset + pageSize),
                meta: {
                  page,
                  pageSize,
                  total: approvedReviews.length,
                  totalPages: Math.max(1, Math.ceil(approvedReviews.length / pageSize)),
                },
              };
            }
            return callApi<ListResponse<Review>>(`/reviews/product/${productId}?page=${params.page ?? 1}&pageSize=${params.pageSize ?? 10}`);
          },

          async canReview(productId: number) {
            if (useMockService) {
              await mockDelay();
              if (!session.userId) {
                return false;
              }
              const hasPurchased = orders.some((order) =>
                order.userId === session.userId &&
                order.items?.some((item) => item.productId === productId) &&
                order.orderStatus === 'delivered'
              );
              const alreadyReviewed = reviews.some((review) => review.userId === session.userId && review.productId === productId);
              return hasPurchased && !alreadyReviewed;
            }
            return callApi<boolean>(`/reviews/product/${productId}/can-review`, undefined, 'get');
          },

          async toWrite() {
            if (useMockService) {
              await mockDelay();
              if (!session.userId) {
                return [];
              }
              const deliveredItems = orders
                .filter((order) => order.userId === session.userId && order.orderStatus === 'delivered')
                .flatMap((order) => order.items ?? []);
              return deliveredItems.filter(
                (item) => !reviews.some((review) => review.userId === session.userId && review.productId === item.productId)
              );
            }
            return callApi<unknown[]>('/reviews/to-write', undefined, 'get');
          },

          async submit(payload: { productId: number; rating: number; title?: string; review?: string }) {
            if (useMockService) {
              await mockDelay();
              if (!session.userId) {
                throw new Error('Not authenticated');
              }
              const nextId = Math.max(0, ...reviews.map((review) => review.id)) + 1;
              const review: Review = {
                id: nextId,
                userId: session.userId,
                productId: payload.productId,
                rating: payload.rating,
                title: payload.title,
                review: payload.review,
                status: 'pending',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              reviews.push(review);
              return review;
            }
            return callApi<Review>('/reviews', payload, 'post');
          },
        };

        export default reviewService;
    ''').strip(),
    'src/services/user.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { users } from '@/mocks/users.mock';
        import { addresses } from '@/mocks/addresses.mock';
        import { session } from '@/mocks/_session';
        import type { User } from '@/types/User';
        import type { Address } from '@/types/Address';
        import type { ApiResponse } from '@/types/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' | 'delete' = 'get') {
          const response = await api.request<ApiResponse<T>>({
            url: path,
            method,
            data: payload,
          });
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        const getUser = () => {
          if (!session.userId) {
            throw new Error('Not authenticated');
          }
          const user = users.find((item) => item.id === session.userId);
          if (!user) {
            throw new Error('User not found');
          }
          return user;
        };

        export const userService = {
          async profile() {
            if (useMockService) {
              await mockDelay();
              return getUser();
            }
            return callApi<User>('/users/me', undefined, 'get');
          },

          async updateProfile(payload: Partial<Pick<User, 'name' | 'phone'>>) {
            if (useMockService) {
              await mockDelay();
              const user = getUser();
              Object.assign(user, payload);
              user.updatedAt = new Date().toISOString();
              return user;
            }
            return callApi<User>('/users/me', payload, 'patch');
          },

          addresses: {
            async list() {
              if (useMockService) {
                await mockDelay();
                return addresses.filter((address) => address.userId === session.userId);
              }
              return callApi<Address[]>('/users/addresses', undefined, 'get');
            },

            async add(payload: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) {
              if (useMockService) {
                await mockDelay();
                const nextId = Math.max(0, ...addresses.map((address) => address.id)) + 1;
                const newAddress: Address = {
                  id: nextId,
                  userId: session.userId!,
                  ...payload,
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString(),
                };
                addresses.push(newAddress);
                return newAddress;
              }
              return callApi<Address>('/users/addresses', payload, 'post');
            },

            async update(id: number, payload: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>) {
              if (useMockService) {
                await mockDelay();
                const address = addresses.find((entry) => entry.id === id && entry.userId === session.userId);
                if (!address) {
                  throw new Error('Address not found');
                }
                Object.assign(address, payload);
                address.updatedAt = new Date().toISOString();
                return address;
              }
              return callApi<Address>(`/users/addresses/${id}`, payload, 'patch');
            },

            async remove(id: number) {
              if (useMockService) {
                await mockDelay();
                const index = addresses.findIndex((entry) => entry.id === id && entry.userId === session.userId);
                if (index >= 0) {
                  addresses.splice(index, 1);
                }
                return { success: true };
              }
              return callApi<{ success: boolean }>(`/users/addresses/${id}`, undefined, 'delete');
            },
          },
        };

        export default userService;
    ''').strip(),
    'src/services/coupon.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { coupons } from '@/mocks/coupons.mock';
        import type { Coupon } from '@/types/Coupon';
        import type { ApiResponse } from '@/types/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        async function callApi<T>(path: string) {
          const response = await api.get<ApiResponse<T>>(path);
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const couponService = {
          async validate(code: string) {
            if (useMockService) {
              await mockDelay();
              const coupon = coupons.find((item) => item.code.toLowerCase() === code.toLowerCase());
              if (!coupon) {
                throw new Error('Coupon not found');
              }
              if (!coupon.isActive || new Date() > new Date(coupon.endDate)) {
                throw new Error('Coupon has expired');
              }
              return coupon;
            }
            return callApi<Coupon>(`/coupons/${encodeURIComponent(code)}`);
          },
        };

        export default couponService;
    ''').strip(),
    'src/services/checkout.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { cartService } from '@/services/cart.service';
        import { session } from '@/mocks/_session';
        import type { ApiResponse } from '@/types/api';
        import type { Cart } from '@/types/Cart';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';
        import env from '@/lib/env';

        export interface CheckoutQuotePayload {
          addressId: number;
          paymentMethod: 'razorpay' | 'cod';
        }

        export interface RazorpayOrderResponse {
          orderId: string;
          amount: number;
          currency: 'INR';
          keyId: string;
        }

        export interface VerifyPaymentPayload {
          orderId: string;
          paymentId: string;
          signature: string;
          idempotencyKey?: string;
        }

        async function callApi<T>(path: string, payload?: unknown, method: 'post' | 'get' = 'post') {
          const response = await api.request<ApiResponse<T>>({
            url: path,
            method,
            data: payload,
          });
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const checkoutService = {
          async quote(payload: CheckoutQuotePayload) {
            if (useMockService) {
              await mockDelay();
              const cart = await cartService.get();
              const quote = {
                quoteId: `quote-${Date.now()}`,
                subtotal: cart.subtotal,
                discount: cart.discount,
                shipping: cart.shipping,
                tax: cart.tax,
                total: cart.total,
                currency: 'INR' as const,
                addressId: payload.addressId,
                paymentMethod: payload.paymentMethod,
              };
              return quote;
            }
            return callApi('/checkout/quote', payload, 'post');
          },

          async createRazorpayOrder(payload: { quoteId: string; amount: number; currency: 'INR' }) {
            if (useMockService) {
              await mockDelay();
              return {
                orderId: `razorpay_order_${Date.now()}`,
                amount: payload.amount,
                currency: payload.currency,
                keyId: env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_mock',
              };
            }
            return callApi<RazorpayOrderResponse>('/checkout/razorpay/order', payload, 'post');
          },

          async verifyPayment(payload: VerifyPaymentPayload) {
            if (useMockService) {
              await mockDelay();
              return {
                success: true,
                orderId: payload.orderId,
                paymentId: payload.paymentId,
              };
            }
            return callApi<{ success: boolean }>('/checkout/razorpay/verify', payload, 'post');
          },
        };

        export default checkoutService;
    ''').strip(),
    'src/services/newsletter.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';
        import type { ApiResponse } from '@/types/api';

        export interface NewsletterPayload {
          email: string;
        }

        async function callApi<T>(path: string, payload?: unknown) {
          const response = await api.post<ApiResponse<T>>(path, payload);
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const newsletterService = {
          async subscribe(payload: NewsletterPayload) {
            if (useMockService) {
              await mockDelay();
              return { email: payload.email, subscribed: true };
            }
            return callApi('/newsletter/subscribe', payload);
          },
        };

        export default newsletterService;
    ''').strip(),
    'src/services/contact.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';
        import type { ApiResponse } from '@/types/api';

        export interface ContactPayload {
          name: string;
          email: string;
          phone?: string;
          subject?: string;
          message: string;
        }

        async function callApi<T>(path: string, payload: unknown) {
          const response = await api.post<ApiResponse<T>>(path, payload);
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const contactService = {
          async submit(payload: ContactPayload) {
            if (useMockService) {
              await mockDelay();
              return { success: true, receivedAt: new Date().toISOString() };
            }
            return callApi('/contact', payload);
          },
        };

        export default contactService;
    ''').strip(),
    'src/services/wholesale.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';
        import type { ApiResponse } from '@/types/api';

        export interface WholesalePayload {
          companyName: string;
          contactPerson: string;
          email: string;
          phone: string;
          businessType?: string;
          productInterest?: string;
          quantityRequirement?: string;
          message?: string;
        }

        async function callApi<T>(path: string, payload: unknown) {
          const response = await api.post<ApiResponse<T>>(path, payload);
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const wholesaleService = {
          async submit(payload: WholesalePayload) {
            if (useMockService) {
              await mockDelay();
              return { success: true, inquiryId: `wholesale_${Date.now()}` };
            }
            return callApi('/wholesale', payload);
          },
        };

        export default wholesaleService;
    ''').strip(),
    'src/services/notification.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import { notifications } from '@/mocks/notifications.mock';
        import { session } from '@/mocks/_session';
        import type { Notification } from '@/types/Notification';
        import type { ApiResponse } from '@/types/api';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' = 'get') {
          const response = await api.request<ApiResponse<T>>({
            url: path,
            method,
            data: payload,
          });
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const notificationService = {
          async list() {
            if (useMockService) {
              await mockDelay();
              return notifications.filter((item) => item.type !== 'system' || !!session.userId);
            }
            return callApi<Notification[]>('/notifications', undefined, 'get');
          },

          async markRead(id: number) {
            if (useMockService) {
              await mockDelay();
              const notification = notifications.find((item) => item.id === id);
              if (notification) {
                notification.read = true;
              }
              return { success: true };
            }
            return callApi<{ success: boolean }>(`/notifications/${id}/read`, undefined, 'post');
          },

          async markAllRead() {
            if (useMockService) {
              await mockDelay();
              notifications.forEach((item) => {
                item.read = true;
              });
              return { success: true };
            }
            return callApi<{ success: boolean }>('/notifications/read-all', undefined, 'post');
          },
        };

        export default notificationService;
    ''').strip(),
    'src/services/upload.service.ts': textwrap.dedent('''
        import api from '@/lib/api';
        import env from '@/lib/env';
        import type { ApiResponse } from '@/types/api';
        import type { ProductImage } from '@/types/ProductImage';
        import { mockDelay, useMockService } from '@/services/_mock-runtime';

        export interface UploadSignature {
          signature: string;
          timestamp: number;
          apiKey: string;
          folder: string;
        }

        export interface UploadResult {
          secureUrl: string;
          publicId: string;
          originalFilename: string;
          metadata?: Record<string, unknown>;
        }

        async function callApi<T>(path: string, payload?: unknown) {
          const response = await api.post<ApiResponse<T>>(path, payload);
          if (!response.data.success) {
            throw new Error(response.data.error.message);
          }
          return response.data.data;
        }

        export const uploadService = {
          async getSignature(folder: string) {
            if (useMockService) {
              await mockDelay();
              return {
                signature: `mock-signature-${folder}`,
                timestamp: Math.floor(Date.now() / 1000),
                apiKey: env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || 'mock_cloud',
                folder,
              };
            }
            return callApi<UploadSignature>(`/upload/signature?folder=${encodeURIComponent(folder)}`);
          },

          async upload(file: File) {
            if (useMockService) {
              await mockDelay();
              const dataUrl = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('Unable to read file'));
                reader.readAsDataURL(file);
              });
              return {
                secureUrl: dataUrl,
                publicId: `mock/${file.name}`,
                originalFilename: file.name,
              };
            }
            return callApi<UploadResult>('/upload', file);
          },

          async persist(payload: { secureUrl: string; publicId: string; alt?: string; sortOrder?: number }) {
            if (useMockService) {
              await mockDelay();
              return {
                ...payload,
                id: `${payload.publicId}-${Date.now()}`,
              } as unknown as ProductImage;
            }
            return callApi<ProductImage>('/upload/persist', payload);
          },
        };

        export default uploadService;
    ''').strip(),
    'src/hooks/useAuth.ts': textwrap.dedent('''
        'use client';

        import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
        import authService from '@/services/auth.service';
        import { setAccessToken } from '@/lib/api';
        import type { AuthPayload, AuthRegisterPayload, AuthChangePasswordPayload } from '@/services/auth.service';

        export function useAuthMe() {
          return useQuery(['auth', 'me'], authService.me, {
            retry: false,
          });
        }

        export function useLogin() {
          const queryClient = useQueryClient();
          return useMutation(authService.login, {
            onSuccess(data) {
              setAccessToken(data.accessToken);
              queryClient.invalidateQueries(['auth', 'me']);
            },
          });
        }

        export function useRegister() {
          const queryClient = useQueryClient();
          return useMutation(authService.register, {
            onSuccess(data) {
              setAccessToken(data.accessToken);
              queryClient.invalidateQueries(['auth', 'me']);
            },
          });
        }

        export function useLogout() {
          const queryClient = useQueryClient();
          return useMutation(authService.logout, {
            onSuccess() {
              setAccessToken(null);
              queryClient.invalidateQueries(['auth', 'me']);
            },
          });
        }

        export function useChangePassword() {
          return useMutation(authService.changePassword);
        }
    ''').strip(),
    'src/hooks/useProducts.ts': textwrap.dedent('''
        'use client';

        import { useQuery } from '@tanstack/react-query';
        import productService from '@/services/product.service';
        import type { ProductListParams } from '@/services/product.service';

        export function useProducts(params: ProductListParams) {
          return useQuery(['products', params], () => productService.list(params), {
            keepPreviousData: true,
          });
        }
    ''').strip(),
    'src/hooks/useProduct.ts': textwrap.dedent('''
        'use client';

        import { useQuery } from '@tanstack/react-query';
        import productService from '@/services/product.service';

        export function useProduct(slug: string) {
          return useQuery(['product', slug], () => productService.bySlug(slug), {
            enabled: Boolean(slug),
          });
        }
    ''').strip(),
    'src/hooks/useCategories.ts': textwrap.dedent('''
        'use client';

        import { useQuery } from '@tanstack/react-query';
        import categoryService from '@/services/category.service';

        export function useCategories() {
          return useQuery(['categories'], categoryService.tree, {
            staleTime: 60_000,
          });
        }
    ''').strip(),
    'src/hooks/useBanners.ts': textwrap.dedent('''
        'use client';

        import { useQuery } from '@tanstack/react-query';
        import bannerService from '@/services/banner.service';

        export function useBanners(placement?: string) {
          return useQuery(['banners', placement], () => bannerService.list({ placement }));
        }
    ''').strip(),
    'src/hooks/useCart.ts': textwrap.dedent('''
        'use client';

        import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
        import cartService from '@/services/cart.service';

        export function useCart() {
          return useQuery(['cart'], cartService.get, {
            staleTime: 10_000,
          });
        }

        export function useAddToCart() {
          const queryClient = useQueryClient();
          return useMutation(cartService.addItem, {
            onSuccess() {
              queryClient.invalidateQueries(['cart']);
            },
          });
        }

        export function useUpdateCartItem() {
          const queryClient = useQueryClient();
          return useMutation(({ id, quantity }: { id: number; quantity: number }) => cartService.updateItem(id, { quantity }), {
            onSuccess() {
              queryClient.invalidateQueries(['cart']);
            },
          });
        }

        export function useRemoveCartItem() {
          const queryClient = useQueryClient();
          return useMutation((id: number) => cartService.removeItem(id), {
            onSuccess() {
              queryClient.invalidateQueries(['cart']);
            },
          });
        }

        export function useApplyCoupon() {
          const queryClient = useQueryClient();
          return useMutation((code: string) => cartService.applyCoupon(code), {
            onSuccess() {
              queryClient.invalidateQueries(['cart']);
            },
          });
        }

        export function useRemoveCoupon() {
          const queryClient = useQueryClient();
          return useMutation(() => cartService.removeCoupon(), {
            onSuccess() {
              queryClient.invalidateQueries(['cart']);
            },
          });
        }

        export function useBulkAddToCart() {
          const queryClient = useQueryClient();
          return useMutation(cartService.bulkAdd, {
            onSuccess() {
              queryClient.invalidateQueries(['cart']);
            },
          });
        }
    ''').strip(),
    'src/hooks/useWishlist.ts': textwrap.dedent('''
        'use client';

        import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
        import wishlistService from '@/services/wishlist.service';

        export function useWishlist() {
          return useQuery(['wishlist'], wishlistService.get, {
            staleTime: 10_000,
          });
        }

        export function useAddToWishlist() {
          const queryClient = useQueryClient();
          return useMutation((productId: number) => wishlistService.add(productId), {
            onSuccess() {
              queryClient.invalidateQueries(['wishlist']);
            },
          });
        }

        export function useRemoveFromWishlist() {
          const queryClient = useQueryClient();
          return useMutation((productId: number) => wishlistService.remove(productId), {
            onSuccess() {
              queryClient.invalidateQueries(['wishlist']);
            },
          });
        }

        export function useToggleWishlist() {
          const queryClient = useQueryClient();
          return useMutation((productId: number) => wishlistService.toggle(productId), {
            onSuccess() {
              queryClient.invalidateQueries(['wishlist']);
            },
          });
        }
    ''').strip(),
    'src/hooks/useOrders.ts': textwrap.dedent('''
        'use client';

        import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
        import orderService from '@/services/order.service';

        export function useOrders() {
          return useQuery(['orders'], orderService.listMine, {
            staleTime: 20_000,
          });
        }

        export function useOrder(orderNumber?: string) {
          return useQuery(['order', orderNumber], () => orderService.byNumber(orderNumber ?? ''), {
            enabled: Boolean(orderNumber),
          });
        }

        export function useCancelOrder() {
          const queryClient = useQueryClient();
          return useMutation((orderNumber: string) => orderService.cancel(orderNumber), {
            onSuccess() {
              queryClient.invalidateQueries(['orders']);
            },
          });
        }

        export function useDownloadInvoice() {
          return useMutation((orderNumber: string) => orderService.downloadInvoice(orderNumber));
        }
    ''').strip(),
    'src/hooks/useReviews.ts': textwrap.dedent('''
        'use client';

        import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
        import reviewService from '@/services/review.service';

        export function useProductReviews(productId: number) {
          return useQuery(['reviews', productId], () => reviewService.listForProduct(productId), {
            enabled: Boolean(productId),
          });
        }

        export function useCanReview(productId: number) {
          return useQuery(['reviews', productId, 'canReview'], () => reviewService.canReview(productId), {
            enabled: Boolean(productId),
          });
        }

        export function useSubmitReview() {
          const queryClient = useQueryClient();
          return useMutation(reviewService.submit, {
            onSuccess() {
              queryClient.invalidateQueries(['reviews']);
            },
          });
        }
    ''').strip(),
    'src/hooks/useAddresses.ts': textwrap.dedent('''
        'use client';

        import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
        import userService from '@/services/user.service';
        import type { Address } from '@/types/Address';

        export function useAddresses() {
          return useQuery(['addresses'], userService.addresses.list, {
            staleTime: 20_000,
          });
        }

        export function useAddAddress() {
          const queryClient = useQueryClient();
          return useMutation((payload: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => userService.addresses.add(payload), {
            onSuccess() {
              queryClient.invalidateQueries(['addresses']);
            },
          });
        }

        export function useUpdateAddress() {
          const queryClient = useQueryClient();
          return useMutation(({ id, payload }: { id: number; payload: Partial<Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>> }) => userService.addresses.update(id, payload), {
            onSuccess() {
              queryClient.invalidateQueries(['addresses']);
            },
          });
        }

        export function useRemoveAddress() {
          const queryClient = useQueryClient();
          return useMutation((id: number) => userService.addresses.remove(id), {
            onSuccess() {
              queryClient.invalidateQueries(['addresses']);
            },
          });
        }
    ''').strip(),
    'src/hooks/useCoupons.ts': textwrap.dedent('''
        'use client';

        import { useMutation, useQueryClient } from '@tanstack/react-query';
        import cartService from '@/services/cart.service';

        export function useApplyCoupon() {
          const queryClient = useQueryClient();
          return useMutation((code: string) => cartService.applyCoupon(code), {
            onSuccess() {
              queryClient.invalidateQueries(['cart']);
            },
          });
        }

        export function useRemoveCoupon() {
          const queryClient = useQueryClient();
          return useMutation(() => cartService.removeCoupon(), {
            onSuccess() {
              queryClient.invalidateQueries(['cart']);
            },
          });
        }
    ''').strip(),
    'src/hooks/useCheckout.ts': textwrap.dedent('''
        'use client';

        import { useMutation } from '@tanstack/react-query';
        import checkoutService from '@/services/checkout.service';

        export function useCheckoutQuote() {
          return useMutation(checkoutService.quote);
        }

        export function useCreateRazorpayOrder() {
          return useMutation(checkoutService.createRazorpayOrder);
        }

        export function useVerifyPayment() {
          return useMutation(checkoutService.verifyPayment);
        }
    ''').strip(),
    'src/hooks/useNotifications.ts': textwrap.dedent('''
        'use client';

        import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
        import notificationService from '@/services/notification.service';

        export function useNotifications() {
          return useQuery(['notifications'], notificationService.list, {
            staleTime: 15_000,
          });
        }

        export function useMarkNotificationRead() {
          const queryClient = useQueryClient();
          return useMutation((id: number) => notificationService.markRead(id), {
            onSuccess() {
              queryClient.invalidateQueries(['notifications']);
            },
          });
        }

        export function useMarkAllNotificationsRead() {
          const queryClient = useQueryClient();
          return useMutation(notificationService.markAllRead, {
            onSuccess() {
              queryClient.invalidateQueries(['notifications']);
            },
          });
        }
    ''').strip(),
    'src/hooks/useUploads.ts': textwrap.dedent('''
        'use client';

        import { useMutation } from '@tanstack/react-query';
        import uploadService from '@/services/upload.service';

        export function useUploadSignature() {
          return useMutation((folder: string) => uploadService.getSignature(folder));
        }

        export function useUploadFile() {
          return useMutation((file: File) => uploadService.upload(file));
        }

        export function usePersistUpload() {
          return useMutation((payload: { secureUrl: string; publicId: string; alt?: string; sortOrder?: number }) => uploadService.persist(payload));
        }
    ''').strip(),
}

for relative_path, content in files.items():
    path = base / relative_path
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(content + '\n', encoding='utf-8')

print(f'created {len(files)} service and hook files')
