'use client';

import Link from 'next/link';
import { CheckCircle2, Circle, Plus } from 'lucide-react';
import type { Address } from '@/types/Address';

export default function AddressStep({
  addresses,
  selected,
  onSelect,
}: {
  addresses: Address[];
  selected?: number;
  onSelect: (id: number) => void;
}) {
  return (
    <section
      data-testid="checkout-address-step"
      className="rounded-lg border border-border bg-surface p-6 sm:p-8 lg:p-10"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
            Step 1
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink">
            Where should we deliver?
          </h2>
          <p className="mt-2 text-sm text-ink-2">
            Choose the address your order should arrive at.
          </p>
        </div>

        <Link
          href="/account/addresses/new?returnTo=/checkout"
          data-testid="checkout-add-address"
          className="inline-flex h-11 items-center gap-2 self-start rounded-full border border-border bg-bg px-4 text-[11px] font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-gold hover:text-gold"
        >
          <Plus className="size-4" /> Add new address
        </Link>
      </div>

      {addresses.length === 0 ? (
        <div
          data-testid="checkout-no-addresses"
          className="mt-7 grid place-items-center rounded-lg border border-dashed border-border bg-bg p-8 text-center"
        >
          <p className="text-sm text-ink-2">
            You don&apos;t have a saved address yet.
          </p>
          <Link
            href="/account/addresses/new?returnTo=/checkout"
            data-testid="checkout-no-addresses-add"
            className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[11px] font-semibold uppercase tracking-wider2 text-bg hover:bg-gold hover:text-ink"
          >
            <Plus className="size-4" /> Add address to continue
          </Link>
        </div>
      ) : (
        <div className="mt-7 grid gap-3">
          {addresses.map((address) => {
            const active = selected === address.id;
            return (
              <button
                type="button"
                key={address.id}
                data-testid={`checkout-address-${address.id}`}
                aria-pressed={active}
                onClick={() => onSelect(address.id)}
                className={`flex min-h-24 items-start gap-4 rounded-lg border p-5 text-left text-sm leading-6 transition-colors focus-visible:ring-2 focus-visible:ring-gold ${
                  active
                    ? 'border-brand bg-brand-soft'
                    : 'border-border bg-bg hover:border-brand/50'
                }`}
              >
                <span className="mt-0.5 shrink-0">
                  {active ? (
                    <CheckCircle2
                      data-testid={`checkout-address-selected-${address.id}`}
                      className="size-5 text-brand"
                    />
                  ) : (
                    <Circle className="size-5 text-ink-2" />
                  )}
                </span>
                <span className="flex-1">
                  <strong
                    data-testid={`checkout-address-name-${address.id}`}
                    className="text-ink"
                  >
                    {address.fullName}
                  </strong>
                  {active ? (
                    <span
                      data-testid={`checkout-address-label-${address.id}`}
                      className="ml-3 rounded-full bg-brand px-2 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-brand-ink"
                    >
                      Selected
                    </span>
                  ) : null}
                  <span className="mt-1 block text-ink-2">
                    {address.addressLine1}, {address.city}, {address.state} ·{' '}
                    {address.pincode}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
