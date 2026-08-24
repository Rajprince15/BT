'use client';

import Link from 'next/link';
import { ArrowRight, Heart, ShoppingBag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

import wishlistService from '@/services/wishlist.service';
import { products } from '@/mocks/products.mock';
import ProductCard from '@/components/product/ProductCard';

export default function WishlistPage() {
  const {
    data: wishlistItems = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.get,
  });

  const items = wishlistItems
    .map((item) => products.find((product) => product.id === item.productId))
    .filter((product): product is (typeof products)[number] => Boolean(product));

  return (
    <div
      data-testid="account-wishlist-page"
      className="w-full"
    >
      {/* Header */}
      <section className="border-b border-ink/10 pb-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-gold">
              <Heart className="size-4 fill-current" />
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em]">
                Saved pieces
              </p>
            </div>

            <h1 className="mt-3 font-serif text-4xl tracking-tight text-ink sm:text-5xl">
              Wishlist
            </h1>

            <p className="mt-3 max-w-xl text-sm leading-6 text-ink/60">
              Keep the pieces you love close. Your saved items will be waiting
              here whenever you are ready.
            </p>
          </div>

          {!isLoading && !isError && items.length > 0 && (
            <p className="text-sm text-ink/50">
              {items.length} {items.length === 1 ? 'piece' : 'pieces'} saved
            </p>
          )}
        </div>
      </section>

      {/* Loading State */}
      {isLoading && (
        <section className="mt-10">
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse"
              >
                <div className="aspect-[4/5] rounded-2xl bg-ink/5" />
                <div className="mt-4 h-4 w-2/3 rounded bg-ink/5" />
                <div className="mt-2 h-4 w-1/3 rounded bg-ink/5" />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Error State */}
      {!isLoading && isError && (
        <section className="mt-10 flex min-h-[360px] flex-col items-center justify-center rounded-3xl border border-ink/10 bg-ink/[0.02] px-6 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-ink/5">
            <Heart className="size-6 text-ink/40" />
          </div>

          <h2 className="mt-5 font-serif text-2xl text-ink">
            We couldn&apos;t load your wishlist
          </h2>

          <p className="mt-2 max-w-md text-sm leading-6 text-ink/60">
            Something went wrong while loading your saved pieces. Please try
            again in a moment.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex h-11 items-center justify-center rounded-full bg-ink px-6 text-[11px] font-semibold uppercase tracking-[0.16em] text-bg transition-all hover:-translate-y-0.5 hover:bg-ink/90"
          >
            Try again
          </button>
        </section>
      )}

      {/* Empty State */}
      {!isLoading && !isError && items.length === 0 && (
        <section className="mt-10 flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-ink/10 bg-ink/[0.02] px-6 py-16 text-center">
          <div className="flex size-20 items-center justify-center rounded-full border border-gold/30 bg-gold/10">
            <Heart className="size-8 text-gold" />
          </div>

          <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            Nothing saved yet
          </p>

          <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
            Your wishlist is waiting.
          </h2>

          <p className="mt-3 max-w-md text-sm leading-6 text-ink/60">
            Explore our collection and save the pieces that catch your eye.
            They&apos;ll appear here for you whenever you come back.
          </p>

          <Link
            href="/shop"
            className="group mt-8 inline-flex h-12 items-center gap-3 rounded-full bg-ink px-7 text-[11px] font-semibold uppercase tracking-[0.16em] text-bg transition-all hover:-translate-y-0.5 hover:bg-ink/90"
          >
            <ShoppingBag className="size-4" />
            Explore collection
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </section>
      )}

      {/* Wishlist Grid */}
      {!isLoading && !isError && items.length > 0 && (
        <section className="mt-10">
          <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
            {items.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>

          {/* Continue Shopping */}
          <div className="mt-16 flex justify-center border-t border-ink/10 pt-10">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink/70 transition-colors hover:text-gold"
            >
              Continue shopping
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>
      )}
    </div>
  );
}