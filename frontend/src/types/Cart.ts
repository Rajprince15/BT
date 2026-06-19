import { CartItem } from './CartItem';

export type { CartItem };

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
