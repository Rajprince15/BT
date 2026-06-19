export type BannerPlacement = 'home_hero' | 'home_promo' | 'category' | 'sidebar';

export interface Banner {
  id: number;
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkUrl?: string;
  placement: BannerPlacement;
  categoryId?: number;
  sortOrder: number;
  startAt?: string;
  endAt?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
