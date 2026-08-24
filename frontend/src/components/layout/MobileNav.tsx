'use client';

import Link from 'next/link';
import { ShoppingBag, Heart, X, ChevronRight } from 'lucide-react';
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
        className="w-[92vw] max-w-[440px] border-r border-border bg-bg p-0 text-ink"
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border bg-surface px-6 py-5">
          <SheetTitle className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-brand text-brand-ink font-serif text-lg">
              B
            </span>
            <span className="font-serif text-xl tracking-[0.02em] text-ink">
              Bhavita Textiles
            </span>
          </SheetTitle>
          <button
            type="button"
            data-testid="mobile-nav-close"
            onClick={close}
            aria-label="Close menu"
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-brand hover:text-brand"
          >
            <X size={18} />
          </button>
        </SheetHeader>

        <div className="flex h-[calc(100%-76px)] flex-col overflow-y-auto">
          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3 border-b border-border px-6 py-5">
            <Link
              href="/cart"
              onClick={close}
              data-testid="mobile-nav-cart"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-bg transition-colors hover:bg-brand"
            >
              <ShoppingBag size={14} /> Cart
            </Link>
            <Link
              href="/account/wishlist"
              onClick={close}
              data-testid="mobile-nav-wishlist"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:border-brand hover:text-brand"
            >
              <Heart size={14} /> Wishlist
            </Link>
          </div>

          {/* Categories */}
          <div className="px-4 py-2">
            <p className="px-2 pb-2 pt-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-ink-2">
              Shop by category
            </p>
            <Accordion type="multiple" className="px-0">
              {top.map((parent) => {
                const children = all
                  .filter((c) => c.parentId === parent.id && c.isActive)
                  .sort((a, b) => a.sortOrder - b.sortOrder);
                return (
                  <AccordionItem
                    key={parent.id}
                    value={parent.slug}
                    className="border-b border-border last:border-b-0"
                  >
                    <AccordionTrigger
                      data-testid={`mobile-nav-cat-${parent.slug}`}
                      className="py-4 font-serif text-[17px] text-ink hover:no-underline"
                    >
                      {parent.name}
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <ul className="space-y-1 pl-2">
                        <li>
                          <Link
                            href={`/shop/${parent.slug}`}
                            onClick={close}
                            className="inline-flex items-center gap-1.5 py-1.5 text-[13px] font-semibold uppercase tracking-[0.14em] text-brand hover:text-brand-2"
                          >
                            View all {parent.name}
                            <ChevronRight size={13} />
                          </Link>
                        </li>
                        {children.map((child) => (
                          <li key={child.id}>
                            <Link
                              href={`/shop/${child.slug}`}
                              onClick={close}
                              className="block py-1.5 text-[13px] text-ink-2 transition-colors hover:text-ink"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </div>

          {/* Secondary Links */}
          <div className="mt-2 border-t border-border px-6 py-4">
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
                    className="flex items-center justify-between py-2.5 text-[13px] text-ink transition-colors hover:text-brand"
                  >
                    {link.label}
                    <ChevronRight size={14} className="text-ink-2" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Theme */}
          <div className="mt-auto flex items-center justify-between border-t border-border bg-surface px-6 py-5">
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
