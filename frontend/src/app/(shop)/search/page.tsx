import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShopBrowser from '@/components/shop/ShopBrowser';
import env from '@/lib/env';

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const baseUrl = env.NEXT_PUBLIC_APP_URL;
  const title = q ? `Search “${q}” · Bhavita Textiles` : 'Search · Bhavita Textiles';
  return {
    title,
    description: q
      ? `Search results for “${q}” at Bhavita Textiles.`
      : 'Search our atelier — bedsheets, curtains, rugs, bath linen, decor.',
    robots: { index: false, follow: true },
    alternates: { canonical: `${baseUrl}/search` },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q = '' } = await searchParams;
  const query = q.trim();

  return (
    <Suspense fallback={<div className="min-h-screen bg-bg" />}>
      <ShopBrowser
        title={query ? `Results for “${query}”` : 'Search the atelier'}
        eyebrow="Search"
        description={
          query
            ? 'Refine by price, colour, size, or category to find exactly what you’re looking for.'
            : 'Type a query in the header search to begin — or browse the atelier below.'
        }
        breadcrumbs={[
          { label: 'Home', href: '/' },
          { label: 'Search', href: '/search' },
        ]}
        lockedQuery={query || undefined}
      />
    </Suspense>
  );
}
