import type { Cart } from '@/types/Cart';

const NOW = '2025-12-15T10:00:00.000Z';

/* Seed cart for demo customer (userId=1).
 * - Item 1: Imperial Gold Jacquard (productId=6), qty 1, sale price 9499
 * - Item 2: Velvet Royal Cushion Cover Set (productId=9), qty 2, sale price 999
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
        productId: 6,
        variantId: undefined,
        quantity: 1,
        price: 9499,
        productName: 'Imperial Gold Jacquard Bedsheet Set',
        productSku: 'BT-PB-001',
        imageUrl:
          'https://res.cloudinary.com/demo/image/upload/c_fill,w_900,h_900,q_auto,f_auto/v1/bhavita/products/imperial-gold-jacquard-bedsheet-1.jpg',
      },
      {
        id: 2,
        cartId: 1,
        productId: 9,
        variantId: undefined,
        quantity: 2,
        price: 999,
        productName: 'Velvet Royal Cushion Cover (Set of 2)',
        productSku: 'BT-CC-001',
        imageUrl:
          'https://res.cloudinary.com/demo/image/upload/c_fill,w_900,h_900,q_auto,f_auto/v1/bhavita/products/velvet-royal-cushion-cover-set-1.jpg',
      },
    ],
    // 9499 + 2*999 = 11497 subtotal, +150 shipping, +5% tax = 574.85 → rounded to 574.85
    subtotal: 11497,
    shipping: 150,
    tax: 574.85,
    total: 12221.85,
    createdAt: NOW,
    updatedAt: NOW,
  },
];
