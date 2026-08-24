'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Award,
  Factory,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  Truck,
} from 'lucide-react';

import Container from '@/components/common/Container';
import Breadcrumbs, { type BreadcrumbItem } from '@/components/shop/Breadcrumbs';
import Gallery from '@/components/product/Gallery';
import VariantPicker from '@/components/product/VariantPicker';
import PriceBlock from '@/components/product/PriceBlock';
import PriceTag from '@/components/common/PriceTag';
import AddToCartButton from '@/components/product/AddToCartButton';
import WishlistButton from '@/components/product/WishlistButton';
import RelatedProducts from '@/components/product/RelatedProducts';
import ReviewList from '@/components/product/ReviewList';
import JsonLdProduct from '@/components/product/JsonLdProduct';
import ProductShare from '@/components/product/ProductShare';
import { useCategories } from '@/hooks/useCategories';
import { useProduct } from '@/hooks/useProduct';
import { Skeleton } from '@/components/ui/skeleton';
import type { Category } from '@/types/Category';
import type { ProductVariant } from '@/types/ProductVariant';

const EASE = [0.22, 1, 0.36, 1] as const;

function buildBreadcrumbs(
  categories: Category[] | undefined,
  productName?: string,
  productSlug?: string,
  categoryId?: number,
): BreadcrumbItem[] {
  const crumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' },
    { label: 'Shop', href: '/shop' },
  ];

  if (!categories || !categoryId) {
    if (productName) crumbs.push({ label: productName });
    return crumbs;
  }

  const map = new Map(categories.map((item) => [item.id, item]));
  const lineage: Category[] = [];
  const seen = new Set<number>();
  let current = map.get(categoryId);

  while (current && !seen.has(current.id)) {
    lineage.push(current);
    seen.add(current.id);
    current = current.parentId ? map.get(current.parentId) : undefined;
  }

  let path = '/shop';
  for (const category of lineage.reverse()) {
    path += `/${category.slug}`;
    crumbs.push({ label: category.name, href: path });
  }

  if (productName) {
    crumbs.push({
      label: productName,
      href: productSlug ? `/product/${productSlug}` : undefined,
    });
  }

  return crumbs;
}

const TRUST_ITEMS = [
  {
    Icon: Factory,
    title: 'Factory direct',
    body: 'Manufactured at our Panipat mill — no middlemen, no directory markups.',
  },
  {
    Icon: ShieldCheck,
    title: 'Quality assured',
    body: 'Five-stage inspection with GSM, shrinkage and colour-fastness testing.',
  },
  {
    Icon: Truck,
    title: 'Global shipping',
    body: 'FOB Nhava Sheva / Mundra. LCL consolidation across categories.',
  },
];

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(params.slug);
  const { data: categories } = useCategories();
  const [variant, setVariant] = useState<ProductVariant>();
  const [quantity, setQuantity] = useState(1);
  const reduce = useReducedMotion();

  const price = variant?.price ?? product?.price ?? 0;
  const stock = variant?.stock ?? product?.stock ?? 0;

  const breadcrumbs = useMemo(
    () =>
      buildBreadcrumbs(
        categories,
        product?.name,
        product?.slug,
        product?.categoryId,
      ),
    [categories, product?.categoryId, product?.name, product?.slug],
  );

  useEffect(() => {
    setVariant(undefined);
    setQuantity(1);
  }, [product?.id]);

  if (isLoading) {
    return (
      <main
        data-testid="product-loading"
        className="min-h-[70vh] bg-bg"
      >
        <Container className="py-10">
          <div className="grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:gap-16">
            <Skeleton className="aspect-square w-full rounded-lg" />
            <div className="space-y-5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="mt-6 h-9 w-40" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </Container>
      </main>
    );
  }

  if (isError || !product) {
    return (
      <div
        data-testid="product-error"
        className="mx-auto min-h-[50vh] max-w-3xl px-6 py-24 text-center"
      >
        <h1 className="font-serif text-4xl text-ink">This piece has moved on</h1>
        <p className="mt-3 text-ink-2">
          Return to the atelier to discover another story.
        </p>
      </div>
    );
  }

  const canAddToCart =
    Boolean(stock) && (product.variants.length === 0 || Boolean(variant));

  const specs: Array<[string, string | undefined]> = [
    ['Specification', product.specification],
    ['Size', product.sizeLabel],
  
    ['Best for', product.buyerSegments?.join(' · ')],
  ];
  const hasSpecs = specs.some(([, value]) => Boolean(value));

  return (
    <main data-testid="product-detail-page" className="bg-bg pb-28 lg:pb-0">
      <JsonLdProduct product={product} />

      <Container className="py-4">
        <Breadcrumbs items={breadcrumbs} />

        <div className="grid gap-10 py-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] lg:gap-16 lg:py-12">
          {/* ---------- Gallery ---------- */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
          >
            <Gallery images={product.images} name={product.name} />
          </motion.div>

          {/* ---------- Buy panel ---------- */}
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.55, ease: EASE }}
            className="flex flex-col"
          >
            {/* SKU + badges */}
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                {product.sku}
              </p>
              {product.bestSeller ? (
                <span className="rounded-full bg-brand-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 text-brand">
                  Bestseller
                </span>
              ) : null}
              {product.newArrival ? (
                <span className="rounded-full border border-gold/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider2 text-gold-2">
                  New
                </span>
              ) : null}
            </div>

            <h1
              data-testid="product-title"
              className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl md:text-5xl"
            >
              {product.name}
            </h1>

            {product.ratingCount > 0 ? (
              <div className="mt-3 flex items-center gap-2 text-xs text-ink-2">
                <Award size={14} className="text-gold-2" />
                <span className="font-semibold text-ink">
                  {product.ratingAvg.toFixed(1)}
                </span>
                <span>· {product.ratingCount} reviews</span>
              </div>
            ) : null}

            <p className="mt-5 max-w-xl text-[15px] leading-7 text-ink-2">
              {product.shortDescription ?? product.description}
            </p>

            {/* Divider */}
            <span
              aria-hidden
              className="mt-7 block h-px w-full bg-border"
            />

            {/* Price block */}
            <div className="mt-6">
              <PriceBlock
                price={price}
                salePrice={variant ? undefined : product.salePrice}
              />
            </div>

            <p
              data-testid="product-stock-status"
              className={`mt-3 text-[11px] font-semibold uppercase tracking-wider2 ${
                stock > 0 ? 'text-success' : 'text-danger'
              }`}
            >
              {stock > 0
                ? stock < 5
                  ? `Only ${stock} left`
                  : 'In stock · Ships across India'
                : 'Currently unavailable'}
            </p>

            {/* Key specs summary — B2B priority */}
            {(product.sizeLabel || product.specification) ? (
              <dl
                data-testid="product-key-specs"
                className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 rounded-lg border border-border bg-surface p-5 sm:grid-cols-2"
              >
                {product.specification ? (
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider2 text-ink-2">
                      Material
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">
                      {product.specification}
                    </dd>
                  </div>
                ) : null}
                {product.sizeLabel ? (
                  <div>
                    <dt className="text-[10px] font-semibold uppercase tracking-wider2 text-ink-2">
                      Size
                    </dt>
                    <dd className="mt-1 text-sm font-semibold text-ink">
                      {product.sizeLabel}
                    </dd>
                  </div>
                ) : null}
                
              </dl>
            ) : null}

            {/* Variant picker */}
            <div className="mt-7">
              <VariantPicker
                variants={product.variants}
                selected={variant}
                onChange={setVariant}
              />
            </div>

                        {/* Quantity + primary CTA */}
            <div className="mt-7 space-y-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider2 text-ink-2">
                Quantity
              </p>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-12 items-center overflow-hidden rounded-full border border-border bg-surface">
                  <button
                    type="button"
                    data-testid="quantity-decrease"
                    aria-label="Decrease quantity"
                    onClick={() =>
                      setQuantity((value) => Math.max(1, value - 1))
                    }
                    className="inline-flex size-11 items-center justify-center text-ink-2 transition-colors hover:bg-bg hover:text-brand"
                  >
                    <Minus className="size-4" />
                  </button>

                  <input
                    type="number"
                    inputMode="numeric"
                    data-testid="quantity-input"
                    aria-label="Quantity"
                    min={1}
                    max={stock || undefined}
                    value={quantity}
                    onChange={(event) => {
                      const raw = event.target.value;

                      if (raw === '') {
                        setQuantity(1);
                        return;
                      }

                      const parsed = Number.parseInt(raw, 10);

                      if (Number.isNaN(parsed)) return;

                      const clamped = Math.max(
                        1,
                        Math.min(stock || parsed, parsed),
                      );

                      setQuantity(clamped);
                    }}
                    onBlur={(event) => {
                      const parsed = Number.parseInt(
                        event.target.value,
                        10,
                      );

                      if (Number.isNaN(parsed) || parsed < 1) {
                        setQuantity(1);
                      }
                    }}
                    className="h-full w-14 border-x border-border bg-transparent text-center text-sm font-semibold text-ink outline-none focus:bg-bg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />

                  <button
                    type="button"
                    data-testid="quantity-increase"
                    aria-label="Increase quantity"
                    onClick={() =>
                      setQuantity((value) =>
                        Math.min(stock || value + 1, value + 1),
                      )
                    }
                    className="inline-flex size-11 items-center justify-center text-ink-2 transition-colors hover:bg-bg hover:text-brand"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>

                <div className="flex flex-1 items-center gap-3">
                  <AddToCartButton
                    productId={product.id}
                    variantId={variant?.id}
                    quantity={quantity}
                    disabled={!canAddToCart}
                  />

                  <WishlistButton productId={product.id} />
                </div>
              </div>

              <p className="text-[11px] text-ink-2">
                Type the exact number of pieces or use the buttons.
              </p>
            </div>

            {/* Bulk enquiry accent CTA */}
            <a
              href={`/wholesale?product=${encodeURIComponent(
                product.slug,
              )}&productName=${encodeURIComponent(
                product.name,
              )}&sku=${encodeURIComponent(product.sku)}&qty=${quantity}`}
              data-testid="product-bulk-cta"
              className="group mt-4 inline-flex items-center justify-center gap-2 rounded-full border border-brand/25 bg-brand-soft/40 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-brand transition-all duration-300 hover:border-brand/60 hover:bg-brand-soft"
            >
              <Package size={14} />
              Request bulk quote for this product
            </a>

            {/* Trust row */}
            <div className="mt-8 grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
              {TRUST_ITEMS.map(({ Icon, title, body }) => (
                <div key={title} className="flex items-start gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand">
                    <Icon size={16} />
                  </span>
                  <div>
                    <p className="text-xs font-semibold text-ink">{title}</p>
                    <p className="mt-0.5 text-xs leading-5 text-ink-2">
                      {body}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <ProductShare product={product} />
          </motion.div>
        </div>

        {/* ---------- Long description + specs ---------- */}
        <motion.section
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: EASE }}
          className="mt-10 border-t border-border pt-12"
        >
          <div className="grid gap-10 lg:grid-cols-[.4fr_.6fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                The details
              </p>
              <h2 className="mt-3 font-serif text-3xl text-ink sm:text-4xl">
                Craft &amp; construction
              </h2>
              <span aria-hidden className="mt-5 block h-px w-14 bg-gold" />
            </div>
            <div>
              <p
                data-testid="product-description"
                className="whitespace-pre-line text-[15px] leading-8 text-ink-2"
              >
                {product.description ?? product.shortDescription}
              </p>

              {hasSpecs ? (
                <dl
                  data-testid="product-technical-specs"
                  className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2"
                >
                  {specs.map(([label, value]) =>
                    value ? (
                      <div
                        key={label}
                        className="bg-surface px-5 py-5"
                      >
                        <dt className="text-[10px] font-semibold uppercase tracking-wider2 text-gold-2">
                          {label}
                        </dt>
                        <dd
                          data-testid={`product-spec-${label
                            .toLowerCase()
                            .replaceAll(' ', '-')}`}
                          className="mt-2 text-sm font-semibold text-ink"
                        >
                          {value}
                        </dd>
                      </div>
                    ) : null,
                  )}
                </dl>
              ) : null}
            </div>
          </div>
        </motion.section>

        <ReviewList
          productId={product.id}
          rating={product.ratingAvg}
          count={product.ratingCount}
        />

        <RelatedProducts productId={product.id} />
      </Container>

      {/* Mobile sticky purchase bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-bg/95 px-4 py-3 shadow-[0_-8px_24px_-16px_rgba(0,0,0,0.25)] backdrop-blur-md lg:hidden">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold uppercase tracking-wider2 text-brand">
              {product.name}
            </p>
            <PriceTag
              price={price}
              salePrice={variant ? undefined : product.salePrice}
              size="md"
              className="mt-1"
            />
          </div>
          <AddToCartButton
            productId={product.id}
            variantId={variant?.id}
            quantity={quantity}
            disabled={!canAddToCart}
          />
        </div>
      </div>
    </main>
  );
}


