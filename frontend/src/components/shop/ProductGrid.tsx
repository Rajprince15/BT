'use client';

import { motion, useReducedMotion } from 'framer-motion';

import ProductCard, {
  ProductCardSkeleton,
  type ProductCardVariant,
} from '@/components/product/ProductCard';
import EmptyState from '@/components/common/EmptyState';
import type { Product } from '@/types/Product';

interface ProductGridProps {
  items: Product[];
  loading?: boolean;
  skeletonCount?: number;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: { label: string; onClick: () => void };
  /** editorial → asymmetric home rhythm, compact → dense uniform grid */
  layout?: 'editorial' | 'compact';
  className?: string;
}

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Asymmetric editorial home rhythm.
 * The pattern repeats every 6 tiles across a 12-col grid, producing an
 * intentionally art-directed cadence (large, standard, standard, wide-featured,
 * standard, standard) that varies with breakpoint.
 */
function editorialSpan(index: number): { col: string; variant: ProductCardVariant } {
  const cycle = index % 6;
  switch (cycle) {
    case 0:
      // Hero opening piece on desktop, standard on mobile
      return { col: 'col-span-2 md:col-span-7 lg:col-span-7', variant: 'hero' };
    case 1:
      return { col: 'col-span-2 md:col-span-5 lg:col-span-5', variant: 'standard' };
    case 2:
      return { col: 'col-span-2 md:col-span-6 lg:col-span-4', variant: 'standard' };
    case 3:
      return { col: 'col-span-2 md:col-span-6 lg:col-span-4', variant: 'standard' };
    case 4:
      return { col: 'col-span-2 md:col-span-12 lg:col-span-4', variant: 'tall' };
    case 5:
      return { col: 'col-span-2 md:col-span-12 lg:col-span-8', variant: 'wide' };
    default:
      return { col: 'col-span-2 md:col-span-6 lg:col-span-4', variant: 'standard' };
  }
}

export default function ProductGrid({
  items,
  loading,
  skeletonCount = 8,
  emptyTitle = 'No pieces match your filters',
  emptyDescription = 'Try widening the price range or removing a colour / size to see more.',
  emptyAction,
  layout = 'editorial',
}: ProductGridProps) {
  const reduce = useReducedMotion();

  if (loading) {
    if (layout === 'compact') {
      return (
        <div
          data-testid="product-grid-loading"
          className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      );
    }
    return (
      <div
        data-testid="product-grid-loading"
        className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-8 md:grid-cols-12 md:gap-x-8 md:gap-y-20 lg:gap-x-10 lg:gap-y-24"
      >
        {Array.from({ length: skeletonCount }).map((_, i) => {
          const { col, variant } = editorialSpan(i);
          return (
            <div key={i} className={col}>
              <ProductCardSkeleton variant={variant} />
            </div>
          );
        })}
      </div>
    );
  }

  if (items.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  if (layout === 'compact') {
    return (
      <motion.div
        data-testid="product-grid"
        initial="hidden"
        animate="show"
        variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.06 } } }}
        className="grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      >
        {items.map((p, i) => (
          <motion.div
            key={p.id}
            variants={{
              hidden: { opacity: 0, y: reduce ? 0 : 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
            }}
          >
            <ProductCard product={p} index={i} />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div
      data-testid="product-grid"
      initial="hidden"
      animate="show"
      variants={{ hidden: {}, show: { transition: { staggerChildren: reduce ? 0 : 0.05 } } }}
      className="grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-8 md:grid-cols-12 md:gap-x-8 md:gap-y-20 lg:gap-x-10 lg:gap-y-24"
    >
      {items.map((p, i) => {
        const { col, variant } = editorialSpan(i);
        return (
          <motion.div
            key={p.id}
            className={col}
            variants={{
              hidden: { opacity: 0, y: reduce ? 0 : 22 },
              show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
            }}
          >
            <ProductCard product={p} variant={variant} index={i} />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
