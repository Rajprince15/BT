'use client';

import { useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import type { Category } from '@/types/Category';
import type { ProductFlag } from '@/services/product.service';

export interface ShopFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  inStock?: boolean;
  flag?: ProductFlag;
}

interface FilterSidebarProps {
  categories: Category[];
  activeCategorySlug?: string;
  filters: ShopFilters;
  facets: { colors: string[]; sizes: string[]; priceMin: number; priceMax: number };
  onChange: (next: Partial<ShopFilters>) => void;
  onReset: () => void;
  className?: string;
  /** Compact mode for the mobile drawer. */
  compact?: boolean;
}

const COLOR_SWATCH: Record<string, string> = {
  Ivory: '#F2EFE6',
  Charcoal: '#36383D',
  Indigo: '#2A3B8F',
  Saffron: '#E89B2D',
  Crimson: '#A11B2C',
  Sky: '#8EC1E5',
  Emerald: '#1F6B4E',
  Burgundy: '#6E1A2B',
  Maroon: '#7A1F2A',
  Pearl: '#EFE9E0',
  Cocoa: '#5B3A29',
  Sand: '#D8C5A4',
  Sage: '#A3B49C',
  Magenta: '#A6266F',
  Mustard: '#C99A2A',
  Natural: '#E7DCC7',
  Earth: '#7A5A3A',
  Rose: '#C77A7A',
  Multicolour: 'conic-gradient(from 0deg, #A11B2C, #E89B2D, #1F6B4E, #2A3B8F, #A11B2C)',
  Mixed: 'linear-gradient(135deg,#2A3B8F,#A11B2C)',
  'Crimson-Gold': 'linear-gradient(135deg,#A11B2C,#C8A24B)',
  'Ivory-Gold': 'linear-gradient(135deg,#F2EFE6,#C8A24B)',
  Ochre: '#B47A1C',
  Festive: 'linear-gradient(135deg,#A11B2C,#C8A24B)',
  Ruby: '#9B1B30',
  Gold: '#C8A24B',
};

function buildTree(categories: Category[]): Category[] {
  const map = new Map<number, Category & { children: Category[] }>();
  categories.forEach((c) => map.set(c.id, { ...c, children: [] }));
  const roots: (Category & { children: Category[] })[] = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) {
      map.get(node.parentId)!.children.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots.sort((a, b) => a.sortOrder - b.sortOrder);
}

function CategoryNode({
  node,
  activeSlug,
  onSelect,
  depth = 0,
}: {
  node: Category & { children?: Category[] };
  activeSlug?: string;
  onSelect: (slug: string) => void;
  depth?: number;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const [open, setOpen] = useState(
    depth === 0 ||
      (activeSlug ? containsSlug(node, activeSlug) : false),
  );
  const isActive = activeSlug === node.slug;

  return (
    <li>
      <div className="flex items-center justify-between">
        <button
          type="button"
          data-testid={`filter-category-${node.slug}`}
          onClick={() => onSelect(node.slug)}
          className={cn(
            'flex-1 truncate text-left text-sm transition-colors hover:text-gold',
            depth === 0 ? 'font-semibold uppercase tracking-wider2 text-[11px] text-ink' : 'text-ink-2',
            isActive && 'text-gold',
          )}
        >
          {node.name}
        </button>
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? `Collapse ${node.name}` : `Expand ${node.name}`}
            onClick={() => setOpen((v) => !v)}
            className="ml-1 inline-flex size-6 items-center justify-center rounded-full text-ink-2 transition-colors hover:bg-surface-2"
          >
            <ChevronDown
              className={cn('size-3.5 transition-transform duration-200', open && 'rotate-180')}
            />
          </button>
        ) : null}
      </div>
      {hasChildren && open ? (
        <ul className={cn('mt-1.5 space-y-1.5', depth === 0 ? 'pl-2' : 'pl-3')}>
          {node.children!.map((child) => (
            <CategoryNode
              key={child.id}
              node={child}
              activeSlug={activeSlug}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

function containsSlug(node: Category & { children?: Category[] }, slug: string): boolean {
  if (node.slug === slug) return true;
  return (node.children ?? []).some((c) => containsSlug(c, slug));
}

export default function FilterSidebar({
  categories,
  activeCategorySlug,
  filters,
  facets,
  onChange,
  onReset,
  className,
  compact = false,
}: FilterSidebarProps) {
  const tree = useMemo(() => buildTree(categories), [categories]);

  const lo = facets.priceMin || 0;
  const hi = facets.priceMax || 0;
  const min = typeof filters.minPrice === 'number' ? filters.minPrice : lo;
  const max = typeof filters.maxPrice === 'number' ? filters.maxPrice : hi;

  return (
    <aside
      data-testid="filter-sidebar"
      className={cn(
        'flex flex-col gap-2 text-sm',
        compact ? 'h-full' : 'rounded-lg border border-border bg-surface/60 p-5',
        className,
      )}
    >
      <div className="flex items-center justify-between pb-2">
        <h2 className="font-serif text-xl text-ink">Refine</h2>
        <button
          type="button"
          data-testid="filter-reset"
          onClick={onReset}
          className="text-[11px] font-semibold uppercase tracking-wider2 text-gold transition-colors hover:text-gold-2"
        >
          Reset
        </button>
      </div>

      <Accordion type="multiple" defaultValue={['category', 'price', 'color', 'size', 'avail']} className="w-full">
        {/* Category tree */}
        <AccordionItem value="category" className="border-border">
          <AccordionTrigger className="text-[12px] font-semibold uppercase tracking-wider2 text-ink">
            Category
          </AccordionTrigger>
          <AccordionContent>
            <ul className="space-y-1.5">
              {tree.map((root) => (
                <CategoryNode
                  key={root.id}
                  node={root}
                  activeSlug={activeCategorySlug ?? filters.category}
                  onSelect={(slug) => onChange({ category: slug })}
                />
              ))}
            </ul>
          </AccordionContent>
        </AccordionItem>

        {/* Price */}
        <AccordionItem value="price" className="border-border">
          <AccordionTrigger className="text-[12px] font-semibold uppercase tracking-wider2 text-ink">
            Price
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between text-xs text-ink-2">
                <span data-testid="price-min-label">₹{min.toLocaleString('en-IN')}</span>
                <span data-testid="price-max-label">₹{max.toLocaleString('en-IN')}</span>
              </div>
              <div className="space-y-2">
                <input
                  type="range"
                  data-testid="filter-price-min"
                  min={lo}
                  max={hi}
                  step={Math.max(50, Math.round((hi - lo) / 200))}
                  value={min}
                  onChange={(e) =>
                    onChange({ minPrice: Math.min(Number(e.target.value), max) })
                  }
                  className="h-1 w-full accent-[var(--gold)]"
                  aria-label="Minimum price"
                />
                <input
                  type="range"
                  data-testid="filter-price-max"
                  min={lo}
                  max={hi}
                  step={Math.max(50, Math.round((hi - lo) / 200))}
                  value={max}
                  onChange={(e) =>
                    onChange({ maxPrice: Math.max(Number(e.target.value), min) })
                  }
                  className="h-1 w-full accent-[var(--gold)]"
                  aria-label="Maximum price"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  data-testid="filter-price-min-input"
                  value={min}
                  onChange={(e) => onChange({ minPrice: Number(e.target.value) })}
                  className="h-9 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink focus:border-gold focus:outline-none"
                />
                <input
                  type="number"
                  data-testid="filter-price-max-input"
                  value={max}
                  onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
                  className="h-9 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        {facets.colors.length > 0 ? (
          <AccordionItem value="color" className="border-border">
            <AccordionTrigger className="text-[12px] font-semibold uppercase tracking-wider2 text-ink">
              Color
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-1">
                {facets.colors.map((c) => {
                  const swatch = COLOR_SWATCH[c] ?? '#D6CBB4';
                  const active = filters.color === c;
                  const isGradient = swatch.includes('gradient');
                  return (
                    <button
                      key={c}
                      type="button"
                      data-testid={`filter-color-${c.toLowerCase().replace(/s+/g, '-')}`}
                      aria-pressed={active}
                      onClick={() => onChange({ color: active ? undefined : c })}
                      title={c}
                      className={cn(
                        'flex h-9 items-center gap-2 rounded-full border px-3 text-xs transition-all',
                        active
                          ? 'border-gold text-ink shadow-[0_0_0_2px_rgba(200,162,75,0.18)]'
                          : 'border-border text-ink-2 hover:border-gold/60',
                      )}
                    >
                      <span
                        aria-hidden
                        className="size-4 rounded-full border border-border/60"
                        style={isGradient ? { background: swatch } : { backgroundColor: swatch }}
                      />
                      {c}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {/* Size */}
        {facets.sizes.length > 0 ? (
          <AccordionItem value="size" className="border-border">
            <AccordionTrigger className="text-[12px] font-semibold uppercase tracking-wider2 text-ink">
              Size
            </AccordionTrigger>
            <AccordionContent>
              <div className="flex flex-wrap gap-2 pt-1">
                {facets.sizes.map((s) => {
                  const active = filters.size === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      data-testid={`filter-size-${s.toLowerCase().replace(/s+/g, '-')}`}
                      aria-pressed={active}
                      onClick={() => onChange({ size: active ? undefined : s })}
                      className={cn(
                        'inline-flex h-9 min-w-[48px] items-center justify-center rounded-full border px-3 text-xs transition-colors',
                        active
                          ? 'border-gold bg-gold-soft text-ink'
                          : 'border-border text-ink-2 hover:border-gold/60',
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {/* Availability & flags */}
        <AccordionItem value="avail" className="border-border">
          <AccordionTrigger className="text-[12px] font-semibold uppercase tracking-wider2 text-ink">
            Availability
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-3 pt-1">
              <label className="flex items-center justify-between gap-3 text-sm text-ink">
                <span>In stock only</span>
                <Switch
                  data-testid="filter-in-stock"
                  checked={!!filters.inStock}
                  onCheckedChange={(v) => onChange({ inStock: v || undefined })}
                />
              </label>
              <FlagToggle
                label="New Arrivals"
                active={filters.flag === 'new_arrival'}
                onToggle={() =>
                  onChange({ flag: filters.flag === 'new_arrival' ? undefined : 'new_arrival' })
                }
                testid="filter-flag-new"
              />
              <FlagToggle
                label="Best Sellers"
                active={filters.flag === 'best_seller'}
                onToggle={() =>
                  onChange({ flag: filters.flag === 'best_seller' ? undefined : 'best_seller' })
                }
                testid="filter-flag-best"
              />
              <FlagToggle
                label="Featured"
                active={filters.flag === 'featured'}
                onToggle={() =>
                  onChange({ flag: filters.flag === 'featured' ? undefined : 'featured' })
                }
                testid="filter-flag-featured"
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}

function FlagToggle({
  label,
  active,
  onToggle,
  testid,
}: {
  label: string;
  active: boolean;
  onToggle: () => void;
  testid: string;
}) {
  return (
    <label className="flex items-center justify-between gap-3 text-sm text-ink">
      <span>{label}</span>
      <Switch data-testid={testid} checked={active} onCheckedChange={onToggle} />
    </label>
  );
}
