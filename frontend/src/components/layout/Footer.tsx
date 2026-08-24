'use client';

import {
  ArrowUpRight,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  Youtube,
} from 'lucide-react';
import Link from 'next/link';

import { whatsappUrl } from '@/components/layout/WhatsAppWidget';

export default function Footer() {
  const columns = [
    {
      name: 'Shop',
      links: [
        ['/shop', 'Full catalogue'],
       
      ],
    },
    {
      name: 'Company',
      links: [
        ['/about', 'Our story'],
        ['/wholesale', 'Wholesale'],
        ['/contact', 'Contact'],
      ],
    },
    {
      name: 'Support',
      links: [
        ['/shipping-policy', 'Shipping'],
        ['/return-policy', 'Returns'],
        ['/privacy', 'Privacy'],
      ],
    },
  ];

  return (
    <footer
      data-testid="footer"
      className="border-t border-bg/10 bg-ink text-bg"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div>
            <Link
              href="/"
              data-testid="footer-logo"
              className="font-serif text-3xl tracking-[.18em]"
            >
              BHAVITA
            </Link>

            <p
              data-testid="footer-description"
              className="mt-5 text-sm leading-7 text-bg/60"
            >
              A family-run textile manufacturer from Panipat, built for
              hospitality and export buyers.
            </p>

            <div className="mt-6 flex gap-2">
              <a
                data-testid="footer-social-instagram"
                href="#"
                aria-label="Instagram"
                className="inline-flex size-9 items-center justify-center rounded-full border border-bg/20 text-bg/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Instagram className="size-4" />
              </a>

              <a
                data-testid="footer-social-linkedin"
                href="#"
                aria-label="LinkedIn"
                className="inline-flex size-9 items-center justify-center rounded-full border border-bg/20 text-bg/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Linkedin className="size-4" />
              </a>

              <a
                data-testid="footer-social-youtube"
                href="#"
                aria-label="YouTube"
                className="inline-flex size-9 items-center justify-center rounded-full border border-bg/20 text-bg/70 transition-colors hover:border-gold hover:text-gold"
              >
                <Youtube className="size-4" />
              </a>
            </div>
          </div>

          {/* Navigation Columns */}
          {columns.map((column) => (
            <div
              key={column.name}
              data-testid={`footer-column-${column.name.toLowerCase()}`}
            >
              <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-gold">
                {column.name}
              </p>

              <div className="mt-5 grid gap-3 text-sm text-bg/70">
                {column.links.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="transition-colors hover:text-gold"
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          ))}

          {/* Contact */}
          <div data-testid="footer-column-contact">
            <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-gold">
              Contact
            </p>

            <div className="mt-5 grid gap-4 text-sm leading-6 text-bg/70">
              <span className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0" />
                Panipat, Haryana, India
              </span>

              <a
                data-testid="footer-email-link"
                href="mailto:hello@bhavitatextiles.com"
                className="flex gap-3 transition-colors hover:text-gold"
              >
                <Mail className="mt-1 size-4 shrink-0" />
                hello@bhavitatextiles.com
              </a>

              <a
                data-testid="footer-whatsapp-link"
                href={whatsappUrl()}
                className="flex gap-3 transition-colors hover:text-gold"
              >
                <ArrowUpRight className="mt-1 size-4 shrink-0" />
                WhatsApp enquiry
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-bg/10">
        <div
          data-testid="footer-copyright"
          className="mx-auto flex max-w-[1440px] flex-col gap-2 px-6 py-6 text-xs text-bg/50 sm:px-10 md:flex-row md:justify-between lg:px-16"
        >
          <span>
            © {new Date().getFullYear()} Bhavita Textiles · Panipat, India
          </span>

          <span>Direct from the loom · Export ready</span>
        </div>
      </div>
    </footer>
  );
}