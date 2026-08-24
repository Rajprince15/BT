'use client';

import Link from 'next/link';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { MapPin, Plus } from 'lucide-react';
import { toast } from 'sonner';

import userService from '@/services/user.service';
import AddressCard from '@/components/account/AddressCard';

export default function AddressesPage() {
  const client = useQueryClient();
  const { data = [], isLoading } = useQuery({
    queryKey: ['addresses'],
    queryFn: userService.addresses.list,
  });

  const handleRemove = async (id: number) => {
    await userService.addresses.remove(id);
    client.invalidateQueries({ queryKey: ['addresses'] });
    toast.success('Address removed');
  };

  const handleSetDefault = async (id: number) => {
    // clear all defaults, then set this one
    await Promise.all(
      data
        .filter((address) => address.isDefault && address.id !== id)
        .map((address) =>
          userService.addresses.update(address.id, { isDefault: false }),
        ),
    );
    await userService.addresses.update(id, { isDefault: true });
    client.invalidateQueries({ queryKey: ['addresses'] });
    toast.success('Default address updated');
  };

  return (
    <div data-testid="addresses-page" className="w-full">
      {/* Header */}
      <section className="flex flex-col gap-6 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            Delivery details
          </p>
          <h1 className="mt-2 font-serif text-4xl text-ink sm:text-5xl">
            Addresses
          </h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-ink-2">
            Save the addresses you ship to most often. You can pick any of them
            at checkout with a single tap.
          </p>
        </div>

        <Link
          href="/account/addresses/new"
          data-testid="addresses-add-button"
          className="inline-flex h-11 items-center gap-2 self-start rounded-full bg-ink px-5 text-[11px] font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold hover:text-ink sm:self-end"
        >
          <Plus className="size-4" /> Add address
        </Link>
      </section>

      {/* Loading */}
      {isLoading ? (
        <div
          data-testid="addresses-loading"
          className="mt-8 grid gap-4 md:grid-cols-2"
        >
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={index}
              className="h-40 animate-pulse rounded-xl border border-border bg-surface-2"
            />
          ))}
        </div>
      ) : null}

      {/* Empty state */}
      {!isLoading && data.length === 0 ? (
        <div
          data-testid="addresses-empty"
          className="mt-10 grid place-items-center rounded-xl border border-dashed border-border bg-surface px-6 py-14 text-center"
        >
          <div>
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-gold-soft">
              <MapPin className="size-6 text-gold" />
            </div>
            <h2 className="mt-4 font-serif text-2xl text-ink">
              No addresses yet
            </h2>
            <p className="mt-2 max-w-sm text-sm text-ink-2">
              Add a delivery address so checkout only takes a moment next time.
            </p>
            <Link
              href="/account/addresses/new"
              data-testid="addresses-empty-add"
              className="mt-5 inline-flex h-11 items-center gap-2 rounded-full bg-ink px-5 text-[11px] font-semibold uppercase tracking-wider2 text-bg hover:bg-gold hover:text-ink"
            >
              <Plus className="size-4" /> Add your first address
            </Link>
          </div>
        </div>
      ) : null}

      {/* List */}
      {!isLoading && data.length > 0 ? (
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {data.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onRemove={() => handleRemove(address.id)}
              onSetDefault={() => handleSetDefault(address.id)}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
