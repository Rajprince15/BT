'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, Heart, Home, LayoutGrid, ShoppingBag, X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { useUIStore } from '@/store/ui.store';
import ThemeToggle from '@/components/layout/ThemeToggle';

const primary = [{ label: 'Home', href: '/', icon: <Home size={16} strokeWidth={1.4} /> }, { label: 'Catalogue', href: '/shop', icon: <LayoutGrid size={16} strokeWidth={1.4} /> }];
const secondary = [{ label: 'Our Heritage', href: '/about' }, { label: 'Bulk Enquiry', href: '/contact' }, { label: 'Privacy', href: '/privacy' }];

export default function MobileNav() {
  const open = useUIStore((s) => s.mobileNavOpen);
  const setOpen = useUIStore((s) => s.setMobileNavOpen);
  const close = () => setOpen(false);
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent data-testid="mobile-nav-drawer" side="left" showCloseButton={false} className="flex w-[88vw] max-w-[390px] flex-col border-r border-border bg-bg p-0 text-ink">
        <SheetHeader className="flex flex-row items-center justify-between border-b border-border px-5 py-6"><SheetTitle className="flex items-center gap-3"><span className="relative flex size-10 overflow-hidden bg-[#eee6d8] ring-1 ring-gold/50"><Image src="/icons/logo.jpg" alt="" width={80} height={80} className="h-[170%] w-[170%] max-w-none object-cover" /></span><span><span className="block font-serif text-xl">Bhavita Textiles</span><span className="mt-1 block text-[9px] uppercase tracking-[0.26em] text-ink-2">Panipat · Est. 2017</span></span></SheetTitle><button type="button" data-testid="mobile-nav-close" onClick={close} aria-label="Close menu" className="inline-flex size-9 items-center justify-center text-ink-2 hover:text-gold-2"><X size={19} strokeWidth={1.4} /></button></SheetHeader>
        <div className="flex flex-1 flex-col overflow-y-auto">
          <div className="grid grid-cols-2 border-b border-border"><Link href="/cart" onClick={close} data-testid="mobile-nav-cart" className="flex items-center justify-center gap-2 border-r border-border py-4 text-[10px] uppercase tracking-[0.18em] hover:bg-surface"><ShoppingBag size={15} strokeWidth={1.4} />Cart</Link><Link href="/account/wishlist" onClick={close} data-testid="mobile-nav-wishlist" className="flex items-center justify-center gap-2 py-4 text-[10px] uppercase tracking-[0.18em] hover:bg-surface"><Heart size={15} strokeWidth={1.4} />Wishlist</Link></div>
          <nav className="border-b border-border px-5 py-5" aria-label="Primary">{primary.map((link) => <Link key={link.href} href={link.href} onClick={close} data-testid={`mobile-nav-primary-${link.label.toLowerCase()}`} className="flex items-center gap-3 border-b border-border py-4 font-serif text-xl last:border-0"><span className="text-gold-2">{link.icon}</span>{link.label}<ChevronRight className="ml-auto size-4 text-ink-2" /></Link>)}</nav>
          <div className="px-5 py-6"><p className="text-[10px] uppercase tracking-[0.24em] text-ink-2">Company</p><div className="mt-3">{secondary.map((link) => <Link key={link.href} href={link.href} onClick={close} data-testid={`mobile-nav-link-${link.label.toLowerCase().replace(/\s+/g, '-')}`} className="flex items-center justify-between border-b border-border py-3 text-sm last:border-0">{link.label}<ChevronRight size={14} className="text-ink-2" /></Link>)}</div></div>
          <div className="mt-auto flex items-center justify-between border-t border-border px-5 py-5"><span className="text-[10px] uppercase tracking-[0.22em] text-ink-2">Appearance</span><ThemeToggle /></div>
        </div>
      </SheetContent>
    </Sheet>
  );
}