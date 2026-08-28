'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import PriceTag from '@/components/common/PriceTag';
import { Skeleton } from '@/components/ui/skeleton';
import type { Product } from '@/types/Product';
import ProductImageFallback from '@/components/common/ProductImageFallback';
import { useToggleWishlist, useWishlist } from '@/hooks/useWishlist';

/**
 * Editorial ProductCard.
 *
 * Cardless / paper-floating aesthetic:
 *   - No visible box outlines or heavy shadows around the image.
 *   - Image is the hero. Meta sits quietly beneath.
 *   - Variants control the composition inside the editorial grid.
 *
 *   variant="standard"  → default portrait 4/5 image
 *   variant="hero"      → tall 3/4 image, larger typography
 *   variant="wide"      → landscape 16/10 image spanning wider tile
 *   variant="tall"      → very tall 3/4.5 for asymmetric spreads
 */
export type ProductCardVariant = 'standard' | 'hero' | 'wide' | 'tall';

export interface ProductCardProps {
  product: Product;
  priority?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: ProductCardVariant;
  index?: number;
  className?: string;
}

const FALLBACK_IMAGE = '/images/editorial/premium-cotton.svg';

const ASPECT: Record<ProductCardVariant, string> = {
  standard: 'aspect-[4/5]',
  hero: 'aspect-[3/4]',
  wide: 'aspect-[16/10]',
  tall: 'aspect-[3/4.4]',
};

export default function ProductCard({
  product,
  size = 'md',
  variant = 'standard',
  index,
  className,
}: ProductCardProps) {
  const primary =
    product.images.find((img) => img.sortOrder === 0)?.imageUrl ??
    product.images[0]?.imageUrl ??
    FALLBACK_IMAGE;
  const secondary = product.images[1]?.imageUrl;
  const sale = typeof product.salePrice === 'number' && product.salePrice < product.price;
  const { data: wishlist = [] } = useWishlist();
  const toggle = useToggleWishlist();
  const saved = wishlist.some((item) => item.productId === product.id);
  const meta = [product.specification, product.sizeLabel].filter(Boolean).slice(0, 2).join(' · ');

  const titleSize =
    variant === 'hero'
      ? 'text-2xl sm:text-[28px] md:text-3xl'
      : variant === 'wide'
        ? 'text-xl sm:text-2xl'
        : size === 'lg'
          ? 'text-xl md:text-2xl'
          : size === 'sm'
            ? 'text-base'
            : 'text-lg md:text-xl';

  return (
    <article
      data-testid={`product-card-${product.id}`}
      data-product-slug={product.slug}
      className={cn('group relative', className)}
    >
      {typeof index === 'number' ? (
        <span
          aria-hidden
          data-testid="product-card-index"
          className="pointer-events-none absolute -top-2 left-0 z-[1] hidden font-mono text-[10px] uppercase tracking-[0.28em] text-ink-3 sm:block"
        >
          N° {String(index + 1).padStart(2, '0')}
        </span>
      ) : null}

      <Link
        href={`/product/${product.slug}`}
        aria-label={product.name}
        className={cn(
          'relative block overflow-hidden bg-surface-2/60 focus-visible:outline-none',
          ASPECT[variant],
        )}
      >
        <ProductImageFallback
          slug={product.slug}
          remote={primary}
          alt={product.images[0]?.altText ?? product.name}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.035]',
            secondary && 'group-hover:opacity-0',
          )}
        />
        {secondary ? (
          <img
            data-testid="product-image-secondary"
            src={secondary}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        ) : null}

        {/* Corner badges — restrained typography rather than pills */}
        <div className="pointer-events-none absolute inset-x-5 top-5 flex items-start justify-between gap-3 text-[9px] uppercase tracking-[0.22em]">
          <div className="flex flex-col gap-1 text-bg drop-shadow-sm">
            {product.newArrival ? (
              <span data-testid="product-card-badge-new">Newly Loomed</span>
            ) : null}
            {product.bestSeller ? (
              <span data-testid="product-card-badge-best">House Bestseller</span>
            ) : null}
            {sale ? <span data-testid="product-card-badge-sale">On Offer</span> : null}
          </div>
        </div>

        {/* Overlay label reveal — editorial caption on hover */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-ink/40 via-ink/10 to-transparent p-5 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
          <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-bg/90">
            View Piece
          </span>
        </div>
      </Link>

      <button
        type="button"
        data-testid="product-card-wishlist"
        aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        onClick={(event) => {
          event.preventDefault();
          toggle.mutate(product.id, {
            onSuccess: (result) =>
              toast.success(result.removed ? 'Removed from wishlist' : 'Saved to wishlist'),
            onError: (error) => toast.error(error.message),
          });
        }}
        disabled={toggle.isPending}
        aria-pressed={saved}
        className={cn(
          'absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center rounded-full bg-bg/85 text-ink-2 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 hover:bg-bg hover:text-terracotta focus-visible:opacity-100',
          saved && 'text-terracotta opacity-100',
        )}
      >
        <Heart size={15} strokeWidth={1.4} fill={saved ? 'currentColor' : 'none'} />
      </button>

      <div className={cn('pt-5', variant === 'hero' && 'pt-7')}>
        <Link
          href={`/product/${product.slug}`}
          data-testid="product-card-name"
          className={cn(
            'block max-w-full font-serif font-normal leading-[1.15] tracking-tight text-ink transition-colors group-hover:text-terracotta',
            titleSize,
          )}
        >
          <span className="line-clamp-2">{product.name}</span>
        </Link>
        {meta ? (
          <p
            data-testid="product-card-meta"
            className="mt-2 line-clamp-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-3"
          >
            {meta}
          </p>
        ) : null}
        <PriceTag
          price={product.price}
          salePrice={product.salePrice}
          size={variant === 'hero' ? 'lg' : size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'}
          className="mt-3"
        />
      </div>
    </article>
  );
}

export function ProductCardSkeleton({ variant = 'standard' }: { variant?: ProductCardVariant }) {
  return (
    <div data-testid="product-card-skeleton" className="flex flex-col gap-4">
      <Skeleton className={cn('w-full rounded-none', ASPECT[variant])} />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  );
}
ProductCard.Skeleton = ProductCardSkeleton;
