'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Container from '@/components/common/Container';
import SectionHeading from '@/components/common/SectionHeading';
import { cn } from '@/lib/utils';

interface SeasonalEditCard {
  key: 'summer-collection' | 'winter-collection' | 'festive-collection' | 'wedding-collection';
  label: string;
  tagline: string;
  description: string;
  /** Gold-accent gradient — ink-based, never purple. */
  panelClassName: string;
  accentClassName: string;
}

const CARDS: SeasonalEditCard[] = [
  {
    key: 'summer-collection',
    label: 'Summer',
    tagline: 'Breeze-light cottons',
    description: 'Airy mulmul throws, pastel bedsheets and breathable bath linens.',
    panelClassName:
      'bg-[linear-gradient(155deg,#f5efe2_0%,#ece1c4_55%,#d9c79a_100%)] text-ink',
    accentClassName: 'bg-ink text-bg',
  },
  {
    key: 'winter-collection',
    label: 'Winter',
    tagline: 'Cashmere & velvet',
    description: 'Heavyweight razais, plush quilts and royal velvet drapes.',
    panelClassName:
      'bg-[linear-gradient(155deg,#101728_0%,#1a2238_55%,#2a3556_100%)] text-bg',
    accentClassName: 'bg-gold text-ink',
  },
  {
    key: 'festive-collection',
    label: 'Festive',
    tagline: 'Gold-threaded craft',
    description: 'Block-printed table linen, brocade cushions and Diwali decor.',
    panelClassName:
      'bg-[linear-gradient(155deg,#3a1414_0%,#5a1f1f_55%,#7d2e2e_100%)] text-bg',
    accentClassName: 'bg-gold text-ink',
  },
  {
    key: 'wedding-collection',
    label: 'Wedding',
    tagline: 'Trousseau heirlooms',
    description: 'Hand-embroidered bedding, dupion silk and ivory monogram sets.',
    panelClassName:
      'bg-[linear-gradient(155deg,#f3e8d4_0%,#e9d7b4_55%,#caa971_100%)] text-ink',
    accentClassName: 'bg-ink text-bg',
  },
];

export default function SeasonalEdit() {
  return (
    <section data-testid="seasonal-edit" className="py-20 md:py-28">
      <Container>
        <SectionHeading
          eyebrow="Edits of the Season"
          title="Seasonal Collections"
          description="Curated capsule edits — woven for the moment, made to last a lifetime."
          actionHref="/shop"
          actionLabel="Browse all"
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {CARDS.map((card, i) => (
            <Link
              key={card.key}
              href={`/collections/${card.key}`}
              data-testid={`seasonal-edit-${card.key}`}
              style={{ animationDelay: `${i * 70}ms` }}
              className={cn(
                'group fade-up relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-md border border-border/40 p-7 outline-none transition-transform duration-500 ease-out hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
                card.panelClassName,
              )}
            >
              <span
                aria-hidden
                className="text-[11px] font-semibold uppercase tracking-wider2 opacity-80"
              >
                {card.tagline}
              </span>

              <div>
                <h3 className="font-serif text-4xl leading-[1.05] md:text-5xl">{card.label}</h3>
                <p className="mt-3 max-w-[18ch] text-[14px] leading-relaxed opacity-85">
                  {card.description}
                </p>
                <span
                  className={cn(
                    'mt-7 inline-flex h-10 items-center gap-2 rounded-full px-5 text-[11px] font-semibold uppercase tracking-wider2 transition-transform duration-300 ease-out group-hover:translate-x-1',
                    card.accentClassName,
                  )}
                >
                  Explore
                  <ArrowRight className="size-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
