'use client';

import type { ProductVariant } from '@/types/ProductVariant';

export default function VariantPicker({ variants, selected, onChange }: { variants: ProductVariant[]; selected?: ProductVariant; onChange: (variant?: ProductVariant) => void }) {
  const sizes = [...new Set(variants.map((variant) => variant.size).filter(Boolean))] as string[];
  const colors = [...new Set(variants.map((variant) => variant.color).filter(Boolean))] as string[];
  if (!variants.length) return null;
  return (
    <div data-testid="product-variant-picker" className="space-y-5 border-y border-border py-5">
      {sizes.length ? <fieldset><legend className="mb-2 text-xs font-semibold uppercase tracking-wider2 text-ink-2">Size</legend><div className="flex flex-wrap gap-2">{sizes.map((size) => { const active = selected?.size === size; const available = variants.some((v) => v.size === size && v.stock > 0); return <button key={size} type="button" data-testid={`variant-size-${size}`} disabled={!available} onClick={() => onChange(variants.find((v) => v.size === size && v.stock > 0))} className={`min-h-11 min-w-14 rounded border px-4 text-sm ${active ? 'border-gold bg-gold-soft/40 text-ink' : 'border-border bg-surface text-ink-2'} disabled:cursor-not-allowed disabled:opacity-40`}>{size}</button>; })}</div></fieldset> : null}
      {colors.length ? <fieldset><legend className="mb-2 text-xs font-semibold uppercase tracking-wider2 text-ink-2">Colour</legend><div className="flex flex-wrap gap-2">{colors.map((color) => { const active = selected?.color === color; const available = variants.some((v) => v.color === color && v.stock > 0); return <button key={color} type="button" data-testid={`variant-color-${color}`} disabled={!available} onClick={() => onChange(variants.find((v) => v.color === color && v.stock > 0))} className={`min-h-11 rounded border px-4 text-sm ${active ? 'border-gold bg-gold-soft/40 text-ink' : 'border-border bg-surface text-ink-2'} disabled:cursor-not-allowed disabled:opacity-40`}>{color}</button>; })}</div></fieldset> : null}
      <p data-testid="variant-stock-message" className="text-xs text-ink-2">{selected ? (selected.stock > 0 ? `${selected.stock} available` : 'Out of stock') : 'Choose an option to see availability'}</p>
    </div>
  );
}