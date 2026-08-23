'use client';

import Image from 'next/image';
import Link from 'next/link';
import Container from '@/components/common/Container';
import { useFeaturedCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/Category';

const FALLBACK_IMAGES = ['/images/editorial/handloom-heritage.svg', '/images/editorial/premium-cotton.svg', '/images/editorial/festive-wear.svg', '/images/editorial/royal-collection.svg'];

function CategoryCard({ category, index }: { category: Category; index: number }) {
  return <Link href={`/shop/${category.slug}`} data-testid={`featured-category-${category.slug}`} className="group relative block aspect-[0.86] overflow-hidden rounded-2xl bg-surface-2"><Image src={category.imageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]} alt={category.name} fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-105" /><div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/15 to-transparent" /><div className="absolute inset-x-0 bottom-0 p-5 sm:p-7"><p className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">0{index + 1} · Category</p><h3 className="font-serif text-2xl leading-none text-bg sm:text-3xl">{category.name}</h3><span className="mt-4 inline-flex items-center text-[10px] font-bold uppercase tracking-[0.16em] text-bg/70 transition-colors group-hover:text-gold">Explore range <span className="ml-2">↗</span></span></div></Link>;
}

export default function FeaturedCategories() {
  const { data, isLoading, isError, refetch } = useFeaturedCategories(8);
  return <section data-testid="featured-categories" className="bg-bg py-20 sm:py-28"><Container><div className="flex flex-col justify-between gap-7 md:flex-row md:items-end"><div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold-2">Featured Range</p><h2 className="mt-3 max-w-2xl font-serif text-4xl leading-none text-navy sm:text-5xl lg:text-6xl">Categories our buyers reorder every season.</h2></div><p className="max-w-sm text-sm leading-6 text-ink-2">A curated look at our collections. Full technical specifications, GSM options and MOQ tiers are in the catalogue.</p></div><div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">{isLoading ? Array.from({ length: 8 }).map((_, index) => <div key={index} data-testid="featured-category-skeleton" className="aspect-[0.86] animate-pulse rounded-2xl bg-surface-2" />) : data?.map((category, index) => <CategoryCard key={category.id} category={category} index={index} />)}</div>{!isLoading && isError && <button type="button" data-testid="featured-categories-retry" onClick={() => refetch()} className="mt-8 rounded-full border border-navy px-5 py-3 text-xs font-bold uppercase tracking-wider2 text-navy">Retry categories</button>}<Link href="/shop" data-testid="featured-categories-link" className="mt-10 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-navy transition-colors hover:text-gold-2">Browse all categories <span>↗</span></Link></Container></section>;
}