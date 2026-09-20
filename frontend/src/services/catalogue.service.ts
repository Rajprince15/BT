import { createElement } from 'react';

import api from '@/lib/api';
import env from '@/lib/env';
import { useMockService } from '@/services/_mock-runtime';

/**
 * ONE design, TWO data sources.
 *   mock mode : products/categories come from the local mocks
 *   real mode : products/categories come from your backend
 * Both feed the exact same normaliser → image loader → PDF document.
 */

/** Logo for cover, top bars and closing page (light/gold, sits on dark green). */
const LOGO_SRC = '/images/footerlogo.png';

/** Backend list endpoints. Change if yours differ. */
const PRODUCTS_ENDPOINT = '/products';
const CATEGORIES_ENDPOINT = '/categories';

const FALLBACK_COPY = 'Premium home textile for wholesale supply.';

/* ───────────────────────── raw data sources ───────────────────────── */

type Raw = Record<string, unknown>;

/** Accepts [..], {data:[..]}, {items:[..]}, {results:[..]}, {data:{items:[..]}} … */
function unwrapList(payload: unknown): Raw[] {
  if (Array.isArray(payload)) return payload as Raw[];
  if (payload && typeof payload === 'object') {
    const obj = payload as Raw;
    for (const key of ['data', 'items', 'results', 'products', 'categories', 'rows']) {
      const value = obj[key];
      if (Array.isArray(value)) return value as Raw[];
      if (value && typeof value === 'object') {
        const nested = unwrapList(value);
        if (nested.length) return nested;
      }
    }
  }
  return [];
}

/** Fetches every page (stops on short page, repeated page, or 20 pages). */
async function fetchAll(path: string): Promise<Raw[]> {
  const limit = 100;
  const all: Raw[] = [];
  let firstId: unknown;

  for (let page = 1; page <= 20; page += 1) {
    const { data } = await api.get<unknown>(path, { params: { page, limit } });
    const list = unwrapList(data);

    if (!list.length) break;
    if (page > 1 && list[0]?.id === firstId) break; // backend ignores `page`
    if (page === 1) firstId = list[0]?.id;

    all.push(...list);
    if (list.length < limit) break;
  }

  return all;
}

async function loadRaw(): Promise<{ products: Raw[]; categories: Raw[] }> {
  if (useMockService) {
    // Dynamic imports keep the mocks out of the production bundle.
    const [{ products }, { categories }] = await Promise.all([
      import('@/mocks/products.mock'),
      import('@/mocks/categories.mock'),
    ]);
    return {
      products: products as unknown as Raw[],
      categories: categories as unknown as Raw[],
    };
  }

  const [products, categories] = await Promise.all([
    fetchAll(PRODUCTS_ENDPOINT),
    fetchAll(CATEGORIES_ENDPOINT).catch(() => [] as Raw[]), // names can fall back to product.category
  ]);
  return { products, categories };
}

/* ───────────────────────── normalise (same for both) ───────────────────────── */

type Item = {
  id: string | number;
  name: string;
  price: number | string;
  description: string;
  sku?: string;
  imageSrc?: string;
};
type Group = { id: string | number; name: string; items: Item[] };

const str = (v: unknown): string | undefined =>
  typeof v === 'string' && v.trim() ? v.trim() : undefined;

/** First match wins. Add your field name here if it is not covered. */
function imageOf(p: Raw): string | undefined {
  const first = (p.images as unknown[] | undefined)?.[0] as
    | string
    | { url?: string; src?: string; secure_url?: string }
    | undefined;

  return (
    str(p.image) ??
    str(p.imageUrl) ??
    str(p.thumbnail) ??
    str(p.primaryImage) ??
    (typeof first === 'string' ? str(first) : str(first?.url) ?? str(first?.src) ?? str(first?.secure_url))
  );
}

function shorten(text: string, max = 150): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

function normalise(rawProducts: Raw[], rawCategories: Raw[]): Group[] {
  const groups = new Map<string, Group>();

  // keep the backend/mocks category order
  rawCategories.forEach((c) => {
    const id = (c.id ?? c._id ?? c.slug) as string | number;
    groups.set(String(id), { id, name: str(c.name) ?? 'Textiles', items: [] });
  });

  rawProducts.forEach((p) => {
    const cat = p.category as Raw | string | number | undefined;
    const catObj = cat && typeof cat === 'object' ? cat : undefined;
    const catId = (p.categoryId ?? p.category_id ?? catObj?.id ?? catObj?._id ?? (typeof cat !== 'object' ? cat : undefined) ?? 'other') as string | number;

    let group = groups.get(String(catId));
    if (!group) {
      group = { id: catId, name: str(catObj?.name) ?? 'Textiles', items: [] };
      groups.set(String(catId), group);
    }

    group.items.push({
      id: (p.id ?? p._id ?? p.slug ?? `${group.items.length}`) as string | number,
      name: str(p.name) ?? str(p.title) ?? 'Product',
      price: (p.price ?? p.basePrice ?? '') as number | string,
      description: shorten(
        str(p.specification) ?? str(p.shortDescription) ?? str(p.description) ?? FALLBACK_COPY,
      ),
      sku: str(p.sku),
      imageSrc: imageOf(p),
    });
  });

  return [...groups.values()].filter((g) => g.items.length > 0);
}

/* ───────────────────────── image helpers ───────────────────────── */

function absolute(src: string): string {
  return new URL(src, window.location.origin).toString();
}

/**
 * Loads any browser-supported image (jpg/png/webp/avif) and returns a
 * JPEG/PNG data URL react-pdf can embed. Resolves null on failure so one
 * broken photo never breaks the whole catalogue.
 */
function toDataUrl(
  src: string | undefined | null,
  format: 'jpeg' | 'png' = 'jpeg',
  maxWidth = 900,
): Promise<string | null> {
  if (!src) return Promise.resolve(null);

  return new Promise((resolve) => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      try {
        const scale = Math.min(1, maxWidth / img.naturalWidth);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.naturalWidth * scale);
        canvas.height = Math.round(img.naturalHeight * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(null);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(
          format === 'png'
            ? canvas.toDataURL('image/png')
            : canvas.toDataURL('image/jpeg', 0.82),
        );
      } catch {
        resolve(null); // tainted canvas (image host has no CORS headers)
      }
    };
    img.onerror = () => resolve(null);
    img.src = absolute(src);
  });
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  fn: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let next = 0;

  await Promise.all(
    Array.from({ length: Math.min(limit, items.length) }, async () => {
      while (next < items.length) {
        const i = next++;
        out[i] = await fn(items[i]);
      }
    }),
  );

  return out;
}

/* ───────────────────────── catalogue builder ───────────────────────── */

async function createCatalogue(): Promise<Blob> {
  // Heavy libs load only when the user clicks "Download catalogue".
  const [{ pdf }, { default: CatalogueDocument }, raw] = await Promise.all([
    import('@react-pdf/renderer'),
    import('@/components/catalogue/CatalogueDocument'),
    loadRaw(),
  ]);

  const groups = normalise(raw.products, raw.categories);
  if (!groups.length) throw new Error('No products available for the catalogue');

  const flat = groups.flatMap((g) => g.items);
  const [logo, photos] = await Promise.all([
    toDataUrl(LOGO_SRC, 'png', 600),
    mapPool(flat, 6, (item) => toDataUrl(item.imageSrc)),
  ]);

  const photoOf = new Map(flat.map((item, i) => [item, photos[i]]));

  const element = createElement(CatalogueDocument, {
    categories: groups.map((g) => ({
      id: g.id,
      name: g.name,
      products: g.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        description: item.description,
        sku: item.sku,
        image: photoOf.get(item) ?? null,
      })),
    })),
    logo,
    siteUrl: window.location.origin,
    year: new Date().getFullYear(),
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return pdf(element as any).toBlob();
}

/* ───────────────────────── public API (unchanged) ───────────────────────── */

export async function downloadCatalogue(): Promise<Blob> {
  return createCatalogue();
}

export function catalogueApiUrl(): string {
  return `${env.NEXT_PUBLIC_API_URL.replace(
    /\/+$/,
    '',
  )}/products/catalogue.pdf`;
}