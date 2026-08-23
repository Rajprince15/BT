'use client';

import { useMemo, useState } from 'react';
import { Copy, Mail, MessageCircleMore, Share2 } from 'lucide-react';
import { toast } from 'sonner';
import env from '@/lib/env';
import type { Product } from '@/types/Product';

function shareUrl(productSlug: string) {
  return `${env.NEXT_PUBLIC_APP_URL}/product/${productSlug}`;
}

export default function ProductShare({ product }: { product: Product }) {
  const [copied, setCopied] = useState(false);
  const url = useMemo(() => shareUrl(product.slug), [product.slug]);
  const text = `${product.name} · Bhavita Textiles`;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied');
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error('Copy failed. Please try again.');
    }
  };

  return (
    <div data-testid="product-share-actions" className="mt-8 border-t border-border pt-6">
      <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider2 text-gold">
        <Share2 className="size-4" />
        Share this piece
      </div>
      <div className="mt-4 flex flex-wrap gap-3">
        <a
          data-testid="product-share-whatsapp"
          href={`https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-[12px] font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-gold hover:text-gold"
        >
          <MessageCircleMore className="size-4" />
          WhatsApp
        </a>

        <button
          type="button"
          data-testid="product-share-copy"
          onClick={copyLink}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-[12px] font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-gold hover:text-gold"
        >
          <Copy className="size-4" />
          {copied ? 'Copied' : 'Copy link'}
        </button>

        <a
          data-testid="product-share-email"
          href={`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`}
          className="inline-flex h-11 items-center gap-2 rounded-full border border-border px-4 text-[12px] font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-gold hover:text-gold"
        >
          <Mail className="size-4" />
          Email
        </a>
      </div>
    </div>
  );
}
