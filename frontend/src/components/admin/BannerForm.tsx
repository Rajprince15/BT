'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import type { Banner, BannerPlacement } from '@/types/Banner';
import type { AdminBannerPayload } from '@/services/admin/banner.service';
import ImageUploader, { UploadedAsset } from '@/components/admin/ImageUploader';

interface BannerFormProps {
  initial?: Banner;
  onSubmit: (payload: AdminBannerPayload) => Promise<void>;
  submitLabel?: string;
}

const PLACEMENTS: Array<{ value: BannerPlacement; label: string }> = [
  { value: 'home_hero', label: 'Home Hero' },
  { value: 'home_promo', label: 'Home Promo' },
  { value: 'category', label: 'Category page' },
  { value: 'sidebar', label: 'Sidebar' },
];

export default function BannerForm({ initial, onSubmit, submitLabel = 'Save banner' }: BannerFormProps) {
  const [draft, setDraft] = useState<AdminBannerPayload>(() =>
    initial
      ? {
          title: initial.title,
          subtitle: initial.subtitle,
          imageUrl: initial.imageUrl,
          linkUrl: initial.linkUrl,
          placement: initial.placement,
          categoryId: initial.categoryId,
          sortOrder: initial.sortOrder,
          startAt: initial.startAt,
          endAt: initial.endAt,
          isActive: initial.isActive,
        }
      : { title: '', imageUrl: '', placement: 'home_hero', sortOrder: 0, isActive: true },
  );
  const [assets, setAssets] = useState<UploadedAsset[]>(
    initial?.imageUrl ? [{ secureUrl: initial.imageUrl, publicId: `banner-${initial.id}`, sortOrder: 0 }] : [],
  );
  const [busy, setBusy] = useState(false);

  const update = <K extends keyof AdminBannerPayload>(key: K, value: AdminBannerPayload[K]) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      data-testid="banner-form"
      className="grid gap-6"
      onSubmit={async (event) => {
        event.preventDefault();
        setBusy(true);
        try {
          const first = assets[0];
          if (!first) {
            toast.error('Please upload a banner image.');
            setBusy(false);
            return;
          }
          await onSubmit({ ...draft, imageUrl: first.secureUrl });
          toast.success('Banner saved');
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to save');
        } finally {
          setBusy(false);
        }
      }}
    >
      <section className="grid gap-4 rounded-xl border border-border bg-surface p-6 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-ink md:col-span-2">
          Title
          <input
            data-testid="banner-form-title"
            required
            value={draft.title}
            onChange={(event) => update('title', event.target.value)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink md:col-span-2">
          Subtitle
          <input
            data-testid="banner-form-subtitle"
            value={draft.subtitle ?? ''}
            onChange={(event) => update('subtitle', event.target.value)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Placement
          <select
            data-testid="banner-form-placement"
            value={draft.placement}
            onChange={(event) => update('placement', event.target.value as BannerPlacement)}
            className="h-11 rounded border border-border bg-bg px-3 outline-none focus:border-gold"
          >
            {PLACEMENTS.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Link URL
          <input
            data-testid="banner-form-link"
            value={draft.linkUrl ?? ''}
            onChange={(event) => update('linkUrl', event.target.value)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Sort order
          <input
            data-testid="banner-form-sort"
            type="number"
            value={draft.sortOrder ?? 0}
            onChange={(event) => update('sortOrder', Number(event.target.value))}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-ink">
          <input
            data-testid="banner-form-active"
            type="checkbox"
            checked={draft.isActive ?? true}
            onChange={(event) => update('isActive', event.target.checked)}
            className="size-4"
          />
          Active
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Starts at
          <input
            data-testid="banner-form-start"
            type="datetime-local"
            value={draft.startAt ?? ''}
            onChange={(event) => update('startAt', event.target.value || undefined)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Ends at
          <input
            data-testid="banner-form-end"
            type="datetime-local"
            value={draft.endAt ?? ''}
            onChange={(event) => update('endAt', event.target.value || undefined)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
      </section>

      <section className="rounded-xl border border-border bg-surface p-6">
        <h3 className="font-serif text-xl text-ink">Image</h3>
        <div className="mt-4">
          <ImageUploader value={assets} onChange={setAssets} folder="bhavita/banners" max={1} label="Upload banner image" />
        </div>
      </section>

      <button
        type="submit"
        data-testid="banner-form-submit"
        disabled={busy}
        className="inline-flex h-12 items-center justify-center self-end rounded-full bg-ink px-8 text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold disabled:opacity-50"
      >
        {busy ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}
