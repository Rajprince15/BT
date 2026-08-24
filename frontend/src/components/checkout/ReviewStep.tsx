'use client';

import { Loader2, MessageCircle, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { Cart } from '@/types/Cart';
import type { Address } from '@/types/Address';
import { whatsappUrl } from '@/components/layout/WhatsAppWidget';

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

function formatINR(value: number) {
  return `Rs. ${value.toLocaleString('en-IN')}`;
}

function computeTotals(cart: Cart, shipping: ShippingSummary) {
  const shippingCost = shipping.price;
  const total = cart.subtotal + cart.tax + shippingCost;
  return { shippingCost, total };
}

function buildWhatsAppMessage(
  cart: Cart,
  address: Address,
  shipping: ShippingSummary,
) {
  const orderRef = `BT-${Date.now().toString().slice(-6)}`;
  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const itemLines = cart.items
    .map((item, index) => {
      const lineTotal = item.price * item.quantity;
      return [
        `${index + 1}. ${item.productName}`,
        `   SKU: ${item.productSku}`,
        `   Quantity: ${item.quantity}`,
        `   Unit Price: ${formatINR(item.price)}`,
        `   Line Total: ${formatINR(lineTotal)}`,
      ].join('\n');
    })
    .join('\n\n');

  const addressLines = [
    address.fullName,
    address.addressLine1,
    address.addressLine2 || null,
    `${address.city}, ${address.state} - ${address.pincode}`,
    `Phone: ${address.phone}`,
  ]
    .filter(Boolean)
    .join('\n');

  const { shippingCost, total } = computeTotals(cart, shipping);

  return [
    'Namaste,',
    '',
    'I would like to place the following order with Bhavita Textiles. Please confirm availability, dispatch timeline and share the payment link at your earliest convenience.',
    '',
    `Order Reference: ${orderRef}`,
    `Date: ${today}`,
    '',
    '--- ORDER ITEMS ---',
    itemLines,
    '',
    '--- ORDER SUMMARY ---',
    `Subtotal: ${formatINR(cart.subtotal)}`,
    `Shipping (${shipping.label} · ${shipping.eta}): ${formatINR(shippingCost)}`,
    `Tax: ${formatINR(cart.tax)}`,
    `Grand Total: ${formatINR(total)}`,
    '',
    '--- DELIVERY ADDRESS ---',
    addressLines,
    '',
    'Kindly acknowledge this request and share next steps.',
    '',
    'Thank you,',
    address.fullName,
  ].join('\n');
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

  const { shippingCost, total } = useMemo(
    () => computeTotals(cart, shipping),
    [cart, shipping],
  );

  const whatsappMessage = useMemo(
    () => (whatsappMode ? buildWhatsAppMessage(cart, address, shipping) : ''),
    [whatsappMode, cart, address, shipping],
  );

  const handlePrimary = () => {
    if (whatsappMode) {
      setConfirming(true);
    } else {
      onPay();
    }
  };

  const openWhatsApp = () => {
    const url = whatsappUrl(whatsappMessage);
    window.open(url, '_blank', 'noopener,noreferrer');
    setConfirming(false);
  };

  return (
    <section data-testid="checkout-review-step" className="grid gap-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">
          Step 3
        </p>
        <h2 className="mt-2 font-serif text-3xl text-ink">
          Review &amp; place order
        </h2>
        <p className="mt-2 text-sm text-ink-2">
          Please review your details below. Everything is locked to what you
          selected.
        </p>
      </header>

      {/* Shipping Address */}
      <article className="rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">
              Shipping address
            </p>
            <p className="mt-2 font-serif text-lg text-ink">{address.fullName}</p>
            <p className="mt-1 text-sm leading-6 text-ink-2">
              {address.addressLine1}
              {address.addressLine2 ? <>, {address.addressLine2}</> : null}
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
      <article
        data-testid="checkout-review-shipping"
        className="rounded-xl border border-border bg-surface p-5 transition-shadow hover:shadow-sm"
      >
        <div className="flex items-start justify-between gap-4">
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
          <div className="text-right">
            <p
              data-testid="checkout-review-shipping-price"
              className="text-lg font-semibold text-ink"
            >
              ₹{shippingCost.toLocaleString('en-IN')}
            </p>
            <button
              type="button"
              data-testid="checkout-edit-shipping"
              onClick={onEditShipping}
              className="mt-1 text-xs uppercase tracking-wider2 text-gold hover:text-gold-2"
            >
              Edit
            </button>
          </div>
        </div>
      </article>

      {/* Items */}
      <article className="rounded-xl border border-border bg-surface p-5">
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">
          Items ({cart.items.length})
        </p>
        <ul className="mt-3 divide-y divide-border text-sm">
          {cart.items.map((item) => (
            <li key={item.id} className="flex justify-between gap-4 py-3">
              <span className="text-ink">
                {item.productName}{' '}
                <span className="text-ink-2">× {item.quantity}</span>
              </span>
              <span className="text-ink">
                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
              </span>
            </li>
          ))}
        </ul>

        {/* Totals block with shipping */}
        <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-ink-2">Subtotal</dt>
            <dd
              data-testid="checkout-review-subtotal"
              className="text-ink"
            >
              ₹{cart.subtotal.toLocaleString('en-IN')}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-ink-2">
              Shipping ·{' '}
              <span className="text-[11px] uppercase tracking-wider2 text-gold">
                {shipping.label}
              </span>
            </dt>
            <dd
              data-testid="checkout-review-shipping-line"
              className="text-ink"
            >
              ₹{shippingCost.toLocaleString('en-IN')}
            </dd>
          </div>
          {cart.tax > 0 ? (
            <div className="flex justify-between">
              <dt className="text-ink-2">Tax</dt>
              <dd className="text-ink">
                ₹{cart.tax.toLocaleString('en-IN')}
              </dd>
            </div>
          ) : null}
          <div className="mt-2 flex items-baseline justify-between border-t border-border pt-3">
            <dt className="font-serif text-lg text-ink">Grand total</dt>
            <dd
              data-testid="checkout-review-total"
              className="font-serif text-xl text-ink"
            >
              ₹{total.toLocaleString('en-IN')}
            </dd>
          </div>
        </dl>
      </article>

      {/* Shipping selection info banner */}
      <div
        data-testid="checkout-review-shipping-notice"
        className="rounded-lg border border-gold/30 bg-gold-soft/40 p-4 text-xs leading-5 text-ink"
      >
        <p className="font-semibold uppercase tracking-wider2 text-gold">
          Delivery selected
        </p>
        <p className="mt-1 text-ink-2">
          You picked{' '}
          <span className="font-semibold text-ink">{shipping.label}</span> (
          {shipping.eta}). Shipping of{' '}
          <span className="font-semibold text-ink">
            ₹{shippingCost.toLocaleString('en-IN')}
          </span>{' '}
          has been added to your grand total above.
        </p>
      </div>

      {/* Primary Action Button */}
      <button
        type="button"
        data-testid="checkout-pay-button"
        onClick={handlePrimary}
        disabled={busy}
        className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg transition-all hover:bg-gold hover:text-ink hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Preparing request…
          </>
        ) : whatsappMode ? (
          'Confirm'
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
          On confirming, you will see the formatted order message and can send
          it directly to Bhavita Textiles on WhatsApp.
        </p>
      ) : null}

      {/* Terms */}
      <p className="text-[11px] uppercase tracking-wider2 text-ink-2">
        By continuing you agree to our{' '}
        <a href="/terms" className="text-gold hover:text-gold-2">
          Terms
        </a>{' '}
        and{' '}
        <a href="/privacy" className="text-gold hover:text-gold-2">
          Privacy Policy
        </a>
        .
      </p>

      {/* Confirmation Preview Modal */}
      {confirming ? (
        <div
          data-testid="checkout-whatsapp-confirm-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="whatsapp-confirm-title"
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink/60 p-4 backdrop-blur-sm sm:items-center"
          onClick={(event) => {
            if (event.target === event.currentTarget) setConfirming(false);
          }}
        >
          <div className="scale-in w-full max-w-lg rounded-2xl border border-border bg-surface shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-border p-5">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-wider2 text-gold">
                  Final review
                </p>
                <h3
                  id="whatsapp-confirm-title"
                  className="mt-1 font-serif text-2xl text-ink"
                >
                  Confirm your order message
                </h3>
                <p className="mt-1 text-xs text-ink-2">
                  This exact message will be sent to Bhavita Textiles on
                  WhatsApp.
                </p>
              </div>
              <button
                type="button"
                data-testid="checkout-whatsapp-close"
                onClick={() => setConfirming(false)}
                aria-label="Close preview"
                className="rounded-full border border-border p-1.5 text-ink-2 transition-colors hover:border-gold hover:text-ink"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[50vh] overflow-y-auto p-5">
              <pre
                data-testid="checkout-whatsapp-preview"
                className="whitespace-pre-wrap break-words rounded-lg border border-border bg-bg p-4 text-[12px] leading-6 text-ink"
              >
                {whatsappMessage}
              </pre>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-border p-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                data-testid="checkout-whatsapp-cancel"
                onClick={() => setConfirming(false)}
                className="inline-flex h-11 items-center justify-center rounded-full border border-border px-5 text-xs font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-gold"
              >
                Cancel
              </button>
              <button
                type="button"
                data-testid="checkout-whatsapp-send"
                onClick={openWhatsApp}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#1f9d58] px-6 text-xs font-semibold uppercase tracking-wider2 text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#18834a] hover:shadow-lg"
              >
                <MessageCircle size={16} />
                Place Order Via WhatsApp
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
