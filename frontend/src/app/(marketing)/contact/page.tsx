'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';

import Container from '@/components/common/Container';
import productService from '@/services/product.service';
import wholesaleService from '@/services/wholesale.service';
import { whatsappUrl } from '@/components/layout/WhatsAppWidget';
import type { Product } from '@/types/Product';

type Choice = { quantity: number; variantId?: number };
type Selection = Record<number, Choice>;

const groups: Record<string, string> = {
  BS: 'Bedsheets',
  MB: 'Mink blankets',
  FM: 'Floor mats',
  CM: 'Comforters',
  PC: 'Pillow covers',
  TW: 'Towels',
  CT: 'Curtains',
};

const money = (value: number) => `₹${value.toLocaleString('en-IN')}`;

const basePrice = (product: Product) =>
  product.salePrice && product.salePrice < product.price
    ? product.salePrice
    : product.price;

const groupFor = (product: Product) =>
  groups[product.sku.split('-')[1]] ?? 'Other';

const variantPrice = (product: Product, variantId?: number) =>
  product.variants.find((variant) => variant.id === variantId)?.price ??
  basePrice(product);

export default function BulkEnquiryPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['bulk-catalogue'],
    queryFn: () => productService.list({ limit: 1000, sort: 'new' }),
  });

  const products = useMemo(
    () => (data?.items ?? []).filter((product) => Boolean(product.moq)),
    [data],
  );

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(products.map(groupFor)))],
    [products],
  );

  const [category, setCategory] = useState('All');
  const [selection, setSelection] = useState<Selection>({});
  const [form, setForm] = useState({
    company: '',
    name: '',
    email: '',
    phone: '',
    business: 'Hotel',
    message: '',
  });
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const visibleProducts = products.filter(
    (product) => category === 'All' || groupFor(product) === category,
  );

  const chosen = products.filter(
    (product) => selection[product.id]?.quantity > 0,
  );

  const total = chosen.reduce((sum, product) => {
    const choice = selection[product.id];
    return sum + variantPrice(product, choice.variantId) * choice.quantity;
  }, 0);

  const update = (key: keyof typeof form, value: string) =>
    setForm((old) => ({ ...old, [key]: value }));

  const toggle = (product: Product) =>
    setSelection((old) =>
      old[product.id]
        ? { ...old, [product.id]: { quantity: 0 } }
        : {
            ...old,
            [product.id]: {
              quantity: 1,
              variantId: product.variants[0]?.id,
            },
          },
    );

  const updateChoice = (product: Product, choice: Partial<Choice>) =>
    setSelection((old) => ({
      ...old,
      [product.id]: { ...old[product.id], ...choice },
    }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!chosen.length) {
      toast.error('Select at least one catalogue item first.');
      return;
    }

    setConfirming(true);
  };

  const sendWhatsApp = async () => {
    setBusy(true);

    const lines = chosen
      .map((product) => {
        const choice = selection[product.id];
        const variant = product.variants.find(
          (item) => item.id === choice.variantId,
        );
        const unit = variantPrice(product, choice.variantId);

        return `${product.sku} — ${product.name} | Size: ${variant?.size ?? product.sizeLabel} | Unit price: ${money(unit)} | Quantity: ${choice.quantity} | Line total: ${money(unit * choice.quantity)} | MOQ: ${product.moq}`;
      })
      .join('\n');

    try {
      await wholesaleService.submit({
        companyName: form.company,
        contactPerson: form.name,
        email: form.email,
        phone: form.phone,
        businessType: form.business,
        productInterest: lines,
        quantityRequirement: chosen
          .map(
            (product) =>
              `${product.sku}: ${selection[product.id].quantity}`,
          )
          .join(', '),
        message: form.message || 'Bulk catalogue enquiry',
      });

      window.location.assign(
        whatsappUrl(
          `Hello, I would like a bulk quote from Bhavita Textiles.\n\nCompany: ${form.company}\nContact: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nBusiness: ${form.business}\n\nSelected items:\n${lines}\n\nCatalogue total: ${money(total)}\nProject notes: ${form.message || 'Not specified'}`,
        ),
      );
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
    <main data-testid="bulk-enquiry-page" className="bg-bg text-ink">
      <section className="bg-brand text-brand-ink">
        <Container className="py-20 sm:py-28">
          <p
            data-testid="bulk-enquiry-eyebrow"
            className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand-ink/70"
          >
            Bulk Enquiry · B2B
          </p>

          <h1
            data-testid="bulk-enquiry-heading"
            className="mt-5 max-w-4xl font-serif text-5xl leading-[.95] sm:text-7xl"
          >
            Choose your range. We&apos;ll build the volume around it.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-8 text-brand-ink/75">
            Select a range, choose the size and quantity you need, and send a
            clear request to our WhatsApp team.
          </p>
        </Container>
      </section>

      <Container className="grid gap-12 py-20 lg:grid-cols-[1.3fr_.7fr]">
        <section>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
                The catalogue
              </p>

              <h2
                data-testid="bulk-catalogue-heading"
                className="mt-3 font-serif text-4xl text-ink sm:text-5xl"
              >
                Existing ranges &amp; prices
              </h2>
            </div>

            <span
              data-testid="bulk-catalogue-count"
              className="text-xs uppercase tracking-[.16em] text-ink-2"
            >
              {products.length} items
            </span>
          </div>

          <div
            data-testid="bulk-category-filters"
            className="mt-8 flex flex-wrap gap-2"
          >
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                data-testid={`bulk-filter-${item
                  .toLowerCase()
                  .replace(/\s+/g, '-')}`}
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[.14em] transition-colors focus-visible:ring-2 focus-visible:ring-gold ${
                  category === item
                    ? 'border-brand bg-brand text-brand-ink'
                    : 'border-border bg-surface text-ink-2 hover:border-brand hover:text-ink'
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          {isLoading ? (
            <p
              data-testid="bulk-catalogue-loading"
              className="mt-8 text-sm text-ink-2"
            >
              Loading catalogue…
            </p>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {visibleProducts.map((product) => {
                const choice = selection[product.id];
                const selected = Boolean(choice?.quantity);
                const variant =
                  product.variants.find(
                    (item) => item.id === choice?.variantId,
                  ) ?? product.variants[0];
                const unit = variantPrice(product, choice?.variantId);
                const productKey = product.sku.toLowerCase();

                return (
                  <article
                    key={product.id}
                    data-testid={`bulk-product-${productKey}`}
                    className={`rounded-lg border bg-surface p-5 transition-shadow hover:shadow-[0_18px_40px_-24px_rgba(125,44,40,0.28)] ${
                      selected ? 'border-brand' : 'border-border'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        data-testid={`bulk-product-select-${productKey}`}
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggle(product)}
                        className="mt-1 size-5 accent-brand"
                        aria-label={`Select ${product.name}`}
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[.16em] text-brand">
                              {product.sku} · {groupFor(product)}
                            </p>

                            <h3
                              data-testid={`bulk-product-name-${productKey}`}
                              className="mt-2 font-serif text-xl leading-tight text-ink"
                            >
                              {product.name}
                            </h3>
                          </div>

                          <p
                            data-testid={`bulk-product-price-${productKey}`}
                            className="shrink-0 font-serif text-xl text-brand"
                          >
                            {money(unit)}
                          </p>
                        </div>

                        <p className="mt-3 line-clamp-2 text-xs leading-5 text-ink-2">
                          {product.shortDescription}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 border-t border-border pt-4 text-[11px] text-ink-2">
                          <span data-testid={`bulk-product-size-${productKey}`}>
                            Size:{' '}
                            <b className="text-ink">
                              {variant?.size ?? product.sizeLabel}
                            </b>
                          </span>

                          <span>
                            MOQ: <b className="text-ink">{product.moq}</b>
                          </span>
                        </div>

                        {selected ? (
                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[.14em] text-ink-2">
                              Size

                              <select
                                data-testid={`bulk-product-size-select-${productKey}`}
                                value={choice.variantId ?? ''}
                                onChange={(event) =>
                                  updateChoice(product, {
                                    variantId: Number(event.target.value),
                                  })
                                }
                                className="h-10 rounded-md border border-border bg-bg px-2 text-xs font-normal normal-case tracking-normal text-ink outline-none focus:border-brand"
                              >
                                {product.variants.map((item) => (
                                  <option key={item.id} value={item.id}>
                                    {item.size ?? product.sizeLabel}
                                    {item.color ? ` · ${item.color}` : ''}
                                  </option>
                                ))}
                              </select>
                            </label>

                            <label className="grid gap-1 text-[10px] font-semibold uppercase tracking-[.14em] text-ink-2">
                              Quantity

                              <input
                                data-testid={`bulk-product-quantity-${productKey}`}
                                type="number"
                                min="1"
                                value={choice.quantity}
                                onChange={(event) =>
                                  updateChoice(product, {
                                    quantity: Math.max(
                                      1,
                                      Number(event.target.value) || 1,
                                    ),
                                  })
                                }
                                className="h-10 rounded-md border border-border bg-bg px-2 text-xs font-normal normal-case tracking-normal text-ink outline-none focus:border-brand"
                              />
                            </label>

                            <p
                              data-testid={`bulk-product-line-total-${productKey}`}
                              className="col-span-2 text-right text-xs font-semibold text-brand"
                            >
                              Line total: {money(unit * choice.quantity)}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <form
            data-testid="bulk-enquiry-form"
            onSubmit={submit}
            className="grid gap-5 rounded-lg border border-border bg-surface p-6 sm:p-8"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
              Send your request
            </p>

            <h2 className="font-serif text-3xl text-ink">
              A precise quote, sent securely
            </h2>

            <p
              data-testid="bulk-enquiry-selected-summary"
              className="rounded-md bg-brand-soft p-4 text-sm leading-6 text-ink-2"
            >
              {chosen.length
                ? `${chosen.length} item${chosen.length === 1 ? '' : 's'} selected · ${money(total)} catalogue total`
                : 'Select items from the catalogue to begin.'}
            </p>

            {(['company', 'name', 'email', 'phone'] as const).map((key) => (
              <label
                key={key}
                className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2"
              >
                {key === 'company'
                  ? 'Company'
                  : key === 'name'
                    ? 'Contact person'
                    : key[0].toUpperCase() + key.slice(1)}

                <input
                  data-testid={`bulk-enquiry-${key}`}
                  required
                  value={form[key]}
                  onChange={(event) => update(key, event.target.value)}
                  type={key === 'email' ? 'email' : key === 'phone' ? 'tel' : 'text'}
                  className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </label>
            ))}

            <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2">
              Business type

              <select
                data-testid="bulk-enquiry-business"
                value={form.business}
                onChange={(event) => update('business', event.target.value)}
                className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-brand"
              >
                <option>Hotel</option>
                <option>Retail Store</option>
                <option>Interior Designer</option>
                <option>Corporate Gifting</option>
                <option>Government Tender</option>
                <option>Other</option>
              </select>
            </label>

            <label className="grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2">
              Project notes

              <textarea
                data-testid="bulk-enquiry-message"
                rows={4}
                value={form.message}
                onChange={(event) => update('message', event.target.value)}
                className="min-h-28 rounded-md border border-border bg-bg p-4 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
              />
            </label>

            <button
              data-testid="bulk-enquiry-submit"
              type="submit"
              disabled={busy || !chosen.length}
              className="mt-1 inline-flex h-12 items-center justify-center rounded-full bg-brand px-6 text-[11px] font-semibold uppercase tracking-[.18em] text-brand-ink transition-colors hover:bg-brand-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy ? 'Preparing WhatsApp…' : 'Review WhatsApp message'}
            </button>

            {confirming ? (
              <div
                data-testid="bulk-whatsapp-confirmation"
                className="rounded-lg border border-brand bg-brand-soft p-5"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[.18em] text-brand">
                  Final check
                </p>

                <h3 className="mt-2 font-serif text-2xl text-ink">
                  Send this exact request?
                </h3>

                <div
                  data-testid="bulk-locked-summary"
                  className="mt-4 max-h-48 overflow-y-auto rounded-md bg-surface p-4 text-xs leading-5 text-ink"
                >
                  {chosen.map((product) => (
                    <p key={product.id}>
                      {product.sku} · {selection[product.id].quantity} ×{' '}
                      {money(
                        variantPrice(
                          product,
                          selection[product.id].variantId,
                        ),
                      )}
                    </p>
                  ))}

                  <p className="mt-3 border-t border-border pt-3 font-semibold">
                    Total: {money(total)}
                  </p>
                </div>

                <p className="mt-3 text-[11px] leading-5 text-ink-2">
                  This review shows the calculated sizes, quantities and prices
                  before WhatsApp opens.
                </p>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    data-testid="bulk-whatsapp-confirm"
                    onClick={sendWhatsApp}
                    disabled={busy}
                    className="flex-1 rounded-full bg-success px-3 py-3 text-[10px] font-semibold uppercase tracking-[.14em] text-brand-ink disabled:opacity-50"
                  >
                    Confirm &amp; open
                  </button>

                  <button
                    type="button"
                    data-testid="bulk-whatsapp-cancel"
                    onClick={() => setConfirming(false)}
                    className="rounded-full border border-border px-3 py-3 text-[10px] font-semibold uppercase tracking-[.14em] text-ink"
                  >
                    Edit
                  </button>
                </div>
              </div>
            ) : null}

            <p
              data-testid="bulk-enquiry-security-note"
              className="text-[11px] leading-5 text-ink-2"
            >
              Prices are calculated automatically from the selected size and
              quantity. No price field can be edited in this form.
            </p>
          </form>
        </aside>
      </Container>
    </main>
  );
}