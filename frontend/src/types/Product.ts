import { ProductImage } from './ProductImage';
import { ProductVariant } from './ProductVariant';

export type ProductStatus = 'draft' | 'published' | 'archived';

export interface Product {
  id: number;
  categoryId: number;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string;
  description?: string;
  price: number;
  salePrice?: number;
  stock: number;
  weightGrams?: number;
  featured: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  status: ProductStatus;
  ratingAvg: number;
  ratingCount: number;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  images: ProductImage[];
  variants: ProductVariant[];
  aggregateRating: number;
  reviewCount: number;
}
