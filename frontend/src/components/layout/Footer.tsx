'use client';

import Link from 'next/link';
import { ArrowUpRight, Mail, MapPin } from 'lucide-react';
import { WHATSAPP_NUMBER, whatsappUrl } from '@/components/layout/WhatsAppWidget';

export default function Footer() {
  return <footer data-testid="site-footer" className="border-t border-border bg-ink text-bg">
    <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[1.3fr_.7fr_1fr] lg:px-16 lg:py-20">
      <div><Link href="/" data-testid="footer-logo" className="font-serif text-3xl tracking-[0.2em]">BHAVITA</Link><p data-testid="footer-description" className="mt-5 max-w-sm text-sm leading-7 text-bg/60">A family-run manufacturer of printed bedsheets, mink blankets and floor mats from Panipat — built for hospitality, export and corporate gifting buyers.</p></div>
      <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Explore</p><div className="mt-5 grid gap-3 text-sm text-bg/65"><Link href="/shop" data-testid="footer-catalogue-link">Full catalogue</Link><Link href="/about" data-testid="footer-about-link">Our Heritage</Link><Link href="/wholesale" data-testid="footer-wholesale-link">Wholesale</Link><Link href="/contact" data-testid="footer-contact-link">Bulk Enquiry</Link></div></div>
      <div><p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Reach the team</p><div className="mt-5 grid gap-4 text-sm text-bg/65"><a data-testid="footer-email-link" href="mailto:hello@bhavitatextiles.com" className="flex items-center gap-3"><Mail size={15} /> hello@bhavitatextiles.com</a><a data-testid="footer-whatsapp-link" href={whatsappUrl()} className="flex items-center gap-3"><ArrowUpRight size={15} /> WhatsApp enquiry</a><span data-testid="footer-location" className="flex items-start gap-3"><MapPin size={15} className="mt-1 shrink-0" /> Panipat, Haryana · India</span></div></div>
    </div>
    <div className="border-t border-bg/15"><div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-6 text-[10px] font-semibold uppercase tracking-[0.15em] text-bg/40 sm:px-10 md:flex-row md:justify-between lg:px-16"><span>© {new Date().getFullYear()} Bhavita Textiles</span><span>Direct from the loom · Export ready</span></div></div>
  </footer>;
}