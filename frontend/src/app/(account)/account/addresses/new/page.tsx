'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useState, type FormEvent } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import userService from '@/services/user.service';

export default function NewAddressPage() {
  const router = useRouter();
  const search = useSearchParams();
  const returnTo = search.get('returnTo') ?? '/account/addresses';
  const client = useQueryClient();
  const [busy, setBusy] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    setBusy(true);
    try {
      await userService.addresses.add({
        fullName: String(form.get('fullName') ?? ''),
        phone: String(form.get('phone') ?? ''),
        addressLine1: String(form.get('addressLine1') ?? ''),
        addressLine2: String(form.get('addressLine2') ?? '') || undefined,
        city: String(form.get('city') ?? ''),
        state: String(form.get('state') ?? ''),
        pincode: String(form.get('pincode') ?? ''),
        country: String(form.get('country') ?? 'India'),
        isDefault: form.get('isDefault') === 'on',
      });

      client.invalidateQueries({ queryKey: ['addresses'] });
      toast.success('Address saved');
      router.push(returnTo);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Unable to save address',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div data-testid="new-address-page" className="w-full">
      <Link
        href={returnTo}
        data-testid="new-address-back"
        className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider2 text-ink-2 transition-colors hover:text-gold"
      >
        <ArrowLeft className="size-3.5" /> Back
      </Link>

      <section className="mt-4 border-b border-border pb-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          New delivery address
        </p>
        <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
          Add a new address
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-ink-2">
          We use this to route your orders and share dispatch updates.
        </p>
      </section>

      <form
        data-testid="new-address-form"
        onSubmit={onSubmit}
        className="mt-8 grid gap-5 rounded-xl border border-border bg-surface p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <Field name="fullName" label="Full name" required />
          <Field name="phone" label="Phone" type="tel" required />
          <Field
            name="addressLine1"
            label="Address line 1"
            required
            className="sm:col-span-2"
          />
          <Field
            name="addressLine2"
            label="Address line 2 (optional)"
            className="sm:col-span-2"
          />
          <Field name="city" label="City" required />
          <Field name="state" label="State" required />
          <Field name="pincode" label="PIN / Zip" required />
          <Field name="country" label="Country" defaultValue="India" required />
        </div>

        <label className="flex items-center gap-3 text-sm text-ink">
          <input
            data-testid="new-address-default"
            type="checkbox"
            name="isDefault"
            className="size-4 accent-brand"
          />
          Set as my default delivery address
        </label>

        <div className="flex flex-wrap gap-3">
          <button
            type="submit"
            data-testid="new-address-submit"
            disabled={busy}
            className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-[11px] font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold hover:text-ink disabled:cursor-not-allowed disabled:opacity-60"
          >
            {busy ? 'Saving…' : 'Save address'}
          </button>
          <Link
            href={returnTo}
            data-testid="new-address-cancel"
            className="inline-flex h-12 items-center justify-center rounded-full border border-border px-6 text-[11px] font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-gold"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function Field({
  name,
  label,
  type = 'text',
  required,
  defaultValue,
  className,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
  className?: string;
}) {
  return (
    <label
      className={`grid gap-2 text-[11px] font-semibold uppercase tracking-[.14em] text-ink-2 ${className ?? ''}`}
    >
      {label}
      {required ? <span className="sr-only">(required)</span> : null}
      <input
        data-testid={`new-address-${name}`}
        name={name}
        type={type}
        required={required}
        defaultValue={defaultValue}
        className="h-12 rounded-md border border-border bg-bg px-4 text-sm font-normal normal-case tracking-normal text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/20"
      />
    </label>
  );
}
