'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { SlidersHorizontal, X, LayoutGrid, LayoutList } from 'lucide-react';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Breadcrumbs, { type BreadcrumbItem } from '@/components/shop/Breadcrumbs';
import FilterSidebar, { type ShopFilters } from '@/components/shop/FilterSidebar';
import SortDropdown from '@/components/shop/SortDropdown';
import Pagination from '@/components/shop/Pagination';
import ProductGrid from '@/components/shop/ProductGrid';
import { useCategories } from '@/hooks/useCategories';
import { useProductFacets, useProducts } from '@/hooks/useProducts';
import type { ProductFlag, ProductSort } from '@/services/product.service';
import type { Category } from '@/types/Category';
import { cn } from '@/lib/utils';

const SORTS: ProductSort[] = ['new', 'price_asc', 'price_desc', 'best_sellers', 'rating'];
const FLAGS: ProductFlag[] = ['new_arrival', 'best_seller', 'featured'];

export interface ShopBrowserProps {
  title: string;
  eyebrow?: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  lockedCategorySlug?: string;
  lockedQuery?: string;
  lockedFlag?: ProductFlag;
  initialFlag?: ProductFlag;
  disableCategoryTree?: boolean;
  limit?: number;
}

function parseFilters(sp: URLSearchParams): ShopFilters {
  const filters: ShopFilters = {};
  const category = sp.get('category');
  const min = sp.get('minPrice');
  const max = sp.get('maxPrice');
  const color = sp.get('color');
  const size = sp.get('size');
  const flag = sp.get('flag');
  if (category) filters.category = category;
  if (min) filters.minPrice = Number(min);
  if (max) filters.maxPrice = Number(max);
  if (color) filters.color = color;
  if (size) filters.size = size;
  if (flag && FLAGS.includes(flag as ProductFlag)) filters.flag = flag as ProductFlag;
  if (sp.get('inStock') === 'true') filters.inStock = true;
  return filters;
}

function serialize(filters: ShopFilters, sort: ProductSort, page: number, query?: string) {
  const sp = new URLSearchParams();
  if (filters.category) sp.set('category', filters.category);
  if (typeof filters.minPrice === 'number') sp.set('minPrice', String(filters.minPrice));
  if (typeof filters.maxPrice === 'number') sp.set('maxPrice', String(filters.maxPrice));
  if (filters.color) sp.set('color', filters.color);
  if (filters.size) sp.set('size', filters.size);
  if (filters.inStock) sp.set('inStock', 'true');
  if (filters.flag) sp.set('flag', filters.flag);
  if (sort !== 'new') sp.set('sort', sort);
  if (page > 1) sp.set('page', String(page));
  if (query) sp.set('q', query);
  return sp.toString();
}

const EDITORIAL_HERO =
  'https://images.unsplash.com/photo-1638741280080-02e3f4267020?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjBob21lJTIwdGV4dGlsZXMlMjBpbnRlcmlvciUyMGRyYXBlcnklMjBzb2ZhJTIwdGhyb3clMjBjdXNoaW9uc3xlbnwwfHx8fDE3ODc5MTQyODB8MA&ixlib=rb-4.1.0&q=85';

/**
 * ShopBrowser — Editorial catalogue redesign.
 *
 * Composition:
 *   1. Breadcrumb + collection eyebrow
 *   2. Editorial hero (large display title beside a lifestyle image)
 *   3. Sticky horizontal filter bar with expandable panel drawer
 *   4. Asymmetric editorial product rhythm
 *   5. Featured textile spread inserted between grid cycles
 *   6. Pagination
 */
export default function ShopBrowser({
  title,
  eyebrow,
  description,
  breadcrumbs,
  lockedCategorySlug,
  lockedQuery,
  lockedFlag,
  initialFlag,
  disableCategoryTree,
  limit = 12,
}: ShopBrowserProps) {
  const router = useRouter();
  const sp = useSearchParams();

  const [filters, setFilters] = useState<ShopFilters>(() =>
    parseFilters(sp as unknown as URLSearchParams),
  );
  const [sort, setSort] = useState<ProductSort>(() => {
    const value = sp.get('sort');
    return value && SORTS.includes(value as ProductSort) ? (value as ProductSort) : 'new';
  });
  const [page, setPage] = useState(Math.max(1, Number(sp.get('page') ?? 1)));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [layout, setLayout] = useState<'editorial' | 'compact'>('editorial');

  useEffect(() => {
    if (initialFlag && !filters.flag)
      setFilters((current) => ({ ...current, flag: initialFlag }));
  }, [initialFlag, filters.flag]);

  const effectiveCategory = lockedCategorySlug ?? filters.category;
  const effectiveFlag = lockedFlag ?? filters.flag;

  const params = useMemo(
    () => ({
      category: effectiveCategory,
      q: lockedQuery,
      minPrice: filters.minPrice,
      maxPrice: filters.maxPrice,
      color: filters.color,
      size: filters.size,
      inStock: filters.inStock,
      flag: effectiveFlag,
      sort,
      page,
      limit,
    }),
    [
      effectiveCategory,
      lockedQuery,
      filters.minPrice,
      filters.maxPrice,
      filters.color,
      filters.size,
      filters.inStock,
      effectiveFlag,
      sort,
      page,
      limit,
    ],
  );

  const { data, isLoading, isError, refetch, isFetching } = useProducts(params);
  const facetsParams = useMemo(
    () => ({ category: effectiveCategory, q: lockedQuery, flag: lockedFlag }),
    [effectiveCategory, lockedQuery, lockedFlag],
  );
  const { data: facets } = useProductFacets(facetsParams);
  const { data: categories = [] as Category[] } = useCategories();
  const safeFacets = {
    colors: facets?.colors ?? [],
    sizes: facets?.sizes ?? [],
    priceMin: facets?.priceMin ?? 0,
    priceMax: facets?.priceMax ?? 0,
  };

  const sync = useCallback(
    (next: ShopFilters, nextSort: ProductSort, nextPage: number) => {
      const query = serialize(next, nextSort, nextPage, sp.get('q') ?? undefined);
      const path = window.location.pathname;
      router.replace(query ? `${path}?${query}` : path, { scroll: false });
    },
    [router, sp],
  );
  useEffect(() => {
    sync(filters, sort, page);
  }, [filters, sort, page, sync]);
  useEffect(() => {
    setPage(1);
  }, [
    filters.category,
    filters.minPrice,
    filters.maxPrice,
    filters.color,
    filters.size,
    filters.inStock,
    filters.flag,
    sort,
  ]);

  const changeFilters = useCallback(
    (next: Partial<ShopFilters>) =>
      setFilters((current) => ({ ...current, ...next })),
    [],
  );
  const reset = useCallback(() => {
    setFilters({});
    setSort('new');
    setPage(1);
  }, []);

  const items = data?.items ?? [];
  const total = data?.meta.total ?? 0;
  const totalPages = data?.meta.totalPages ?? 1;

  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; clear: () => void }[] = [];
    if (filters.category && !lockedCategorySlug) {
      const category = categories.find((item) => item.slug === filters.category);
      chips.push({
        key: 'category',
        label: category?.name ?? filters.category,
        clear: () => changeFilters({ category: undefined }),
      });
    }
    if (filters.color)
      chips.push({
        key: 'color',
        label: filters.color,
        clear: () => changeFilters({ color: undefined }),
      });
    if (filters.size)
      chips.push({
        key: 'size',
        label: `Size ${filters.size}`,
        clear: () => changeFilters({ size: undefined }),
      });
    if (filters.flag && !lockedFlag)
      chips.push({
        key: 'flag',
        label:
          filters.flag === 'new_arrival'
            ? 'Newly Loomed'
            : filters.flag === 'best_seller'
              ? 'House Bestseller'
              : 'Featured',
        clear: () => changeFilters({ flag: undefined }),
      });
    if (filters.inStock)
      chips.push({
        key: 'stock',
        label: 'In stock',
        clear: () => changeFilters({ inStock: undefined }),
      });
    if (typeof filters.minPrice === 'number' || typeof filters.maxPrice === 'number')
      chips.push({
        key: 'price',
        label: `₹${(filters.minPrice ?? 0).toLocaleString('en-IN')} – ₹${(filters.maxPrice ?? safeFacets.priceMax).toLocaleString('en-IN')}`,
        clear: () => changeFilters({ minPrice: undefined, maxPrice: undefined }),
      });
    return chips;
  }, [
    filters,
    categories,
    lockedCategorySlug,
    lockedFlag,
    safeFacets.priceMax,
    changeFilters,
  ]);

  const filterPanel = (
    <FilterSidebar
      categories={disableCategoryTree ? [] : categories}
      activeCategorySlug={lockedCategorySlug ?? filters.category}
      filters={filters}
      facets={safeFacets}
      onChange={changeFilters}
      onReset={reset}
    />
  );

  const totalIssue = String(50 + (title.length % 30)).padStart(2, '0'); // stable, cosmetic

  return (
    <div data-testid="shop-browser" className="bg-bg text-ink">
      {/* --- Editorial Hero Spread ------------------------------------------ */}
      <section
        data-testid="catalogue-hero"
        className="paper-grain relative border-b border-border bg-bg"
      >
        <div className="mx-auto max-w-[1560px] px-5 pt-8 sm:px-10 lg:px-16 lg:pt-12">
          <Breadcrumbs items={breadcrumbs} />
        </div>

        <div className="mx-auto grid max-w-[1560px] gap-10 px-5 pb-14 pt-10 sm:px-10 md:grid-cols-12 md:gap-12 md:pb-20 md:pt-14 lg:gap-16 lg:px-16 lg:pt-16">
          <div className="md:col-span-7 lg:col-span-6">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-terracotta">
                Collection {totalIssue}
              </span>
              <span aria-hidden className="h-px flex-1 max-w-32 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-3">
                {eyebrow ?? 'The Catalogue'}
              </span>
            </div>

            <h1
              data-testid="shop-page-title"
              className="mt-8 font-serif font-normal leading-[0.98] tracking-[-0.03em] text-ink"
              style={{ fontSize: 'clamp(2.75rem, 6.2vw, 5.5rem)' }}
            >
              {title}
            </h1>

            {description ? (
              <p className="mt-8 max-w-xl text-[15px] leading-[1.7] text-ink-2">
                {description}
              </p>
            ) : (
              <p className="mt-8 max-w-xl text-[15px] leading-[1.7] text-ink-2">
                A curated edit of textiles woven in Panipat — pieces chosen for the
                hand-feel, weight and finish they bring to considered spaces.
              </p>
            )}

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3">
              <span data-testid="catalogue-piece-count">
                {total ? `${total.toLocaleString('en-IN')} Pieces` : 'Curating…'}
              </span>
              <span aria-hidden>·</span>
              <span>Panipat Handloom</span>
              <span aria-hidden>·</span>
              <span>Made to Order · MOQ from 300</span>
            </div>
          </div>

          <div className="relative md:col-span-5 lg:col-span-6">
            <div className="relative aspect-[4/5] w-full overflow-hidden bg-surface-2 md:aspect-[3/4] lg:aspect-[4/5]">
              <Image
                src={EDITORIAL_HERO}
                alt="Textile lookbook editorial"
                fill
                priority
                sizes="(min-width: 1024px) 45vw, (min-width: 768px) 40vw, 90vw"
                className="object-cover"
              />
              <div className="absolute inset-x-6 bottom-6 flex items-end justify-between text-bg">
                <p className="max-w-[70%] font-serif text-lg italic leading-snug drop-shadow-md">
                  “Cloth is the quietest architecture of a room.”
                </p>
                <span className="font-mono text-[9px] uppercase tracking-[0.28em] text-bg/85">
                  Plate&nbsp;· I
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Sticky Editorial Filter Bar ------------------------------------ */}
      <div
        data-testid="filter-bar-wrapper"
        className="sticky top-[76px] z-30 border-b border-border bg-bg/85 backdrop-blur-md lg:top-[92px]"
      >
        <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-16">
          <div className="flex flex-wrap items-center justify-between gap-y-3 py-4 lg:py-5">
            {/* Desktop horizontal filter triggers */}
            <div className="hidden items-center gap-6 lg:flex">
              <button
                type="button"
                data-testid="filter-trigger-button"
                onClick={() => setPanelOpen((v) => !v)}
                aria-expanded={panelOpen}
                className={cn(
                  'group inline-flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors',
                  panelOpen ? 'text-terracotta' : 'text-ink hover:text-terracotta',
                )}
              >
                <SlidersHorizontal size={14} strokeWidth={1.5} />
                Filter &amp; Refine
                {activeChips.length ? (
                  <span className="inline-flex size-5 items-center justify-center rounded-full bg-terracotta text-[9px] text-bg">
                    {activeChips.length}
                  </span>
                ) : null}
              </button>

              <span aria-hidden className="h-4 w-px bg-border" />

              <nav className="flex items-center gap-6" aria-label="Filter categories">
                {['Category', 'Colour', 'Size', 'Availability'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    data-testid={`filter-pill-${label.toLowerCase()}`}
                    onClick={() => setPanelOpen(true)}
                    className="font-mono text-[10px] uppercase tracking-[0.22em] text-ink-2 transition-colors hover:text-ink"
                  >
                    {label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Mobile: single trigger opens sheet */}
            <div className="flex items-center gap-4 lg:hidden">
              <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    data-testid="filter-drawer-trigger"
                    className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-ink"
                  >
                    <SlidersHorizontal size={14} strokeWidth={1.5} />
                    Filter &amp; Refine
                    {activeChips.length ? (
                      <span className="inline-flex size-5 items-center justify-center rounded-full bg-terracotta text-[9px] text-bg">
                        {activeChips.length}
                      </span>
                    ) : null}
                  </button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="flex w-full max-w-md flex-col gap-0 bg-bg p-6 text-ink sm:p-8"
                >
                  <div className="flex-1 overflow-y-auto">{filterPanel}</div>
                  <div className="mt-6 flex gap-3 border-t border-border pt-5">
                    <button
                      type="button"
                      data-testid="filter-drawer-reset"
                      onClick={reset}
                      className="flex-1 border border-border py-3 font-mono text-[10px] uppercase tracking-[0.22em] hover:border-ink"
                    >
                      Reset
                    </button>
                    <button
                      type="button"
                      data-testid="filter-drawer-apply"
                      onClick={() => setDrawerOpen(false)}
                      className="flex-[2] bg-ink py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-bg hover:bg-terracotta"
                    >
                      Show {total} pieces
                    </button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="ml-auto flex items-center gap-4 lg:gap-6">
              <div className="hidden items-center gap-1 border border-border/70 p-0.5 md:flex">
                <button
                  type="button"
                  data-testid="layout-toggle-editorial"
                  onClick={() => setLayout('editorial')}
                  aria-pressed={layout === 'editorial'}
                  aria-label="Editorial layout"
                  className={cn(
                    'inline-flex size-8 items-center justify-center transition-colors',
                    layout === 'editorial' ? 'bg-ink text-bg' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  <LayoutList size={13} strokeWidth={1.5} />
                </button>
                <button
                  type="button"
                  data-testid="layout-toggle-compact"
                  onClick={() => setLayout('compact')}
                  aria-pressed={layout === 'compact'}
                  aria-label="Compact grid"
                  className={cn(
                    'inline-flex size-8 items-center justify-center transition-colors',
                    layout === 'compact' ? 'bg-ink text-bg' : 'text-ink-2 hover:text-ink',
                  )}
                >
                  <LayoutGrid size={13} strokeWidth={1.5} />
                </button>
              </div>
              <SortDropdown value={sort} onChange={setSort} />
            </div>
          </div>

          {/* Active chip strip */}
          {activeChips.length ? (
            <div
              data-testid="active-filter-chips"
              className="filter-reveal flex flex-wrap gap-x-3 gap-y-2 border-t border-border/70 py-3"
            >
              {activeChips.map((chip) => (
                <button
                  key={chip.key}
                  type="button"
                  onClick={chip.clear}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-2 transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  {chip.label}
                  <X size={11} />
                </button>
              ))}
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center gap-1 pl-2 font-mono text-[10px] uppercase tracking-[0.22em] text-terracotta hover:text-ink"
              >
                Clear all
              </button>
            </div>
          ) : null}

          {/* Desktop expandable filter panel */}
          {panelOpen ? (
            <div
              data-testid="filter-panel-expanded"
              className="filter-reveal hidden border-t border-border py-8 lg:block"
            >
              <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
                {filterPanel}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={reset}
                  className="border border-border px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-ink hover:border-ink"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setPanelOpen(false)}
                  className="bg-ink px-5 py-2.5 font-mono text-[10px] uppercase tracking-[0.22em] text-bg hover:bg-terracotta"
                >
                  Apply · {total} pieces
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      {/* --- Editorial Product Rhythm --------------------------------------- */}
      <section className="mx-auto max-w-[1560px] px-5 py-16 sm:px-10 sm:py-20 lg:px-16 lg:py-28">
        <div className="mb-10 flex items-center justify-between border-b border-border pb-5">
          <p
            data-testid="results-count"
            className={cn(
              'font-mono text-[10px] uppercase tracking-[0.24em] text-ink-2',
              isFetching && 'opacity-50',
            )}
          >
            {isLoading
              ? 'Curating the lookbook…'
              : total === 0
                ? 'No pieces'
                : `Plate ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} · of ${total}`}
          </p>
          <p className="hidden font-mono text-[10px] uppercase tracking-[0.24em] text-ink-3 md:block">
            {layout === 'editorial' ? 'Editorial Spread' : 'Compact Grid'}
          </p>
        </div>

        <ProductGrid
          items={items}
          loading={isLoading}
          layout={layout}
          skeletonCount={limit}
          emptyTitle={
            isError
              ? 'We couldn’t load these pieces'
              : lockedQuery
                ? `No matches for "${lockedQuery}"`
                : 'No pieces match your filters'
          }
          emptyDescription={
            isError
              ? 'Please retry — your atelier feed will reappear shortly.'
              : 'Try widening the price range or removing a colour / size to see more.'
          }
          emptyAction={
            isError
              ? { label: 'Retry', onClick: () => refetch() }
              : activeChips.length
                ? { label: 'Clear filters', onClick: reset }
                : undefined
          }
        />

        {/* Editorial featured band — visible once results loaded */}
        {items.length > 4 ? (
          <div
            data-testid="catalogue-featured-band"
            className="paper-grain my-24 border-y border-border bg-surface/60 px-6 py-16 sm:px-10 md:my-32 md:py-24"
          >
            <div className="grid gap-10 md:grid-cols-12 md:items-center md:gap-14">
              <div className="md:col-span-5">
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-terracotta">
                  Featured Textile · N° 02
                </span>
                <h3
                  className="mt-6 font-serif leading-[1.02] tracking-[-0.02em] text-ink"
                  style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}
                >
                  Woven for the quiet hours of a room.
                </h3>
                <p className="mt-5 max-w-md text-[15px] leading-[1.75] text-ink-2">
                  A closer look at the yarns, dyes and finishes that carry each piece
                  from the loom to your interior.
                </p>
              </div>
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-2 md:col-span-7">
                <Image
                  src="https://images.unsplash.com/photo-1601000785676-f9b0ade234d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjdXJ0YWluJTIwZHJhcGVyeSUyMGxpbmVuJTIwdmVsdmV0JTIwYmVpZ2UlMjB3aW5kb3clMjBuYXR1cmFsJTIwbGlnaHR8ZW58MHx8fHwxNzg3OTE0MjkwfDA&ixlib=rb-4.1.0&q=85"
                  alt="Editorial featured textile"
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        ) : null}

        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </section>
    </div>
  );
}
