export interface ProductImage {
  id: number;
  productId: number;
  imageUrl: string;
  cloudId?: string;
  altText?: string;
  sortOrder: number;
  createdAt: string;
}
