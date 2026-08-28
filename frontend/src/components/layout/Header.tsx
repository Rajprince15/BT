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
    <span data-testid={testid} className="absolute -right-1 -top-1 min-w-4 bg-ink px-1 text-center text-[9px] leading-4 text-bg">
      {value > 99 ? '99+' : value}
    </span>
  ) : null;
}

const links = [
  { href: '/', label: 'Home', testid: 'nav-home-link' },
  { href: '/shop', label: 'Catalogue', testid: 'nav-catalogue-link' },
  { href: '/about', label: 'Our Heritage', testid: 'nav-about-link' },
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
      <div data-testid="site-announcement" className="hidden border-b border-ink/10 bg-ink px-4 py-2 text-center text-[9px] uppercase tracking-[0.28em] text-bg sm:block">
        Made in Panipat · Crafted for considered spaces
      </div>
      <header data-testid="site-header" className={`sticky top-0 z-40 border-b ${scrolled ? 'border-border/80 bg-bg/95 backdrop-blur-xl' : 'border-transparent bg-bg/90 backdrop-blur-md'}`}>
        <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-4 px-5 sm:px-8 lg:h-[92px] lg:px-14">
          <button type="button" data-testid="nav-mobile-hamburger" aria-label="Open menu" onClick={() => setMobileNavOpen(true)} className="inline-flex size-10 items-center justify-center text-ink lg:hidden">
            <Menu size={20} strokeWidth={1.5} />
          </button>

          <Link href="/" data-testid="site-logo" aria-label="Bhavita Textiles — home" className="group flex min-w-0 items-center gap-3 lg:w-[250px]">
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden bg-[#eee6d8] ring-1 ring-gold/50 sm:size-12">
              <Image src="/icons/logo.jpg" alt="" width={96} height={96} priority className="h-[170%] w-[170%] max-w-none object-cover" />
            </span>
            <span className="min-w-0 leading-none">
              <span className="block truncate font-serif text-[22px] text-ink transition-colors group-hover:text-gold-2 sm:text-[25px]">Bhavita Textiles</span>
              <span className="mt-2 hidden text-[9px] uppercase tracking-[0.3em] text-ink-2 sm:block">Panipat · Est. 2017</span>
            </span>
          </Link>

          <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex" aria-label="Primary navigation">
            {links.map((link) => (
              <Link key={link.href} href={link.href} data-testid={link.testid} className="group relative py-3 text-[10px] uppercase tracking-[0.2em] text-ink-2 hover:text-ink">
                {link.label}
                <span aria-hidden className="absolute inset-x-0 bottom-1 h-px origin-left scale-x-0 bg-gold-2 transition-transform duration-300 group-hover:scale-x-100" />
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button type="button" data-testid="nav-search-button" aria-label="Search catalogue" onClick={() => setSearchOpen(true)} className="inline-flex size-10 items-center justify-center text-ink-2 hover:text-gold-2"><Search size={19} strokeWidth={1.5} /></button>
            <Link href="/account/wishlist" data-testid="nav-wishlist-link" aria-label="Wishlist" className="relative inline-flex size-10 items-center justify-center text-ink-2 hover:text-gold-2"><Heart size={19} strokeWidth={1.5} /><Count value={wishlistCount} testid="nav-wishlist-count" /></Link>
            <Link href="/cart" data-testid="nav-cart-link" aria-label="Shopping cart" className="relative inline-flex size-10 items-center justify-center text-ink-2 hover:text-gold-2"><ShoppingBag size={19} strokeWidth={1.5} /><Count value={cartCount} testid="nav-cart-count" /></Link>
            <span className="hidden border-l border-border pl-2 sm:inline-flex"><ThemeToggle /></span>
          </div>
        </div>
      </header>
      <MobileNav />
      <SearchCommand />
    </>
  );
}