'use client';

import Image from 'next/image';
import Link from 'next/link';
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

  const [scrolled, setScrolled] = useState(false);

  const cartCount =
    cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  const wishlistCount = wishlist?.length ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();

    window.addEventListener('scroll', onScroll, {
      passive: true,
    });

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Header spacer */}
      <div
        data-testid="site-header-spacer"
        aria-hidden="true"
        className="h-[62px] sm:h-[68px] lg:h-[78px]"
      />

      <header
        data-testid="site-header"
        data-scrolled={scrolled}
        className={`fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur-2xl transition-[background-color,box-shadow,border-color] duration-300 ${
          scrolled
            ? 'border-border/70 bg-bg/78 shadow-[0_8px_24px_-18px_rgba(30,26,24,0.28)]'
            : 'border-border/40 bg-bg/65 shadow-[0_8px_24px_-20px_rgba(30,26,24,0.12)]'
        }`}
      >
        {/* Premium top accent */}
        <div
          data-testid="site-announcement"
          className="h-[2px] bg-brand"
          aria-label="Crafted in Panipat and trusted across India"
        />

        <div
          className={`mx-auto flex w-full max-w-[1440px] items-center gap-2 px-4 transition-[height] duration-300 sm:gap-3 sm:px-8 lg:gap-6 lg:px-16 ${
            scrolled
              ? 'h-[56px] sm:h-[62px] lg:h-[68px]'
              : 'h-[60px] sm:h-[66px] lg:h-[76px]'
          }`}
        >
          {/* Mobile menu */}
          <button
            type="button"
            data-testid="nav-mobile-hamburger"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full text-ink transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-surface-2 hover:text-brand sm:size-10 lg:hidden"
          >
            <Menu size={21} />
          </button>

          {/* Logo */}
          <Link
            href="/"
            data-testid="site-logo"
            aria-label="Bhavita Textiles — home"
            className="group flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3.5 lg:flex-none"
          >
            <span
              className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5efe0] shadow-sm ring-1 ring-gold/40 transition-[height,width,transform] duration-300 group-hover:scale-[1.03] ${
                scrolled
                  ? 'size-8 sm:size-9 lg:size-10'
                  : 'size-9 sm:size-10 lg:size-[48px]'
              }`}
              aria-hidden="true"
            >
              <Image
                src="/icons/logo.jpg"
                alt=""
                width={112}
                height={112}
                priority
                className="h-[170%] w-[170%] max-w-none object-cover object-center"
              />
            </span>

            <span className="flex min-w-0 flex-col justify-center leading-none">
              <span
                className={`truncate font-serif font-medium tracking-[0.01em] text-ink transition-[font-size,color] duration-300 group-hover:text-gold ${
                  scrolled
                    ? 'text-[16px] sm:text-[18px] lg:text-[20px]'
                    : 'text-[17px] sm:text-[20px] lg:text-[24px]'
                }`}
              >
                Bhavita Textiles
              </span>

              <span className="mt-1 hidden text-[9px] font-medium uppercase tracking-[0.28em] text-gold sm:block sm:text-[9px]">
                Panipat · Est. 1979
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-0.5 lg:flex xl:gap-1"
            aria-label="Primary navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={link.testid}
                className="group relative whitespace-nowrap rounded-full px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.17em] text-ink transition-[color,background-color] duration-200 hover:bg-surface-2/70 hover:text-ink xl:px-4"
              >
                {link.label}

                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-3 -bottom-0.5 h-px origin-center scale-x-0 bg-gold transition-transform duration-300 group-hover:scale-x-100 xl:inset-x-4"
                />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            <Link
              href="/account/wishlist"
              data-testid="nav-wishlist-link"
              aria-label="Wishlist"
              className="relative inline-flex size-9 items-center justify-center rounded-full text-ink-2 transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-surface-2/70 hover:text-brand sm:size-10"
            >
              <Heart size={19} />

              <CountPill
                value={wishlistCount}
                testid="nav-wishlist-count"
              />
            </Link>

            <Link
              href="/cart"
              data-testid="nav-cart-link"
              aria-label="Shopping cart"
              className="relative inline-flex size-9 items-center justify-center rounded-full text-ink-2 transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-surface-2/70 hover:text-brand sm:size-10"
            >
              <ShoppingBag size={19} />

              <CountPill value={cartCount} testid="nav-cart-count" />
            </Link>

            <span className="ml-1 hidden sm:inline-flex">
              <ThemeToggle />
            </span>
          </div>
        </div>
      </header>

      <MobileNav />
    </>
  );
}