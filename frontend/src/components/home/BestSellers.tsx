'use client';

import { useProducts } from '@/hooks/useProducts';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import EmptyState from '@/components/common/EmptyState';
import ProductCard, { ProductCardSkeleton } from '@/components/product/ProductCard';

export default function BestSellers() {
  const { data, isLoading, isError, refetch } = useProducts({
    flag: 'best_seller',
    pageSize: 6,
  });

  const items = data && 'items' in data ? data.items : [];
  const [featured, ...rest] = items;

  return (
    <section
      data-testid="best-sellers"
      className="border-y border-gold-soft/40 bg-surface-2/60 py-20 md:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Most Loved"
          title="Bestsellers of the Atelier"
          description="The pieces our patrons keep coming back to — and gift to those they love."
          actionHref="/shop?flag=best_seller"
          actionLabel="Shop bestsellers"
        />

        {isLoading ? (
          <div className="mt-12 grid grid-cols-2 gap-6 md:gap-8 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : null}

        {!isLoading && featured ? (
          <div className="mt-12 grid grid-cols-1 gap-6 md:gap-8 lg:grid-cols-3 lg:grid-rows-2">
            <div
              data-testid="best-sellers-featured"
              className="fade-up lg:col-span-1 lg:row-span-2"
              style={{ animationDelay: '0ms' }}
            >
              <ProductCard product={featured} size="lg" priority />
            </div>

            {rest.map((product, i) => (
              <div
                key={product.id}
                className="fade-up"
                style={{ animationDelay: `${(i + 1) * 70}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : null}

        {!isLoading && isError ? (
          <div className="mt-10">
            <EmptyState
              tone="error"
              title="We couldn’t load bestsellers"
              description="Please retry — our most loved pieces will reappear shortly."
              action={{ label: 'Retry', onClick: () => refetch() }}
            />
          </div>
        ) : null}

        {!isLoading && !isError && items.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              title="No bestsellers to show"
              description="As soon as our patrons declare their favourites, you’ll see them here."
            />
          </div>
        ) : null}
      </Container>
    </section>
  );
}
