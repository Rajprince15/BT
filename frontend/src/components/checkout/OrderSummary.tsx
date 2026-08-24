import type { Cart } from '@/types/Cart';

interface ShippingSummary {
  id?: string;
  label: string;
  eta: string;
  price: number;
}

export default function OrderSummary({
  cart,
  shipping,
}: {
  cart: Cart;
  shipping?: ShippingSummary;
}) {
  // If a shipping method is chosen, override cart.shipping with the picked price.
  const shippingCost = shipping ? shipping.price : cart.shipping;
  const total = cart.subtotal + cart.tax + shippingCost;

  return (
    <aside
      data-testid="checkout-order-summary"
      className="h-fit rounded-lg border border-border bg-surface p-6 sm:p-8 lg:sticky lg:top-24"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">
        Your order
      </p>
      <h2 className="mt-3 font-serif text-2xl text-ink">Order summary</h2>

      {/* Items */}
      <ul className="mt-6 space-y-3 text-sm text-ink-2">
        {cart.items.map((item) => (
          <li key={item.id} className="flex justify-between gap-4">
            <span className="min-w-0 truncate">
              {item.productName}{' '}
              <span className="text-ink-2">× {item.quantity}</span>
            </span>
            <span className="shrink-0 text-ink">
              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
            </span>
          </li>
        ))}
      </ul>

      {/* Breakdown */}
      <dl className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-ink-2">Subtotal</dt>
          <dd
            data-testid="checkout-subtotal"
            className="text-ink"
          >
            ₹{cart.subtotal.toLocaleString('en-IN')}
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-ink-2">
            Shipping
            {shipping ? (
              <span
                data-testid="checkout-shipping-method-label"
                className="ml-1 text-[11px] uppercase tracking-wider2 text-gold"
              >
                · {shipping.label}
              </span>
            ) : null}
          </dt>
          <dd
            data-testid="checkout-shipping-cost"
            className="text-ink"
          >
            ₹{shippingCost.toLocaleString('en-IN')}
          </dd>
        </div>
        {cart.tax > 0 ? (
          <div className="flex justify-between">
            <dt className="text-ink-2">Tax</dt>
            <dd data-testid="checkout-tax" className="text-ink">
              ₹{cart.tax.toLocaleString('en-IN')}
            </dd>
          </div>
        ) : null}
      </dl>

      <div className="mt-5 flex items-baseline justify-between border-t border-border pt-5 text-ink">
        <span className="font-serif text-xl">Total</span>
        <span
          data-testid="checkout-total"
          className="font-serif text-2xl"
        >
          ₹{total.toLocaleString('en-IN')}
        </span>
      </div>

      {!shipping ? (
        <p
          data-testid="checkout-total-hint"
          className="mt-3 text-[11px] leading-5 text-ink-2"
        >
          Pick a delivery method to see the final total including shipping.
        </p>
      ) : null}
    </aside>
  );
}
