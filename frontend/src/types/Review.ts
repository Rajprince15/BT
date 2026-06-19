export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface Review {
  id: number;
  userId: number;
  productId: number;
  orderId?: number;
  rating: number;
  title?: string;
  review?: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}
