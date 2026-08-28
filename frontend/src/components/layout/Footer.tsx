'use client';

import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { whatsappUrl } from '@/components/layout/WhatsAppWidget';

const columns = [
  { name: 'Explore', links: [['/', 'Home'], ['/shop', 'Full catalogue']] },
  { name: 'Company', links: [['/about', 'Our heritage'], ['/contact', 'Bulk enquiry']] },
  { name: 'Support', links: [['/shipping-policy', 'Shipping'], ['/return-policy', 'Returns'], ['/privacy', 'Privacy']] },
];

export default function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-border bg-surface text-ink">
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.5fr_repeat(3,.7fr)_1fr]">
          <div>
            <Link href="/" data-testid="footer-logo" aria-label="Bhavita Textiles — home" className="group inline-flex items-center gap-3">
              <span className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden bg-[#eee6d8] ring-1 ring-gold/50"><Image src="/icons/logo.jpg" alt="" width={96} height={96} className="h-[170%] w-[170%] max-w-none object-cover" /></span>
              <span><span className="block font-serif text-2xl text-ink group-hover:text-gold-2">Bhavita Textiles</span><span className="mt-1 block text-[9px] uppercase tracking-[0.28em] text-ink-2">Panipat · Est. 2017</span></span>
            </Link>
            <p data-testid="footer-description" className="mt-7 max-w-sm text-sm leading-7 text-ink-2">A family-run textile manufacturer from Panipat, weaving dependable layers for hospitality, retail, furnishing and export partners.</p>
            <div className="mt-7 flex gap-4 text-ink-2">
              <a data-testid="footer-social-instagram" href="#" aria-label="Instagram" className="hover:text-gold-2"><Instagram size={17} strokeWidth={1.4} /></a>
              <a data-testid="footer-social-linkedin" href="#" aria-label="LinkedIn" className="hover:text-gold-2"><Linkedin size={17} strokeWidth={1.4} /></a>
              <a data-testid="footer-social-youtube" href="#" aria-label="YouTube" className="hover:text-gold-2"><Youtube size={17} strokeWidth={1.4} /></a>
            </div>
          </div>
          {columns.map((column) => <div key={column.name} data-testid={`footer-column-${column.name.toLowerCase()}`}><p className="text-[10px] uppercase tracking-[0.24em] text-gold-2">{column.name}</p><div className="mt-6 grid gap-4 text-sm text-ink-2">{column.links.map(([href, label]) => <Link key={href} href={href} className="w-fit hover:text-ink">{label}</Link>)}</div></div>)}
          <div data-testid="footer-column-contact"><p className="text-[10px] uppercase tracking-[0.24em] text-gold-2">Contact</p><div className="mt-6 grid gap-5 text-sm leading-6 text-ink-2"><span className="flex gap-3"><MapPin className="mt-1 size-4 shrink-0 text-gold-2" />Panipat, Haryana, India</span><a data-testid="footer-email-link" href="mailto:hello@bhavitatextiles.com" className="flex gap-3 hover:text-ink"><Mail className="mt-1 size-4 shrink-0 text-gold-2" />hello@bhavitatextiles.com</a><a data-testid="footer-whatsapp-link" href={whatsappUrl()} className="flex gap-3 hover:text-ink"><ArrowUpRight className="mt-1 size-4 shrink-0 text-gold-2" />WhatsApp enquiry</a></div></div>
        </div>
      </div>
      <div className="border-t border-border"><div data-testid="footer-copyright" className="mx-auto flex max-w-[1440px] flex-col gap-2 px-6 py-5 text-[10px] uppercase tracking-[0.16em] text-ink-2 sm:px-10 md:flex-row md:justify-between lg:px-14"><span>© {new Date().getFullYear()} Bhavita Textiles · Panipat, India</span><span className="text-gold-2">Direct from the loom · Export ready</span></div></div>
    </footer>
  );
}