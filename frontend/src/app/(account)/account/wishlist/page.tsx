'use client';

import Link from 'next/link';
import { useState } from 'react';
import Image from 'next/image';
import {
  ArrowRight,
  Heart,
  LayoutGrid,
  List as ListIcon,
  ShoppingBag,
  Trash2,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import wishlistService from '@/services/wishlist.service';
import { products } from '@/mocks/products.mock';
import PriceTag from '@/components/common/PriceTag';
import { useAddToCart } from '@/hooks/useCart';
import { useToggleWishlist } from '@/hooks/useWishlist';
import type { Product } from '@/types/Product';

type ViewMode = 'grid' | 'list';

const FALLBACK_IMAGE = '/images/editorial/premium-cotton.svg';

function coverImage(product: Product): string {
  return (
    product.images.find((image) => image.sortOrder === 0)?.imageUrl ??
    product.images[0]?.imageUrl ??
    FALLBACK_IMAGE
  );
}

export default function WishlistPage() {
  const [view, setView] = useState<ViewMode>('grid');

  const {
    data: wishlistItems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.get,
  });

  const addToCart = useAddToCart();
  const toggleWishlist = useToggleWishlist();

  const items = wishlistItems
    .map((item) => products.find((product) => product.id === item.productId))
    .filter((product): product is Product => Boolean(product));

  const handleMove = (product: Product) => {
    addToCart.mutate(
      { productId: product.id, quantity: 1 },
      {
        onSuccess: () => toast.success(`${product.name} added to cart`),
        onError: (error) => toast.error(error.message),
      },
    );
  };

  const handleRemove = (product: Product) => {
    toggleWishlist.mutate(product.id, {
      onSuccess: () => toast.success('Removed from wishlist'),
      onError: (error) => toast.error(error.message),
    });
  };

  return (
    <div data-testid="account-wishlist-page" className="w-full">
      {/* ---------- Header ---------- */}
      <section className="border-b border-border pb-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Saved pieces
            </p>
            <h1 className="mt-2 font-serif text-2xl tracking-tight text-ink sm:text-3xl">
              Wishlist
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-ink-2">
              Curate the pieces you love. Move any item to cart in a single tap,
              or keep them here for later.
            </p>
          </div>

          {/* View + count controls */}
          {!isLoading && !isError && items.length > 0 ? (
            <div className="flex items-center gap-4">
              <p className="text-xs uppercase tracking-wider2 text-ink-2">
                {items.length} {items.length === 1 ? 'piece' : 'pieces'}
              </p>
              <div
                data-testid="wishlist-view-toggle"
                className="inline-flex overflow-hidden rounded-full border border-border bg-surface"
              >
                <button
                  type="button"
                  aria-pressed={view === 'grid'}
                  data-testid="wishlist-view-grid"
                  onClick={() => setView('grid')}
                  className={`inline-flex h-9 items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider2 transition-colors ${
                    view === 'grid'
                      ? 'bg-ink text-bg'
                      : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  <LayoutGrid className="size-3.5" /> Grid
                </button>
                <button
                  type="button"
                  aria-pressed={view === 'list'}
                  data-testid="wishlist-view-list"
                  onClick={() => setView('list')}
                  className={`inline-flex h-9 items-center gap-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider2 transition-colors ${
                    view === 'list'
                      ? 'bg-ink text-bg'
                      : 'text-ink-2 hover:text-ink'
                  }`}
                >
                  <ListIcon className="size-3.5" /> List
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* ---------- Loading ---------- */}
      {isLoading ? (
        <section className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-square rounded-lg bg-surface-2" />
              <div className="mt-3 h-4 w-2/3 rounded bg-surface-2" />
              <div className="mt-2 h-3 w-1/3 rounded bg-surface-2" />
            </div>
          ))}
        </section>
      ) : null}

      {/* ---------- Error ---------- */}
      {!isLoading && isError ? (
        <section className="mt-10 grid min-h-[320px] place-items-center rounded-lg border border-border bg-surface p-8 text-center">
          <div>
            <Heart className="mx-auto size-6 text-ink-2" />
            <h2 className="mt-4 font-serif text-2xl text-ink">
              We couldn&apos;t load your wishlist
            </h2>
            <p className="mt-2 text-sm text-ink-2">
              Please try again in a moment.
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 inline-flex h-10 items-center rounded-full bg-ink px-5 text-[11px] font-semibold uppercase tracking-wider2 text-bg hover:bg-ink/90"
            >
              Try again
            </button>
          </div>
        </section>
      ) : null}

      {/* ---------- Empty ---------- */}
      {!isLoading && !isError && items.length === 0 ? (
        <section className="mt-10 grid min-h-[420px] place-items-center rounded-lg border border-border bg-surface px-6 py-14 text-center">
          <div>
            <div className="mx-auto flex size-16 items-center justify-center rounded-full border border-gold/30 bg-gold-soft">
              <Heart className="size-6 text-gold" />
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Nothing saved yet
            </p>
            <h2 className="mt-2 font-serif text-3xl text-ink">
              Your wishlist is waiting.
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-ink-2">
              Explore our collection and save the pieces that catch your eye —
              they will appear here for whenever you return.
            </p>
            <Link
              href="/shop"
              className="mt-7 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-[11px] font-semibold uppercase tracking-[0.18em] text-bg transition-colors hover:bg-gold hover:text-ink"
            >
              <ShoppingBag className="size-4" />
              Explore collection
            </Link>
          </div>
        </section>
      ) : null}

      {/* ---------- GRID VIEW ---------- */}
      {!isLoading && !isError && items.length > 0 && view === 'grid' ? (
        <section className="mt-8">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {items.map((product) => (
              <article
                key={product.id}
                data-testid={`wishlist-card-${product.slug}`}
                className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-md"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="relative block aspect-square overflow-hidden bg-surface-2"
                >
                  <Image
                    src={coverImage(product)}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                <div className="flex flex-1 flex-col gap-3 p-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-wider2 text-ink-2">
                      {product.sku}
                    </p>
                    <Link
                      href={`/product/${product.slug}`}
                      className="mt-1 line-clamp-2 font-serif text-base leading-snug text-ink transition-colors hover:text-brand"
                    >
                      {product.name}
                    </Link>
                  </div>

                  <PriceTag
                    price={product.price}
                    salePrice={product.salePrice}
                    size="sm"
                  />

                  <div className="mt-auto flex gap-2 pt-2">
                    <button
                      type="button"
                      data-testid={`wishlist-move-cart-${product.slug}`}
                      onClick={() => handleMove(product)}
                      disabled={addToCart.isPending}
                      className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-full bg-ink text-[10px] font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold hover:text-ink disabled:opacity-50"
                    >
                      <ShoppingBag className="size-3.5" /> Move to cart
                    </button>
                    <button
                      type="button"
                      data-testid={`wishlist-remove-${product.slug}`}
                      onClick={() => handleRemove(product)}
                      aria-label="Remove from wishlist"
                      className="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-danger hover:text-danger"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}

      {/* ---------- LIST VIEW ---------- */}
      {!isLoading && !isError && items.length > 0 && view === 'list' ? (
        <section
          data-testid="wishlist-list-view"
          className="mt-8 overflow-hidden rounded-lg border border-border bg-surface"
        >
          <ul className="divide-y divide-border">
            {items.map((product) => (
              <li
                key={product.id}
                data-testid={`wishlist-row-${product.slug}`}
                className="grid grid-cols-[80px_1fr_auto] items-center gap-4 p-4 sm:grid-cols-[96px_1fr_auto_auto] sm:gap-6 sm:p-5"
              >
                <Link
                  href={`/product/${product.slug}`}
                  className="relative block aspect-square overflow-hidden rounded-md bg-surface-2"
                >
                  <Image
                    src={coverImage(product)}
                    alt={product.name}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </Link>

                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-wider2 text-ink-2">
                    {product.sku}
                  </p>
                  <Link
                    href={`/product/${product.slug}`}
                    className="mt-0.5 line-clamp-1 font-serif text-base text-ink transition-colors hover:text-brand sm:text-lg"
                  >
                    {product.name}
                  </Link>
                  {product.specification ? (
                    <p className="mt-0.5 line-clamp-1 text-xs text-ink-2">
                      {product.specification}
                      {product.sizeLabel ? ` · ${product.sizeLabel}` : null}
                    </p>
                  ) : null}
                  <PriceTag
                    price={product.price}
                    salePrice={product.salePrice}
                    size="sm"
                    className="mt-1.5 sm:hidden"
                  />
                </div>

                <PriceTag
                  price={product.price}
                  salePrice={product.salePrice}
                  size="md"
                  className="hidden sm:block"
                />

                <div className="col-span-3 flex flex-wrap justify-end gap-2 sm:col-span-1">
                  <button
                    type="button"
                    data-testid={`wishlist-list-move-${product.slug}`}
                    onClick={() => handleMove(product)}
                    disabled={addToCart.isPending}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full bg-ink px-4 text-[10px] font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold hover:text-ink disabled:opacity-50"
                  >
                    <ShoppingBag className="size-3.5" /> Move to cart
                  </button>
                  <button
                    type="button"
                    data-testid={`wishlist-list-remove-${product.slug}`}
                    onClick={() => handleRemove(product)}
                    aria-label="Remove from wishlist"
                    className="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-danger hover:text-danger"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ---------- Footer ---------- */}
      {!isLoading && !isError && items.length > 0 ? (
        <div className="mt-12 flex justify-center border-t border-border pt-8">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-2 transition-colors hover:text-gold"
          >
            Continue shopping
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}