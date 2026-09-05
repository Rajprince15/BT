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

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const FALLBACK_IMAGE = '/images/editorial/premium-cotton.svg';

function ProductCard({
  product,
  size = 'md',
  className,
}: ProductCardProps) {
  const primary =
    product.images.find((img) => img.sortOrder === 0)?.imageUrl ??
    product.images[0]?.imageUrl ??
    FALLBACK_IMAGE;

  const secondary = product.images[1]?.imageUrl;

  const onSale =
    typeof product.salePrice === 'number' && product.salePrice < product.price;

  const titleSize =
    size === 'lg'
      ? 'text-xl md:text-2xl'
      : size === 'sm'
        ? 'text-sm'
        : 'text-base md:text-lg';

  const priceSize: 'sm' | 'md' | 'lg' =
    size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md';

  const { data: wishlist = [] } = useWishlist();
  const wishlistMutation = useToggleWishlist();

  const saved = wishlist.some((item) => item.productId === product.id);

  // Compact B2B meta line: e.g. "Cotton · 90×100 in"
  const metaParts: string[] = [];
  if (product.specification) metaParts.push(product.specification);
  if (product.sizeLabel) metaParts.push(product.sizeLabel);
  const metaLine = metaParts.slice(0, 2).join(' · ');

  return (
    <article
      data-testid="product-card"
      data-product-slug={product.slug}
      className={cn(
        'group relative flex flex-col',
        className,
      )}
    >
      <Link
        href={`/product/${product.slug}`}
        aria-label={product.name}
        className={cn(
          'relative block aspect-[4/5] overflow-hidden rounded-md border border-border bg-surface-2 outline-none',
          'transition-all duration-500 ease-out',
          'focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          'group-hover:border-brand/30 group-hover:shadow-[0_18px_40px_-24px_rgba(125,44,40,0.28)]',
        )}
      >
        <ProductImageFallback
          slug={product.slug}
          remote={primary || FALLBACK_IMAGE}
          alt={product.images[0]?.altText ?? product.name}
          className={cn(
            'absolute inset-0 h-full w-full object-cover transition-transform duration-[700ms] ease-out will-change-transform',
            'group-hover:scale-[1.05]',
            secondary ? 'group-hover:opacity-0' : '',
          )}
        />

        {secondary ? (
          <img
            data-testid="product-image-secondary"
            src={secondary}
            alt=""
            aria-hidden
            className="absolute inset-0 h-full w-full scale-[1.05] object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          />
        ) : null}

        {/* Soft gradient on hover */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/25 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.newArrival ? (
            <span
              data-testid="product-card-badge-new"
              className="rounded-full bg-bg/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 text-brand shadow-sm"
            >
              New
            </span>
          ) : null}

          {product.bestSeller ? (
            <span
              data-testid="product-card-badge-best"
              className="rounded-full bg-ink px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 text-bg"
            >
              Best Seller
            </span>
          ) : null}

          {onSale ? (
            <span
              data-testid="product-card-badge-sale"
              className="rounded-full bg-brand px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 text-brand-ink"
            >
              Sale
            </span>
          ) : null}
        </div>
      </Link>

      {/* Wishlist */}
      <button
        type="button"
        data-testid="product-card-wishlist"
        aria-label={
          saved
            ? `Remove ${product.name} from wishlist`
            : `Add ${product.name} to wishlist`
        }
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();

          wishlistMutation.mutate(product.id, {
            onSuccess: (result) =>
              toast.success(
                result.removed ? 'Removed from wishlist' : 'Saved to wishlist',
              ),
            onError: (error) => toast.error(error.message),
          });
        }}
        disabled={wishlistMutation.isPending}
        aria-pressed={saved}
        className={cn(
          'absolute right-3 top-3 z-10 inline-flex size-10 items-center justify-center rounded-full bg-bg/90 shadow-sm backdrop-blur-sm transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
          'hover:scale-105',
          saved ? 'text-brand' : 'text-ink-2 hover:text-brand',
          wishlistMutation.isPending && 'cursor-not-allowed opacity-60',
        )}
      >
        <Heart
          className="size-4"
          strokeWidth={1.6}
          fill={saved ? 'currentColor' : 'none'}
        />
      </button>

      {/* Body */}
      <div className="mt-4 flex flex-col gap-1.5">
        <Link
          href={`/product/${product.slug}`}
          data-testid="product-card-name"
          className={cn(
            'relative inline-flex w-fit max-w-full self-start font-serif font-semibold leading-snug text-ink',
            'transition-colors duration-300 group-hover:text-brand',
            titleSize,
          )}
        >
          <span className="line-clamp-2 pb-0.5">{product.name}</span>
        </Link>

        {metaLine ? (
          <p
            data-testid="product-card-meta"
            className="line-clamp-1 text-xs leading-5 text-ink-2"
          >
            {metaLine}
          </p>
        ) : null}

        <PriceTag
          price={product.price}
          salePrice={product.salePrice}
          size={priceSize}
          className="mt-1"
        />
      </div>
    </article>
  );
}

function ProductCardSkeleton() {
  return (
    <div data-testid="product-card-skeleton" className="flex flex-col gap-3">
      <Skeleton className="aspect-[4/5] w-full rounded-md" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
    </div>
  );
}

ProductCard.Skeleton = ProductCardSkeleton;

export default ProductCard;
export { ProductCardSkeleton };


