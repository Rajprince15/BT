'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const LINKS: Array<{ href: string; label: string }> = [
  { href: '/account/profile', label: 'Profile' },
  { href: '/account/addresses', label: 'Addresses' },
  { href: '/account/orders', label: 'Orders' },
  { href: '/account/wishlist', label: 'Wishlist' },
  { href: '/account/notifications', label: 'Notifications' },
];

export default function AccountSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  return (
    <nav
      data-testid="account-sidebar"
      aria-label="Account navigation"
      className={cn('grid gap-1', className)}
    >
      {LINKS.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            data-testid={`account-sidebar-link-${link.label.toLowerCase()}`}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded px-3 py-2 text-sm transition-colors',
              active ? 'bg-gold-soft/40 font-semibold text-ink' : 'text-ink-2 hover:text-gold',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
