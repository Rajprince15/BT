export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  size?: string;
  color?: string;
  price?: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
