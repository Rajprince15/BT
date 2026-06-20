'use client';

import ProductCard, { ProductCardSkeleton } from '@/components/product/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import type { Product } from '@/types/Product';

interface ProductGridProps {
  items: Product[];
  loading?: boolean;
  skeletonCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  className?: string;
}

export default function ProductGrid({
  items,
  loading,
  skeletonCount = 8,
  emptyTitle = 'No pieces match your filters',
  emptyDescription = 'Try widening the price range or removing a colour / size to see more.',
  emptyAction,
}: ProductGridProps) {
  if (loading) {
    return (
      <div
        data-testid="product-grid-loading"
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={emptyTitle}
        description={emptyDescription}
        action={emptyAction}
      />
    );
  }

  return (
    <div
      data-testid="product-grid"
      className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-8"
    >
      {items.map((p, i) => (
        <div
          key={p.id}
          className="fade-up"
          style={{ animationDelay: `${Math.min(i * 40, 240)}ms` }}
        >
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
