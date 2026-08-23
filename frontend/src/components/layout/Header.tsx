'use client';

import Link from 'next/link';
import { Menu, Search, Heart, ShoppingBag, User, Bell, X, ArrowUpRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import { useNotifications } from '@/hooks/useNotifications';
import { useUIStore } from '@/store/ui.store';
import ThemeToggle from '@/components/layout/ThemeToggle';
import MegaMenu from '@/components/layout/MegaMenu';
import MobileNav from '@/components/layout/MobileNav';
import SearchCommand from '@/components/layout/SearchCommand';

function CountPill({ value, testid }: { value: number; testid: string }) {
  return value > 0 ? <span data-testid={testid} className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">{value > 99 ? '99+' : value}</span> : null;
}

export default function Header() {
  const { data: cart } = useCart();
  const { data: wishlist } = useWishlist();
  const { data: notifications } = useNotifications();
  const announcementClosed = useUIStore((s) => s.announcementClosed);
  const closeAnnouncement = useUIStore((s) => s.closeAnnouncement);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const cartCount = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
  const wishlistCount = wishlist?.length ?? 0;
  const unreadCount = notifications?.filter((item) => !item.read).length ?? 0;

  return (
    <header data-testid="site-header" className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-xl">
      {!announcementClosed && <div data-testid="announcement-bar" className="relative bg-navy px-4 py-2 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-bg">Panipat · India&apos;s Home-Textile Capital <button type="button" data-testid="announcement-close" aria-label="Close announcement" onClick={closeAnnouncement} className="absolute right-4 top-1/2 -translate-y-1/2 text-bg/70 transition-colors hover:text-gold"><X size={14} /></button></div>}
      <div className="mx-auto flex h-[76px] max-w-[1440px] items-center gap-5 px-5 sm:px-8 lg:h-[88px] lg:px-12">
        <button type="button" data-testid="nav-mobile-hamburger" aria-label="Open menu" onClick={() => setMobileNavOpen(true)} className="text-navy lg:hidden"><Menu size={21} /></button>
        <Link href="/" data-testid="site-logo" className="group flex items-baseline gap-2"><span className="font-serif text-[28px] font-semibold tracking-[0.22em] text-navy">BHAVITA</span><span className="hidden text-[9px] font-bold uppercase tracking-[0.3em] text-gold-2 sm:inline">Textiles</span></Link>
        <nav className="ml-8 hidden flex-1 lg:block" aria-label="Primary"><MegaMenu /></nav>
        <div className="ml-auto flex items-center gap-1.5">
          <button type="button" data-testid="nav-search-trigger" aria-label="Open search" onClick={() => setSearchOpen(true)} className="inline-flex size-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-navy"><Search size={18} /></button>
          <Link href="/account/wishlist" data-testid="nav-wishlist-link" aria-label="Wishlist" className="relative inline-flex size-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-navy"><Heart size={18} /><CountPill value={wishlistCount} testid="nav-wishlist-count" /></Link>
          <Link href="/cart" data-testid="nav-cart-link" aria-label="Shopping cart" className="relative inline-flex size-10 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2 hover:text-navy"><ShoppingBag size={18} /><CountPill value={cartCount} testid="nav-cart-count" /></Link>
          <Link href="/account/notifications" data-testid="nav-notification-bell" aria-label="Notifications" className="relative hidden size-10 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-navy sm:inline-flex"><Bell size={18} /><CountPill value={unreadCount} testid="nav-notification-count" /></Link>
          <Link href="/account" data-testid="nav-account-menu" aria-label="Account" className="hidden size-10 items-center justify-center rounded-full text-ink-2 hover:bg-surface-2 hover:text-navy sm:inline-flex"><User size={18} /></Link>
          <span className="hidden sm:inline-flex"><ThemeToggle /></span>
          <Link href="/wholesale" data-testid="nav-wholesale-link" className="ml-2 hidden items-center gap-1 rounded-full bg-navy px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.14em] text-bg transition-colors hover:bg-gold hover:text-ink xl:inline-flex">Bulk Enquiry <ArrowUpRight size={14} /></Link>
        </div>
      </div>
      <MobileNav /><SearchCommand />
    </header>
  );
}