'use client';
import Link from 'next/link';
import Container from '@/components/common/Container';
import CartLineItem from '@/components/cart/CartLineItem';
import CartSummary from '@/components/cart/CartSummary';
import CouponInput from '@/components/cart/CouponInput';
import { useCart, useRemoveCartItem, useUpdateCartItem } from '@/hooks/useCart';

export default function CartPage() {
  const { data: cart, isLoading, isError } = useCart();
  const update = useUpdateCartItem();
  const remove = useRemoveCartItem();
  if (isLoading) return <main data-testid="cart-loading" className="min-h-[60vh] bg-bg" />;
  if (isError || !cart) return <main data-testid="cart-auth-required" className="min-h-[50vh] bg-bg px-6 py-24 text-center"><h1 className="font-serif text-4xl text-ink">Your private collection awaits</h1><p className="mt-3 text-ink-2">Sign in to keep pieces in your bag.</p></main>;
  return <main data-testid="cart-page" className="bg-bg"><Container className="py-20 sm:py-28"><p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">Your bag</p><h1 className="mt-3 font-serif text-4xl tracking-[-.03em] text-ink sm:text-5xl">Review your order</h1><p className="mt-4 max-w-xl text-sm leading-7 text-ink-2">A considered selection, prepared with care and ready for its next room.</p>{cart.items.length ? <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_380px] lg:gap-16"><section><ul data-testid="cart-items-list" className="divide-y divide-border">{cart.items.map((item) => <li key={item.id}><CartLineItem item={item} onQuantity={(quantity) => update.mutate({ id: item.id, quantity })} onRemove={() => remove.mutate(item.id)} /></li>)}</ul><CouponInput /></section><CartSummary cart={cart} /></div> : <div data-testid="cart-empty-state" className="mt-14 border border-border bg-surface px-6 py-20 text-center sm:px-16"><p className="font-serif text-4xl text-ink">Your bag is empty</p><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-ink-2">Begin with a woven layer that makes the room feel like yours.</p><Link data-testid="cart-empty-cta" href="/shop" className="mt-8 inline-flex h-12 items-center rounded-full bg-brand px-7 text-[11px] font-semibold uppercase tracking-[.18em] text-brand-ink transition-colors hover:bg-brand-2 focus-visible:ring-2 focus-visible:ring-gold">Explore the catalogue</Link></div>}</Container></main>;
}