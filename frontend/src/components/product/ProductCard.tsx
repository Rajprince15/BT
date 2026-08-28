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

export interface ProductCardProps { product: Product; priority?: boolean; size?: 'sm' | 'md' | 'lg'; className?: string }
const FALLBACK_IMAGE = '/images/editorial/premium-cotton.svg';

export default function ProductCard({ product, size = 'md', className }: ProductCardProps) {
  const primary = product.images.find((img) => img.sortOrder === 0)?.imageUrl ?? product.images[0]?.imageUrl ?? FALLBACK_IMAGE;
  const secondary = product.images[1]?.imageUrl;
  const sale = typeof product.salePrice === 'number' && product.salePrice < product.price;
  const { data: wishlist = [] } = useWishlist();
  const toggle = useToggleWishlist();
  const saved = wishlist.some((item) => item.productId === product.id);
  const meta = [product.specification, product.sizeLabel].filter(Boolean).slice(0, 2).join(' · ');
  const titleSize = size === 'lg' ? 'text-xl md:text-2xl' : size === 'sm' ? 'text-sm' : 'text-base md:text-lg';
  return (
    <article data-testid="product-card" data-product-slug={product.slug} className={cn('group relative', className)}>
      <Link href={`/product/${product.slug}`} aria-label={product.name} className="relative block aspect-[4/5] overflow-hidden bg-surface-2 focus-visible:ring-2 focus-visible:ring-gold-2">
        <ProductImageFallback slug={product.slug} remote={primary} alt={product.images[0]?.altText ?? product.name} className={cn('absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]', secondary && 'group-hover:opacity-0')} />
        {secondary ? <img data-testid="product-image-secondary" src={secondary} alt="" aria-hidden className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" /> : null}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute left-4 top-4 flex flex-col gap-1 text-[9px] uppercase tracking-[0.18em] text-bg drop-shadow">{product.newArrival ? <span data-testid="product-card-badge-new">New arrival</span> : null}{product.bestSeller ? <span data-testid="product-card-badge-best">Bestseller</span> : null}{sale ? <span data-testid="product-card-badge-sale">Sale</span> : null}</div>
      </Link>
      <button type="button" data-testid="product-card-wishlist" aria-label={saved ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`} onClick={(event) => { event.preventDefault(); toggle.mutate(product.id, { onSuccess: (result) => toast.success(result.removed ? 'Removed from wishlist' : 'Saved to wishlist'), onError: (error) => toast.error(error.message) }); }} disabled={toggle.isPending} aria-pressed={saved} className={cn('absolute right-3 top-3 z-10 inline-flex size-9 items-center justify-center bg-bg/85 text-ink-2 opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100 hover:text-gold-2 focus-visible:opacity-100', saved && 'text-gold-2 opacity-100')}><Heart size={15} strokeWidth={1.4} fill={saved ? 'currentColor' : 'none'} /></button>
      <div className="pt-5"><Link href={`/product/${product.slug}`} data-testid="product-card-name" className={cn('block max-w-full font-serif leading-snug text-ink group-hover:text-gold-2', titleSize)}><span className="line-clamp-2">{product.name}</span></Link>{meta ? <p data-testid="product-card-meta" className="mt-2 line-clamp-1 text-[11px] uppercase tracking-[0.1em] text-ink-2">{meta}</p> : null}<PriceTag price={product.price} salePrice={product.salePrice} size={size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : 'md'} className="mt-3" /></div>
    </article>
  );
}

export function ProductCardSkeleton() { return <div data-testid="product-card-skeleton" className="flex flex-col gap-4"><Skeleton className="aspect-[4/5] w-full rounded-none" /><Skeleton className="h-4 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>; }
ProductCard.Skeleton = ProductCardSkeleton;