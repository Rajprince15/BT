import api from '@/lib/api';
import { carts } from '@/mocks/cart.mock';
import { coupons } from '@/mocks/coupons.mock';
import { products } from '@/mocks/products.mock';
import { session } from '@/mocks/_session';
import type { Cart, CartItem } from '@/types/Cart';
import type { Coupon } from '@/types/Coupon';
import type { ApiResponse } from '@/types/api';
import { mockDelay, useMockService } from '@/services/_mock-runtime';

async function callApi<T>(path: string, payload?: unknown, method: 'get' | 'post' | 'patch' | 'delete' = 'post') {
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
