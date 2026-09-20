'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/common/Container';

const EDITORIAL_IMAGE = '/images/editorial/handloom-heritage.svg';
const ARTISAN_IMAGE = '/images/editorial/premium-cotton.svg';

interface CraftPillar {
  title: string;
  body: string;
}

const PILLARS: CraftPillar[] = [
  {
    title: 'Bedding Sets',
    body: 'Comforters, double bedsheets, cushions and pillow covers in supplied set combinations.',
  },
  {
    title: 'Weight-Based Bedding',
    body: 'Gulliver Super Soft, Mink Blanket and Mink Cloudy are available from 1.3 kg to 8 kg.',
  },
  {
    title: 'Towel Grades',
    body: 'A Grade and B+ Grade towels with GST-included per-piece prices.',
  },
];

export default function HandloomHeritage() {
  const [heroError, setHeroError] = useState(false);
  const [artisanError, setArtisanError] = useState(false);

  return (
    <section
      data-testid="handloom-heritage"
      className="relative overflow-hidden bg-bg py-20 md:py-28"
    >
      {/* gold hairline top + bottom */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gold/30" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gold/30" />

      <Container>
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {/* Editorial copy column */}
          <div className="lg:col-span-5 lg:pt-12">
            <p
              data-testid="handloom-heritage-eyebrow"
              className="text-[11px] font-semibold uppercase tracking-wider2 text-gold"
            >
              Handloom Heritage
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-ink md:text-5xl lg:text-6xl">
              Woven by hand.
              <br />
              Worn by memory.
            </h2>

            <span aria-hidden className="mt-7 block h-px w-16 bg-gold" />

            <p className="mt-7 max-w-md text-[15px] leading-relaxed text-ink-2">
              Explore the supplied bedding, weight-based bedding and towel catalogue in one place.
              Prices, units, sizes, available weights, bed types and GST treatment are shown as
              provided.
            </p>

            <Link
              href="/shop/handloom-heritage"
              data-testid="handloom-heritage-cta"
              className="group mt-8 inline-flex h-12 items-center gap-2 rounded-full border border-ink/15 bg-ink px-7 text-[12px] font-semibold uppercase tracking-wider2 text-bg transition-colors duration-200 hover:bg-ink/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              Explore the heritage edit
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Asymmetric image stack */}
          <div className="relative lg:col-span-7">
            <div className="grid grid-cols-12 gap-4 md:gap-6">
              {/* Tall hero image */}
              <div className="col-span-12 sm:col-span-7">
                <div className="relative aspect-[3/4] overflow-hidden rounded-md border border-gold/20 bg-surface">
                  <Image
                    src={heroError ? EDITORIAL_IMAGE : EDITORIAL_IMAGE}
                    onError={() => setHeroError(true)}
                    alt="Bedding and towel catalogue"
                    fill
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    className="object-cover"
                  />
                  <span
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent"
                  />
                </div>
              </div>

              {/* Stacked smaller image + quote card */}
              <div className="col-span-12 flex flex-col gap-4 sm:col-span-5 md:gap-6">
                <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-gold/20 bg-surface sm:mt-8">
                  <Image
                    src={artisanError ? EDITORIAL_IMAGE : ARTISAN_IMAGE}
                    onError={() => setArtisanError(true)}
                    alt="Bedding and towel products"
                    fill
                    sizes="(min-width: 1024px) 25vw, 50vw"
                    className="object-cover"
                  />
                </div>

                <figure className="rounded-md border border-gold/30 bg-bg p-5 shadow-sm">
                  <blockquote className="font-serif text-lg leading-snug text-ink">
                    “Product details and pricing shown as supplied.”
                  </blockquote>
                  <figcaption className="mt-3 text-[11px] font-semibold uppercase tracking-wider2 text-gold-2">
                    Bhavita Textiles catalogue
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        </div>

        {/* Craft pillars */}
        <ul
          data-testid="handloom-heritage-pillars"
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-gold/30 bg-gold/30 md:grid-cols-3"
        >
          {PILLARS.map((pillar) => (
            <li key={pillar.title} className="bg-bg p-6 md:p-8">
              <h3 className="font-serif text-xl text-ink md:text-2xl">{pillar.title}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-ink-2">{pillar.body}</p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
