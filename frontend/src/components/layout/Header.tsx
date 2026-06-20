'use client';

import Link from 'next/link';
import { Menu, Search, Heart, ShoppingBag, User, Bell, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useNotifications } from '@/hooks/useNotifications';
import { useUIStore } from '@/store/ui.store';
import ThemeToggle from '@/components/layout/ThemeToggle';
import MegaMenu from '@/components/layout/MegaMenu';
import MobileNav from '@/components/layout/MobileNav';
import SearchCommand from '@/components/layout/SearchCommand';

function CountPill({ value, testid }: { value: number; testid: string }) {
  if (value <= 0) return null;
  return (
    <span
      data-testid={testid}
      className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gold)] px-1 font-sans text-[10px] font-semibold text-[var(--surface)]"
    >
      {value > 99 ? '99+' : value}
    </span>
  );
}

export default function Header() {
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const { data: notifications } = useNotifications();
  const announcementClosed = useUIStore((s) => s.announcementClosed);
  const closeAnnouncement = useUIStore((s) => s.closeAnnouncement);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);

  const cartCount = cart?.items?.reduce((s, i) => s + i.quantity, 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-40 border-b border-[var(--gold-soft)] bg-[var(--surface)]/95 backdrop-blur-md"
    >
      {!announcementClosed && (
        <div
          data-testid="announcement-bar"
          className="relative bg-[var(--navy)] py-2 text-center font-sans text-[11px] uppercase tracking-[0.2em] text-[var(--bg)]"
        >
          <span>
            Free shipping on orders above ₹2,499 · Handcrafted in India
          </span>
          <button
            type="button"
            data-testid="announcement-close"
            aria-label="Close announcement"
            onClick={closeAnnouncement}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--bg)]/80 hover:text-[var(--gold)]"
          >
            <X size={14} />
          </button>
        </div>
      )}

      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-4 px-4 sm:px-6 lg:h-20 lg:px-10">
        <button
          type="button"
          data-testid="nav-mobile-hamburger"
          aria-label="Open menu"
          onClick={() => setMobileNavOpen(true)}
          className="text-[var(--ink)] hover:text-[var(--gold)] lg:hidden"
        >
          <Menu size={22} />
        </button>

        <Link
          href="/"
          data-testid="site-logo"
          className="flex-1 text-center lg:flex-initial lg:text-left"
        >
          <span className="font-serif text-2xl tracking-[0.32em] text-[var(--navy)] lg:text-3xl">
            BHAVITA
          </span>
          <span className="ml-2 hidden font-sans text-[10px] uppercase tracking-[0.34em] text-[var(--gold)] lg:inline">
            Textiles
          </span>
        </Link>

        <nav className="ml-8 hidden flex-1 lg:flex" aria-label="Primary">
          <MegaMenu />
        </nav>

        <div className="flex items-center gap-1">
          <button
            type="button"
            data-testid="nav-search-trigger"
            aria-label="Open search"
            onClick={() => setSearchOpen(true)}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink)] hover:text-[var(--gold)]"
          >
            <Search size={18} />
          </button>

          <Link
            href="/account/wishlist"
            data-testid="nav-wishlist-link"
            aria-label="Wishlist"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink)] hover:text-[var(--gold)]"
          >
            <Heart size={18} />
            <CountPill value={wishlistCount} testid="nav-wishlist-count" />
          </Link>

          <Link
            href="/cart"
            data-testid="nav-cart-link"
            aria-label="Shopping cart"
            className="relative inline-flex h-9 w-9 items-center justify-center rounded-full text-[var(--ink)] hover:text-[var(--gold)]"
          >
            <ShoppingBag size={18} />
            <CountPill value={cartCount} testid="nav-cart-count" />
          </Link>

          <Link
            href="/account/notifications"
            data-testid="nav-notification-bell"
            aria-label="Notifications"
            className="relative hidden h-9 w-9 items-center justify-center rounded-full text-[var(--ink)] hover:text-[var(--gold)] sm:inline-flex"
          >
            <Bell size={18} />
            <CountPill value={unreadCount} testid="nav-notification-count" />
          </Link>

          <Link
            href="/account"
            data-testid="nav-account-menu"
            aria-label="Account"
            className="hidden h-9 w-9 items-center justify-center rounded-full text-[var(--ink)] hover:text-[var(--gold)] sm:inline-flex"
          >
            <User size={18} />
          </Link>

          <span className="ml-1 hidden sm:inline-flex">
            <ThemeToggle />
          </span>
        </div>
      </div>

      <MobileNav />
      <SearchCommand />
    </header>
  );
}
