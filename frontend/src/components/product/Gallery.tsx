'use client';

import Image from 'next/image';
import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import type { ProductImage } from '@/types/ProductImage';

const FALLBACK = '/images/editorial/premium-cotton.svg';

function createFallbackImage(): ProductImage {
  return {
    id: 0,
    productId: 0,
    imageUrl: FALLBACK,
    altText: 'Bhavita Textiles editorial textile image',
    sortOrder: 0,
    createdAt: '',
  };
}

export default function Gallery({ images, name }: { images: ProductImage[]; name: string }) {
  const galleryImages = useMemo(
    () => (images.length > 0 ? images : [createFallbackImage()]),
    [images],
  );
  const [active, setActive] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [failed, setFailed] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActive(0);
    setFailed(false);
  }, [galleryImages]);

  const current = galleryImages[active] ?? galleryImages[0];
  const source = failed ? FALLBACK : current?.imageUrl ?? FALLBACK;

  const move = (next: number) => {
    const total = galleryImages.length;
    if (total <= 1) return;
    setActive(((next % total) + total) % total);
    setFailed(false);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (!expanded) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      move(active - 1);
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      move(active + 1);
    }
  };

  const onTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
  };

  const onTouchEnd = (clientX: number) => {
    if (touchStartX.current === null) return;
    const delta = clientX - touchStartX.current;
    if (Math.abs(delta) > 40) {
      move(delta < 0 ? active + 1 : active - 1);
    }
    touchStartX.current = null;
  };

  return (
    <div data-testid="product-gallery" className="grid gap-3 sm:grid-cols-[76px_1fr]">
      <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
        {galleryImages.map((image, index) => (
          <button
            key={image.id ?? `${image.imageUrl}-${index}`}
            type="button"
            data-testid={`product-gallery-thumbnail-${index}`}
            aria-label={`View ${name} image ${index + 1}`}
            onClick={() => {
              setActive(index);
              setFailed(false);
            }}
            className={cn(
              'relative size-16 shrink-0 overflow-hidden rounded border transition-colors',
              active === index ? 'border-gold ring-1 ring-gold' : 'border-border',
            )}
          >
            <Image
              src={image.imageUrl || FALLBACK}
              alt={image.altText ?? `${name} image ${index + 1}`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <button
        type="button"
        data-testid="product-gallery-expand"
        aria-label={`Open fullscreen gallery for ${name}`}
        onClick={() => setExpanded(true)}
        className="group relative order-1 aspect-[4/5] overflow-hidden rounded-md bg-surface-2 sm:order-2"
      >
        <Image
          src={source}
          alt={current?.altText ?? name}
          fill
          priority
          sizes="(min-width: 1024px) 45vw, 100vw"
          onError={() => setFailed(true)}
          className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
        />
        <span
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent"
        />
        <span className="absolute right-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-bg/85 text-ink shadow-sm backdrop-blur-sm transition-colors group-hover:text-gold">
          <Maximize2 className="size-4" />
        </span>
      </button>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          showCloseButton={false}
          className="max-h-[calc(100vh-1rem)] w-[min(96vw,1100px)] overflow-hidden border border-border bg-bg p-0 text-ink shadow-2xl"
          data-testid="product-gallery-modal"
          onKeyDown={onKeyDown}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>Fullscreen product gallery</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider2 text-gold">
              {active + 1} / {galleryImages.length}
            </p>
            <button
              type="button"
              data-testid="product-gallery-modal-close"
              aria-label="Close fullscreen gallery"
              onClick={() => setExpanded(false)}
              className="inline-flex size-10 items-center justify-center rounded-full border border-border text-ink-2 transition-colors hover:border-gold hover:text-gold"
            >
              <X className="size-4" />
            </button>
          </div>

          <div
            className="relative flex min-h-[60vh] items-center justify-center bg-[var(--surface-2)] px-4 py-6"
            onTouchStart={(event) => onTouchStart(event.touches[0]?.clientX ?? 0)}
            onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
          >
            <button
              type="button"
              data-testid="product-gallery-modal-prev"
              aria-label="Previous image"
              onClick={() => move(active - 1)}
              className="absolute left-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-ink transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div className="relative h-[62vh] w-full max-w-5xl">
              <Image
                src={source}
                alt={current?.altText ?? name}
                fill
                sizes="(min-width: 1024px) 80vw, 100vw"
                onError={() => setFailed(true)}
                className="object-contain"
              />
            </div>

            <button
              type="button"
              data-testid="product-gallery-modal-next"
              aria-label="Next image"
              onClick={() => move(active + 1)}
              className="absolute right-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-ink transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="border-t border-border px-4 py-4">
            <div className="flex gap-2 overflow-x-auto">
              {galleryImages.map((image, index) => (
                <button
                  key={`modal-${image.id ?? image.imageUrl}-${index}`}
                  type="button"
                  data-testid={`product-gallery-modal-thumbnail-${index}`}
                  aria-label={`Focus image ${index + 1}`}
                  onClick={() => move(index)}
                  className={cn(
                    'relative size-16 shrink-0 overflow-hidden rounded border transition-colors',
                    active === index ? 'border-gold ring-1 ring-gold' : 'border-border',
                  )}
                >
                  <Image
                    src={image.imageUrl || FALLBACK}
                    alt={image.altText ?? `${name} image ${index + 1}`}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
