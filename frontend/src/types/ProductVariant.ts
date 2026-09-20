export interface ProductVariant {
  id: number;
  productId: number;
  sku: string;
  size?: string;
  color?: string;
  weight?: string;
  bedType?: 'Single Bed' | 'Double Bed';
  price?: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
