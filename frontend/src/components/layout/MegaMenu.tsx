'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useCategories } from '@/hooks/useCategories';
import type { Category } from '@/types/Category';

const PINNED_SLUGS = [
  'bedroom',
  'living-room',
  'rugs-carpets',
  'door-mats',
  'bath',
  'home-decor',
  'handloom-heritage',
  'gift-collection',
  'special-collections',
];

const EDITORIAL = [
  { src: '/images/editorial/handloom-heritage.svg', label: 'Handloom Heritage' },
  { src: '/images/editorial/premium-cotton.svg', label: 'Premium Cotton' },
  { src: '/images/editorial/royal-collection.svg', label: 'Royal Collection' },
  { src: '/images/editorial/festive-wear.svg', label: 'Festive Edit' },
];

function buildColumns(all: Category[]) {
  const bySlug = new Map(all.map((c) => [c.slug, c]));
  return PINNED_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean) as Category[];
}

function childrenOf(parent: Category, all: Category[]) {
  return all
    .filter((c) => c.parentId === parent.id && c.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .slice(0, 6);
}

export default function MegaMenu() {
  const { data: tree } = useCategories();
  const all = tree ?? [];
  const columns = buildColumns(all);

  return (
    <NavigationMenu data-testid="mega-menu" viewport={false}>
      <NavigationMenuList className="gap-1">
        <NavigationMenuItem>
          <NavigationMenuTrigger
            data-testid="mega-menu-trigger-shop"
            className="bg-transparent font-sans text-[13px] uppercase tracking-[0.18em] text-[var(--ink)] hover:bg-transparent hover:text-[var(--gold)] data-[state=open]:bg-transparent data-[state=open]:text-[var(--gold)]"
          >
            Shop
          </NavigationMenuTrigger>
          <NavigationMenuContent
            data-testid="mega-menu-panel"
            className="left-0 w-screen max-w-none rounded-none border-t border-[var(--gold-soft)] bg-[var(--surface)] p-0 shadow-lg"
          >
            <div className="mx-auto grid max-w-[1400px] grid-cols-12 gap-8 px-10 py-10">
              <div className="col-span-8 grid grid-cols-3 gap-x-8 gap-y-10">
                {columns.slice(0, 6).map((col) => (
                  <div key={col.id} data-testid={`mega-menu-column-${col.slug}`}>
                    <Link
                      href={`/shop/${col.slug}`}
                      className="font-serif text-base text-[var(--navy)] hover:text-[var(--gold)]"
                    >
                      {col.name}
                    </Link>
                    <span className="mt-1 block h-px w-8 bg-[var(--gold)]" />
                    <ul className="mt-4 space-y-2">
                      {childrenOf(col, all).map((child) => (
                        <li key={child.id}>
                          <NavigationMenuLink asChild>
                            <Link
                              href={`/shop/${child.slug}`}
                              className="block bg-transparent p-0 text-[13px] text-[var(--ink-2)] hover:text-[var(--gold)] focus:bg-transparent focus:text-[var(--gold)]"
                            >
                              {child.name}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="col-span-4 grid grid-cols-2 gap-4">
                {EDITORIAL.map((ed) => (
                  <Link
                    key={ed.label}
                    href="/shop"
                    data-testid={`mega-menu-editorial-${ed.label.toLowerCase().replace(/\s+/g, '-')}`}
                    className="group relative block aspect-[3/4] overflow-hidden border border-[var(--gold-soft)]"
                  >
                    <Image
                      src={ed.src}
                      alt={ed.label}
                      fill
                      sizes="(min-width: 1024px) 200px, 50vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 font-serif text-sm text-[var(--bg)]">
                      {ed.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {[
          { label: 'Wholesale', href: '/wholesale' },
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ].map((item) => (
          <NavigationMenuItem key={item.href}>
            <NavigationMenuLink asChild>
              <Link
                href={item.href}
                data-testid={`nav-${item.label.toLowerCase()}`}
                className="bg-transparent px-3 py-2 font-sans text-[13px] uppercase tracking-[0.18em] text-[var(--ink)] hover:bg-transparent hover:text-[var(--gold)] focus:bg-transparent focus:text-[var(--gold)]"
              >
                {item.label}
              </Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
