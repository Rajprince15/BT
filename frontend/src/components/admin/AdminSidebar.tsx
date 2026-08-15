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
    <aside data-testid="admin-sidebar" className="flex h-full flex-col gap-6 border-r border-border bg-surface p-6">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-[.35em] text-gold">Bhavita</p>
        <h1 className="mt-1 font-serif text-2xl text-ink">Admin</h1>
      </div>
      <nav className="grid gap-1" aria-label="Admin navigation">
        {links.map((link) => {
          const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              data-testid={`admin-sidebar-${link.label.toLowerCase()}`}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'inline-flex items-center gap-3 rounded px-3 py-2 text-sm transition-colors',
                active ? 'bg-gold-soft/40 font-semibold text-ink' : 'text-ink-2 hover:text-gold',
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
