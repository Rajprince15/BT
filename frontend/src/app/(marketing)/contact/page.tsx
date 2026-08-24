'use client';

import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock3,
  Mail,
  MapPin,
  Package,
  Phone,
} from 'lucide-react';
import { toast } from 'sonner';

import Container from '@/components/common/Container';
import wholesaleService from '@/services/wholesale.service';
import { whatsappUrl } from '@/components/layout/WhatsAppWidget';

const categories = [
  'Bedsheets',
  'Blankets',
  'Floor mats',
  'Cushion covers',
  'Curtains',
  'Towels',
  'Other',
];

const moqOptions = ['300', '500', '1000', '2500', '5000+'];

const timelines = ['Within 30 days', '30–60 days', '60+ days', 'Flexible'];

export default function BulkEnquiryPage() {
  const search = useSearchParams();
  const prefill = useMemo(() => {
    const productName = search.get('productName') ?? '';
    const productSlug = search.get('product') ?? '';
    const sku = search.get('sku') ?? '';
    const qty = search.get('qty') ?? '';
    return { productName, productSlug, sku, qty };
  }, [search]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [files] = useState<File[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');

  // Prefill the message when arriving from a product page.
  useEffect(() => {
    if (prefill.productName) {
      setMessage(
        [
          `Enquiry for: ${prefill.productName}`,
          prefill.sku ? `SKU: ${prefill.sku}` : null,
          prefill.qty
            ? `Interested quantity: ${prefill.qty} pcs (indicative)`
            : null,
          '',
          'Please share your best wholesale price, lead time, packaging options and MOQ details for this product.',
        ]
          .filter(Boolean)
          .join('\n'),
      );
    }
  }, [prefill.productName, prefill.sku, prefill.qty]);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const data = new FormData(event.currentTarget);

    const companyName = String(data.get('companyName') ?? '');
    const contactPerson = String(data.get('contactPerson') ?? '');
    const email = String(data.get('email') ?? '');
    const phone = String(data.get('phone') ?? '');
    const moq = String(data.get('moq') ?? '');
    const timeline = String(data.get('timeline') ?? 'Flexible');
    const brief = String(data.get('message') ?? '');
    const fileNames = files.map((file) => file.name).join(', ') || 'None';

    setBusy(true);

    try {
      await wholesaleService.submit({
        companyName,
        contactPerson,
        email,
        phone,
        businessType: String(data.get('designation') ?? ''),
        productInterest:
          prefill.productName ||
          selectedCategories.join(', ') ||
          'General textile enquiry',
        quantityRequirement: `${moq} pcs per SKU · ${timeline}`,
        message: `${brief}\nAttachments: ${fileNames}`,
      });

      const whatsappMessage = [
        'Hello, I would like a wholesale quote from Bhavita Textiles.',
        '',
        `Company: ${companyName}`,
        `Contact: ${contactPerson}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Designation: ${String(data.get('designation') ?? 'Not specified')}`,
        `Country / City: ${String(data.get('country') ?? 'Not specified')}`,
        '',
        prefill.productName
          ? `Product: ${prefill.productName}${
              prefill.sku ? ` (SKU: ${prefill.sku})` : ''
            }`
          : `Product interest: ${
              selectedCategories.join(', ') || 'General textile enquiry'
            }`,
        prefill.qty ? `Interested quantity: ${prefill.qty} pcs` : null,
        `Estimated MOQ: ${moq} pcs per SKU`,
        `Delivery timeline: ${timeline}`,
        `Website: ${
          String(data.get('website') ?? 'Not specified') || 'Not specified'
        }`,
        '',
        `Brief: ${brief}`,
        `Files: ${fileNames}`,
      ]
        .filter(Boolean)
        .join('\n');

      window.open(
        whatsappUrl(whatsappMessage),
        '_blank',
        'noopener,noreferrer',
      );

      setSubmitted(true);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to submit enquiry',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main data-testid="contact-page" className="bg-bg text-ink">
      <section data-testid="contact-hero" className="bg-brand text-brand-ink">
        <Container className="py-24 sm:py-32">
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand-ink/70">
            Wholesale program · B2B
          </p>

          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[.95] sm:text-7xl">
            Manufactured to your spec. Priced to your volume.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-brand-ink/75">
            Share your brief with the mill. We will return with a clear quote,
            practical timeline and the right next step.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-brand-ink/25 px-4 py-2">
              24-hour quote
            </span>
            <span className="rounded-full border border-brand-ink/25 px-4 py-2">
              MOQ from 300 pcs
            </span>
          </div>
        </Container>
      </section>

      <Container className="grid gap-16 py-20 sm:py-28 lg:grid-cols-[.45fr_.55fr]">
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
            Talk to the mill
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            A considered beginning to a dependable supply partnership.
          </h2>

          <p className="mt-6 text-sm leading-7 text-ink-2">
            Hotels, furnishing buyers, retailers and designers can use this form
            to share quantities, specifications, packaging needs and delivery
            expectations.
          </p>

          <div className="mt-12 divide-y divide-border">
            <div
              data-testid="contact-info-factory-address"
              className="flex gap-4 border-t border-border py-6"
            >
              <MapPin className="mt-1 size-5 text-brand" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-2">
                  Factory address
                </p>
                <p className="mt-2 text-sm text-ink">Panipat, Haryana, India</p>
              </div>
            </div>

            <div
              data-testid="contact-info-phone-whatsapp"
              className="flex gap-4 py-6"
            >
              <Phone className="mt-1 size-5 text-brand" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-2">
                  Phone / WhatsApp
                </p>
                <p className="mt-2 text-sm text-ink">+91 99999 99999</p>
              </div>
            </div>

            <div data-testid="contact-info-email" className="flex gap-4 py-6">
              <Mail className="mt-1 size-5 text-brand" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-2">
                  Email
                </p>
                <p className="mt-2 text-sm text-ink">hello@bhavitatextiles.com</p>
              </div>
            </div>

            <div className="flex gap-4 py-6">
              <Clock3 className="mt-1 size-5 text-brand" />
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-2">
                  Business hours
                </p>
                <p className="mt-2 text-sm text-ink">
                  Mon–Sat · 10:00–18:00 IST
                </p>
              </div>
            </div>
          </div>
        </section>

        <section
          data-testid="contact-form"
          className="rounded-lg border border-border bg-surface p-6 sm:p-10"
        >
          {submitted ? (
            <div
              data-testid="contact-form-success"
              className="grid min-h-[560px] place-items-center text-center"
            >
              <div>
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <CheckCircle2 className="size-8" />
                </span>
                <h2 className="mt-6 font-serif text-4xl text-ink">
                  Your brief is with the mill.
                </h2>
                <p className="mt-4 text-sm leading-7 text-ink-2">
                  WhatsApp has opened with your enquiry. Our team will reply
                  within 24 hours.
                </p>
                <a
                  data-testid="contact-success-home"
                  href="/"
                  className="mt-7 inline-flex h-11 items-center rounded-full border border-border px-6 text-[11px] font-semibold uppercase tracking-[.18em] text-ink hover:border-brand"
                >
                  Return home
                </a>
              </div>
            </div>
          ) : (
            <form
              data-testid="bulk-enquiry-form"
              onSubmit={submit}
              className="grid gap-5"
            >
              {/* Product context banner */}
              {prefill.productName ? (
                <div
                  data-testid="contact-product-context"
                  className="flex items-start gap-3 rounded-lg border border-brand/25 bg-brand-soft/50 p-4"
                >
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand text-brand-ink">
                    <Package size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-wider2 text-brand">
                      Enquiring about
                    </p>
                    <p className="mt-1 line-clamp-2 font-serif text-lg text-ink">
                      {prefill.productName}
                    </p>
                    <p className="mt-1 text-xs text-ink-2">
                      {prefill.sku ? `SKU ${prefill.sku}` : null}
                      {prefill.qty
                        ? `${prefill.sku ? ' · ' : ''}Interested qty ${
                            prefill.qty
                          } pcs`
                        : null}
                    </p>
                  </div>
                </div>
              ) : null}

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
                  Company details
                </p>
                <h2 className="mt-3 font-serif text-3xl text-ink">
                  Tell us who you are.
                </h2>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                {[
                  ['companyName', 'Company name', 'text', true],
                  ['contactPerson', 'Contact person', 'text', true],
                  ['designation', 'Designation', 'text', false],
                  ['email', 'Email', 'email', true],
                  ['phone', 'Phone with country code', 'tel', true],
                  ['country', 'Country / City', 'text', false],
                  ['website', 'Website', 'url', false],
                ].map(([name, label, type, required]) => (
                  <label
                    key={String(name)}
                    className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2"
                  >
                    {label}
                    <input
                      data-testid={`contact-form-${name}`}
                      name={String(name)}
                      required={Boolean(required)}
                      type={String(type)}
                      className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                ))}
              </div>

              {!prefill.productName ? (
                <div className="mt-8 border-t border-border pt-8">
                  <p className="font-serif text-2xl text-ink">
                    Product interest
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {categories.map((category) => {
                      const active = selectedCategories.includes(category);
                      return (
                        <button
                          key={category}
                          type="button"
                          data-testid={`contact-category-${category
                            .toLowerCase()
                            .replaceAll(' ', '-')}`}
                          aria-pressed={active}
                          onClick={() => toggleCategory(category)}
                          className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                            active
                              ? 'border-brand bg-brand text-brand-ink'
                              : 'border-border text-ink-2 hover:border-brand'
                          }`}
                        >
                          {category}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}

              <label className="mt-6 grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2">
                Estimated MOQ per SKU
                <select
                  data-testid="contact-form-moq"
                  name="moq"
                  required
                  defaultValue={prefill.qty ? '500' : moqOptions[0]}
                  className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-brand"
                >
                  {moqOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </label>

              <div className="border-t border-border pt-8">
                <p className="font-serif text-2xl text-ink">
                  Brief &amp; timeline
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {timelines.map((timeline) => (
                    <label
                      key={timeline}
                      className="flex min-h-12 items-center gap-3 rounded-md border border-border bg-bg px-4 text-sm text-ink"
                    >
                      <input
                        data-testid={`contact-timeline-${timeline
                          .toLowerCase()
                          .replaceAll(' ', '-')}`}
                        type="radio"
                        name="timeline"
                        value={timeline}
                        defaultChecked={timeline === 'Flexible'}
                        className="size-4 accent-brand"
                      />
                      {timeline}
                    </label>
                  ))}
                </div>

                <textarea
                  data-testid="contact-form-message"
                  name="message"
                  required
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell us about print styles, GSM, packaging or private-label needs…"
                  className="mt-5 min-h-40 w-full rounded-md border border-border bg-bg p-4 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              <label className="flex items-center gap-3 text-sm text-ink">
                <input
                  data-testid="contact-form-consent"
                  required
                  type="checkbox"
                  className="size-4 accent-brand"
                />
                I agree to receive quotes and updates from Bhavita Textiles.
              </label>

              <button
                data-testid="contact-form-submit"
                disabled={busy}
                type="submit"
                className="h-12 rounded-full bg-brand text-[11px] font-semibold uppercase tracking-[.18em] text-brand-ink transition-colors hover:bg-brand-2 disabled:opacity-60"
              >
                {busy
                  ? 'Preparing WhatsApp…'
                  : 'Send enquiry on WhatsApp'}
              </button>

              <p className="text-center text-xs text-ink-2">
                Typical response within 24 hours.
              </p>
            </form>
          )}
        </section>
      </Container>

      <Container className="pb-24">
        <div
          data-testid="contact-map"
          className="overflow-hidden rounded-lg border border-border bg-surface"
        >
          <iframe
            title="Bhavita Textiles factory location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d111235.59384228835!2d76.80822447722554!3d29.396270499959137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390dda457afbe651%3A0x41d3f6feacaa74d4!2sPanipat%2C%20Haryana!5e0!3m2!1sen!2sin!4v1787605821564!5m2!1sen!2sin"
            className="h-[360px] w-full border-0 sm:h-[440px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <div className="flex items-center gap-3 border-t border-border px-5 py-4">
            <MapPin className="size-5 shrink-0 text-brand" />
            <div>
              <p className="text-sm font-semibold text-ink">Bhavita Textiles</p>
              <p className="text-xs text-ink-2">Panipat, Haryana, India</p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}
