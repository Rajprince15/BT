
'use client';

import Link from 'next/link';
import {
  Heart,
  Menu,
  Search,
  ShoppingBag,
  ArrowUpRight,
} from 'lucide-react';

import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useUIStore } from '@/store/ui.store';

import MobileNav from '@/components/layout/MobileNav';
import SearchCommand from '@/components/layout/SearchCommand';
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
      className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink"
    >
      {value > 99 ? '99+' : value}
    </span>
  ) : null;
}

export default function Header() {
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();

  const setMobileNavOpen = useUIStore(
    (state) => state.setMobileNavOpen
  );

  const setSearchOpen = useUIStore(
    (state) => state.setSearchOpen
  );

  const cartCount =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) ?? 0;

  const wishlistCount = wishlist?.length ?? 0;

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-xl"
    >
      <div className="mx-auto flex h-[78px] max-w-[1440px] items-center gap-6 px-5 sm:px-10 lg:h-[88px] lg:px-16">
        {/* Mobile Menu Button */}
        <button
          type="button"
          data-testid="nav-mobile-hamburger"
          aria-label="Open menu"
          onClick={() => setMobileNavOpen(true)}
          className="text-ink lg:hidden"
        >
          <Menu size={21} />
        </button>

        {/* Logo */}
        <Link
          href="/"
          data-testid="site-logo"
          className="flex items-baseline gap-2"
        >
          <span className="font-serif text-[27px] font-semibold tracking-[0.22em] text-ink">
            BHAVITA
          </span>

          <span className="hidden text-[9px] font-bold uppercase tracking-[0.3em] text-gold-2 sm:inline">
            Textiles
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="ml-8 hidden flex-1 items-center gap-8 lg:flex"
          aria-label="Primary navigation"
        >
          <Link
            href="/"
            data-testid="nav-home-link"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-gold-2"
          >
            Home
          </Link>

          <Link
            href="/products"
            data-testid="nav-catalogue-link"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-gold-2"
          >
            Catalogue
          </Link>

          <Link
            href="/about"
            data-testid="nav-about-link"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-gold-2"
          >
            Our Mill
          </Link>

          <Link
            href="/contact"
            data-testid="nav-contact-link"
            className="text-[11px] font-bold uppercase tracking-[0.16em] text-ink-2 transition-colors hover:text-gold-2"
          >
            Contact
          </Link>
        </nav>

        {/* Header Actions */}
        <div className="ml-auto flex items-center gap-1.5">
          <button
            type="button"
            data-testid="nav-search-trigger"
            aria-label="Open search"
            onClick={() => setSearchOpen(true)}
            className="inline-flex size-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-gold-2"
          >
            <Search size={18} />
          </button>

          <Link
            href="/account/wishlist"
            data-testid="nav-wishlist-link"
            aria-label="Wishlist"
            className="relative inline-flex size-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-gold-2"
          >
            <Heart size={18} />

            <CountPill
              value={wishlistCount}
              testid="nav-wishlist-count"
            />
          </Link>

          <Link
            href="/cart"
            data-testid="nav-cart-link"
            aria-label="Shopping cart"
            className="relative inline-flex size-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-gold-2"
          >
            <ShoppingBag size={18} />

            <CountPill
              value={cartCount}
              testid="nav-cart-count"
            />
          </Link>

          <span className="hidden sm:inline-flex">
            <ThemeToggle />
          </span>

          <Link
            href="/wholesale"
            data-testid="nav-wholesale-link"
            className="ml-2 hidden items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-gold hover:text-ink xl:inline-flex"
          >
            Bulk Enquiry
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>

      <MobileNav />
      <SearchCommand />
    </header>
  );
}
