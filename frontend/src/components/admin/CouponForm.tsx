'use client';

/*
 * NOTE: Coupons are NOT part of the current schema.sql or backend_workflow.md.
 * This form is a UI-only stub kept ready for a future promotion module.
 * It stores its state locally and MUST NOT be wired to any service until
 * the backend adds a coupons endpoint. The next LLM must not persist coupon
 * data without a matching backend contract amendment.
 */

import { useState } from 'react';
import { toast } from 'sonner';

export interface CouponDraft {
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minOrderAmount?: number;
  usageLimit?: number;
  startsAt?: string;
  endsAt?: string;
  isActive: boolean;
}

const EMPTY: CouponDraft = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: 10,
  isActive: true,
};

interface CouponFormProps {
  initial?: CouponDraft;
  onSubmit?: (draft: CouponDraft) => Promise<void> | void;
}

export default function CouponForm({ initial, onSubmit }: CouponFormProps) {
  const [draft, setDraft] = useState<CouponDraft>(initial ?? EMPTY);

  const update = <K extends keyof CouponDraft>(key: K, value: CouponDraft[K]) => setDraft((prev) => ({ ...prev, [key]: value }));

  return (
    <form
      data-testid="coupon-form"
      className="grid gap-5 rounded-xl border border-border bg-surface p-6"
      onSubmit={async (event) => {
        event.preventDefault();
        try {
          await onSubmit?.(draft);
          toast.success('Coupon saved (local draft only).');
        } catch (error) {
          toast.error(error instanceof Error ? error.message : 'Failed to save');
        }
      }}
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Promotions</p>
        <h2 className="mt-2 font-serif text-3xl text-ink">Coupon</h2>
        <p className="mt-2 text-xs text-ink-2">
          UI stub — a matching backend endpoint must exist before persisting.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-ink">
          Code
          <input
            data-testid="coupon-code"
            required
            value={draft.code}
            onChange={(event) => update('code', event.target.value.toUpperCase())}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Discount type
          <select
            data-testid="coupon-discount-type"
            value={draft.discountType}
            onChange={(event) => update('discountType', event.target.value as CouponDraft['discountType'])}
            className="h-11 rounded border border-border bg-bg px-3 outline-none focus:border-gold"
          >
            <option value="percentage">Percentage</option>
            <option value="flat">Flat amount</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Value
          <input
            data-testid="coupon-value"
            type="number"
            min={0}
            value={draft.discountValue}
            onChange={(event) => update('discountValue', Number(event.target.value))}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Minimum order (₹)
          <input
            data-testid="coupon-min-order"
            type="number"
            min={0}
            value={draft.minOrderAmount ?? ''}
            onChange={(event) => update('minOrderAmount', event.target.value ? Number(event.target.value) : undefined)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink md:col-span-2">
          Description
          <textarea
            data-testid="coupon-description"
            rows={3}
            value={draft.description}
            onChange={(event) => update('description', event.target.value)}
            className="rounded border border-border bg-bg px-4 py-3 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Starts at
          <input
            data-testid="coupon-starts-at"
            type="datetime-local"
            value={draft.startsAt ?? ''}
            onChange={(event) => update('startsAt', event.target.value || undefined)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
        <label className="grid gap-2 text-sm text-ink">
          Ends at
          <input
            data-testid="coupon-ends-at"
            type="datetime-local"
            value={draft.endsAt ?? ''}
            onChange={(event) => update('endsAt', event.target.value || undefined)}
            className="h-11 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
          />
        </label>
      </div>

      <label className="flex items-center gap-3 text-sm text-ink">
        <input
          data-testid="coupon-active"
          type="checkbox"
          checked={draft.isActive}
          onChange={(event) => update('isActive', event.target.checked)}
          className="size-4 rounded border-border"
        />
        Active
      </label>

      <button
        type="submit"
        data-testid="coupon-submit"
        className="inline-flex h-12 items-center justify-center self-start rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg hover:bg-gold"
      >
        Save coupon
      </button>
    </form>
  );
}
