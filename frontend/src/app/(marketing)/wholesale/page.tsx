'use client';

import { useState, type FormEvent } from 'react';
import { CheckCircle2, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

import Container from '@/components/common/Container';
import wholesaleService from '@/services/wholesale.service';

const categories = [
  'Bedsheets',
  'Blankets',
  'Floor mats',
  'Cushion covers',
  'Curtains',
  'Towels',
  'Other',
];

const processSteps = [
  'Submit brief',
  'Sample & quote',
  'Approve & schedule',
  'Ship & inspect',
];

const formFields = [
  ['companyName', 'Company name'],
  ['contactPerson', 'Contact person'],
  ['designation', 'Designation'],
  ['email', 'Email'],
  ['phone', 'Phone with country code'],
  ['country', 'Country / City'],
  ['website', 'Website'],
] as const;

const moqOptions = ['300', '500', '1000', '2500', '5000+'];

export default function WholesalePage() {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  const toggleCategory = (category: string) => {
    setSelectedCategories((current) =>
      current.includes(category)
        ? current.filter((item) => item !== category)
        : [...current, category],
    );
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFiles = Array.from(event.target.files ?? []).slice(0, 3);
    setFiles(selectedFiles);
  };

  const removeFile = (indexToRemove: number) => {
    setFiles((current) =>
      current.filter((_, index) => index !== indexToRemove),
    );
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setBusy(true);

    const formData = new FormData(event.currentTarget);

    try {
      await wholesaleService.submit({
        companyName: String(formData.get('companyName') ?? ''),
        contactPerson: String(formData.get('contactPerson') ?? ''),
        email: String(formData.get('email') ?? ''),
        phone: String(formData.get('phone') ?? ''),
        businessType: String(formData.get('designation') ?? ''),
        productInterest: selectedCategories.join(', '),
        quantityRequirement: String(formData.get('moq') ?? ''),
        message: [
          String(formData.get('message') ?? ''),
          `Files: ${files.map((file) => file.name).join(', ')}`,
        ].join('\n'),
      });

      setSent(true);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : 'Unable to send enquiry',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main data-testid="wholesale-page" className="bg-bg">
      <section
        data-testid="wholesale-hero"
        className="bg-brand text-brand-ink"
      >
        <Container className="py-24 sm:py-32">
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand-ink/70">
            Wholesale program
          </p>

          <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[.95] sm:text-7xl">
            Manufactured to your spec. Priced to your volume.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-brand-ink/75">
            From a considered first sample to a dependable repeat order, we
            build around your brief.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-brand-ink/25 px-4 py-2 text-xs">
              24-hour quote
            </span>

            <span className="rounded-full border border-brand-ink/25 px-4 py-2 text-xs">
              MOQ from 300 pcs
            </span>
          </div>
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="grid gap-8 py-16 sm:grid-cols-4">
          {processSteps.map((title, index) => (
            <div
              key={title}
              data-testid={`wholesale-step-${index + 1}`}
              className="border-t border-brand pt-4"
            >
              <p className="font-serif text-4xl text-brand">
                0{index + 1}
              </p>

              <h2 className="mt-4 font-semibold text-ink">
                {title}
              </h2>

              <p className="mt-2 text-sm leading-6 text-ink-2">
                A clear next step, with one team beside you.
              </p>
            </div>
          ))}
        </Container>
      </section>

      <Container className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl">
          {sent ? (
            <div
              data-testid="wholesale-success"
              className="rounded-lg border border-border bg-surface p-12 text-center"
            >
              <span className="inline-flex size-16 items-center justify-center rounded-full bg-brand-soft text-brand">
                <CheckCircle2 className="size-8" />
              </span>

              <h2 className="mt-6 font-serif text-4xl text-ink">
                Your brief is with the mill.
              </h2>

              <p className="mt-4 text-sm leading-7 text-ink-2">
                Our wholesale team will reply within 24 hours with the next
                steps.
              </p>

              <a
                data-testid="wholesale-success-catalogue"
                href="/shop"
                className="mt-8 inline-flex h-12 items-center rounded-full bg-brand px-6 text-[11px] font-semibold uppercase tracking-[.18em] text-brand-ink"
              >
                Explore the catalogue
              </a>
            </div>
          ) : (
            <form
              data-testid="wholesale-form"
              onSubmit={submitForm}
              className="rounded-lg border border-border bg-surface p-6 sm:p-10 lg:p-14"
            >
              <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
                Company details
              </p>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {formFields.map(([name, label]) => (
                  <label
                    key={name}
                    className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2"
                  >
                    {label}

                    <input
                      data-testid={`wholesale-form-${name}`}
                      name={name}
                      required={[
                        'companyName',
                        'contactPerson',
                        'email',
                        'phone',
                      ].includes(name)}
                      type={name === 'email' ? 'email' : 'text'}
                      className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                    />
                  </label>
                ))}
              </div>

              <div className="mt-12 border-t border-border pt-10">
                <p className="font-serif text-2xl text-ink">
                  Product interest
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {categories.map((category) => {
                    const isSelected =
                      selectedCategories.includes(category);

                    const testId =
                      category === 'Other'
                        ? 'bhavita-bulk-order'
                        : category.toLowerCase().replaceAll(' ', '-');

                    return (
                      <button
                        key={category}
                        type="button"
                        data-testid={`wholesale-category-chip-${testId}`}
                        aria-pressed={isSelected}
                        onClick={() => toggleCategory(category)}
                        className={`rounded-full border px-4 py-2 text-xs transition-colors ${
                          isSelected
                            ? 'border-brand bg-brand text-brand-ink'
                            : 'border-border text-ink-2 hover:border-brand'
                        }`}
                      >
                        {category}
                      </button>
                    );
                  })}
                </div>

                <label className="mt-6 grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2">
                  Estimated MOQ per SKU

                  <select
                    data-testid="wholesale-form-moq"
                    name="moq"
                    className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink"
                  >
                    {moqOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>

              <div className="mt-12 border-t border-border pt-10">
                <p className="font-serif text-2xl text-ink">
                  Your brief
                </p>

                <textarea
                  data-testid="wholesale-form-message"
                  name="message"
                  required
                  placeholder="Tell us about print styles, GSM, packaging or private-label needs…"
                  className="mt-5 min-h-40 w-full rounded-md border border-border bg-bg p-4 text-sm text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />

                <label
                  data-testid="wholesale-file-drop"
                  className="mt-5 flex cursor-pointer flex-col items-center justify-center rounded-md border-2 border-dashed border-border bg-surface-2 p-8 text-center"
                >
                  <Upload className="size-6 text-brand" />

                  <span className="mt-3 text-sm text-ink">
                    Drop files here or browse
                  </span>

                  <span className="mt-1 text-xs text-ink-2">
                    PDF, JPG, PNG or ZIP · 10 MB each
                  </span>

                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.zip"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>

                {files.length > 0 ? (
                  <ul className="mt-4 grid gap-2">
                    {files.map((file, index) => (
                      <li
                        key={`${file.name}-${index}`}
                        data-testid={`wholesale-file-${index}`}
                        className="flex items-center justify-between rounded-md bg-surface-2 px-3 py-2 text-xs text-ink"
                      >
                        <span>{file.name}</span>

                        <button
                          type="button"
                          data-testid={`wholesale-file-remove-${index}`}
                          aria-label={`Remove ${file.name}`}
                          onClick={() => removeFile(index)}
                        >
                          <X className="size-4" />
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <label className="mt-5 flex items-center gap-3 text-sm text-ink">
                  <input
                    data-testid="wholesale-form-consent"
                    required
                    type="checkbox"
                    className="size-4 accent-brand"
                  />

                  I agree to receive quotes and updates from Bhavita Textiles.
                </label>

                <button
                  data-testid="wholesale-submit"
                  type="submit"
                  disabled={busy}
                  className="mt-8 h-12 w-full rounded-full bg-brand text-[11px] font-semibold uppercase tracking-[.18em] text-brand-ink hover:bg-brand-2 disabled:opacity-60"
                >
                  {busy ? 'Sending…' : 'Send bulk enquiry'}
                </button>

                <p className="mt-4 text-center text-xs text-ink-2">
                  Typical response within 24 hours.
                </p>
              </div>
            </form>
          )}
        </div>
      </Container>
    </main>
  );
}