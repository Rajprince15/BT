'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Maximize2 } from 'lucide-react';
import type { ProductImage } from '@/types/ProductImage';

const FALLBACK = '/images/editorial/premium-cotton.svg';

export default function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const [failed, setFailed] = useState(false);
  const current = images[active] ?? images[0];
  const source = failed ? FALLBACK : current?.imageUrl ?? FALLBACK;

  return (
    <div data-testid="product-gallery" className="grid gap-3 sm:grid-cols-[76px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
        {(images.length ? images : [{ id: 0, productId: 0, imageUrl: FALLBACK, sortOrder: 0, createdAt: '' }]).map((image, index) => (
          <button
            key={image.id}
            type="button"
            data-testid={`product-gallery-thumbnail-${index}`}
            aria-label={`View ${name} image ${index + 1}`}
            onClick={() => { setActive(index); setFailed(false); }}
            className={`relative size-16 shrink-0 overflow-hidden rounded border ${active === index ? 'border-gold ring-1 ring-gold' : 'border-border'}`}
          >
            <Image src={image.imageUrl || FALLBACK} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
      <div className="group relative order-1 aspect-[4/5] overflow-hidden rounded-md bg-surface-2 sm:order-2">
        <Image src={source} alt={current?.altText ?? name} fill priority sizes="(min-width: 1024px) 45vw, 100vw" onError={() => setFailed(true)} className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
        <button type="button" data-testid="product-gallery-expand" aria-label="Expand product image" className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-bg/85 text-ink shadow-sm backdrop-blur-sm hover:text-gold">
          <Maximize2 className="size-4" />
        </button>
      </div>
    </div>
  );
}