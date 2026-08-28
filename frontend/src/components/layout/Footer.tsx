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
import Image from 'next/image';

import { whatsappUrl } from '@/components/layout/WhatsAppWidget';

export default function Footer() {
  const columns: Array<{ name: string; links: [string, string][] }> = [
    {
      name: 'Shop',
      links: [['/shop', 'Full catalogue']],
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
      className="border-t border-border bg-surface text-ink"
    >
      <div className="mx-auto max-w-[1440px] px-6 py-16 sm:px-10 lg:px-16 lg:py-20">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              data-testid="footer-logo"
              aria-label="Bhavita Textiles — home"
              className="group inline-flex items-center gap-4"
            >
              <span className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f5efe0] shadow-sm ring-1 ring-gold/40 transition-transform duration-500 group-hover:scale-[1.04]">
                <Image
                  src="/icons/logo.jpg"
                  alt=""
                  width={140}
                  height={140}
                  className="h-[170%] w-[170%] max-w-none object-cover object-center"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-serif text-[24px] font-medium tracking-[0.01em] text-ink transition-colors group-hover:text-gold">
                  Bhavita Textiles
                </span>
                <span className="mt-1.5 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">
                  Panipat · Est. 2017
                </span>
              </span>
            </Link>

            <p
              data-testid="footer-description"
              className="mt-6 max-w-md text-sm leading-7 text-ink-2"
            >
              A family-run textile manufacturer from Panipat, weaving heritage
              and craft for hospitality and export buyers across the world.
            </p>

            <div className="mt-6 flex gap-2">
              <a
                data-testid="footer-social-instagram"
                href="#"
                aria-label="Instagram"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-gold hover:bg-gold-soft hover:text-gold"
              >
                <Instagram className="size-4" />
              </a>

              <a
                data-testid="footer-social-linkedin"
                href="#"
                aria-label="LinkedIn"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-gold hover:bg-gold-soft hover:text-gold"
              >
                <Linkedin className="size-4" />
              </a>

              <a
                data-testid="footer-social-youtube"
                href="#"
                aria-label="YouTube"
                className="inline-flex size-9 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-gold hover:bg-gold-soft hover:text-gold"
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

              <div className="mt-5 grid gap-3 text-sm text-ink-2">
                {column.links.map(([href, label]) => (
                  <Link
                    key={href}
                    href={href}
                    className="w-fit transition-colors hover:text-gold"
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

            <div className="mt-5 grid gap-4 text-sm leading-6 text-ink-2">
              <span className="flex gap-3">
                <MapPin className="mt-1 size-4 shrink-0 text-gold" />
                Panipat, Haryana, India
              </span>

              <a
                data-testid="footer-email-link"
                href="mailto:hello@bhavitatextiles.com"
                className="flex gap-3 transition-colors hover:text-gold"
              >
                <Mail className="mt-1 size-4 shrink-0 text-gold" />
                hello@bhavitatextiles.com
              </a>

              <a
                data-testid="footer-whatsapp-link"
                href={whatsappUrl()}
                className="flex gap-3 transition-colors hover:text-gold"
              >
                <ArrowUpRight className="mt-1 size-4 shrink-0 text-gold" />
                WhatsApp enquiry
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border bg-surface-2">
        <div
          data-testid="footer-copyright"
          className="mx-auto flex max-w-[1440px] flex-col gap-2 px-6 py-6 text-xs text-ink-2 sm:px-10 md:flex-row md:justify-between lg:px-16"
        >
          <span>
            © {new Date().getFullYear()} Bhavita Textiles · Panipat, India
          </span>

          <span className="text-gold">Direct from the loom · Export ready</span>
        </div>
      </div>
    </footer>
  );
}
