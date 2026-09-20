'use client';
import type { ProductVariant } from '@/types/ProductVariant';
export default function VariantPicker({ variants, selected, onChange }: { variants: ProductVariant[]; selected?: ProductVariant; onChange: (variant?: ProductVariant) => void }) {
  const weights = [...new Set(variants.map((v) => v.weight).filter(Boolean))] as string[];
  const beds = [...new Set(variants.map((v) => v.bedType).filter(Boolean))] as string[];
  if (!variants.length) return null;
  const choose = (weight?: string, bedType?: string) => onChange(variants.find((v) => (!weight || v.weight === weight) && (!bedType || v.bedType === bedType) && v.isActive));
  const buttons = (values: string[], kind: 'weight' | 'bedType') => values.map((value) => { const active = selected?.[kind] === value; const available = variants.some((v) => v[kind] === value && v.isActive); return <button key={value} type="button" disabled={!available} onClick={() => choose(kind === 'weight' ? value : selected?.weight, kind === 'bedType' ? value : selected?.bedType)} className={`min-h-10 rounded-md border px-3 text-sm ${active ? 'border-gold bg-gold-soft/50 text-ink' : 'border-border bg-surface text-ink-2'} disabled:opacity-40`}>{value}</button>; });
  return <div data-testid="product-variant-picker" className="space-y-4 border-y border-border py-4">
    {weights.length ? <fieldset><legend className="mb-2 text-[11px] font-semibold uppercase tracking-wider2 text-ink-2">Weight</legend><div className="flex flex-wrap gap-2">{buttons(weights, 'weight')}</div></fieldset> : null}
    {beds.length ? <fieldset><legend className="mb-2 text-[11px] font-semibold uppercase tracking-wider2 text-ink-2">Bed type</legend><div className="flex flex-wrap gap-2">{buttons(beds, 'bedType')}</div></fieldset> : null}
    <p data-testid="variant-stock-message" className="text-[11px] text-ink-2">{selected?.isActive ? 'Available' : 'Choose an option to see availability'}</p>
  </div>;
}
