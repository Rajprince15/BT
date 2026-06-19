export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  variantId?: number;
  productName: string;
  productSku: string;
  quantity: number;
  price: number;
  lineTotal: number;
}
