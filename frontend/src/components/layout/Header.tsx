'use client';

import Link from 'next/link';
import {
  Heart,
  Menu,
  ShoppingBag,
} from 'lucide-react';

import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useUIStore } from '@/store/ui.store';

import MobileNav from '@/components/layout/MobileNav';
import ThemeToggle from '@/components/layout/ThemeToggle';

function CountPill({
  value,
  testid,
}: {
  value: number;
  testid: string;
}) {
  return value > 0 ? (
    <span
      data-testid={testid}
      className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink"
    >
      {value > 99 ? '99+' : value}
    </span>
  ) : null;
}

export default function Header() {
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

  const setMobileNavOpen = useUIStore(
    (state) => state.setMobileNavOpen,
  );

  const cartCount =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity,
      0,
    ) ?? 0;

  const wishlistCount = wishlist?.length ?? 0;

  return (
    <>
      <header
        data-testid="site-header"
        className="fixed inset-x-0 top-0 z-40 w-full border-b border-border/80 bg-bg/95 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-[88px] max-w-[1440px] items-center gap-4 px-5 sm:px-10 lg:h-[96px] lg:gap-6 lg:px-16">

          {/* Mobile Menu Button */}
          <button
            type="button"
            data-testid="nav-mobile-hamburger"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex size-12 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-surface-2 hover:text-gold-2 lg:hidden"
          >
            <Menu size={24} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            data-testid="site-logo"
            className="flex shrink-0 items-center gap-3 sm:gap-4"
          >
            {/* B Circle */}
            <div className="flex size-[48px] shrink-0 items-center justify-center rounded-full bg-[#7d2c28] text-white shadow-sm sm:size-[56px]">
              <span className="font-serif text-[24px] leading-none sm:text-[28px]">
                B
              </span>
            </div>

            {/* Brand Text */}
            <div className="flex flex-col justify-center">
              <span className="font-serif text-[21px] font-medium leading-tight tracking-[0.02em] text-[#6f3931] sm:text-[30px]">
                Bhavita Textiles
              </span>

              <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.28em] text-ink-2 sm:block sm:text-[10px]">
                Panipat · Est. 2017
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-8 xl:gap-10 lg:flex"
            aria-label="Primary navigation"
          >
            <Link
              href="/"
              data-testid="nav-home-link"
              className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-gold-2"
            >
              Home
            </Link>

            <Link
              href="/shop"
              data-testid="nav-catalogue-link"
              className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-gold-2"
            >
              Catalogue
            </Link>

            <Link
              href="/about"
              data-testid="nav-about-link"
              className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-gold-2"
            >
              Our Heritage
            </Link>

            <Link
              href="/contact"
              data-testid="nav-contact-link"
              className="whitespace-nowrap text-[13px] font-bold uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-gold-2"
            >
              Bulk Enquiry
            </Link>
          </nav>

          {/* Header Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-2">

            {/* Wishlist */}
            <Link
              href="/account/wishlist"
              data-testid="nav-wishlist-link"
              aria-label="Wishlist"
              className="relative inline-flex size-12 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-gold-2"
            >
              <Heart size={22} />

              <CountPill
                value={wishlistCount}
                testid="nav-wishlist-count"
              />
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              data-testid="nav-cart-link"
              aria-label="Shopping cart"
              className="relative inline-flex size-12 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-gold-2"
            >
              <ShoppingBag size={22} />

              <CountPill
                value={cartCount}
                testid="nav-cart-count"
              />
            </Link>

            {/* Theme Toggle */}
            <span className="hidden sm:inline-flex">
              <ThemeToggle />
            </span>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav />
    </>
  );
}