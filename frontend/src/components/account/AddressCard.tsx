'use client';

import type { Address } from '@/types/Address';

interface AddressCardProps {
  address: Address;
  onEdit?: (address: Address) => void;
  onRemove?: (address: Address) => void;
  onSetDefault?: (address: Address) => void;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: (address: Address) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onRemove,
  onSetDefault,
  selectable,
  selected,
  onSelect,
}: AddressCardProps) {
  const Tag: 'button' | 'article' = selectable ? 'button' : 'article';
  const testId = `address-card-${address.id}`;

  return (
    <Tag
      type={selectable ? 'button' : undefined}
      data-testid={testId}
      onClick={selectable ? () => onSelect?.(address) : undefined}
      aria-pressed={selectable ? selected : undefined}
      className={`w-full rounded-xl border bg-surface p-5 text-left transition-colors ${
        selected ? 'border-gold shadow-luxe' : 'border-border hover:border-gold/60'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-xl text-ink">{address.fullName}</h3>
          <p className="mt-1 text-xs uppercase tracking-wider2 text-ink-2">{address.phone}</p>
        </div>
        {address.isDefault ? (
          <span
            data-testid={`${testId}-default`}
            className="rounded-full bg-gold-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 text-ink"
          >
            Default
          </span>
        ) : null}
      </div>

      <p className="mt-4 text-sm leading-6 text-ink-2">
        {address.addressLine1}
        {address.addressLine2 ? <>, {address.addressLine2}</> : null}
        <br />
        {address.city}, {address.state} · {address.pincode}
        <br />
        {address.country}
      </p>

      {onEdit || onRemove || onSetDefault ? (
        <div className="mt-5 flex flex-wrap gap-3 text-xs uppercase tracking-wider2">
          {onEdit ? (
            <button
              type="button"
              data-testid={`${testId}-edit`}
              onClick={(event) => {
                event.stopPropagation();
                onEdit(address);
              }}
              className="text-gold hover:text-gold-2"
            >
              Edit
            </button>
          ) : null}
          {onSetDefault && !address.isDefault ? (
            <button
              type="button"
              data-testid={`${testId}-default-set`}
              onClick={(event) => {
                event.stopPropagation();
                onSetDefault(address);
              }}
              className="text-ink-2 hover:text-gold"
            >
              Set default
            </button>
          ) : null}
          {onRemove ? (
            <button
              type="button"
              data-testid={`${testId}-remove`}
              onClick={(event) => {
                event.stopPropagation();
                onRemove(address);
              }}
              className="text-danger hover:text-danger/80"
            >
              Remove
            </button>
          ) : null}
        </div>
      ) : null}
    </Tag>
  );
}
