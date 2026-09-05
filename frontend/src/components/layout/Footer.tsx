'use client';

import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { whatsappUrl } from '@/components/layout/WhatsAppWidget';

const columns = [
  { name: 'Company', links: [['/shop', 'Full catalogue'], ['/about', 'Our story'], ['/wholesale', 'Wholesale'], ['/contact', 'Contact']] },
  { name: 'Support', links: [['/shipping-policy', 'Shipping'], ['/return-policy', 'Returns'], ['/privacy', 'Privacy']] },
] as const;

export default function Footer() {
  return (
    <footer data-testid="footer" className="page-footer">
      <div className="mx-auto w-[90%] max-w-[1200px] py-14 lg:py-16">
        <div className="footer-grid grid gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_2fr]">
          <div className="footer-brand-info lg:col-span-1">
            <Link href="/" data-testid="footer-logo" aria-label="Bhavita Textiles — home" className="inline-flex items-center gap-4">
              <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5efe0] shadow-sm ring-1 ring-gold/40">
                <Image src="/icons/logo.jpg" alt="" width={140} height={140} className="h-[170%] w-[170%] max-w-none object-cover object-center" />
              </span>
              <span className="flex flex-col leading-none"><span className="font-serif text-2xl font-bold tracking-[0.08em] text-gold-light">Bhavita Textiles</span><span className="mt-1 font-accent text-lg italic text-gold-pale">Woven with tradition</span></span>
            </Link>
            <p data-testid="footer-description" className="brand-bio-footer mt-5 max-w-sm text-sm leading-6">
              A family-run textile manufacturer from Panipat, weaving heritage and craft for hospitality and export buyers across the world.
            </p>
            <div className="mt-6 flex gap-3">
              {[[Instagram, 'footer-social-instagram', 'Instagram'], [Linkedin, 'footer-social-linkedin', 'LinkedIn'], [Youtube, 'footer-social-youtube', 'YouTube']].map(([Icon, testid, label]) => {
                const SocialIcon = Icon as typeof Instagram;
                return <a key={testid as string} data-testid={testid as string} href="#" aria-label={label as string} className="social-icon-btn inline-flex size-9 items-center justify-center rounded border border-[#4E4535] bg-[#383226] text-gold-pale hover:bg-gold-medium"><SocialIcon className="size-4" /></a>;
              })}
            </div>
          </div>
          {columns.map((column) => (
            <div key={column.name} data-testid={`footer-column-${column.name.toLowerCase()}`} className="footer-links-col">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">{column.name}</p>
              <div className="mt-5 grid gap-3 text-sm">
                {column.links.map(([href, label]) => <Link key={href} href={href} data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, '-')}`} className="w-fit text-[#B1A89A] hover:translate-x-1 hover:text-gold-light">{label}</Link>)}
              </div>
            </div>
          ))}
          <div data-testid="footer-column-contact" className="footer-contact-details">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">Contact</p>
            <div className="mt-5 grid gap-4 text-sm text-[#B1A89A]">
              <span className="flex gap-3"><MapPin className="mt-1 size-4 shrink-0 text-gold-light" />Panipat, Haryana, India</span>
              <a data-testid="footer-email-link" href="mailto:hello@bhavitatextiles.com" className="flex gap-3 hover:text-gold-light"><Mail className="mt-1 size-4 shrink-0 text-gold-light" />hello@bhavitatextiles.com</a>
              <a data-testid="footer-whatsapp-link" href={whatsappUrl()} className="flex gap-3 hover:text-gold-light"><ArrowUpRight className="mt-1 size-4 shrink-0 text-gold-light" />WhatsApp enquiry</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom border-t border-[#383226] py-5 text-center text-xs text-[#8D8271]">
        <span data-testid="footer-copyright">© {new Date().getFullYear()} Bhavita Textiles · Panipat, India · Direct from the loom · Export ready</span>
      </div>
    </footer>
  );
}

