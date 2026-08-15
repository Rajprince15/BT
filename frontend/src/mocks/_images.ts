const EDITORIAL_IMAGES = [
  '/images/editorial/handloom-heritage.svg',
  '/images/editorial/premium-cotton.svg',
  '/images/editorial/festive-wear.svg',
  '/images/editorial/royal-collection.svg',
] as const;

function hash(value: string): number {
  return Array.from(value).reduce((total, character) => total + character.charCodeAt(0), 0);
}

/** Stable, locally bundled image for mock records. Real services replace this in Phase 11. */
export function mockImage(key: string, offset = 0): string {
  return EDITORIAL_IMAGES[(hash(key) + offset) % EDITORIAL_IMAGES.length];
}
