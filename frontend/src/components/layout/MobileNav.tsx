'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Heart, X, ChevronRight, Home, LayoutGrid } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useUIStore } from '@/store/ui.store';
import { useCategories } from '@/hooks/useCategories';
import ThemeToggle from '@/components/layout/ThemeToggle';

const TOP_SLUGS = [
  'bedroom',
  'living-room',
  'bath',
  'home-decor',
  'handloom-heritage',
  'handicrafts',
  'special-collections',
];

// Primary links — kept in sync with the desktop header nav so the mobile
// menu shows the same top-level navigation instead of "different things".
const PRIMARY_LINKS: Array<{ label: string; href: string; icon: React.ReactNode }> = [
  { label: 'Home', href: '/', icon: <Home size={16} /> },
  { label: 'Catalogue', href: '/shop', icon: <LayoutGrid size={16} /> },
];

const SECONDARY_LINKS: Array<{ label: string; href: string }> = [
  { label: 'Our Heritage', href: '/about' },
  { label: 'Bulk Enquiry', href: '/contact' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
];

export default function MobileNav() {
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);
  const { data: tree } = useCategories();
  const all = tree ?? [];
  const top = TOP_SLUGS.map((slug) =>
    all.find((c) => c.slug === slug),
  ).filter(Boolean) as typeof all;

  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        data-testid="mobile-nav-drawer"
        side="left"
        showCloseButton={false}
        className="flex w-[88vw] max-w-[400px] flex-col overflow-x-hidden border-r border-border bg-bg p-0 text-ink"
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between gap-3 border-b border-border bg-surface px-5 py-4 sm:px-6 sm:py-5">
          <SheetTitle className="flex min-w-0 items-center gap-3">
            <span className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5efe0] shadow-sm ring-1 ring-gold/40">
              <Image
                src="/icons/logo.jpg"
                alt=""
                width={96}
                height={96}
                className="h-[170%] w-[170%] max-w-none object-cover object-center"
              />
            </span>
            <span className="flex flex-col min-w-0 leading-none">
              <span className="truncate font-serif text-lg tracking-[0.02em] text-ink sm:text-xl">
                Bhavita Textiles
              </span>
              <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.28em] text-gold">
                Panipat · Est. 1979
              </span>
            </span>
          </SheetTitle>
          <button
            type="button"
            data-testid="mobile-nav-close"
            onClick={close}
            aria-label="Close menu"
            className="inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-gold hover:text-gold"
          >
            <X size={18} />
          </button>
        </SheetHeader>

        <div className="flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3 border-b border-border px-5 py-4 sm:px-6 sm:py-5">
            <Link
              href="/cart"
              onClick={close}
              data-testid="mobile-nav-cart"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-bg transition-colors hover:bg-gold hover:text-ink"
            >
              <ShoppingBag size={14} /> Cart
            </Link>
            <Link
              href="/account/wishlist"
              onClick={close}
              data-testid="mobile-nav-wishlist"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-gold hover:bg-gold-soft hover:text-gold"
            >
              <Heart size={14} /> Wishlist
            </Link>
          </div>

          {/* Primary links (mirrors desktop header nav) */}
          <nav className="border-b border-border px-3 py-2" aria-label="Primary">
            {PRIMARY_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={close}
                data-testid={`mobile-nav-primary-${link.label.toLowerCase()}`}
                className="flex items-center gap-3 rounded-lg px-3 py-3 font-serif text-[17px] text-ink transition-colors hover:bg-surface-2 hover:text-gold"
              >
                <span className="text-gold">{link.icon}</span>
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Secondary Links */}
          <div className="mt-2 border-t border-border px-5 py-4 sm:px-6">
            <p className="pb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-2">
              Company
            </p>
            <ul className="space-y-0.5">
              {SECONDARY_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    data-testid={`mobile-nav-link-${link.label
                      .toLowerCase()
                      .replace(/\s+/g, '-')}`}
                    className="flex items-center justify-between py-2.5 text-[13px] text-ink transition-colors hover:text-gold"
                  >
                    {link.label}
                    <ChevronRight size={14} className="text-ink-2" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme */}
          <div className="mt-auto flex items-center justify-between border-t border-border bg-surface px-5 py-4 sm:px-6 sm:py-5">
            <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-ink-2">
              Appearance
            </span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}