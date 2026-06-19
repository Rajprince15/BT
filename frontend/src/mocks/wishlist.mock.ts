import type { Wishlist } from '@/types/Wishlist';

const NOW = '2025-12-15T10:00:00.000Z';

// 5 wishlist items for the demo customer (userId=1).
export const wishlist: Wishlist[] = [
  { id: 1, userId: 1, productId: 6, createdAt: NOW }, // Imperial Gold Jacquard
  { id: 2, userId: 1, productId: 7, createdAt: NOW }, // Cashmere-Wool Royal Blanket
  { id: 3, userId: 1, productId: 14, createdAt: NOW }, // Persian-Inspired Area Rug
  { id: 4, userId: 1, productId: 19, createdAt: NOW }, // Royal Hotel Bath Towel
  { id: 5, userId: 1, productId: 27, createdAt: NOW }, // Wedding Trousseau Gift Set
];
