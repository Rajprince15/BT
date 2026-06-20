'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SlidersHorizontal, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import Container from '@/components/common/Container';
import Breadcrumbs, { type BreadcrumbItem } from '@/components/shop/Breadcrumbs';
import FilterSidebar, { type ShopFilters } from '@/components/shop/FilterSidebar';
import SortDropdown from '@/components/shop/SortDropdown';
import Pagination from '@/components/shop/Pagination';
import ProductGrid from '@/components/shop/ProductGrid';
import { useCategories } from '@/hooks/useCategories';
import { useProductFacets, useProducts } from '@/hooks/useProducts';
import type { ProductFlag, ProductSort } from '@/services/product.service';
import { cn } from '@/lib/utils';

const SORTS: ProductSort[] = ['new', 'price_asc', 'price_desc', 'best_sellers', 'rating'];
const FLAGS: ProductFlag[] = ['new_arrival', 'best_seller', 'featured'];

interface ShopBrowserProps {
  /** Page title shown above the grid. */
  title: string;
  /** Optional subtitle/eyebrow. */
  eyebrow?: string;
  description?: string;
  breadcrumbs: BreadcrumbItem[];
  /** Force-locked category (from /shop/[slug] route). User filters cannot override. */
  lockedCategorySlug?: string;
  /** Force-locked search query (from /search route). */
  lockedQuery?: string;
  /** Force-locked flag (e.g. collections page = best_seller). */
  lockedFlag?: ProductFlag;
  /** Optional initial filters (defaults). */
  initialFlag?: ProductFlag;
  /** Disable category tree (e.g. collections page). */
  disableCategoryTree?: boolean;
  /** Page size. */
  limit?: number;
}

function parseFilters(sp: URLSearchParams): ShopFilters {
  const f: ShopFilters = {};
  const cat = sp.get('category') ?? undefined;
  if (cat) f.category = cat;
  const minP = sp.get('minPrice');
  if (minP) f.minPrice = Number(minP);
  const maxP = sp.get('maxPrice');
  if (maxP) f.maxPrice = Number(maxP);
  const color = sp.get('color');
  if (color) f.color = color;
  const size = sp.get('size');
  if (size) f.size = size;
  const flag = sp.get('flag');
  if (flag && (FLAGS as string[]).includes(flag)) f.flag = flag as ProductFlag;
  if (sp.get('inStock') === 'true') f.inStock = true;
  return f;
}

function serialize(filters: ShopFilters, sort: ProductSort, page: number, q?: string): string {
  const sp = new URLSearchParams();
  if (filters.category) sp.set('category', filters.category);
  if (typeof filters.minPrice === 'number') sp.set('minPrice', String(filters.minPrice));
  if (typeof filters.maxPrice === 'number') sp.set('maxPrice', String(filters.maxPrice));
  if (filters.color) sp.set('color', filters.color);
  if (filters.size) sp.set('size', filters.size);
  if (filters.inStock) sp.set('inStock', 'true');
  if (filters.flag) sp.set('flag', filters.flag);
  if (sort && sort !== 'new') sp.set('sort', sort);
  if (page > 1) sp.set('page', String(page));
  if (q) sp.set('q', q);
  return sp.toString();
}

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

  const [filters, setFilters] = useState<ShopFilters>(() => parseFilters(sp));
  const [sort, setSort] = useState<ProductSort>(() => {
    const s = sp.get('sort');
    return (s && (SORTS as string[]).includes(s) ? (s as ProductSort) : 'new');
  });
  const [page, setPage] = useState<number>(() => Math.max(1, Number(sp.get('page') ?? 1)));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Apply initial flag default if user has not set any (e.g. /shop?flag=…).
  useEffect(() => {
    if (initialFlag && !filters.flag) {
      setFilters((f) => ({ ...f, flag: initialFlag }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialFlag]);

  // ------- Resolve "effective" params (lock overrides user input) -------
  const effectiveCategory = lockedCategorySlug ?? filters.category;
  const effectiveQuery = lockedQuery;
  const effectiveFlag = lockedFlag ?? filters.flag;

  const listParams = useMemo(
    () => ({
      category: effectiveCategory,
      q: effectiveQuery,
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
      effectiveQuery,
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

  const { data, isLoading, isError, refetch, isFetching } = useProducts(listParams);

  // Facets follow the *page* context (locked category/query) only — not user filters,
  // so the sidebar always shows the full set of options the catalogue supports.
  const facetsParams = useMemo(
    () => ({ category: effectiveCategory, q: effectiveQuery, flag: lockedFlag }),
    [effectiveCategory, effectiveQuery, lockedFlag],
  );
  const { data: facets } = useProductFacets(facetsParams);
  const { data: cats = [] } = useCategories();

  const safeFacets = {
    colors: facets?.colors ?? [],
    sizes: facets?.sizes ?? [],
    priceMin: facets?.priceMin ?? 0,
    priceMax: facets?.priceMax ?? 0,
  };

  // ------- URL sync (shareable links) -------
  const syncUrl = useCallback(
    (nextFilters: ShopFilters, nextSort: ProductSort, nextPage: number) => {
      const qs = serialize(nextFilters, nextSort, nextPage, sp.get('q') ?? undefined);
      const path = window.location.pathname;
      router.replace(qs ? `${path}?${qs}` : path, { scroll: false });
    },
    [router, sp],
  );

  useEffect(() => {
    syncUrl(filters, sort, page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, page]);

  // Reset to page 1 whenever filters/sort change
  useEffect(() => {
    setPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const onChangeFilters = useCallback((next: Partial<ShopFilters>) => {
    setFilters((cur) => ({ ...cur, ...next }));
  }, []);

  const onReset = useCallback(() => {
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
      const c = cats.find((cc) => cc.slug === filters.category);
      chips.push({
        key: 'cat',
        label: c?.name ?? filters.category,
        clear: () => onChangeFilters({ category: undefined }),
      });
    }
    if (filters.color) chips.push({ key: 'color', label: filters.color, clear: () => onChangeFilters({ color: undefined }) });
    if (filters.size) chips.push({ key: 'size', label: `Size ${filters.size}`, clear: () => onChangeFilters({ size: undefined }) });
    if (filters.flag && !lockedFlag) {
      const label = filters.flag === 'new_arrival' ? 'New' : filters.flag === 'best_seller' ? 'Best Seller' : 'Featured';
      chips.push({ key: 'flag', label, clear: () => onChangeFilters({ flag: undefined }) });
    }
    if (filters.inStock) chips.push({ key: 'stock', label: 'In stock', clear: () => onChangeFilters({ inStock: undefined }) });
    if (typeof filters.minPrice === 'number' || typeof filters.maxPrice === 'number') {
      chips.push({
        key: 'price',
        label: `₹${(filters.minPrice ?? 0).toLocaleString('en-IN')} – ₹${(filters.maxPrice ?? safeFacets.priceMax).toLocaleString('en-IN')}`,
        clear: () => onChangeFilters({ minPrice: undefined, maxPrice: undefined }),
      });
    }
    return chips;
  }, [filters, lockedCategorySlug, lockedFlag, cats, safeFacets.priceMax, onChangeFilters]);

  return (
    <div className="bg-bg">
      <Container className="py-6">
        <Breadcrumbs items={breadcrumbs} />

        <div className="mt-4 flex flex-col gap-2">
          {eyebrow ? (
            <p className="text-[11px] font-semibold uppercase tracking-wider2 text-gold">
              {eyebrow}
            </p>
          ) : null}
          <h1
            data-testid="shop-page-title"
            className="font-serif text-3xl text-ink md:text-5xl"
          >
            {title}
          </h1>
          {description ? (
            <p className="max-w-2xl text-[15px] leading-relaxed text-ink-2">{description}</p>
          ) : null}
        </div>

        {/* Toolbar */}
        <div className="sticky top-16 z-20 -mx-4 mt-6 flex items-center justify-between gap-3 border-b border-border bg-bg/85 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-bg/65 sm:-mx-6 sm:px-6 lg:hidden">
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <button
                type="button"
                data-testid="filter-drawer-trigger"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-border bg-surface px-4 text-[12px] font-semibold uppercase tracking-wider2 text-ink hover:border-gold"
              >
                <SlidersHorizontal className="size-4 text-gold" /> Filters
                {activeChips.length > 0 ? (
                  <span className="ml-1 inline-flex size-5 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-white">
                    {activeChips.length}
                  </span>
                ) : null}
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="flex w-full max-w-md flex-col gap-0 bg-bg p-0 sm:max-w-md"
            >
              <div className="flex-1 overflow-y-auto p-5">
                <FilterSidebar
                  compact
                  categories={disableCategoryTree ? [] : cats}
                  activeCategorySlug={lockedCategorySlug ?? filters.category}
                  filters={filters}
                  facets={safeFacets}
                  onChange={onChangeFilters}
                  onReset={onReset}
                />
              </div>
              <div className="sticky bottom-0 flex gap-3 border-t border-border bg-bg p-4">
                <button
                  type="button"
                  onClick={() => {
                    onReset();
                  }}
                  data-testid="filter-drawer-reset"
                  className="h-12 flex-1 rounded-full border border-border bg-surface text-[12px] font-semibold uppercase tracking-wider2 text-ink hover:border-gold"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  data-testid="filter-drawer-apply"
                  className="h-12 flex-[2] rounded-full bg-ink text-[12px] font-semibold uppercase tracking-wider2 text-bg hover:bg-ink/90"
                >
                  Show {total} pieces
                </button>
              </div>
            </SheetContent>
          </Sheet>
          <SortDropdown value={sort} onChange={setSort} />
        </div>

        {/* Body */}
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr] lg:gap-12">
          {/* Desktop sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <FilterSidebar
                categories={disableCategoryTree ? [] : cats}
                activeCategorySlug={lockedCategorySlug ?? filters.category}
                filters={filters}
                facets={safeFacets}
                onChange={onChangeFilters}
                onReset={onReset}
              />
            </div>
          </div>

          <div>
            {/* Desktop toolbar */}
            <div className="hidden items-center justify-between gap-3 pb-6 lg:flex">
              <p
                data-testid="results-count"
                className={cn(
                  'text-sm text-ink-2 transition-opacity',
                  isFetching && 'opacity-60',
                )}
              >
                {isLoading
                  ? 'Loading…'
                  : total === 0
                  ? 'No results'
                  : `Showing ${(page - 1) * limit + 1}–${Math.min(page * limit, total)} of ${total}`}
              </p>
              <SortDropdown value={sort} onChange={setSort} />
            </div>

            {/* Active chips */}
            {activeChips.length > 0 ? (
              <div data-testid="active-filter-chips" className="mb-4 flex flex-wrap gap-2">
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.clear}
                    className="inline-flex h-8 items-center gap-1.5 rounded-full border border-gold/40 bg-gold-soft/40 px-3 text-[11px] font-semibold uppercase tracking-wider2 text-ink transition-colors hover:bg-gold-soft"
                  >
                    {chip.label}
                    <X className="size-3" />
                  </button>
                ))}
              </div>
            ) : null}

            {/* Grid */}
            <ProductGrid
              items={items}
              loading={isLoading}
              skeletonCount={limit}
              emptyTitle={
                isError
                  ? 'We couldn’t load these pieces'
                  : effectiveQuery
                  ? `No matches for “${effectiveQuery}”`
                  : 'No pieces match your filters'
              }
              emptyDescription={
                isError
                  ? 'Please retry — your atelier feed will reappear shortly.'
                  : effectiveQuery
                  ? 'Try fewer keywords, or browse our collections to discover something new.'
                  : 'Try widening the price range or removing a colour / size to see more.'
              }
              emptyAction={
                isError
                  ? { label: 'Retry', onClick: () => refetch() }
                  : activeChips.length > 0
                  ? { label: 'Clear filters', onClick: onReset }
                  : undefined
              }
            />

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </div>
      </Container>
    </div>
  );
}
