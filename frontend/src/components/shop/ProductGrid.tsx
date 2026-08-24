'use client';

import { motion, useReducedMotion } from 'framer-motion';

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

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ProductGrid({
  items,
  loading,
  skeletonCount = 8,
  emptyTitle = 'No pieces match your filters',
  emptyDescription = 'Try widening the price range or removing a colour / size to see more.',
  emptyAction,
}: ProductGridProps) {
  const reduce = useReducedMotion();

  if (loading) {
    return (
      <div
        data-testid="product-grid-loading"
        className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-10"
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
    <motion.div
      data-testid="product-grid"
      initial="hidden"
      animate="show"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
      }}
      className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-10"
    >
      {items.map((p) => (
        <motion.div
          key={p.id}
          variants={{
            hidden: { opacity: 0, y: reduce ? 0 : 18 },
            show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
          }}
        >
          <ProductCard product={p} />
        </motion.div>
      ))}
    </motion.div>
  );
}
