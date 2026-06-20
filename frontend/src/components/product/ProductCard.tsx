'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import PriceTag from '@/components/common/PriceTag';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types/Product';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FALLBACK_IMAGE = '/images/editorial/premium-cotton.svg';

function ProductCard({ product, priority = false, size = 'md', className }: ProductCardProps) {
  const [primaryError, setPrimaryError] = useState(false);
  const [secondaryError, setSecondaryError] = useState(false);

  const primary =
    product.images.find((img) => img.sortOrder === 0)?.imageUrl ??
    product.images[0]?.imageUrl ??
    FALLBACK_IMAGE;
  const secondary = product.images[1]?.imageUrl;

  const onSale = typeof product.salePrice === 'number' && product.salePrice < product.price;

  const titleSize =
    size === 'lg' ? 'text-xl md:text-2xl' : size === 'sm' ? 'text-sm' : 'text-base md:text-lg';
  const priceSize: 'sm' | 'md' | 'lg' = size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md';

  return (
    <article
      data-testid="product-card"
      data-product-slug={product.slug}
      className={cn('group relative flex flex-col', className)}
    >
      <Link
        href={`/product/${product.slug}`}
        aria-label={product.name}
        className="relative block aspect-[4/5] overflow-hidden rounded-md border border-border bg-surface-2 outline-none transition-shadow duration-300 ease-out focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg group-hover:shadow-luxe"
      >
        <Image
          src={primaryError ? FALLBACK_IMAGE : primary}
          alt={product.images[0]?.altText ?? product.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 70vw"
          priority={priority}
          onError={() => setPrimaryError(true)}
          className={cn(
            'object-cover transition-transform duration-[600ms] ease-out will-change-transform',
            'group-hover:scale-[1.04]',
            secondary && !secondaryError ? 'group-hover:opacity-0' : '',
          )}
        />

        {secondary && !secondaryError ? (
          <Image
            src={secondary}
            alt=""
            aria-hidden
            fill
            sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 70vw"
            onError={() => setSecondaryError(true)}
            className="object-cover opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100"
          />
        ) : null}

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.newArrival ? (
            <span
              data-testid="product-card-badge-new"
              className="rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 text-ink"
            >
              New
            </span>
          ) : null}
          {product.bestSeller ? (
            <span
              data-testid="product-card-badge-best"
              className="rounded-full bg-navy px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 text-white"
            >
              Best Seller
            </span>
          ) : null}
          {onSale ? (
            <span
              data-testid="product-card-badge-sale"
              className="rounded-full bg-danger px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 text-white"
            >
              Sale
            </span>
          ) : null}
        </div>
      </Link>

      {/* Wishlist (overlaid on top-right, outside Link for keyboard accessibility) */}
      <button
        type="button"
        data-testid="product-card-wishlist"
        aria-label={`Add ${product.name} to wishlist`}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          // Wishlist wiring lands in Phase 7A.
          if (typeof window !== 'undefined') {
            // eslint-disable-next-line no-console
            console.debug('[wishlist:stub] add', product.id);
          }
        }}
        className="absolute right-3 top-3 z-10 inline-flex size-11 items-center justify-center rounded-full bg-bg/80 text-ink-2 backdrop-blur-sm transition-colors duration-200 hover:bg-bg hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <Heart className="size-4" strokeWidth={1.6} />
      </button>

      {/* Body */}
      <div className="mt-4 flex flex-col gap-2">
        <Link
          href={`/product/${product.slug}`}
          data-testid="product-card-name"
          className={cn(
            'relative inline-flex w-fit max-w-full self-start font-serif font-semibold leading-snug text-ink',
            titleSize,
          )}
        >
          <span className="line-clamp-2 pb-0.5">
            {product.name}
          </span>
          <span
            aria-hidden
            className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-300 ease-out group-hover:scale-x-100"
          />
        </Link>
        <PriceTag price={product.price} salePrice={product.salePrice} size={priceSize} />
      </div>
    </article>
  );
}

function ProductCardSkeleton() {
  return (
    <div data-testid="product-card-skeleton" className="flex flex-col gap-4">
      <Skeleton className="aspect-[4/5] w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

ProductCard.Skeleton = ProductCardSkeleton;

export default ProductCard;
export { ProductCardSkeleton };
