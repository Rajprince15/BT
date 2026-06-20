'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
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

export default function MobileNav() {
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);
  const { data: tree } = useCategories();
  const all = tree ?? [];
  const top = TOP_SLUGS.map((slug) => all.find((c) => c.slug === slug)).filter(Boolean) as typeof all;

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        data-testid="mobile-nav-drawer"
        side="left"
        className="w-[88vw] max-w-[420px] border-r border-[var(--gold-soft)] bg-[var(--surface)] p-0 text-[var(--ink)]"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-[var(--gold-soft)] px-6 py-5">
          <SheetTitle className="font-serif text-xl tracking-[0.18em] text-[var(--navy)]">
            BHAVITA
          </SheetTitle>
          <button
            type="button"
            data-testid="mobile-nav-close"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-[var(--ink-2)] hover:text-[var(--gold)]"
          >
            <X size={20} />
          </button>
        </SheetHeader>

        <div className="flex h-[calc(100%-72px)] flex-col overflow-y-auto px-2 pb-8">
          <div className="px-4 py-4">
            <Link
              href="/auth/login"
              onClick={() => setOpen(false)}
              data-testid="mobile-nav-login"
              className="block w-full border border-[var(--gold)] py-3 text-center font-sans text-[12px] uppercase tracking-[0.24em] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--surface)]"
              style={{ transition: 'background-color 200ms, color 200ms' }}
            >
              Sign in / Register
            </Link>
          </div>

          <Accordion type="multiple" className="px-4">
            {top.map((parent) => {
              const children = all
                .filter((c) => c.parentId === parent.id && c.isActive)
                .sort((a, b) => a.sortOrder - b.sortOrder);
              return (
                <AccordionItem key={parent.id} value={parent.slug} className="border-b border-[var(--gold-soft)]">
                  <AccordionTrigger
                    data-testid={`mobile-nav-cat-${parent.slug}`}
                    className="py-4 font-serif text-base text-[var(--ink)] hover:no-underline"
                  >
                    {parent.name}
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <ul className="space-y-3 pl-2">
                      <li>
                        <Link
                          href={`/shop/${parent.slug}`}
                          onClick={() => setOpen(false)}
                          className="text-[13px] text-[var(--gold)] hover:underline"
                        >
                          View all {parent.name}
                        </Link>
                      </li>
                      {children.map((child) => (
                        <li key={child.id}>
                          <Link
                            href={`/shop/${child.slug}`}
                            onClick={() => setOpen(false)}
                            className="block py-1 text-[13px] text-[var(--ink-2)] hover:text-[var(--gold)]"
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

          <div className="mt-6 space-y-1 px-6">
            {[
              { label: 'Wholesale', href: '/wholesale' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
              { label: 'Privacy', href: '/privacy' },
              { label: 'Terms', href: '/terms' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                data-testid={`mobile-nav-link-${link.label.toLowerCase()}`}
                className="block py-2 font-sans text-[12px] uppercase tracking-[0.22em] text-[var(--ink-2)] hover:text-[var(--gold)]"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto flex items-center justify-between border-t border-[var(--gold-soft)] px-6 pt-6">
            <span className="font-sans text-[11px] uppercase tracking-[0.2em] text-[var(--ink-2)]">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
