import type { Cart } from '@/types/Cart';
import { mockImage } from '@/mocks/_images';

const NOW = '2025-12-15T10:00:00.000Z';

/* Seed cart for demo customer (userId=1).
 * - Item 1: Dohar Double Bed (productId=1), qty 1, price 699
 * - Item 2: Fleno Woolen Set with Satin (productId=2), qty 1, price 699
 *
 * Totals are server-computed in the cart service (`computeTotals`). Values here
 * are the expected output so any consumer reading raw mocks sees a coherent state.
 */
export const carts: Cart[] = [
  {
    id: 1,
    userId: 1,
    items: [
      {
        id: 1,
        cartId: 1,
        productId: 1,
        variantId: undefined,
        quantity: 1,
        price: 699,
        productName: 'Dohar Double Bed', productSku: '', productSlug: 'dohar-double-bed', imageUrl: mockImage('dohar-double-bed'),
      },
      {
        id: 2,
        cartId: 1,
        productId: 2,
        variantId: undefined,
        quantity: 1,
        price: 699,
        productName: 'Fleno Woolen Set with Satin', productSku: '', productSlug: 'fleno-woolen-set-with-satin', imageUrl: mockImage('fleno-woolen-set-with-satin'),
      },
    ],
    // 9499 + 2*999 = 11497 subtotal, +150 shipping, +5% tax = 574.85 → rounded to 574.85
    subtotal: 1398,
    shipping: 150,
    tax: 0,
    total: 1548,
    createdAt: NOW,
    updatedAt: NOW,
  },
];
