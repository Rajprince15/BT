'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBanners } from '@/hooks/useBanners';
import type { Banner } from '@/types/Banner';

const HERO_FALLBACK_IMAGE = '/images/editorial/handloom-heritage.svg';
const AUTOPLAY_MS = 6000;

const FALLBACK_BANNERS: Banner[] = [
  {
    id: -1,
    title: 'Heritage Reimagined',
    subtitle: 'Handloom-woven luxury for every Indian home.',
    imageUrl: HERO_FALLBACK_IMAGE,
    linkUrl: '/collections/handloom-heritage',
    placement: 'home_hero',
    sortOrder: 1,
    isActive: true,
    createdAt: '',
    updatedAt: '',
  },
];

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mql.matches);
    const handler = (event: MediaQueryListEvent) => setReduced(event.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);
  return reduced;
}

function HeroSkeleton() {
  return (
    <div
      data-testid="hero-skeleton"
      className="relative min-h-[480px] w-full animate-pulse overflow-hidden bg-gradient-to-br from-surface-2 via-bg to-gold-soft md:min-h-[640px]"
    />
  );
}

interface HeroSlideProps {
  banner: Banner;
  active: boolean;
  priority: boolean;
}

function HeroSlide({ banner, active, priority }: HeroSlideProps) {
  const [imgError, setImgError] = useState(false);
  const href = banner.linkUrl ?? '/shop';

  return (
    <div
      data-testid={`hero-slide-${banner.id}`}
      aria-hidden={!active}
      className={cn(
        'absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none',
        active ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
      )}
    >
      <Image
        src={imgError ? HERO_FALLBACK_IMAGE : banner.imageUrl}
        alt={banner.title}
        fill
        sizes="100vw"
        priority={priority}
        onError={() => setImgError(true)}
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-tr from-ink/80 via-ink/40 to-transparent" />

      <div className="absolute inset-0 flex items-end pb-16 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl">
            <p className="text-[12px] font-semibold uppercase tracking-wider2 text-gold">
              {banner.title}
            </p>
            {banner.subtitle ? (
              <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-bg md:text-6xl lg:text-7xl">
                {banner.subtitle}
              </h1>
            ) : null}
            <div className="mt-7">
              <Link
                href={href}
                data-testid={`hero-cta-${banner.id}`}
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-[12px] font-semibold uppercase tracking-wider2 text-ink transition-colors duration-200 hover:bg-gold-2 hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Discover
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroCarousel() {
  const { data, isLoading, isError } = useBanners('home_hero');
  const reducedMotion = usePrefersReducedMotion();

  const slides = useMemo<Banner[]>(() => {
    if (data && data.length > 0) return data;
    if (isError || !isLoading) return FALLBACK_BANNERS;
    return [];
  }, [data, isError, isLoading]);

  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;

  const go = useCallback(
    (next: number) => {
      if (total === 0) return;
      setIndex(((next % total) + total) % total);
    },
    [total],
  );

  // Autoplay
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (reducedMotion || paused || total <= 1) {
      return;
    }
    timerRef.current = setInterval(() => {
      setIndex((current) => (current + 1) % total);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, total]);

  // Pause when page hidden
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  const onKey = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        go(index - 1);
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        go(index + 1);
      }
    },
    [go, index],
  );

  if (isLoading && !data) {
    return <HeroSkeleton />;
  }

  return (
    <section
      data-testid="hero-carousel"
      aria-roledescription="carousel"
      aria-label="Featured collections"
      tabIndex={0}
      onKeyDown={onKey}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative min-h-[480px] w-full overflow-hidden bg-ink text-bg md:min-h-[640px] lg:min-h-[720px]"
    >
      {slides.map((banner, i) => (
        <HeroSlide
          key={banner.id}
          banner={banner}
          active={i === index}
          priority={i === 0}
        />
      ))}

      {total > 1 ? (
        <>
          <button
            type="button"
            aria-label="Previous slide"
            data-testid="hero-prev-btn"
            onClick={() => go(index - 1)}
            className="absolute left-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-bg/30 bg-ink/30 text-bg backdrop-blur-sm transition-colors duration-200 hover:bg-ink/60 md:inline-flex"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            aria-label="Next slide"
            data-testid="hero-next-btn"
            onClick={() => go(index + 1)}
            className="absolute right-4 top-1/2 z-10 hidden size-11 -translate-y-1/2 items-center justify-center rounded-full border border-bg/30 bg-ink/30 text-bg backdrop-blur-sm transition-colors duration-200 hover:bg-ink/60 md:inline-flex"
          >
            <ChevronRight className="size-5" />
          </button>

          <div
            role="tablist"
            aria-label="Slide indicators"
            className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2"
          >
            {slides.map((banner, i) => (
              <button
                key={banner.id}
                role="tab"
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={i === index}
                data-testid={`hero-dot-${i}`}
                onClick={() => go(i)}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300 ease-out',
                  i === index ? 'w-8 bg-gold' : 'w-4 bg-bg/40 hover:bg-bg/70',
                )}
              />
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
