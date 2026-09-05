'use client';

import { Suspense, useEffect, useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
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

// Inner component that reads URL search params.
// It must be rendered inside a <Suspense> boundary.
function BulkEnquiryContent() {
  const search = useSearchParams();

  const prefill = useMemo(() => {
    const productName = search.get('productName') ?? '';
    const productSlug = search.get('product') ?? '';
    const sku = search.get('sku') ?? '';
    const qty = search.get('qty') ?? '';

    return {
      productName,
      productSlug,
      sku,
      qty,
    };
  }, [search]);

  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
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

    const name = String(data.get('name') ?? '');
    const email = String(data.get('email') ?? '');
    const phone = String(data.get('phone') ?? '');
    const brief = String(data.get('message') ?? '');

    const productCategories =
      selectedCategories.join(', ') || 'Not specified';

    setBusy(true);

    try {
      /*
       * Keep the existing wholesale service structure so your
       * current backend/service continues to work.
       *
       * The user's name is stored as the contact person.
       */
      await wholesaleService.submit({
        companyName: name,
        contactPerson: name,
        email,
        phone,
        businessType: '',
        productInterest:
          prefill.productName ||
          productCategories ||
          'General textile enquiry',
        quantityRequirement: 'Not specified',
      });

      const whatsappMessage = [
        'Hello, I would like to enquire about Bhavita Textiles.',
        '',
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        '',
        prefill.productName
          ? `Product: ${prefill.productName}${
              prefill.sku ? ` (SKU: ${prefill.sku})` : ''
            }`
          : `Product categories: ${productCategories}`,
        prefill.qty
          ? `Interested quantity: ${prefill.qty} pcs`
          : null,
        '',
        `Brief message: ${brief}`,
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
        error instanceof Error
          ? error.message
          : 'Unable to submit enquiry',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main data-testid="contact-page" className="bg-bg text-ink">
      {/* HERO */}
      <section
        data-testid="contact-hero"
        className="bg-brand text-brand-ink"
      >
        <Container className="py-24 sm:py-32">
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand-ink/70">
            Wholesale program · B2B
          </p>

          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[.95] sm:text-7xl">
            Let&apos;s build something together.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-brand-ink/75">
            Tell us what you are looking for and our team will get back to you
            with the right products, pricing and options.
          </p>

          <div className="mt-8 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full border border-brand-ink/25 px-4 py-2">
              24-hour response
            </span>

            <span className="rounded-full border border-brand-ink/25 px-4 py-2">
              Direct WhatsApp support
            </span>
          </div>
        </Container>
      </section>

      {/* MAIN CONTENT */}
      <Container className="grid gap-16 py-20 sm:py-28 lg:grid-cols-[.45fr_.55fr]">
        {/* LEFT INFORMATION */}
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
            Talk to us
          </p>

          <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">
            Tell us what you need.
          </h2>

          <p className="mt-6 text-sm leading-7 text-ink-2">
            Whether you are looking for bedsheets, blankets, curtains,
            towels or other textile products, share your requirements with us.
            Our team will help you find the right options.
          </p>

          <div className="mt-12 divide-y divide-border">
            {/* ADDRESS */}
            <div
              data-testid="contact-info-factory-address"
              className="flex gap-4 border-t border-border py-6"
            >
              <MapPin className="mt-1 size-5 text-brand" />

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-2">
                  Factory address
                </p>

                <p className="mt-2 text-sm text-ink">
                  Panipat, Haryana, India
                </p>
              </div>
            </div>

            {/* PHONE */}
            <div
              data-testid="contact-info-phone-whatsapp"
              className="flex gap-4 py-6"
            >
              <Phone className="mt-1 size-5 text-brand" />

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-2">
                  Phone / WhatsApp
                </p>

                <p className="mt-2 text-sm text-ink">
                  +91 99999 99999
                </p>
              </div>
            </div>

            {/* EMAIL */}
            <div
              data-testid="contact-info-email"
              className="flex gap-4 py-6"
            >
              <Mail className="mt-1 size-5 text-brand" />

              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-ink-2">
                  Email
                </p>

                <p className="mt-2 text-sm text-ink">
                  hello@bhavitatextiles.com
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FORM */}
        <section
          data-testid="contact-form"
          className="rounded-lg border border-border bg-surface p-6 sm:p-10"
        >
          {submitted ? (
            /* SUCCESS STATE */
            <div
              data-testid="contact-form-success"
              className="grid min-h-[500px] place-items-center text-center"
            >
              <div>
                <span className="inline-flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
                  <CheckCircle2 className="size-8" />
                </span>

                <h2 className="mt-6 font-serif text-4xl text-ink">
                  Your enquiry has been sent.
                </h2>

                <p className="mt-4 text-sm leading-7 text-ink-2">
                  WhatsApp has opened with your enquiry. Our team will get
                  back to you within 24 hours.
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
              className="grid gap-6"
            >
              {/* FORM HEADING */}
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
                  Get in touch
                </p>

                <h2 className="mt-3 font-serif text-3xl text-ink">
                  Tell us what you are looking for.
                </h2>

                <p className="mt-3 text-sm leading-6 text-ink-2">
                  Fill in your details and select the products you are
                  interested in.
                </p>
              </div>

              {/* PRODUCT CONTEXT */}
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
                      {prefill.sku
                        ? `SKU ${prefill.sku}`
                        : null}

                      {prefill.qty
                        ? `${prefill.sku ? ' · ' : ''}Interested qty ${
                            prefill.qty
                          } pcs`
                        : null}
                    </p>
                  </div>
                </div>
              ) : null}

              {/* NAME */}
              <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2">
                Name

                <input
                  data-testid="contact-form-name"
                  name="name"
                  required
                  type="text"
                  autoComplete="name"
                  placeholder="Your name"
                  className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none placeholder:text-ink-2/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>

              {/* EMAIL + PHONE */}
              <div className="grid gap-5 sm:grid-cols-2">
                {/* EMAIL */}
                <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2">
                  Email

                  <input
                    data-testid="contact-form-email"
                    name="email"
                    required
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none placeholder:text-ink-2/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </label>

                {/* PHONE */}
                <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2">
                  Phone

                  <input
                    data-testid="contact-form-phone"
                    name="phone"
                    required
                    type="tel"
                    autoComplete="tel"
                    placeholder="+91 98765 43210"
                    className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none placeholder:text-ink-2/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
                  />
                </label>
              </div>

              {/* PRODUCT CATEGORIES */}
              <div className="border-t border-border pt-7">
                <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2">
                  Product category

                  <select
                    name="productCategory"
                    required
                    value={selectedCategories[0] ?? ''}
                    onChange={(event) =>
                      setSelectedCategories(
                        event.target.value ? [event.target.value] : [],
                      )
                    }
                    className="h-12 w-full rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                  >
                    <option value="" disabled>
                      Select a product category
                    </option>

                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              {/* BRIEF MESSAGE */}
              <div className="border-t border-border pt-7">
                <p className="font-serif text-2xl text-ink">
                  Brief message
                </p>

                <p className="mt-2 text-sm text-ink-2">
                  Tell us anything else about your requirements.
                </p>

                <textarea
                  data-testid="contact-form-message"
                  name="message"
                  required
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="Tell us about the products, quantity, specifications or anything else you need..."
                  className="mt-5 min-h-40 w-full rounded-md border border-border bg-bg p-4 text-sm leading-6 text-ink outline-none placeholder:text-ink-2/60 focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>

              

              {/* SUBMIT */}
              <button
                data-testid="contact-form-submit"
                disabled={busy}
                type="submit"
                className="h-12 rounded-full bg-brand text-[11px] font-semibold uppercase tracking-[.18em] text-brand-ink transition-colors hover:bg-brand-2 disabled:cursor-not-allowed disabled:opacity-60"
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

      {/* MAP */}
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
              <p className="text-sm font-semibold text-ink">
                Bhavita Textiles
              </p>

              <p className="text-xs text-ink-2">
                Panipat, Haryana, India
              </p>
            </div>
          </div>
        </div>
      </Container>
    </main>
  );
}

// Suspense wrapper required because the page uses useSearchParams().
export default function BulkEnquiryPage() {
  return (
    <Suspense
      fallback={
        <main
          data-testid="contact-page-loading"
          className="min-h-[60vh] bg-bg"
        />
      }
    >
      <BulkEnquiryContent />
    </Suspense>
  );
}