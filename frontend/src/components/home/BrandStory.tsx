'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/common/Container';

const STORY_IMAGE = '/images/editorial/royal-collection.svg';

interface Milestone {
  year: string;
  title: string;
  body: string;
}

const MILESTONES: Milestone[] = [
  {
    year: '1972',
    title: 'A loom in Jaipur',
    body: 'Founded by Pt. Bhavita Sharma — three pit looms, one obsession with weft and warp.',
  },
  {
    year: '1998',
    title: 'Across India',
    body: 'Hand-printed Sanganeri reaches a hundred homes across Mumbai and Delhi.',
  },
  {
    year: '2026',
    title: 'Heritage online',
    body: 'The atelier opens its doors to the world — every piece still signed by hand.',
  },
];

export default function BrandStory() {
  const [imageError, setImageError] = useState(false);

  return (
    <section data-testid="brand-story" className="py-20 md:py-28">
      <Container>
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Editorial image with overlapping gold frame */}
          <div className="relative lg:col-span-6">
            <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
              <Image
                src={STORY_IMAGE}
                onError={() => setImageError(true)}
                alt="Bhavita Sharma — founder — at the original Jaipur atelier"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover"
                style={imageError ? { display: 'none' } : undefined}
              />
              <span
                aria-hidden
                className="absolute inset-0 bg-gradient-to-tr from-ink/35 via-transparent to-transparent"
              />
            </div>
            <span
              aria-hidden
              className="pointer-events-none absolute -bottom-5 -right-5 hidden h-24 w-24 border-b-2 border-r-2 border-gold lg:block"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute -left-5 -top-5 hidden h-24 w-24 border-l-2 border-t-2 border-gold lg:block"
            />
          </div>

          {/* Story copy */}
          <div className="lg:col-span-6">
            <p className="text-[11px] font-semibold uppercase tracking-wider2 text-gold">
              Our Story
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-ink md:text-5xl lg:text-6xl">
              From a single loom in Jaipur,
              <br />
              to your dining table.
            </h2>

            <span aria-hidden className="mt-7 block h-px w-16 bg-gold" />

            <p className="mt-7 max-w-xl text-[15px] leading-relaxed text-ink-2">
              Three generations. Forty-seven master artisans. One unchanged philosophy —
              that a textile is more than a thing you use; it is a quiet keeper of memory.
              Each Bhavita piece is finished by hand, stamped with the weaver&apos;s name and
              sent home with a story.
            </p>

            <figure className="mt-8 border-l-2 border-gold pl-5">
              <blockquote className="font-serif text-xl italic leading-snug text-ink md:text-2xl">
                “We don&apos;t make textiles. We pass on a way of seeing the world —
                slowly, with our hands.”
              </blockquote>
              <figcaption className="mt-3 text-[11px] font-semibold uppercase tracking-wider2 text-gold-2">
                Bhavita Sharma · Founder
              </figcaption>
            </figure>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/about"
                data-testid="brand-story-cta"
                className="group inline-flex h-12 items-center gap-2 rounded-full bg-gold px-7 text-[12px] font-semibold uppercase tracking-wider2 text-ink transition-colors duration-200 hover:bg-gold-2 hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                Read the full story
                <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="/shop/handloom-heritage"
                className="inline-flex h-12 items-center gap-2 rounded-full border border-ink/15 px-7 text-[12px] font-semibold uppercase tracking-wider2 text-ink transition-colors duration-200 hover:bg-ink hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                See the craft
              </Link>
            </div>
          </div>
        </div>

        <ol
          data-testid="brand-story-timeline"
          className="mt-16 grid grid-cols-1 gap-px overflow-hidden rounded-md border border-gold/30 bg-gold/30 md:grid-cols-3"
        >
          {MILESTONES.map((m) => (
            <li key={m.year} className="bg-bg p-6 md:p-8">
              <p className="font-serif text-3xl text-gold-2 md:text-4xl">{m.year}</p>
              <h3 className="mt-2 font-serif text-xl text-ink">{m.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{m.body}</p>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
