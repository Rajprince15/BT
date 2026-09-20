'use client';

import { ArrowUpRight, Instagram, Linkedin, Mail, MapPin, Youtube } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { whatsappUrl } from '@/components/layout/WhatsAppWidget';
import { usePathname } from 'next/navigation';

const columns = [
  { name: 'Product Categories', links: [['/shop/bedroom', 'Bedroom Collection'], ['/shop/living-room', 'Living Room Collection'], ['/shop/bath', 'Bath Collection'], ['/shop/home-decor', 'Home Décor'], ['/shop/handloom-heritage', 'Handloom Heritage'], ['/shop/handicrafts', 'Handicrafts'], ['/shop', 'Seasonal Collection']] },
  { name: 'Bulk Solutions', links: [['/wholesale?industry=hotels', 'For Hotels'], ['/wholesale?industry=resorts', 'For Resorts'], ['/wholesale?industry=hospitals', 'For Hospitals'], ['/wholesale?industry=hostels', 'For Hostels'], ['/wholesale?industry=retail', 'For Retail Stores'], ['/wholesale?industry=interior-designers', 'For Interior Designers'], ['/wholesale?industry=corporate-gifting', 'For Corporate Gifting'], ['/wholesale', 'Custom Manufacturing']] },
  { name: 'Company', links: [['/about', 'About Us'], ['/about#strength', 'Our Strength'], ['/about#values', 'Quality & Sustainability'], ['/wholesale', 'Infrastructure'], ['/contact', 'Our Clients'], ['/contact', 'Contact Us']] },
] as const;

export default function Footer() {
  const pathname = usePathname();
  const isAbout = pathname === '/about';
  return (
    <footer data-testid="footer" className={`page-footer ${isAbout ? 'footer-about' : 'footer-home'} bg-[var(--dark-green)] text-bg`}>
      <div className="mx-auto w-[90%] max-w-[1200px] py-14 lg:py-16">
        <div className="footer-grid grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.15fr_1.15fr_1fr_1.15fr]">
          <div className="footer-brand-info lg:col-span-1">
            <Link href="/" data-testid="footer-logo" aria-label="Bhavita Textiles — home" className="inline-flex items-center gap-4">
              <Image src="/icons/logo.jpg" alt="Bhavita Textiles — woven with tradition, made for elegance" width={230} height={230} className="h-auto w-44 object-contain sm:w-48" />
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
                {column.links.map(([href, label]) => <Link key={`${column.name}-${label}`} href={href} data-testid={`footer-link-${label.toLowerCase().replace(/\s+/g, '-')}`} className="w-fit text-[#B1A89A] hover:translate-x-1 hover:text-gold-light">{label}</Link>)}
              </div>
            </div>
          ))}
          <div data-testid="footer-column-contact" className="footer-contact-details">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-light">Get in Touch</p>
            <div className="mt-5 grid gap-4 text-sm text-[#B1A89A]">
              <span className="flex gap-3"><MapPin className="mt-1 size-4 shrink-0 text-gold-light" />Panipat, Haryana, India</span>
              <a data-testid="footer-email-link" href="mailto:hello@bhavitatextiles.com" className="flex gap-3 hover:text-gold-light"><Mail className="mt-1 size-4 shrink-0 text-gold-light" />hello@bhavitatextiles.com</a>
              <a data-testid="footer-whatsapp-link" href={whatsappUrl()} className="flex gap-3 hover:text-gold-light"><ArrowUpRight className="mt-1 size-4 shrink-0 text-gold-light" />WhatsApp enquiry</a>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom grid gap-3 border-t border-[#8A7048]/50 px-6 py-4 text-center text-[10px] text-[#D8C8A9] md:grid-cols-[1fr_auto_1fr] md:items-center md:text-left">
        <span data-testid="footer-copyright">© {new Date().getFullYear()} Bhavita Textiles · Panipat, India · Direct from the loom · Export ready</span>
        <div className="col-span-full grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
          <span data-testid="footer-copyright-current">© 2024 Bhavita Textiles. All rights reserved.</span>
          <span data-testid="footer-tagline" className="font-serif uppercase tracking-[.14em] text-gold-light">{isAbout ? 'Woven with tradition, made for a brighter tomorrow.' : 'Indian textiles for a brighter, more beautiful tomorrow.'}</span>
          <span className="flex justify-center gap-3 md:justify-end"><Link href="/privacy" data-testid="footer-privacy-link">Privacy Policy</Link><span aria-hidden>|</span><Link href="/terms" data-testid="footer-terms-link">{isAbout ? 'Terms & Conditions' : 'Terms'}</Link>{!isAbout ? <><span aria-hidden>|</span><Link href="/sitemap.xml" data-testid="footer-sitemap-link">Sitemap</Link></> : null}</span>
        </div>
      </div>
    </footer>
  );
}
