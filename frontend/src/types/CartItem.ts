export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  variantId?: number;
  quantity: number;
  price: number;
  productName: string;
  productSku: string;
  imageUrl?: string;
}
