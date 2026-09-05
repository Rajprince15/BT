'use client';

import Image from 'next/image';
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type MouseEvent,
} from 'react';
import { ChevronLeft, ChevronRight, Maximize2, X, ZoomIn } from 'lucide-react';
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
  const [hoverZoom, setHoverZoom] = useState(false);
  const [hoverOrigin, setHoverOrigin] = useState({ x: 50, y: 50 });
  const [modalZoomed, setModalZoomed] = useState(false);
  const [modalOrigin, setModalOrigin] = useState({ x: 50, y: 50 });
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    setActive(0);
    setFailed(false);
  }, [galleryImages]);

  useEffect(() => {
    if (!expanded) setModalZoomed(false);
  }, [expanded]);

  const current = galleryImages[active] ?? galleryImages[0];
  const source = failed ? FALLBACK : current?.imageUrl ?? FALLBACK;

  const move = (next: number) => {
    const total = galleryImages.length;
    if (total <= 1) return;
    setActive(((next % total) + total) % total);
    setFailed(false);
    setModalZoomed(false);
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

  const handleHoverMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setHoverOrigin({ x, y });
  };

  const handleModalZoomMove = (event: MouseEvent<HTMLDivElement>) => {
    if (!modalZoomed) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setModalOrigin({ x, y });
  };

  return (
    <div
      data-testid="product-gallery"
      className="mx-auto grid w-full max-w-[560px] gap-3 sm:grid-cols-[72px_1fr] lg:mx-0 lg:max-w-none"
    >
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
              'relative size-16 shrink-0 overflow-hidden rounded border transition-colors sm:size-[72px]',
              active === index ? 'border-gold ring-1 ring-gold' : 'border-border',
            )}
          >
            <Image
              src={image.imageUrl || FALLBACK}
              alt={image.altText ?? `${name} image ${index + 1}`}
              fill
              sizes="72px"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <div
        data-testid="product-gallery-main"
        className="order-1 sm:order-2"
      >
        <div
          role="button"
          tabIndex={0}
          aria-label={`Open fullscreen gallery for ${name}`}
          onClick={() => setExpanded(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setExpanded(true);
            }
          }}
          onMouseEnter={() => setHoverZoom(true)}
          onMouseLeave={() => setHoverZoom(false)}
          onMouseMove={handleHoverMove}
          data-testid="product-gallery-expand"
          className={cn(
            'group relative aspect-[4/5] overflow-hidden rounded-md bg-surface-2 shadow-sm',
            hoverZoom ? 'cursor-zoom-in' : 'cursor-pointer',
          )}
        >
          <Image
            src={source}
            alt={current?.altText ?? name}
            fill
            priority
            sizes="(min-width: 1024px) 560px, 90vw"
            onError={() => setFailed(true)}
            style={{
              transformOrigin: `${hoverOrigin.x}% ${hoverOrigin.y}%`,
              transform: hoverZoom ? 'scale(1.8)' : 'scale(1)',
            }}
            className="object-cover transition-transform duration-300 ease-out"
          />
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/20 via-transparent to-transparent opacity-100 transition-opacity duration-300 group-hover:opacity-0"
          />
          <span
            className={cn(
              'pointer-events-none absolute right-3 top-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-bg/90 px-3 text-[10px] font-semibold uppercase tracking-wider2 text-ink shadow-sm backdrop-blur-sm transition-opacity duration-200',
              hoverZoom ? 'opacity-0' : 'opacity-100',
            )}
          >
            <ZoomIn className="size-3.5" />
            Hover to zoom
          </span>
          <span
            className={cn(
              'pointer-events-none absolute bottom-3 right-3 inline-flex h-8 items-center gap-1.5 rounded-full bg-bg/90 px-3 text-[10px] font-semibold uppercase tracking-wider2 text-ink shadow-sm backdrop-blur-sm transition-opacity duration-200',
              hoverZoom ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Maximize2 className="size-3.5" />
            Click for fullscreen
          </span>
        </div>
      </div>

      <Dialog open={expanded} onOpenChange={setExpanded}>
        <DialogContent
          showCloseButton={false}
          className="!w-[min(96vw,1080px)] !max-w-[min(96vw,1080px)] max-h-[calc(100vh-1.5rem)] overflow-hidden border border-border bg-bg !p-0 text-ink shadow-2xl sm:!max-w-[1080px]"
          data-testid="product-gallery-modal"
          onKeyDown={onKeyDown}
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>Fullscreen product gallery with zoom</DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wider2 text-gold">
              {active + 1} / {galleryImages.length}
            </p>
            <div className="flex items-center gap-3">
              <span className="hidden items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider2 text-ink-2 sm:inline-flex">
                <ZoomIn className="size-3.5" />
                {modalZoomed ? 'Click image to zoom out' : 'Click image to zoom in'}
              </span>
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
          </div>

          <div
            className="relative flex min-h-[58vh] items-center justify-center overflow-hidden bg-[var(--surface-2)] px-4 py-6"
            onTouchStart={(event) => onTouchStart(event.touches[0]?.clientX ?? 0)}
            onTouchEnd={(event) => onTouchEnd(event.changedTouches[0]?.clientX ?? 0)}
          >
            <button
              type="button"
              data-testid="product-gallery-modal-prev"
              aria-label="Previous image"
              onClick={() => move(active - 1)}
              className="absolute left-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-ink shadow-sm transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronLeft className="size-5" />
            </button>

            <div
              data-testid="product-gallery-zoom-area"
              onClick={() => setModalZoomed((value) => !value)}
              onMouseMove={handleModalZoomMove}
              onMouseLeave={() => setModalZoomed(false)}
              className={cn(
                'relative h-[64vh] w-full max-w-3xl overflow-hidden',
                modalZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in',
              )}
            >
              <Image
                src={source}
                alt={current?.altText ?? name}
                fill
                sizes="(min-width: 1024px) 70vw, 100vw"
                onError={() => setFailed(true)}
                style={{
                  transformOrigin: `${modalOrigin.x}% ${modalOrigin.y}%`,
                  transform: modalZoomed ? 'scale(2.4)' : 'scale(1)',
                }}
                className="object-contain transition-transform duration-200 ease-out"
              />
            </div>

            <button
              type="button"
              data-testid="product-gallery-modal-next"
              aria-label="Next image"
              onClick={() => move(active + 1)}
              className="absolute right-3 top-1/2 z-10 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-bg/90 text-ink shadow-sm transition-colors hover:border-gold hover:text-gold"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>

          <div className="border-t border-border px-4 py-4">
            <div className="flex justify-center gap-2 overflow-x-auto">
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