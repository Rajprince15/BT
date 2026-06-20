'use client';

import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import EmptyState from '@/components/common/EmptyState';
import { useTestimonials } from '@/hooks/useReviews';
import type { Testimonial } from '@/services/review.service';
import { cn } from '@/lib/utils';

const AUTOPLAY_MS = 7000;

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

function chunk<T>(items: T[], size: number): T[][] {
  if (items.length === 0) return [];
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

function StarRow({ rating }: { rating: number }) {
  const rounded = Math.max(0, Math.min(5, Math.round(rating)));
  return (
    <div
      aria-label={`${rounded} out of 5 stars`}
      role="img"
      className="flex items-center gap-1"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          aria-hidden
          className={cn(
            'size-4',
            i < rounded ? 'fill-gold text-gold' : 'fill-transparent text-gold/30',
          )}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <article
      data-testid={`testimonial-${testimonial.id}`}
      className="flex h-full flex-col gap-4 rounded-md border border-border bg-bg p-7 shadow-sm transition-shadow duration-300 hover:shadow-md md:p-8"
    >
      <Quote aria-hidden className="size-7 text-gold" />

      <StarRow rating={testimonial.rating} />

      {testimonial.title ? (
        <h3 className="font-serif text-lg leading-snug text-ink md:text-xl">
          {testimonial.title}
        </h3>
      ) : null}

      {testimonial.review ? (
        <p className="text-[14px] leading-relaxed text-ink-2">
          &ldquo;{testimonial.review}&rdquo;
        </p>
      ) : null}

      <div className="mt-auto border-t border-border pt-4">
        <p className="text-sm font-semibold text-ink">{testimonial.authorName}</p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider2 text-gold-2">
          {testimonial.productName
            ? `On · ${testimonial.productName}`
            : testimonial.authorRole ?? 'Verified buyer'}
        </p>
      </div>
    </article>
  );
}

function TestimonialSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="h-64 animate-pulse rounded-md border border-border bg-surface-2"
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { data, isLoading, isError, refetch } = useTestimonials(9);
  const reducedMotion = usePrefersReducedMotion();
  const [perView, setPerView] = useState(1);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  // Responsive perView: 1 (mobile) / 2 (md) / 3 (lg)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const compute = () => {
      const w = window.innerWidth;
      if (w >= 1024) return 3;
      if (w >= 768) return 2;
      return 1;
    };
    const apply = () => setPerView(compute());
    apply();
    window.addEventListener('resize', apply);
    return () => window.removeEventListener('resize', apply);
  }, []);

  const pages = useMemo(() => chunk(data ?? [], perView), [data, perView]);
  const totalPages = pages.length;

  // Clamp index when perView changes
  useEffect(() => {
    if (index >= totalPages) setIndex(0);
  }, [totalPages, index]);

  const go = useCallback(
    (next: number) => {
      if (totalPages === 0) return;
      setIndex(((next % totalPages) + totalPages) % totalPages);
    },
    [totalPages],
  );

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => {
    if (reducedMotion || paused || totalPages <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % totalPages);
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, reducedMotion, totalPages]);

  return (
    <section
      data-testid="testimonials"
      className="bg-surface/40 py-20 md:py-28"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
    >
      <Container>
        <SectionHeading
          eyebrow="In Their Words"
          title="Patrons of the Atelier"
          description="A note of gratitude to the families who let our craft into their homes."
          align="center"
        />

        <div className="mt-12">
          {isLoading ? <TestimonialSkeleton /> : null}

          {!isLoading && isError ? (
            <EmptyState
              tone="error"
              title="Couldn’t load reviews"
              description="Please retry — kind words will reappear shortly."
              action={{ label: 'Retry', onClick: () => refetch() }}
            />
          ) : null}

          {!isLoading && !isError && totalPages > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-700 ease-out motion-reduce:transition-none"
                  style={{ transform: `translateX(-${index * 100}%)` }}
                  aria-live="polite"
                >
                  {pages.map((page, pageIdx) => (
                    <div
                      key={pageIdx}
                      className="grid w-full shrink-0 grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8"
                      aria-hidden={pageIdx !== index}
                    >
                      {page.map((testimonial) => (
                        <TestimonialCard
                          key={testimonial.id}
                          testimonial={testimonial}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {totalPages > 1 ? (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => go(index - 1)}
                    aria-label="Previous testimonials"
                    data-testid="testimonials-prev"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 bg-bg text-ink transition-colors duration-200 hover:bg-ink hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <ChevronLeft className="size-5" />
                  </button>

                  <div role="tablist" aria-label="Testimonial pages" className="flex items-center gap-2">
                    {pages.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        role="tab"
                        aria-selected={i === index}
                        aria-label={`Go to testimonial page ${i + 1}`}
                        data-testid={`testimonials-dot-${i}`}
                        onClick={() => go(i)}
                        className={cn(
                          'h-1.5 rounded-full transition-all duration-300 ease-out',
                          i === index ? 'w-8 bg-gold' : 'w-4 bg-ink/15 hover:bg-ink/30',
                        )}
                      />
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => go(index + 1)}
                    aria-label="Next testimonials"
                    data-testid="testimonials-next"
                    className="inline-flex size-11 items-center justify-center rounded-full border border-ink/15 bg-bg text-ink transition-colors duration-200 hover:bg-ink hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : null}

          {!isLoading && !isError && totalPages === 0 ? (
            <EmptyState
              title="No reviews yet"
              description="As soon as our patrons share their experience, they’ll appear here."
            />
          ) : null}
        </div>

        <p className="mt-10 text-center text-[13px] text-ink-2">
          Have a piece from us?{' '}
          <Link
            href="/account/reviews"
            className="font-semibold text-gold-2 underline-offset-4 hover:underline"
          >
            Share your story
          </Link>
          .
        </p>
      </Container>
    </section>
  );
}
