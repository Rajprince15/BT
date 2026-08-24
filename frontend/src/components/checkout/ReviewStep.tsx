'use client';

import { Loader2 } from 'lucide-react';
import type { Cart } from '@/types/Cart';
import type { Address } from '@/types/Address';
import { useState } from 'react';

interface ShippingSummary {
  label: string;
  eta: string;
  price: number;
}

interface ReviewStepProps {
  cart: Cart;
  address: Address;
  shipping: ShippingSummary;
  onEditAddress: () => void;
  onEditShipping: () => void;
  onPay: () => void;
  busy: boolean;
  whatsappMode?: boolean;
}

export default function ReviewStep({
  cart,
  address,
  shipping,
  onEditAddress,
  onEditShipping,
  onPay,
  busy,
  whatsappMode = false,
}: ReviewStepProps) {
  const [confirming, setConfirming] = useState(false);

  return (
    <section
      data-testid="checkout-review-step"
      className="grid gap-6"
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">
          Step 3
        </p>

        <h2 className="mt-2 font-serif text-3xl text-ink">
          Review &amp; pay
        </h2>

        <p className="mt-2 text-sm text-ink-2">
          One last look before we send this to production.
        </p>
      </header>

      {/* Shipping Address */}
      <article className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">
              Shipping address
            </p>

            <p className="mt-2 font-serif text-lg text-ink">
              {address.fullName}
            </p>

            <p className="mt-1 text-sm leading-6 text-ink-2">
              {address.addressLine1}
              {address.addressLine2 ? (
                <>, {address.addressLine2}</>
              ) : null}
              <br />
              {address.city}, {address.state} · {address.pincode}
              <br />
              {address.phone}
            </p>
          </div>

          <button
            type="button"
            data-testid="checkout-edit-address"
            onClick={onEditAddress}
            className="text-xs uppercase tracking-wider2 text-gold hover:text-gold-2"
          >
            Edit
          </button>
        </div>
      </article>

      {/* Delivery Method */}
      <article className="rounded-xl border border-border bg-surface p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">
              Delivery method
            </p>

            <p className="mt-2 font-serif text-lg text-ink">
              {shipping.label}
            </p>

            <p className="mt-1 text-xs uppercase tracking-wider2 text-ink-2">
              {shipping.eta}
            </p>
          </div>

          <button
            type="button"
            data-testid="checkout-edit-shipping"
            onClick={onEditShipping}
            className="text-xs uppercase tracking-wider2 text-gold hover:text-gold-2"
          >
            Edit
          </button>
        </div>
      </article>

      {/* Items */}
      <article className="rounded-xl border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">
          Items ({cart.items.length})
        </p>

        <ul className="mt-3 divide-y divide-border text-sm">
          {cart.items.map((item) => (
            <li
              key={item.id}
              className="flex justify-between gap-4 py-3"
            >
              <span className="text-ink">
                {item.productName}{' '}
                <span className="text-ink-2">
                  × {item.quantity}
                </span>
              </span>

              <span className="text-ink">
                ₹
                {(item.price * item.quantity).toLocaleString(
                  'en-IN'
                )}
              </span>
            </li>
          ))}
        </ul>
      </article>

      {/* Payment / WhatsApp Button */}
      <button
        type="button"
        data-testid="checkout-pay-button"
        onClick={() =>
          whatsappMode ? setConfirming(true) : onPay()
        }
        disabled={busy}
        className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold disabled:opacity-50"
      >
        {busy ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Preparing request…
          </>
        ) : whatsappMode ? (
          'Review WhatsApp message'
        ) : (
          'Pay with Razorpay'
        )}
      </button>

      {/* WhatsApp Note */}
      {whatsappMode ? (
        <p
          data-testid="checkout-whatsapp-note"
          className="rounded-lg border border-[#1f9d58]/30 bg-[#1f9d58]/10 p-3 text-xs leading-5 text-ink-2"
        >
          Your selected items, variants, delivery details and calculated
          prices will be prefilled in WhatsApp.
        </p>
      ) : null}

      {/* Terms */}
      <p className="text-[11px] uppercase tracking-wider2 text-ink-2">
        By continuing you agree to our{' '}
        <a
          href="/terms"
          className="text-gold hover:text-gold-2"
        >
          Terms
        </a>{' '}
        and{' '}
        <a
          href="/privacy"
          className="text-gold hover:text-gold-2"
        >
          Privacy Policy
        </a>
        .
      </p>
    </section>
  );
}