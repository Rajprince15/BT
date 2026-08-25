'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Bell,
  Heart,
  MapPin,
  Package,
  Star,
  User,
} from 'lucide-react';
import type { ReactNode } from 'react';
import env from '@/lib/env';
import { cn } from '@/lib/utils';

const LINKS: Array<{ href: string; label: string; icon: ReactNode }> = [
  { href: '/account/profile', label: 'Profile', icon: <User className="size-4" /> },
  { href: '/account/orders', label: 'Orders', icon: <Package className="size-4" /> },
  { href: '/account/addresses', label: 'Addresses', icon: <MapPin className="size-4" /> },
  { href: '/account/wishlist', label: 'Wishlist', icon: <Heart className="size-4" /> },
  { href: '/account/reviews', label: 'Reviews', icon: <Star className="size-4" /> },
  { href: '/account/notifications', label: 'Notifications', icon: <Bell className="size-4" /> },
];

export default function AccountShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Frontend-only (mock) mode: account/profile actions are not persisted, so
  // the section navigation is intentionally hidden — render content bare.
  if (env.NEXT_PUBLIC_USE_MOCKS) {
    return (
      <main data-testid="local-account-content" className="bg-bg">
        {children}
      </main>
    );
  }

  return (
    <main data-testid="account-shell" className="bg-bg">
      <div className="mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 md:py-10 lg:px-8">
        {/* Heading */}
        <div className="mb-5 md:mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            Your atelier
          </p>
          <h1 className="mt-2 font-serif text-3xl text-ink sm:text-4xl">Account</h1>
        </div>

        <div className="grid gap-6 md:grid-cols-[220px_minmax(0,1fr)] md:gap-10 lg:gap-14">
          {/* Navigation: horizontal scroll rail on mobile → vertical sidebar on md+ */}
          <nav
            data-testid="account-navigation"
            aria-label="Account navigation"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 sm:-mx-6 sm:px-6 md:mx-0 md:sticky md:top-24 md:h-max md:flex-col md:gap-1 md:overflow-visible md:px-0 md:pb-0"
          >
            {LINKS.map((link) => {
              const active =
                pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  data-testid={`account-nav-${link.label.toLowerCase()}`}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2.5 text-sm font-medium transition-colors md:shrink md:justify-start md:rounded-lg md:px-3',
                    active
                      ? 'bg-gold-soft/50 font-semibold text-ink'
                      : 'bg-surface text-ink-2 hover:text-gold md:bg-transparent md:hover:bg-surface-2',
                  )}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Page content */}
          <section className="min-w-0">{children}</section>
        </div>
      </div>
    </main>
  );
}
