'use client';

import { useMemo, useState } from 'react';
import { ChevronRight, X } from 'lucide-react';
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

interface Props {
  categories: Category[];
  activeCategorySlug?: string;
  filters: ShopFilters;
  facets: { colors: string[]; sizes: string[]; priceMin: number; priceMax: number };
  onChange: (next: Partial<ShopFilters>) => void;
  onReset: () => void;
  className?: string;
  /** editorial vertical panel (mobile drawer / desktop expanded) */
  variant?: 'panel' | 'inline';
}

const swatches: Record<string, string> = {
  Ivory: '#f2efe6', Charcoal: '#36383d', Indigo: '#2a3b8f', Saffron: '#e89b2d',
  Crimson: '#a11b2c', Sky: '#8ec1e5', Emerald: '#1f6b4e', Burgundy: '#6e1a2b',
  Pearl: '#efe9e0', Cocoa: '#5b3a29', Sand: '#d8c5a4', Sage: '#a3b49c',
  Natural: '#e7dcc7', Earth: '#7a5a3a', Rose: '#c77a7a', Mustard: '#c99a2a',
  Terracotta: '#a8583b', Olive: '#5c614a', Ochre: '#c28b46', Taupe: '#8c8275',
};

function treeOf(categories: Category[]) {
  const map = new Map<number, Category & { children: Category[] }>();
  categories.forEach((c) => map.set(c.id, { ...c, children: [] }));
  const roots: (Category & { children: Category[] })[] = [];
  map.forEach((node) =>
    node.parentId && map.has(node.parentId)
      ? map.get(node.parentId)!.children.push(node)
      : roots.push(node),
  );
  return roots.sort((a, b) => a.sortOrder - b.sortOrder);
}

function has(node: Category & { children?: Category[] }, slug: string): boolean {
  return node.slug === slug || (node.children ?? []).some((child) => has(child, slug));
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
  const children = node.children ?? [];
  const [open, setOpen] = useState(
    depth === 0 || Boolean(activeSlug && has(node, activeSlug)),
  );
  const active = activeSlug === node.slug;
  return (
    <li>
      <div className="flex items-center">
        {children.length ? (
          <button
            type="button"
            aria-expanded={open}
            aria-label={open ? `Collapse ${node.name}` : `Expand ${node.name}`}
            onClick={() => setOpen((value) => !value)}
            className="mr-2 inline-flex size-5 items-center justify-center text-ink-3 hover:text-ink"
          >
            <ChevronRight
              className={cn(
                'size-3.5 transition-transform duration-200',
                open && 'rotate-90',
              )}
            />
          </button>
        ) : (
          <span className="mr-2 size-5" />
        )}
        <button
          type="button"
          data-testid={`filter-category-${node.slug}`}
          onClick={() => onSelect(node.slug)}
          className={cn(
            'flex-1 py-1.5 text-left font-sans transition-colors hover:text-terracotta',
            depth === 0
              ? 'text-[13px] uppercase tracking-[0.14em] text-ink'
              : 'text-sm text-ink-2',
            active && 'text-terracotta',
          )}
        >
          {node.name}
        </button>
      </div>
      {children.length && open ? (
        <ul className="ml-3 border-l border-border/70 pl-3">
          {children.map((child) => (
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

/**
 * Editorial filter panel — thin dividers, quiet typography, no boxy accordions.
 * All filter groups are always visible inside the drawer / expanded panel;
 * the horizontal filter bar (ShopBrowser) handles collapsing on desktop.
 */
export default function FilterSidebar({
  categories,
  activeCategorySlug,
  filters,
  facets,
  onChange,
  onReset,
  className,
}: Props) {
  const tree = useMemo(() => treeOf(categories), [categories]);
  const lo = facets.priceMin || 0;
  const hi = facets.priceMax || 0;
  const min = typeof filters.minPrice === 'number' ? filters.minPrice : lo;
  const max = typeof filters.maxPrice === 'number' ? filters.maxPrice : hi;

  const activeCount = [
    filters.category && !activeCategorySlug,
    typeof filters.minPrice === 'number',
    typeof filters.maxPrice === 'number',
    filters.color,
    filters.size,
    filters.inStock,
    filters.flag,
  ].filter(Boolean).length;

  return (
    <aside
      data-testid="filter-drawer-container"
      className={cn('text-sm text-ink', className)}
    >
      <div className="flex items-baseline justify-between border-b border-border pb-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-3">
            Refine
          </p>
          <h2 className="mt-2 font-serif text-3xl leading-none text-ink">
            Filter &amp; Curate
          </h2>
        </div>
        <button
          type="button"
          data-testid="filter-reset"
          onClick={onReset}
          disabled={!activeCount}
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2 transition-colors hover:text-terracotta disabled:opacity-30"
        >
          <X size={12} />
          Clear{activeCount ? ` (${activeCount})` : ''}
        </button>
      </div>

      <div className="divide-y divide-border">
        {tree.length ? (
          <section className="py-7">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-3">
              Category
            </p>
            <ul className="space-y-0.5">
              {tree.map((node) => (
                <CategoryNode
                  key={node.id}
                  node={node}
                  activeSlug={activeCategorySlug ?? filters.category}
                  onSelect={(slug) => onChange({ category: slug })}
                />
              ))}
            </ul>
          </section>
        ) : null}

        <section className="py-7">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-3">
            Price range
          </p>
          <div className="grid grid-cols-2 gap-6">
            <label className="grid gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-2">
                From
              </span>
              <input
                type="number"
                data-testid="filter-price-min-input"
                value={min}
                min={lo}
                max={hi}
                onChange={(e) => onChange({ minPrice: Number(e.target.value) })}
                className="h-9 border-b border-border bg-transparent text-sm text-ink outline-none focus:border-terracotta"
              />
            </label>
            <label className="grid gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-2">
                To
              </span>
              <input
                type="number"
                data-testid="filter-price-max-input"
                value={max}
                min={lo}
                max={hi}
                onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
                className="h-9 border-b border-border bg-transparent text-sm text-ink outline-none focus:border-terracotta"
              />
            </label>
          </div>
          <div className="mt-6 space-y-3">
            <input
              type="range"
              data-testid="filter-price-min"
              min={lo}
              max={hi}
              step={Math.max(50, Math.round((hi - lo) / 200))}
              value={min}
              onChange={(e) => onChange({ minPrice: Math.min(Number(e.target.value), max) })}
              className="h-1 w-full accent-[var(--terracotta)]"
              aria-label="Minimum price"
            />
            <input
              type="range"
              data-testid="filter-price-max"
              min={lo}
              max={hi}
              step={Math.max(50, Math.round((hi - lo) / 200))}
              value={max}
              onChange={(e) => onChange({ maxPrice: Math.max(Number(e.target.value), min) })}
              className="h-1 w-full accent-[var(--terracotta)]"
              aria-label="Maximum price"
            />
            <div className="flex justify-between font-mono text-[10px] tracking-[0.14em] text-ink-2">
              <span data-testid="price-min-label">₹{min.toLocaleString('en-IN')}</span>
              <span data-testid="price-max-label">₹{max.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </section>

        {facets.colors.length ? (
          <section className="py-7">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-3">
              Colour
              {filters.color ? (
                <span className="ml-2 text-terracotta">· {filters.color}</span>
              ) : null}
            </p>
            <div className="flex flex-wrap gap-3">
              {facets.colors.map((color) => {
                const active = filters.color === color;
                const value = swatches[color] ?? '#d6c5ad';
                return (
                  <button
                    key={color}
                    type="button"
                    data-testid={`filter-color-${color.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-label={color}
                    aria-pressed={active}
                    onClick={() => onChange({ color: active ? undefined : color })}
                    className={cn(
                      'group relative flex size-9 items-center justify-center rounded-full border transition-all',
                      active
                        ? 'border-terracotta ring-1 ring-terracotta ring-offset-2 ring-offset-bg'
                        : 'border-border hover:border-terracotta',
                    )}
                  >
                    <span
                      aria-hidden
                      className="size-6 rounded-full border border-ink/10"
                      style={{ background: value }}
                    />
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        {facets.sizes.length ? (
          <section className="py-7">
            <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-3">
              Size
              {filters.size ? (
                <span className="ml-2 text-terracotta">· {filters.size}</span>
              ) : null}
            </p>
            <div className="flex flex-wrap gap-x-5 gap-y-3">
              {facets.sizes.map((size) => {
                const active = filters.size === size;
                return (
                  <button
                    key={size}
                    type="button"
                    data-testid={`filter-size-${size.toLowerCase().replace(/\s+/g, '-')}`}
                    aria-pressed={active}
                    onClick={() => onChange({ size: active ? undefined : size })}
                    className={cn(
                      'border-b pb-1 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors',
                      active
                        ? 'border-terracotta text-terracotta'
                        : 'border-transparent text-ink-2 hover:border-border hover:text-ink',
                    )}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </section>
        ) : null}

        <section className="py-7">
          <p className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-ink-3">
            Availability
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-3">
            <FilterChip
              label="In stock only"
              testid="filter-in-stock"
              active={!!filters.inStock}
              onToggle={() => onChange({ inStock: !filters.inStock || undefined })}
            />
            <FilterChip
              label="New arrivals"
              testid="filter-flag-new"
              active={filters.flag === 'new_arrival'}
              onToggle={() =>
                onChange({
                  flag: filters.flag === 'new_arrival' ? undefined : 'new_arrival',
                })
              }
            />
            <FilterChip
              label="Best sellers"
              testid="filter-flag-best"
              active={filters.flag === 'best_seller'}
              onToggle={() =>
                onChange({
                  flag: filters.flag === 'best_seller' ? undefined : 'best_seller',
                })
              }
            />
            <FilterChip
              label="Featured"
              testid="filter-flag-featured"
              active={filters.flag === 'featured'}
              onToggle={() =>
                onChange({ flag: filters.flag === 'featured' ? undefined : 'featured' })
              }
            />
          </div>
        </section>
      </div>
    </aside>
  );
}

function FilterChip({
  label,
  testid,
  active,
  onToggle,
}: {
  label: string;
  testid: string;
  active: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      type="button"
      data-testid={testid}
      aria-pressed={active}
      onClick={onToggle}
      className={cn(
        'rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-all',
        active
          ? 'border-ink bg-ink text-bg'
          : 'border-border text-ink-2 hover:border-ink hover:text-ink',
      )}
    >
      {label}
    </button>
  );
}
