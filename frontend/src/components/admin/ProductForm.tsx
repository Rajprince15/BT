'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { Product } from '@/types/Product';
import type { Category } from '@/types/Category';
import type { AdminProductPayload } from '@/services/admin/product.service';
import ImageUploader, { UploadedAsset } from '@/components/admin/ImageUploader';

interface ProductFormProps {
  initial?: Product;
  categories: Category[];
  onSubmit: (payload: AdminProductPayload) => Promise<void>;
  submitLabel?: string;
}

const emptyDraft = (): AdminProductPayload => ({
  name: '',
  slug: '',
  sku: '',
  categoryId: 0,
  shortDescription: '',
  description: '',
  price: 0,
  salePrice: undefined,
  stock: 0,
  featured: false,
  bestSeller: false,
  newArrival: false,
  status: 'draft',
});

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ProductForm({ initial, categories, onSubmit, submitLabel = 'Save product' }: ProductFormProps) {
  const [draft, setDraft] = useState<AdminProductPayload>(() =>
    initial
      ? {
          name: initial.name,
          slug: initial.slug,
          sku: initial.sku,
          categoryId: initial.categoryId,
          shortDescription: initial.shortDescription ?? '',
          description: initial.description ?? '',
          price: initial.price,
          salePrice: initial.salePrice,
          stock: initial.stock,
          featured: initial.featured,
          bestSeller: initial.bestSeller,
          newArrival: initial.newArrival,
          status: initial.status,
        }
      : emptyDraft(),
  );
  const [images, setImages] = useState<UploadedAsset[]>(
    () =>
      initial?.images.map((img) => ({
        secureUrl: img.imageUrl,
        publicId: img.cloudId ?? String(img.id),
        alt: img.altText ?? '',
        sortOrder: img.sortOrder,
      })) ?? [],
  );
  const [busy, setBusy] = useState(false);

  const update = <K extends keyof AdminProductPayload>(key: K, value: AdminProductPayload[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      data-testid="product-form"
      className="grid gap-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        try {
          await onSubmit(draft);
          toast.success('Product saved');
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to save');
        } finally {
          setBusy(false);
        }
      }}
    >
      <section className="grid gap-4 rounded-xl border border-border bg-surface p-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-ink md:col-span-2">
          Name
          <input
            data-testid="product-form-name"
            required
            value={draft.name}
            onChange={(event) => {
              const name = event.target.value;
              setDraft((prev) => ({
                ...prev,
                name,
                slug: prev.slug || slugify(name),
              }));
            }}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Slug
          <input
            data-testid="product-form-slug"
            required
            value={draft.slug}
            onChange={(event) => update('slug', slugify(event.target.value))}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          SKU
          <input
            data-testid="product-form-sku"
            required
            value={draft.sku}
            onChange={(event) => update('sku', event.target.value.toUpperCase())}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Category
          <select
            data-testid="product-form-category"
            required
            value={draft.categoryId || ''}
            onChange={(event) => update('categoryId', Number(event.target.value))}
            className="h-11 rounded border border-border bg-bg px-3 outline-none focus:border-gold"
          >
            <option value="">Choose a category…</option>
            {categories
              .filter((c) => c.isActive)
              .map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Status
          <select
            data-testid="product-form-status"
            value={draft.status}
            onChange={(event) => update('status', event.target.value as AdminProductPayload['status'])}
            className="h-11 rounded border border-border bg-bg px-3 outline-none focus:border-gold"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-ink md:col-span-2">
          Short description
          <input
            data-testid="product-form-short-description"
            value={draft.shortDescription ?? ''}
            onChange={(event) => update('shortDescription', event.target.value)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink md:col-span-2">
          Long description
          <textarea
            data-testid="product-form-description"
            rows={5}
            value={draft.description ?? ''}
            onChange={(event) => update('description', event.target.value)}
            className="rounded border border-border bg-bg px-4 py-3 outline-none focus:border-gold"
          />
        </label>
      </section>

      <section className="grid gap-4 rounded-xl border border-border bg-surface p-6 md:grid-cols-3">
        <label className="grid gap-2 text-sm text-ink">
          Price (₹)
          <input
            data-testid="product-form-price"
            required
            type="number"
            min={0}
            step="0.01"
            value={draft.price}
            onChange={(event) => update('price', Number(event.target.value))}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Sale price (₹)
          <input
            data-testid="product-form-sale-price"
            type="number"
            min={0}
            step="0.01"
            value={draft.salePrice ?? ''}
            onChange={(event) => update('salePrice', event.target.value ? Number(event.target.value) : undefined)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Stock
          <input
            data-testid="product-form-stock"
            required
            type="number"
            min={0}
            value={draft.stock}
            onChange={(event) => update('stock', Number(event.target.value))}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
      </section>

      <section className="flex flex-wrap gap-6 rounded-xl border border-border bg-surface p-6">
        {(
          [
            ['featured', 'Featured'],
            ['bestSeller', 'Best seller'],
            ['newArrival', 'New arrival'],
          ] as const
        ).map(([key, label]) => (
          <label key={key} className="inline-flex items-center gap-2 text-sm text-ink">
            <input
              data-testid={`product-form-flag-${key}`}
              type="checkbox"
              checked={Boolean(draft[key])}
              onChange={(event) => update(key, event.target.checked)}
              className="size-4"
            />
            {label}
          </label>
        ))}
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-serif text-xl text-ink">Images</h3>
        <p className="mt-1 text-xs text-ink-2">Uploads use the mock Cloudinary flow while `NEXT_PUBLIC_USE_MOCKS=true`.</p>
        <div className="mt-4">
          <ImageUploader value={images} onChange={setImages} folder="bhavita/products" max={10} />
        </div>
      </section>

      <div className="flex justify-end">
        <button
          type="submit"
          data-testid="product-form-submit"
          disabled={busy}
          className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-8 text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold disabled:opacity-50"
        >
          {busy ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}
