'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, ChevronRight, X } from 'lucide-react';
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
  Multicolour:
    'conic-gradient(from 0deg, #A11B2C, #E89B2D, #1F6B4E, #2A3B8F, #A11B2C)',
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

function containsSlug(
  node: Category & { children?: Category[] },
  slug: string,
): boolean {
  if (node.slug === slug) return true;
  return (node.children ?? []).some((c) => containsSlug(c, slug));
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
    depth === 0 || (activeSlug ? containsSlug(node, activeSlug) : false),
  );
  const isActive = activeSlug === node.slug;

  return (
    <li>
      <div className="flex items-center">
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? `Collapse ${node.name}` : `Expand ${node.name}`}
            onClick={() => setOpen((v) => !v)}
            className="mr-1 inline-flex size-5 shrink-0 items-center justify-center rounded text-ink-2 transition-colors hover:text-ink"
          >
            <ChevronRight
              className={cn(
                'size-3.5 transition-transform duration-200',
                open && 'rotate-90',
              )}
            />
          </button>
        ) : (
          <span className="mr-1 inline-block size-5 shrink-0" />
        )}
        <button
          type="button"
          data-testid={`filter-category-${node.slug}`}
          onClick={() => onSelect(node.slug)}
          className={cn(
            'flex-1 truncate rounded px-1.5 py-1 text-left text-sm transition-colors hover:text-gold',
            depth === 0 ? 'font-semibold text-ink' : 'text-ink-2',
            isActive && 'bg-gold-soft text-ink',
          )}
        >
          {node.name}
        </button>
      </div>
      {hasChildren && open ? (
        <ul className="ml-4 mt-0.5 space-y-0.5 border-l border-border pl-2">
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

  // Count active filters for the reset button.
  const activeCount =
    (activeCategorySlug ? 0 : filters.category ? 1 : 0) +
    (typeof filters.minPrice === 'number' ? 1 : 0) +
    (typeof filters.maxPrice === 'number' ? 1 : 0) +
    (filters.color ? 1 : 0) +
    (filters.size ? 1 : 0) +
    (filters.inStock ? 1 : 0) +
    (filters.flag ? 1 : 0);

  return (
    <aside
      data-testid="filter-sidebar"
      className={cn(
        'flex flex-col text-sm',
        compact ? 'h-full' : 'rounded-lg border border-border bg-surface',
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-gold">
            Refine
          </p>
          <h2 className="mt-0.5 font-serif text-lg text-ink">Filters</h2>
        </div>
        <button
          type="button"
          data-testid="filter-reset"
          onClick={onReset}
          disabled={activeCount === 0}
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-wider2 transition-colors',
            activeCount > 0
              ? 'bg-ink text-bg hover:bg-ink/90'
              : 'text-ink-2 opacity-40',
          )}
        >
          <X className="size-3" /> Clear
          {activeCount > 0 ? ` (${activeCount})` : ''}
        </button>
      </div>

      {/* Sections */}
      <Accordion
        type="multiple"
        defaultValue={['category', 'price']}
        className="w-full px-2 pb-2"
      >
        {/* Category tree */}
        {tree.length > 0 ? (
          <AccordionItem value="category" className="border-b border-border">
            <AccordionTrigger className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider2 text-ink hover:no-underline">
              Category
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <ul className="space-y-0.5">
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
        ) : null}

        {/* Price */}
        <AccordionItem value="price" className="border-b border-border">
          <AccordionTrigger className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider2 text-ink hover:no-underline">
            Price range
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-4">
            <div className="grid grid-cols-2 gap-2">
              <label className="grid gap-1">
                <span className="text-[10px] uppercase tracking-wider2 text-ink-2">
                  Min
                </span>
                <input
                  type="number"
                  data-testid="filter-price-min-input"
                  value={min}
                  min={lo}
                  max={hi}
                  onChange={(e) =>
                    onChange({ minPrice: Number(e.target.value) })
                  }
                  className="h-9 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </label>
              <label className="grid gap-1">
                <span className="text-[10px] uppercase tracking-wider2 text-ink-2">
                  Max
                </span>
                <input
                  type="number"
                  data-testid="filter-price-max-input"
                  value={max}
                  min={lo}
                  max={hi}
                  onChange={(e) =>
                    onChange({ maxPrice: Number(e.target.value) })
                  }
                  className="h-9 w-full rounded-md border border-border bg-bg px-2 text-sm text-ink focus:border-gold focus:outline-none"
                />
              </label>
            </div>
            <div className="mt-4 space-y-2">
              <input
                type="range"
                data-testid="filter-price-min"
                min={lo}
                max={hi}
                step={Math.max(50, Math.round((hi - lo) / 200))}
                value={min}
                onChange={(e) =>
                  onChange({
                    minPrice: Math.min(Number(e.target.value), max),
                  })
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
                  onChange({
                    maxPrice: Math.max(Number(e.target.value), min),
                  })
                }
                className="h-1 w-full accent-[var(--gold)]"
                aria-label="Maximum price"
              />
              <div className="flex items-center justify-between text-[11px] text-ink-2">
                <span data-testid="price-min-label">
                  ₹{min.toLocaleString('en-IN')}
                </span>
                <span data-testid="price-max-label">
                  ₹{max.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Color */}
        {facets.colors.length > 0 ? (
          <AccordionItem value="color" className="border-b border-border">
            <AccordionTrigger className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider2 text-ink hover:no-underline">
              Colour
              {filters.color ? (
                <span className="ml-auto mr-2 rounded-full bg-gold-soft px-2 py-0.5 text-[9px] font-semibold text-ink">
                  1
                </span>
              ) : null}
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="grid grid-cols-6 gap-2">
                {facets.colors.map((c) => {
                  const swatch = COLOR_SWATCH[c] ?? '#D6CBB4';
                  const active = filters.color === c;
                  const isGradient = swatch.includes('gradient');
                  return (
                    <button
                      key={c}
                      type="button"
                      data-testid={`filter-color-${c
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                      aria-pressed={active}
                      onClick={() =>
                        onChange({ color: active ? undefined : c })
                      }
                      title={c}
                      className={cn(
                        'group relative flex aspect-square items-center justify-center rounded-full border transition-all',
                        active
                          ? 'border-gold ring-2 ring-gold/40 ring-offset-1 ring-offset-surface'
                          : 'border-border hover:border-gold/60',
                      )}
                    >
                      <span
                        aria-hidden
                        className="size-6 rounded-full border border-border/40"
                        style={
                          isGradient
                            ? { background: swatch }
                            : { backgroundColor: swatch }
                        }
                      />
                    </button>
                  );
                })}
              </div>
              {filters.color ? (
                <p className="mt-3 text-[11px] text-ink-2">
                  Selected:{' '}
                  <span className="font-semibold text-ink">
                    {filters.color}
                  </span>
                </p>
              ) : null}
            </AccordionContent>
          </AccordionItem>
        ) : null}

        {/* Size */}
        {facets.sizes.length > 0 ? (
          <AccordionItem value="size" className="border-b border-border">
            <AccordionTrigger className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider2 text-ink hover:no-underline">
              Size
              {filters.size ? (
                <span className="ml-auto mr-2 rounded-full bg-gold-soft px-2 py-0.5 text-[9px] font-semibold text-ink">
                  1
                </span>
              ) : null}
            </AccordionTrigger>
            <AccordionContent className="px-3 pb-3">
              <div className="flex flex-wrap gap-1.5">
                {facets.sizes.map((s) => {
                  const active = filters.size === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      data-testid={`filter-size-${s
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                      aria-pressed={active}
                      onClick={() =>
                        onChange({ size: active ? undefined : s })
                      }
                      className={cn(
                        'inline-flex h-8 min-w-[44px] items-center justify-center rounded-md border px-2.5 text-[11px] font-medium transition-colors',
                        active
                          ? 'border-ink bg-ink text-bg'
                          : 'border-border text-ink-2 hover:border-ink hover:text-ink',
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
        <AccordionItem value="avail" className="border-b-0">
          <AccordionTrigger className="px-3 py-3 text-[11px] font-semibold uppercase tracking-wider2 text-ink hover:no-underline">
            Availability
          </AccordionTrigger>
          <AccordionContent className="px-3 pb-3">
            <div className="space-y-2.5">
              <label className="flex items-center justify-between gap-3 rounded-md px-1 py-1 text-sm text-ink">
                <span>In stock only</span>
                <Switch
                  data-testid="filter-in-stock"
                  checked={!!filters.inStock}
                  onCheckedChange={(v) =>
                    onChange({ inStock: v || undefined })
                  }
                />
              </label>
              <FlagToggle
                label="New Arrivals"
                active={filters.flag === 'new_arrival'}
                onToggle={() =>
                  onChange({
                    flag:
                      filters.flag === 'new_arrival'
                        ? undefined
                        : 'new_arrival',
                  })
                }
                testid="filter-flag-new"
              />
              <FlagToggle
                label="Best Sellers"
                active={filters.flag === 'best_seller'}
                onToggle={() =>
                  onChange({
                    flag:
                      filters.flag === 'best_seller'
                        ? undefined
                        : 'best_seller',
                  })
                }
                testid="filter-flag-best"
              />
              <FlagToggle
                label="Featured"
                active={filters.flag === 'featured'}
                onToggle={() =>
                  onChange({
                    flag: filters.flag === 'featured' ? undefined : 'featured',
                  })
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
    <label className="flex items-center justify-between gap-3 rounded-md px-1 py-1 text-sm text-ink">
      <span>{label}</span>
      <Switch
        data-testid={testid}
        checked={active}
        onCheckedChange={onToggle}
      />
    </label>
  );
}

// Keep ChevronDown import used elsewhere (in case ui lib expects). Not strictly needed.
export { ChevronDown as _ChevronDown };
