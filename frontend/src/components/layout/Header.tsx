'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Menu, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useUIStore } from '@/store/ui.store';

import MobileNav from '@/components/layout/MobileNav';
import ThemeToggle from '@/components/layout/ThemeToggle';

function CountPill({ value, testid }: { value: number; testid: string }) {
  return value > 0 ? (
    <span
      data-testid={testid}
      className="absolute -right-1 -top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-brand-ink shadow-sm ring-2 ring-bg"
    >
      {value > 99 ? '99+' : value}
    </span>
  ) : null;
}

const NAV_LINKS: Array<{ href: string; label: string; testid: string }> = [
  { href: '/', label: 'Home', testid: 'nav-home-link' },
  { href: '/shop', label: 'Catalogue', testid: 'nav-catalogue-link' },
  { href: '/about', label: 'Our Heritage', testid: 'nav-about-link' },
  { href: '/contact', label: 'Bulk Enquiry', testid: 'nav-contact-link' },
];

export default function Header() {
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  // Elevate the header on scroll for a subtle premium feel
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Announcement strip */}
      <div
        data-testid="site-announcement"
        className="relative z-50 hidden bg-brand text-brand-ink sm:block"
      >
        <div className="mx-auto flex h-9 max-w-[1440px] items-center justify-center px-5 text-center text-[11px] font-medium uppercase tracking-[0.22em] sm:px-10 lg:px-16">
          Crafted in Panipat · Trusted by hospitality &amp; retail across India
        </div>
      </div>

      <header
        data-testid="site-header"
        className={
          'sticky top-0 z-40 w-full border-b transition-[background-color,box-shadow,border-color] duration-300 ' +
          (scrolled
            ? 'border-border/80 bg-bg/95 shadow-[0_10px_30px_-24px_rgba(28,26,23,0.5)] backdrop-blur-xl'
            : 'border-transparent bg-bg/85 backdrop-blur-lg')
        }
      >
        <div className="mx-auto flex h-[68px] w-full max-w-[1440px] items-center gap-2 px-4 sm:h-[76px] sm:gap-3 sm:px-8 lg:h-[88px] lg:gap-6 lg:px-16">
          {/* Mobile Menu Button */}
          <button
            type="button"
            data-testid="nav-mobile-hamburger"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex size-10 shrink-0 items-center justify-center rounded-full text-ink transition-all hover:bg-surface-2 hover:text-brand sm:size-11 lg:hidden"
          >
            <Menu size={22} />
          </button>

          {/* Logo lockup */}
          <Link
            href="/"
            data-testid="site-logo"
            aria-label="Bhavita Textiles — home"
            className="group flex min-w-0 flex-1 items-center gap-2.5 sm:gap-4 lg:flex-none"
          >
            {/* Real logo mark inside a cream disc — visible in both themes */}
            <span
              className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5efe0] shadow-sm ring-1 ring-gold/40 transition-transform duration-500 group-hover:scale-[1.04] sm:size-12 lg:size-[56px]"
              aria-hidden
            >
              <Image
                src="/icons/logo.jpg"
                alt=""
                width={112}
                height={112}
                priority
                className="h-[170%] w-[170%] max-w-none object-cover object-center"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-full opacity-0 ring-2 ring-gold transition-opacity duration-300 group-hover:opacity-100"
              />
            </span>

            <span className="flex min-w-0 flex-col justify-center leading-none">
              <span className="truncate font-serif text-[18px] font-medium tracking-[0.01em] text-ink transition-colors group-hover:text-gold sm:text-[22px] lg:text-[26px]">
                Bhavita Textiles
              </span>
              <span className="mt-1.5 hidden text-[9px] font-medium uppercase tracking-[0.32em] text-gold sm:block sm:text-[10px]">
                Panipat · Est. 2017
              </span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-1 lg:flex xl:gap-2"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={link.testid}
                className="group relative whitespace-nowrap rounded-full px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.18em] text-ink-2 transition-colors hover:text-gold xl:px-5"
              >
                {link.label}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-4 -bottom-0.5 h-px origin-center scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            ))}
          </nav>

          {/* Header Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-2">
            <Link
              href="/account/wishlist"
              data-testid="nav-wishlist-link"
              aria-label="Wishlist"
              className="relative inline-flex size-10 items-center justify-center rounded-full text-ink-2 transition-all hover:-translate-y-0.5 hover:bg-surface-2 hover:text-gold sm:size-11"
            >
              <Heart size={20} />
              <CountPill value={wishlistCount} testid="nav-wishlist-count" />
            </Link>

            <Link
              href="/cart"
              data-testid="nav-cart-link"
              aria-label="Shopping cart"
              className="relative inline-flex size-10 items-center justify-center rounded-full text-ink-2 transition-all hover:-translate-y-0.5 hover:bg-surface-2 hover:text-gold sm:size-11"
            >
              <ShoppingBag size={20} />
              <CountPill value={cartCount} testid="nav-cart-count" />
            </Link>

            <span className="ml-1 hidden sm:inline-flex">
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
