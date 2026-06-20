'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';
import { Instagram, Facebook, Youtube, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import newsletterService from '@/services/newsletter.service';

const SHOP_LINKS = [
  { label: 'New Arrivals', href: '/collections/new-arrivals' },
  { label: 'Best Sellers', href: '/collections/best-sellers' },
  { label: 'Bedroom', href: '/shop/bedroom' },
  { label: 'Living Room', href: '/shop/living-room' },
  { label: 'Bath', href: '/shop/bath' },
  { label: 'Home Decor', href: '/shop/home-decor' },
  { label: 'Handloom Heritage', href: '/shop/handloom-heritage' },
  { label: 'Wholesale', href: '/wholesale' },
];

const CARE_LINKS = [
  { label: 'Contact', href: '/contact' },
  { label: 'Order Tracking', href: '/account/orders' },
  { label: 'Returns', href: '/return-policy' },
  { label: 'Shipping', href: '/shipping-policy' },
  { label: 'About', href: '/about' },
];

const POLICY_LINKS = [
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Return Policy', href: '/return-policy' },
  { label: 'Shipping Policy', href: '/shipping-policy' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = async (e: FormEvent) => {
    e.preventDefault();
      if (!email || !/^S+@S+.S+$/.test(email)) {
      toast.error('Please enter a valid email');
      return;
    }
    setSubmitting(true);
    try {
      await newsletterService.subscribe({ email });
      toast.success('Welcome to BHAVITA — check your inbox.');
      setEmail('');
    } catch {
      toast.error('Could not subscribe. Try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer
      data-testid="site-footer"
      className="mt-24 border-t border-[var(--gold-soft)] bg-[var(--surface-2)] text-[var(--ink)]"
    >
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <Link href="/" className="font-serif text-2xl tracking-[0.32em] text-[var(--navy)]">
            BHAVITA
          </Link>
          <p className="mt-4 max-w-xs font-serif text-base italic leading-relaxed text-[var(--ink-2)]">
            Handcrafted Home Textiles &amp; Decor for Elegant Living.
          </p>
          <div className="mt-6 flex gap-3">
            {[
              { Icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
              { Icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              { Icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
            ].map(({ Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                data-testid={`footer-social-${label.toLowerCase()}`}
                className="inline-flex h-9 w-9 items-center justify-center border border-[var(--border)] text-[var(--ink-2)] hover:border-[var(--gold)] hover:text-[var(--gold)]"
                style={{ transition: 'color 200ms, border-color 200ms' }}
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <FooterColumn title="Shop" links={SHOP_LINKS} testid="footer-shop" />
        <FooterColumn title="Customer Care" links={CARE_LINKS} testid="footer-care" />

        <div>
          <h3 className="font-serif text-lg text-[var(--navy)]">Stay in the Loop</h3>
          <span className="mt-1 block h-px w-8 bg-[var(--gold)]" />
          <p className="mt-4 font-sans text-[13px] leading-relaxed text-[var(--ink-2)]">
            Receive private invitations, early access to seasonal collections and curated
            stories from our atelier.
          </p>
          <form
            onSubmit={handleSubscribe}
            data-testid="footer-newsletter-form"
            className="mt-4 flex border border-[var(--gold)] bg-[var(--surface)]"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              data-testid="footer-newsletter-input"
              className="flex-1 bg-transparent px-3 py-3 font-sans text-[13px] text-[var(--ink)] placeholder:text-[var(--ink-2)] focus:outline-none"
            />
            <button
              type="submit"
              disabled={submitting}
              aria-label="Subscribe"
              data-testid="footer-newsletter-submit"
              className="bg-[var(--gold)] px-4 text-[var(--surface)] hover:bg-[var(--gold-2)] disabled:opacity-50"
              style={{ transition: 'background-color 200ms' }}
            >
              <ArrowRight size={16} />
            </button>
          </form>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
            {POLICY_LINKS.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  className="font-sans text-[11px] uppercase tracking-[0.18em] text-[var(--ink-2)] hover:text-[var(--gold)]"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-[var(--gold-soft)]">
        <div className="mx-auto flex max-w-[1400px] flex-col items-center justify-between gap-3 px-6 py-6 md:flex-row lg:px-10">
          <span className="font-sans text-[11px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            © {new Date().getFullYear()} Bhavita Textiles · All rights reserved
          </span>
          <div className="flex items-center gap-3 font-sans text-[10px] uppercase tracking-[0.22em] text-[var(--ink-2)]">
            <span>Visa</span>
            <span>·</span>
            <span>Mastercard</span>
            <span>·</span>
            <span>UPI</span>
            <span>·</span>
            <span>Razorpay</span>
          </div>
          <span className="font-serif text-xs italic text-[var(--ink-2)]">
            Made with care in Jaipur
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
  testid,
}: {
  title: string;
  links: { label: string; href: string }[];
  testid: string;
}) {
  return (
    <div data-testid={testid}>
      <h3 className="font-serif text-lg text-[var(--navy)]">{title}</h3>
      <span className="mt-1 block h-px w-8 bg-[var(--gold)]" />
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="font-sans text-[13px] text-[var(--ink-2)] hover:text-[var(--gold)]"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
