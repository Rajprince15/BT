import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import type { CartItem } from '@/types/CartItem';

interface Props {
  item: CartItem;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartLineItem({ item, onQuantity, onRemove }: Props) {
  const href = item.productSlug ? `/product/${item.productSlug}` : '/shop';

  return (
    <article
      data-testid={`cart-item-${item.id}`}
      className="grid grid-cols-[88px_1fr] gap-4 py-5 sm:grid-cols-[132px_1fr_auto] sm:gap-6 sm:py-6"
    >
      <Link
        href={href}
        data-testid={`cart-item-image-link-${item.id}`}
        aria-label={`View ${item.productName}`}
        className="group relative aspect-[4/5] overflow-hidden rounded-md bg-surface-2 shadow-sm ring-1 ring-border transition-all duration-300 hover:ring-brand/50"
      >
        <Image
          src={item.imageUrl || '/images/editorial/premium-cotton.svg'}
          alt={`${item.productName} textile`}
          fill
          sizes="(min-width: 640px) 132px, 88px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
        />
      </Link>

      <div className="min-w-0">
        <Link href={href} data-testid={`cart-item-name-link-${item.id}`}>
          <h2
            data-testid={`cart-item-name-${item.id}`}
            className="font-serif text-base leading-tight text-ink transition-colors hover:text-brand sm:text-lg"
          >
            {item.productName}
          </h2>
        </Link>

        <p
          data-testid={`cart-item-variant-${item.id}`}
          className="mt-1.5 text-[11px] uppercase tracking-[.14em] text-ink-2"
        >
          {item.productSku}
        </p>

        <span className="mt-2.5 inline-flex rounded-full bg-brand-soft px-2.5 py-0.5 text-[9px] font-semibold uppercase tracking-[.14em] text-brand">
          Made to order
        </span>

        {/* Mobile price row */}
        <div className="mt-3 flex items-baseline gap-2 sm:hidden">
          <p
            data-testid={`cart-item-total-mobile-${item.id}`}
            className="font-serif text-lg text-ink"
          >
            ₹{(item.price * item.quantity).toLocaleString('en-IN')}
          </p>
          <p className="text-[11px] text-ink-2">
            ₹{item.price.toLocaleString('en-IN')} each
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 sm:mt-5">
          <div
            data-testid={`cart-item-quantity-control-${item.id}`}
            className="flex h-10 items-center overflow-hidden rounded-full border border-border bg-surface"
          >
            <button
              type="button"
              data-testid={`cart-item-qty-dec-${item.id}`}
              aria-label="Decrease quantity"
              onClick={() => onQuantity(Math.max(1, item.quantity - 1))}
              className="inline-flex size-10 items-center justify-center text-ink-2 transition-colors hover:bg-bg hover:text-brand"
            >
              <Minus className="size-3.5" />
            </button>
            <span
              data-testid={`cart-item-quantity-${item.id}`}
              className="w-8 text-center text-sm font-semibold text-ink"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              data-testid={`cart-item-qty-inc-${item.id}`}
              aria-label="Increase quantity"
              onClick={() => onQuantity(item.quantity + 1)}
              className="inline-flex size-10 items-center justify-center text-ink-2 transition-colors hover:bg-bg hover:text-brand"
            >
              <Plus className="size-3.5" />
            </button>
          </div>

          <button
            type="button"
            data-testid="cart-item-remove"
            onClick={onRemove}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[.16em] text-ink-2 transition-colors hover:text-brand"
          >
            <Trash2 className="size-3" /> Remove
          </button>
        </div>
      </div>

      <div className="hidden text-right sm:block">
        <p
          data-testid={`cart-item-total-${item.id}`}
          className="font-serif text-xl text-ink"
        >
          ₹{(item.price * item.quantity).toLocaleString('en-IN')}
        </p>
        <p className="mt-1 text-xs text-ink-2">
          ₹{item.price.toLocaleString('en-IN')} each
        </p>
      </div>
    </article>
  );
}