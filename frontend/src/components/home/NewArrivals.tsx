'use client';

import { useProducts } from '@/hooks/useProducts';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import EmptyState from '@/components/common/EmptyState';
import ProductCard, { ProductCardSkeleton } from '@/components/product/ProductCard';

export default function NewArrivals() {
  const { data, isLoading, isError, refetch } = useProducts({
    flag: 'new_arrival',
    pageSize: 8,
  });

  const items = data && 'items' in data ? data.items : [];

  return (
    <section data-testid="new-arrivals" className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Just In"
          title="New Arrivals"
          description="Fresh weaves and seasonal editions from our atelier."
          actionHref="/shop?flag=new_arrival"
          actionLabel="View all"
        />
      </Container>

      <div className="mt-10">
        {/* Mobile: horizontal scroll with snap; lg+: grid */}
        <div className="lg:hidden">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="w-[70vw] flex-shrink-0 snap-start sm:w-[45vw]"
                  >
                    <ProductCardSkeleton />
                  </div>
                ))
              : null}

            {!isLoading &&
              items.map((product, i) => (
                <div
                  key={product.id}
                  className="fade-up w-[70vw] flex-shrink-0 snap-start sm:w-[45vw]"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        </div>

        <Container className="hidden lg:block">
          <div className="grid grid-cols-4 gap-8">
            {isLoading
              ? Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)
              : null}

            {!isLoading &&
              items.map((product, i) => (
                <div
                  key={product.id}
                  className="fade-up"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
          </div>
        </Container>
      </div>

      {!isLoading && isError ? (
        <Container className="mt-8">
          <EmptyState
            tone="error"
            title="We couldn’t load new arrivals"
            description="Please retry — the atelier’s newest pieces will return shortly."
            action={{ label: 'Retry', onClick: () => refetch() }}
          />
        </Container>
      ) : null}

      {!isLoading && !isError && items.length === 0 ? (
        <Container className="mt-8">
          <EmptyState
            title="No new arrivals yet"
            description="Our weavers are working on something special. Check back soon."
          />
        </Container>
      ) : null}
    </section>
  );
}
