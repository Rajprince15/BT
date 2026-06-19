import type { Banner } from '@/types/Banner';

const NOW = '2025-12-15T10:00:00.000Z';
const IMG = (slug: string) =>
  `https://res.cloudinary.com/demo/image/upload/c_fill,w_1920,h_900,q_auto,f_auto/v1/bhavita/banners/${slug}.jpg`;

export const banners: Banner[] = [
  // 2 home_hero
  {
    id: 1,
    title: 'Heritage Reimagined',
    subtitle: 'Handloom-woven luxury for every Indian home.',
    imageUrl: IMG('hero-heritage'),
    linkUrl: '/collections/handloom-heritage',
    placement: 'home_hero',
    sortOrder: 1,
    startAt: '2025-12-01T00:00:00.000Z',
    endAt: '2026-03-31T23:59:59.000Z',
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  {
    id: 2,
    title: 'The Winter Royal Edit',
    subtitle: 'Cashmere blankets, velvet drapes, festive layers.',
    imageUrl: IMG('hero-winter-royal'),
    linkUrl: '/collections/winter-collection',
    placement: 'home_hero',
    sortOrder: 2,
    startAt: '2025-11-15T00:00:00.000Z',
    endAt: '2026-02-28T23:59:59.000Z',
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  // 1 category
  {
    id: 3,
    title: 'Bedroom Collection — Premium Linen',
    subtitle: '300–600 TC sateen, ivory & royal indigo.',
    imageUrl: IMG('cat-bedroom'),
    linkUrl: '/shop/bedroom',
    placement: 'category',
    categoryId: 1, // bedroom top-level
    sortOrder: 1,
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
  // 1 promotional
  {
    id: 4,
    title: 'Festive Sale — Up to 30% Off',
    subtitle: 'On select handloom heritage pieces.',
    imageUrl: IMG('promo-festive-30'),
    linkUrl: '/collections/festive-collection',
    placement: 'home_promo',
    sortOrder: 1,
    startAt: '2025-12-01T00:00:00.000Z',
    endAt: '2026-01-31T23:59:59.000Z',
    isActive: true,
    createdAt: NOW,
    updatedAt: NOW,
  },
];
