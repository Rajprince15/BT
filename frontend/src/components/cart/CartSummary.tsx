import Link from 'next/link';
import { RefreshCcw, ShieldCheck, Truck } from 'lucide-react';
import type { Cart } from '@/types/Cart';

export default function CartSummary({ cart }: { cart: Cart }) {
  return (
    <aside
      data-testid="cart-summary"
      className="h-fit rounded-lg border border-border bg-surface p-5 sm:p-6 lg:sticky lg:top-24"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
        Order summary
      </p>
      <dl className="mt-5 space-y-3.5 text-sm text-ink-2">
        <div className="flex justify-between">
          <dt>Subtotal</dt>
          <dd data-testid="cart-subtotal" className="font-semibold text-ink">
            ₹{cart.subtotal.toLocaleString('en-IN')}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Shipping</dt>
          <dd data-testid="cart-shipping" className="font-semibold text-ink">
            ₹{cart.shipping.toLocaleString('en-IN')}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt>Tax</dt>
          <dd data-testid="cart-tax" className="font-semibold text-ink">
            ₹{cart.tax.toLocaleString('en-IN')}
          </dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-border pt-4 text-ink">
          <dt className="font-serif text-xl">Total</dt>
          <dd
            data-testid="cart-total"
            className="font-serif text-xl"
          >
            ₹{cart.total.toLocaleString('en-IN')}
          </dd>
        </div>
      </dl>
      <Link
        data-testid="cart-checkout-cta"
        href={cart.items.length ? '/checkout' : '/shop'}
        className="mt-6 flex h-11 items-center justify-center rounded-full bg-brand text-[11px] font-semibold uppercase tracking-[.18em] text-brand-ink transition-colors hover:bg-brand-2 focus-visible:ring-2 focus-visible:ring-gold"
      >
        {cart.items.length ? 'Proceed to checkout' : 'Explore catalogue'}
      </Link>
      <div className="mt-6 space-y-2.5 border-t border-border pt-5 text-xs text-ink-2">
        <p className="flex items-center gap-3">
          <ShieldCheck className="size-4 text-brand" /> Secure order details
        </p>
        <p className="flex items-center gap-3">
          <Truck className="size-4 text-brand" /> Carefully packed delivery
        </p>
        <p className="flex items-center gap-3">
          <RefreshCcw className="size-4 text-brand" /> Support when you need it
        </p>
      </div>
    </aside>
  );
}