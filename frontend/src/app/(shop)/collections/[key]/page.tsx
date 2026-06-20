import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ShopBrowser from '@/components/shop/ShopBrowser';
import env from '@/lib/env';
import type { CollectionKey, ProductFlag } from '@/services/product.service';
import type { ProductListParams } from '@/services/product.service';

interface CollectionsPageProps {
  params: Promise<{ key: string }>;
}

interface CollectionMeta {
  key: CollectionKey;
  title: string;
  eyebrow: string;
  description: string;
  /** Filter that powers the listing. */
  filter:
    | { kind: 'flag'; flag: ProductFlag }
    | { kind: 'category'; categorySlug: string }
    | { kind: 'sale' };
}

const COLLECTIONS: Record<CollectionKey, CollectionMeta> = {
  'new-arrivals': {
    key: 'new-arrivals',
    title: 'New Arrivals',
    eyebrow: 'Just In',
    description: 'The newest weaves to leave our atelier — gathered here in one place.',
    filter: { kind: 'flag', flag: 'new_arrival' },
  },
  'best-sellers': {
    key: 'best-sellers',
    title: 'Bestsellers',
    eyebrow: 'Most Loved',
    description: 'Pieces our patrons keep returning to — and gifting to those they love.',
    filter: { kind: 'flag', flag: 'best_seller' },
  },
  featured: {
    key: 'featured',
    title: 'Featured Selection',
    eyebrow: 'Hand-picked',
    description: 'Curated by our atelier — distinctive pieces with a story to tell.',
    filter: { kind: 'flag', flag: 'featured' },
  },
  sale: {
    key: 'sale',
    title: 'On Sale',
    eyebrow: 'Limited',
    description: 'Luxury at a moment — selected pieces from the atelier at a special price.',
    filter: { kind: 'sale' },
  },
  'summer-collection': {
    key: 'summer-collection',
    title: 'Summer Collection',
    eyebrow: 'Season',
    description: 'Cool mulmul, breathable cottons and breezy weaves for the warmer months.',
    filter: { kind: 'category', categorySlug: 'summer-collection' },
  },
  'winter-collection': {
    key: 'winter-collection',
    title: 'Winter Collection',
    eyebrow: 'Season',
    description: 'Warmth woven in — cashmere, wool blends and hand-quilted razais.',
    filter: { kind: 'category', categorySlug: 'winter-collection' },
  },
  'festive-collection': {
    key: 'festive-collection',
    title: 'Festive Collection',
    eyebrow: 'Celebrate',
    description: 'Brocade, zari and gold — pieces that turn rooms into occasions.',
    filter: { kind: 'category', categorySlug: 'festive-collection' },
  },
  'wedding-collection': {
    key: 'wedding-collection',
    title: 'Wedding Collection',
    eyebrow: 'Trousseau',
    description: 'Heirloom-worthy bed linen, throws and decor for the wedding home.',
    filter: { kind: 'category', categorySlug: 'wedding-collection' },
  },
};

function getMeta(key: string): CollectionMeta | null {
  return (COLLECTIONS as Record<string, CollectionMeta>)[key] ?? null;
}

export async function generateMetadata({ params }: CollectionsPageProps): Promise<Metadata> {
  const { key } = await params;
  const meta = getMeta(key);
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  if (!meta) {
    return { title: 'Collection · Bhavita Textiles', robots: { index: false } };
  }
  return {
    title: `${meta.title} · Bhavita Textiles`,
    description: meta.description,
    alternates: { canonical: `${baseUrl}/collections/${meta.key}` },
  };
}

export default async function CollectionPage({ params }: CollectionsPageProps) {
  const { key } = await params;
  const meta = getMeta(key);
  if (!meta) notFound();

  const props: Pick<ProductListParams, 'flag' | 'category'> & {
    sale?: boolean;
  } = {};
  if (meta.filter.kind === 'flag') props.flag = meta.filter.flag;
  if (meta.filter.kind === 'category') props.category = meta.filter.categorySlug;

  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <ShopBrowser
        title={meta.title}
        eyebrow={meta.eyebrow}
        description={meta.description}
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Collections', href: '/shop' },
          { label: meta.title, href: `/collections/${meta.key}` },
        ]}
        lockedFlag={props.flag}
        lockedCategorySlug={props.category}
        disableCategoryTree={meta.filter.kind !== 'category'}
        initialFlag={props.flag}
      />
    </Suspense>
  );
}
