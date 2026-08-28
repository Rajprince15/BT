'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart, Menu, Search, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useUIStore } from '@/store/ui.store';
import MobileNav from '@/components/layout/MobileNav';
import ThemeToggle from '@/components/layout/ThemeToggle';
import SearchCommand from '@/components/layout/SearchCommand';

function Count({ value, testid }: { value: number; testid: string }) {
  return value > 0 ? (
    <span
      data-testid={testid}
      className="absolute -right-0.5 -top-0.5 inline-flex min-w-[16px] items-center justify-center rounded-full bg-terracotta px-1 text-[9px] leading-[14px] text-bg"
    >
      {value > 99 ? '99+' : value}
    </span>
  ) : null;
}

const links = [
  { href: '/', label: 'home', testid: 'nav-home-link' },
  { href: '/shop', label: 'Catalogue', testid: 'nav-catalogue-link' },
  { href: '/about', label: 'Our Craft', testid: 'nav-about-link' },
  { href: '/wholesale', label: 'Wholesale', testid: 'nav-wholesale-link' },
  { href: '/contact', label: 'Bulk Enquiry', testid: 'nav-contact-link' },
];

export default function Header() {
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen);
  const setSearchOpen = useUIStore((state) => state.setSearchOpen);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div
        data-testid="site-announcement"
        className="hidden border-b border-border bg-ink py-2.5 text-center font-mono text-[9px] uppercase tracking-[0.32em] text-bg sm:block"
      >
        Est. Panipat 2017 · Woven for considered interiors · Trade &amp; Retail
      </div>

      <header
        data-testid="site-header"
        className={`sticky top-0 z-40 transition-colors duration-300 ${
          scrolled
            ? 'border-b border-border bg-bg/92 backdrop-blur-xl'
            : 'border-b border-transparent bg-bg/85 backdrop-blur-md'
        }`}
      >
        <div className="mx-auto flex h-[76px] max-w-[1560px] items-center gap-4 px-5 sm:px-8 lg:h-[92px] lg:px-14">
          <button
            type="button"
            data-testid="nav-mobile-hamburger"
            aria-label="Open menu"
            onClick={() => setMobileNavOpen(true)}
            className="inline-flex size-10 items-center justify-center text-ink lg:hidden"
          >
            <Menu size={20} strokeWidth={1.4} />
          </button>

          <Link
            href="/"
            data-testid="nav-logo"
            aria-label="Bhavita Textiles — home"
            className="group flex min-w-0 items-center gap-3 lg:w-[280px]"
          >
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eee6d8] ring-1 ring-border sm:size-11">
              <Image
                src="/icons/logo.jpg"
                alt=""
                width={96}
                height={96}
                priority
                className="h-[170%] w-[170%] max-w-none object-cover"
              />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block truncate font-serif text-[22px] font-normal tracking-tight text-ink transition-colors group-hover:text-terracotta sm:text-[24px]">
                Bhavita Textiles
              </span>
              <span className="mt-1.5 hidden font-mono text-[9px] uppercase tracking-[0.32em] text-ink-3 sm:block">
                Panipat · Est. MMXVII
              </span>
            </span>
          </Link>

          <nav
            className="hidden flex-1 items-center justify-center gap-8 lg:flex"
            aria-label="Primary navigation"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                data-testid={link.testid}
                className="group relative py-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2 transition-colors hover:text-ink"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-terracotta transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              type="button"
              data-testid="nav-search-button"
              aria-label="Search catalogue"
              onClick={() => setSearchOpen(true)}
              className="inline-flex size-10 items-center justify-center text-ink-2 transition-colors hover:text-terracotta"
            >
              <Search size={18} strokeWidth={1.4} />
            </button>
            <Link
              href="/account/wishlist"
              data-testid="nav-wishlist-link"
              aria-label="Wishlist"
              className="relative inline-flex size-10 items-center justify-center text-ink-2 transition-colors hover:text-terracotta"
            >
              <Heart size={18} strokeWidth={1.4} />
              <Count value={wishlistCount} testid="nav-wishlist-count" />
            </Link>
            <Link
              href="/cart"
              data-testid="nav-cart-link"
              aria-label="Shopping cart"
              className="relative inline-flex size-10 items-center justify-center text-ink-2 transition-colors hover:text-terracotta"
            >
              <ShoppingBag size={18} strokeWidth={1.4} />
              <Count value={cartCount} testid="nav-cart-count" />
            </Link>
            <span className="hidden border-l border-border pl-2 sm:inline-flex">
              <ThemeToggle />
            </span>
          </div>
        </div>
      </header>
      <MobileNav />
      <SearchCommand />
    </>
  );
}
