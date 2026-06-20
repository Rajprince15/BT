import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShopBrowser from '@/components/shop/ShopBrowser';
import { categories as MOCK_CATEGORIES } from '@/mocks/categories.mock';
import env from '@/lib/env';
import type { BreadcrumbItem } from '@/components/shop/Breadcrumbs';

interface ShopPageProps {
  params: Promise<{ slug?: string[] }>;
}

function findCategory(slug?: string) {
  if (!slug) return null;
  return MOCK_CATEGORIES.find((c) => c.slug === slug) ?? null;
}

function buildCrumbs(slugChain: string[] = []): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ];
  let path = '/shop';
  for (const s of slugChain) {
    const cat = MOCK_CATEGORIES.find((c) => c.slug === s);
    if (!cat) continue;
    path += `/${s}`;
    crumbs.push({ label: cat.name, href: path });
  }
  return crumbs;
}

export async function generateMetadata({ params }: ShopPageProps): Promise<Metadata> {
  const { slug } = await params;
  const last = slug?.[slug.length - 1];
  const cat = findCategory(last);
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const path = slug && slug.length > 0 ? `/shop/${slug.join('/')}` : '/shop';

  if (!cat) {
    return {
      title: 'Shop · Bhavita Textiles',
      description:
        'Browse our full atelier — luxury bedsheets, curtains, rugs, bath linen, decor and handloom heritage pieces.',
      alternates: { canonical: `${baseUrl}/shop` },
    };
  }
  return {
    title: `${cat.name} · Bhavita Textiles`,
    description:
      cat.description ??
      `${cat.name} — handcrafted, premium textiles by Bhavita Textiles.`,
    alternates: { canonical: `${baseUrl}${path}` },
  };
}

export default async function Page({ params }: ShopPageProps) {
  const { slug } = await params;
  const last = slug?.[slug.length - 1];
  const cat = findCategory(last);

  const title = cat ? cat.name : 'The Atelier';
  const eyebrow = cat ? 'Shop' : 'Atelier';
  const description = cat
    ? cat.description
    : 'Bedroom, living, bath, decor — every piece woven by hands that have done so for generations.';

  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <ShopBrowser
        title={title}
        eyebrow={eyebrow}
        description={description}
        breadcrumbs={buildCrumbs(slug)}
        lockedCategorySlug={cat?.slug}
      />
    </Suspense>
  );
}
