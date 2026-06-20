'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';

import { cn } from '@/lib/utils';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import EmptyState from '@/components/common/EmptyState';
import { useFeaturedCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/Category';

const FALLBACK_IMAGES = [
  '/images/editorial/handloom-heritage.svg',
  '/images/editorial/premium-cotton.svg',
  '/images/editorial/festive-wear.svg',
  '/images/editorial/royal-collection.svg',
];

interface CategoryCardProps {
  category: Category;
  index: number;
}

function CategoryCard({ category, index }: CategoryCardProps) {
  const [errored, setErrored] = useState(false);
  const fallback = FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const src = errored || !category.imageUrl ? fallback : category.imageUrl;

  return (
    <Link
      href={`/shop/${category.slug}`}
      data-testid={`featured-category-${category.slug}`}
      className="group fade-up relative block aspect-[4/5] overflow-hidden rounded-md border border-border bg-surface-2 outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Image
        src={src}
        alt={category.name}
        fill
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        loading="lazy"
        onError={() => setErrored(true)}
        className="object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.06]"
      />
      <div className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink/85 via-ink/40 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-4 pb-6">
        <span className="text-center font-serif text-xl text-bg md:text-2xl">
          {category.name}
        </span>
        <span
          aria-hidden
          className={cn(
            'mt-2 block h-px w-12 origin-center scale-x-0 bg-gold transition-transform duration-500 ease-out',
            'group-hover:scale-x-100',
          )}
        />
      </div>
    </Link>
  );
}

function CategorySkeleton({ index }: { index: number }) {
  return (
    <div
      data-testid="featured-category-skeleton"
      className="aspect-[4/5] w-full animate-pulse rounded-md bg-surface-2"
      style={{ animationDelay: `${index * 60}ms` }}
    />
  );
}

export default function FeaturedCategories() {
  const { data, isLoading, isError, refetch } = useFeaturedCategories(8);

  return (
    <section data-testid="featured-categories" className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Explore"
          title="Curated Categories"
          description="Each collection signed by master artisans of Jaipur, Maheshwar and Bengal."
        />

        <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-8">
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => <CategorySkeleton key={i} index={i} />)
            : null}

          {!isLoading && data && data.length > 0
            ? data.map((category, i) => (
                <CategoryCard key={category.id} category={category} index={i} />
              ))
            : null}
        </div>

        {!isLoading && isError ? (
          <div className="mt-10">
            <EmptyState
              tone="error"
              title="We couldn’t load categories"
              description="Please retry — your catalogue should reappear in a moment."
              action={{ label: 'Retry', onClick: () => refetch() }}
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
