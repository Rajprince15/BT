import { CartItem } from './CartItem';

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  createdAt: string;
  updatedAt: string;
}
