'use client';

import type { ProductVariant } from '@/types/ProductVariant';

interface VariantPickerProps {
  variants: ProductVariant[];
  selected?: ProductVariant;
  onChange: (variant?: ProductVariant) => void;
}

export default function VariantPicker({
  variants,
  selected,
  onChange,
}: VariantPickerProps) {
  const sizes = [
    ...new Set(variants.map((variant) => variant.size).filter(Boolean)),
  ] as string[];
  const colors = [
    ...new Set(variants.map((variant) => variant.color).filter(Boolean)),
  ] as string[];

  if (!variants.length) return null;

  return (
    <div
      data-testid="product-variant-picker"
      className="space-y-4 border-y border-border py-4"
    >
      {sizes.length ? (
        <fieldset>
          <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wider2 text-ink-2">
            Size
          </legend>

          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => {
              const active = selected?.size === size;
              const available = variants.some(
                (variant) => variant.size === size && variant.stock > 0,
              );

              return (
                <button
                  key={size}
                  type="button"
                  data-testid={`variant-size-${size}`}
                  disabled={!available}
                  onClick={() =>
                    onChange(
                      variants.find(
                        (variant) =>
                          variant.size === size && variant.stock > 0,
                      ),
                    )
                  }
                  className={`min-h-10 min-w-12 rounded-md border px-3 text-sm transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 ${
                    active
                      ? 'border-gold bg-gold-soft/50 text-ink'
                      : 'border-border bg-surface text-ink-2 hover:border-gold hover:text-ink'
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      {colors.length ? (
        <fieldset>
          <legend className="mb-2 text-[11px] font-semibold uppercase tracking-wider2 text-ink-2">
            Colour
          </legend>

          <div className="flex flex-wrap gap-2">
            {colors.map((color) => {
              const active = selected?.color === color;
              const available = variants.some(
                (variant) => variant.color === color && variant.stock > 0,
              );

              return (
                <button
                  key={color}
                  type="button"
                  data-testid={`variant-color-${color}`}
                  disabled={!available}
                  onClick={() =>
                    onChange(
                      variants.find(
                        (variant) =>
                          variant.color === color && variant.stock > 0,
                      ),
                    )
                  }
                  className={`min-h-10 rounded-md border px-3 text-sm transition-[background-color,border-color,color,transform] duration-200 hover:-translate-y-0.5 ${
                    active
                      ? 'border-gold bg-gold-soft/50 text-ink'
                      : 'border-border bg-surface text-ink-2 hover:border-gold hover:text-ink'
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  {color}
                </button>
              );
            })}
          </div>
        </fieldset>
      ) : null}

      <p
        data-testid="variant-stock-message"
        className="text-[11px] text-ink-2"
      >
        {selected
          ? selected.stock > 0
            ? `${selected.stock} available`
            : 'Out of stock'
          : 'Choose an option to see availability'}
      </p>
    </div>
  );
}