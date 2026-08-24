const EDITORIAL_IMAGES = [
  '/images/editorial/handloom-heritage.svg',
  '/images/editorial/premium-cotton.svg',
  '/images/editorial/festive-wear.svg',
  '/images/editorial/royal-collection.svg',
] as const;
const PRODUCT_IMAGES: Record<string, string[]> = {
  bedsheet: [
    'https://bhavitatextiles.lovable.app/assets/product-bedsheet-styled-B1ras_mT.jpg',
    'https://images.unsplash.com/photo-1639690222445-595b0794bbd4?auto=format&fit=crop&w=1200&q=85',
  ],
  blanket: [
    'https://bhavitatextiles.lovable.app/assets/product-mink-blankets-Cd-j1YKi.jpg',
    'https://images.unsplash.com/photo-1652410057729-609376366136?auto=format&fit=crop&w=1200&q=85',
  ],
  mat: [
    'https://bhavitatextiles.lovable.app/assets/product-floor-mats-D-ey-gLp.jpg',
    'https://images.unsplash.com/photo-1619263719761-165c773ee5df?auto=format&fit=crop&w=1200&q=85',
  ],
  quilt: ['https://images.unsplash.com/photo-1652410057729-609376366136?auto=format&fit=crop&w=1200&q=85'],
  pillow: ['https://images.pexels.com/photos/6207448/pexels-photo-6207448.jpeg?auto=compress&cs=tinysrgb&w=1200'],
  towel: ['https://images.unsplash.com/photo-1619263719761-165c773ee5df?auto=format&fit=crop&w=1200&q=85'],
  curtain: ['https://images.pexels.com/photos/12553184/pexels-photo-12553184.jpeg?auto=compress&cs=tinysrgb&w=1200'],
};
function hash(value: string): number {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

/** Stable, locally bundled image for mock records. Real services replace this in Phase 11. */
export function mockImage(key: string, offset = 0): string {
  const normalized = key.toLowerCase();
  const match = Object.keys(PRODUCT_IMAGES).find((keyword) => normalized.includes(keyword));
  if (match) {
    const images = PRODUCT_IMAGES[match];
    return images[offset % images.length];
  }
  return EDITORIAL_IMAGES[(hash(key) + offset) % EDITORIAL_IMAGES.length];
}
