import type { Wishlist } from '@/types/Wishlist';

const NOW = '2025-12-15T10:00:00.000Z';

// 5 wishlist items for the demo customer (userId=1).
export const wishlist: Wishlist[] = [
  { id: 1, userId: 1, productId: 1, createdAt: NOW },
  { id: 2, userId: 1, productId: 2, createdAt: NOW },
  { id: 3, userId: 1, productId: 17, createdAt: NOW },
  { id: 4, userId: 1, productId: 20, createdAt: NOW },
  { id: 5, userId: 1, productId: 28, createdAt: NOW },
];
