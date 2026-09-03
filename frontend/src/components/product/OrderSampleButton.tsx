'use client';

import { MessageCircle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { whatsappUrl } from '@/components/layout/WhatsAppWidget';
import type { Product } from '@/types/Product';
import type { ProductVariant } from '@/types/ProductVariant';

interface OrderSampleButtonProps {
  product: Product;
  variant?: ProductVariant;
  quantity: number;
}

function buildSampleMessage(
  product: Product,
  variant: ProductVariant | undefined,
  quantity: number,
  productUrl: string,
) {
  const selectedVariant = variant
    ? [variant.color, variant.size].filter(Boolean).join(' · ')
    : 'Not selected';

  return [
    'Hello Bhavita Textiles team,',
    '',
    'I would like to order a sample for:',
    `- Product: ${product.name}`,
    `- SKU: ${product.sku}`,
    `- Colour / variant: ${selectedVariant}`,
    `- Specification / material: ${product.specification ?? 'Standard'}`,
    `- Size: ${variant?.size ?? product.sizeLabel ?? 'Standard'}`,
    `- Quantity requested: ${quantity}`,
    '',
    `Product link: ${productUrl}`,
    '',
    'Please share availability, sample cost, and dispatch timelines. Thank you!',
  ].join('\n');
}

export default function OrderSampleButton({
  product,
  variant,
  quantity,
}: OrderSampleButtonProps) {
  const [productUrl, setProductUrl] = useState('');

  useEffect(() => {
    setProductUrl(window.location.href);
  }, []);

  const message = useMemo(
    () => buildSampleMessage(product, variant, quantity, productUrl),
    [product, productUrl, quantity, variant],
  );

  return (
    <div data-testid="product-sample-order" className="mt-5 space-y-2.5">
      <a
        data-testid="product-order-sample-button"
        href={productUrl ? whatsappUrl(message) : '#'}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`Order a sample of ${product.name} on WhatsApp`}
        onClick={(event) => {
          if (!productUrl) {
            event.preventDefault();
          }
        }}
        className="group inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-[var(--whatsapp-green)]/30 bg-[var(--whatsapp-green)] px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-white shadow-sm transition-[background-color,box-shadow,transform] duration-300 hover:-translate-y-0.5 hover:bg-[var(--whatsapp-green-hover)] hover:shadow-[0_12px_28px_-12px_rgba(37,211,102,0.8)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--whatsapp-green)]"
      >
        <MessageCircle
          className="size-4 transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        />
        Order a Sample via WhatsApp
      </a>

      <p
        data-testid="product-sample-order-note"
        className="text-center text-[11px] leading-5 text-ink-2"
      >
        Opens a pre-filled draft with your current colour, size, quantity and
        product link.
      </p>
    </div>
  );
}