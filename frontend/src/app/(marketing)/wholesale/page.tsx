'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Container from '@/components/common/Container';
import wholesaleService from '@/services/wholesale.service';

const BUSINESS_TYPES = [
  'Hotel',
  'Resort',
  'Hospital',
  'Hostel',
  'Retail Store',
  'Interior Designer',
  'Corporate Gifting',
  'Other',
];

interface FormState {
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  businessType: string;
  productInterest: string;
  quantityRequirement: string;
  message: string;
  website: string; // honeypot
}

const EMPTY: FormState = {
  companyName: '',
  contactPerson: '',
  email: '',
  phone: '',
  businessType: BUSINESS_TYPES[0],
  productInterest: '',
  quantityRequirement: '',
  message: '',
  website: '',
};

export default function WholesalePage() {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <main data-testid="wholesale-page" className="bg-bg">
      <section className="border-b border-border bg-navy text-bg">
        <Container className="py-20 md:py-24">
          <p className="text-xs uppercase tracking-[.35em] text-gold-soft">Wholesale · B2B</p>
          <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">
            Furnish your rooms with pieces that have a story.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-bg/70">
            Hotels, resorts, interior designers, and corporate gifters: partner with our atelier for
            custom collections, bulk orders, and priority production.
          </p>
        </Container>
      </section>

      <Container className="grid gap-12 py-16 lg:grid-cols-[.9fr_1.1fr]">
        <aside>
          <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Why partner with us</p>
          <ul className="mt-6 grid gap-4 text-sm leading-7 text-ink-2">
            {[
              'Volume pricing tuned to your project brief',
              'Custom colourways, sizes, monograms, packaging',
              'Priority production windows for opening timelines',
              'Direct-from-atelier logistics for pan-India delivery',
            ].map((line) => (
              <li key={line} className="flex gap-3">
                <span aria-hidden className="mt-1 size-2 rounded-full bg-gold" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </aside>

        <form
          data-testid="wholesale-form"
          className="grid gap-4 rounded-2xl border border-border bg-surface p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            if (form.website) return; // honeypot
            setBusy(true);
            try {
              await wholesaleService.submit({
                companyName: form.companyName,
                contactPerson: form.contactPerson,
                email: form.email,
                phone: form.phone,
                businessType: form.businessType,
                productInterest: form.productInterest || undefined,
                quantityRequirement: form.quantityRequirement || undefined,
                message: form.message || undefined,
              });
              setSubmitted(true);
              setForm(EMPTY);
              toast.success('Thank you — our wholesale team will contact you shortly.');
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Unable to submit inquiry');
            } finally {
              setBusy(false);
            }
          }}
        >
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            value={form.website}
            onChange={(event) => update('website', event.target.value)}
            className="hidden"
          />
          <div className="grid gap-4 md:grid-cols-2">
            {(
              [
                ['companyName', 'Company', 'text'],
                ['contactPerson', 'Contact person', 'text'],
                ['email', 'Business email', 'email'],
                ['phone', 'Phone', 'tel'],
              ] as const
            ).map(([key, label, type]) => (
              <label key={key} className="grid gap-2 text-sm text-ink">
                {label}
                <input
                  data-testid={`wholesale-${key}`}
                  required
                  type={type}
                  value={form[key]}
                  onChange={(event) => update(key, event.target.value)}
                  className="h-12 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
                />
              </label>
            ))}
            <label className="grid gap-2 text-sm text-ink">
              Business type
              <select
                data-testid="wholesale-business-type"
                value={form.businessType}
                onChange={(event) => update('businessType', event.target.value)}
                className="h-12 rounded border border-border bg-bg px-3 outline-none focus:border-gold"
              >
                {BUSINESS_TYPES.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="grid gap-2 text-sm text-ink">
              Quantity required
              <input
                data-testid="wholesale-quantity"
                value={form.quantityRequirement}
                onChange={(event) => update('quantityRequirement', event.target.value)}
                className="h-12 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-ink">
            Product interest
            <input
              data-testid="wholesale-interest"
              value={form.productInterest}
              onChange={(event) => update('productInterest', event.target.value)}
              className="h-12 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
            />
          </label>
          <label className="grid gap-2 text-sm text-ink">
            Tell us about the project
            <textarea
              data-testid="wholesale-message"
              rows={5}
              value={form.message}
              onChange={(event) => update('message', event.target.value)}
              className="min-h-[140px] rounded border border-border bg-bg p-4 outline-none focus:border-gold"
            />
          </label>
          {submitted ? (
            <p data-testid="wholesale-success" className="rounded border border-success/30 bg-success/10 p-4 text-sm text-success">
              Thank you — a member of the wholesale team will reach out within one working day.
            </p>
          ) : null}
          <button
            data-testid="wholesale-submit"
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold disabled:opacity-50"
          >
            {busy ? 'Sending…' : 'Send inquiry'}
          </button>
        </form>
      </Container>
    </main>
  );
}
