'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useBanners } from '@/hooks/useBanners';
import type { Banner } from '@/types/Banner';

const FALLBACK_IMAGE = '/images/editorial/handloom-heritage.svg';
const FALLBACK_BANNERS: Banner[] = [{ id: -1, title: "Eight years of loom-woven trust, shipped in bulk.", subtitle: 'Panipat · India’s Home-Textile Capital', imageUrl: FALLBACK_IMAGE, linkUrl: '/shop', placement: 'home_hero', sortOrder: 1, isActive: true, createdAt: '', updatedAt: '' }];

export default function HeroCarousel() {
  const { data, isLoading, isError } = useBanners('home_hero');
  const slides = useMemo(() => (data?.length ? data : isLoading && !isError ? [] : FALLBACK_BANNERS), [data, isError, isLoading]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = slides.length;
  const go = useCallback((next: number) => total && setIndex(((next % total) + total) % total), [total]);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  useEffect(() => { if (paused || total < 2) return; timer.current = setInterval(() => setIndex((current) => (current + 1) % total), 6500); return () => { if (timer.current) clearInterval(timer.current); }; }, [paused, total]);

  if (isLoading && !data) return <div data-testid="hero-skeleton" className="min-h-[600px] animate-pulse bg-surface-2" />;
  return <section data-testid="hero-carousel" aria-label="Featured collections" tabIndex={0} onKeyDown={(event) => { if (event.key === 'ArrowLeft') go(index - 1); if (event.key === 'ArrowRight') go(index + 1); }} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} className="relative min-h-[600px] overflow-hidden bg-navy text-bg md:min-h-[700px] lg:min-h-[calc(100vh-88px)]">
    {slides.map((banner, slideIndex) => <div key={banner.id} data-testid={`hero-slide-${banner.id}`} aria-hidden={slideIndex !== index} className={cn('absolute inset-0 transition-opacity duration-700', slideIndex === index ? 'opacity-100' : 'pointer-events-none opacity-0')}>
      <Image src={banner.imageUrl || FALLBACK_IMAGE} alt={banner.title} fill priority={slideIndex === 0} sizes="100vw" className="object-cover opacity-75" onError={(event) => { event.currentTarget.src = FALLBACK_IMAGE; }} />
      <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/60 to-navy/10" />
    </div>)}
    <div className="relative z-10 mx-auto flex min-h-[600px] max-w-[1440px] items-end px-6 pb-20 sm:px-10 md:min-h-[700px] md:items-center md:pb-0 lg:px-16">
      <div className="max-w-3xl"><p className="mb-5 text-[11px] font-bold uppercase tracking-[0.24em] text-gold">{slides[index]?.subtitle || 'Panipat · India’s Home-Textile Capital'}</p><h1 data-testid="hero-heading" className="max-w-3xl font-serif text-5xl leading-[0.94] text-bg sm:text-6xl lg:text-8xl">{slides[index]?.title || 'Eight years of loom-woven trust, shipped in bulk.'}</h1><p className="mt-7 max-w-xl text-sm leading-7 text-bg/75 sm:text-base">A family-run manufacturer of printed bedsheets, mink blankets and floor mats — built for hospitality chains, export houses and corporate gifting programs.</p><div className="mt-9 flex flex-wrap gap-3"><Link href="/shop" data-testid="hero-catalogue-link" className="group inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-ink transition-transform hover:-translate-y-0.5 hover:bg-gold-2">View Full Catalogue <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></Link><Link href="/wholesale" data-testid="hero-quote-link" className="inline-flex items-center rounded-full border border-bg/40 px-6 py-3.5 text-[11px] font-bold uppercase tracking-[0.16em] text-bg transition-colors hover:border-gold hover:text-gold">Request Bulk Quote</Link></div></div>
    </div>
    <div className="absolute bottom-7 left-6 right-6 z-10 flex items-center justify-between border-t border-bg/20 pt-4 text-bg/70 sm:left-10 sm:right-10 lg:left-16 lg:right-16"><div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-semibold uppercase tracking-[0.16em]"><span>8+ Years in Panipat</span><span>50K Units / month</span><span>12+ Export markets</span></div>{total > 1 && <div className="flex gap-2"><button type="button" data-testid="hero-prev-btn" aria-label="Previous slide" onClick={() => go(index - 1)}><ChevronLeft size={18} /></button><button type="button" data-testid="hero-next-btn" aria-label="Next slide" onClick={() => go(index + 1)}><ChevronRight size={18} /></button></div>}</div>
  </section>;
}