'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import { Minus, Plus } from 'lucide-react';
import Container from '@/components/common/Container';
import Breadcrumbs from '@/components/shop/Breadcrumbs';
import Gallery from '@/components/product/Gallery';
import VariantPicker from '@/components/product/VariantPicker';
import PriceBlock from '@/components/product/PriceBlock';
import AddToCartButton from '@/components/product/AddToCartButton';
import WishlistButton from '@/components/product/WishlistButton';
import RelatedProducts from '@/components/product/RelatedProducts';
import ReviewList from '@/components/product/ReviewList';
import JsonLdProduct from '@/components/product/JsonLdProduct';
import { useProduct } from '@/hooks/useProduct';
import type { ProductVariant } from '@/types/ProductVariant';

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const { data: product, isLoading, isError } = useProduct(params.slug);
  const [variant, setVariant] = useState<ProductVariant>();
  const [quantity, setQuantity] = useState(1);
  const price = variant?.price ?? product?.price ?? 0;
  const stock = variant?.stock ?? product?.stock ?? 0;
  const crumbs = useMemo(() => [{ label: 'Home', href: '/' }, { label: 'Shop', href: '/shop' }, ...(product ? [{ label: product.name }] : [])], [product]);
  if (isLoading) return <div data-testid="product-loading" className="min-h-[70vh] bg-bg" />;
  if (isError || !product) return <div data-testid="product-error" className="mx-auto min-h-[50vh] max-w-3xl px-6 py-24 text-center"><h1 className="font-serif text-4xl text-ink">This piece has moved on</h1><p className="mt-3 text-ink-2">Return to the atelier to discover another story.</p></div>;
  return <main data-testid="product-detail-page" className="bg-bg"><JsonLdProduct product={product} /><Container className="py-4"><Breadcrumbs items={crumbs} /><div className="grid gap-10 py-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)] lg:gap-16 lg:py-10"><Gallery images={product.images} name={product.name} /><div className="flex flex-col justify-center"><p className="text-xs font-semibold uppercase tracking-wider2 text-gold">{product.sku}</p><h1 data-testid="product-title" className="mt-3 font-serif text-4xl leading-tight text-ink md:text-5xl">{product.name}</h1><p className="mt-5 max-w-xl text-base leading-7 text-ink-2">{product.shortDescription ?? product.description}</p><div className="mt-6"><PriceBlock price={price} salePrice={variant ? undefined : product.salePrice} /></div><p data-testid="product-stock-status" className="mt-4 text-xs font-semibold uppercase tracking-wider2 text-success">{stock > 0 ? stock < 5 ? `Only ${stock} left` : 'In stock · Ships across India' : 'Currently unavailable'}</p><div className="mt-6"><VariantPicker variants={product.variants} selected={variant} onChange={setVariant} /></div><div className="mt-6 flex items-center gap-3"><div className="flex h-12 items-center rounded-full border border-border bg-surface"><button type="button" data-testid="quantity-decrease" aria-label="Decrease quantity" onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="inline-flex size-11 items-center justify-center text-ink-2 hover:text-gold"><Minus className="size-4" /></button><span data-testid="quantity-value" className="w-8 text-center text-sm">{quantity}</span><button type="button" data-testid="quantity-increase" aria-label="Increase quantity" onClick={() => setQuantity((value) => Math.min(stock || 1, value + 1))} className="inline-flex size-11 items-center justify-center text-ink-2 hover:text-gold"><Plus className="size-4" /></button></div><AddToCartButton productId={product.id} variantId={variant?.id} quantity={quantity} disabled={!stock || (product.variants.length > 0 && !variant)} /><WishlistButton productId={product.id} /></div><div className="mt-8 grid gap-4 border-t border-border pt-6 text-sm leading-6 text-ink-2 sm:grid-cols-3"><p><strong className="block text-ink">Crafted slowly</strong>Made with considered materials and enduring detail.</p><p><strong className="block text-ink">Easy care</strong>Care notes included with every order.</p><p><strong className="block text-ink">Thoughtful delivery</strong>Securely packed for its journey home.</p></div></div></div><div className="mt-8 border-t border-border pt-10"><h2 className="font-serif text-3xl text-ink">The details</h2><p data-testid="product-description" className="mt-4 max-w-3xl whitespace-pre-line text-base leading-8 text-ink-2">{product.description ?? product.shortDescription}</p></div><ReviewList productId={product.id} rating={product.ratingAvg} count={product.ratingCount} /><RelatedProducts productId={product.id} /></Container></main>;
}