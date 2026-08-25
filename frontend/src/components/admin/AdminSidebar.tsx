'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingBag,
  Users,
  Briefcase,
  Image as ImageIcon,
  MessageSquare,
  History,
  Settings,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface AdminLink {
  href: string;
  label: string;
  icon: ReactNode;
  superAdminOnly?: boolean;
}

const LINKS: AdminLink[] = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="size-4" /> },
  { href: '/admin/products', label: 'Products', icon: <Package className="size-4" /> },
  { href: '/admin/categories', label: 'Categories', icon: <FolderTree className="size-4" /> },
  { href: '/admin/orders', label: 'Orders', icon: <ShoppingBag className="size-4" /> },
  { href: '/admin/customers', label: 'Customers', icon: <Users className="size-4" /> },
  { href: '/admin/wholesale-inquiries', label: 'Wholesale', icon: <Briefcase className="size-4" /> },
  { href: '/admin/banners', label: 'Banners', icon: <ImageIcon className="size-4" /> },
  { href: '/admin/reviews', label: 'Reviews', icon: <MessageSquare className="size-4" /> },
  { href: '/admin/audit-logs', label: 'Audit', icon: <History className="size-4" />, superAdminOnly: true },
  { href: '/admin/settings', label: 'Settings', icon: <Settings className="size-4" />, superAdminOnly: true },
];

interface AdminSidebarProps {
  role?: 'admin' | 'super_admin';
}

export default function AdminSidebar({ role = 'admin' }: AdminSidebarProps) {
  const pathname = usePathname();
  const links = LINKS.filter((link) => !link.superAdminOnly || role === 'super_admin');

  return (
    <aside
      data-testid="admin-sidebar"
      className="sticky top-0 z-20 flex flex-col gap-4 border-b border-border bg-surface p-4 lg:h-screen lg:gap-6 lg:overflow-y-auto lg:border-b-0 lg:border-r lg:p-6"
    >
      <div className="flex items-center justify-between gap-3 lg:block">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[.35em] text-gold">Bhavita</p>
          <h1 className="mt-1 font-serif text-xl text-ink lg:text-2xl">Admin</h1>
        </div>
      </div>

      {/* Horizontal scroll rail on mobile → vertical list on desktop */}
      <nav
        className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:grid lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
        aria-label="Admin navigation"
      >
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`admin-sidebar-${link.label.toLowerCase()}`}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-3 py-2 text-sm transition-colors lg:rounded lg:shrink lg:gap-3',
                active
                  ? 'bg-gold-soft/40 font-semibold text-ink'
                  : 'text-ink-2 hover:bg-gold-soft/20 hover:text-gold',
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
