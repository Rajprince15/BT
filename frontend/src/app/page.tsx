import Link from 'next/link';
import Container from '@/components/common/Container';
import Breadcrumbs from '@/components/shop/Breadcrumbs';
import { ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <>
      {/* Editorial hero placeholder — full hero arrives in Phase 3A */}
      <section className="relative overflow-hidden border-b border-border bg-[radial-gradient(circle_at_20%_20%,_var(--gold-soft),_transparent_55%),radial-gradient(circle_at_85%_70%,_var(--surface-2),_transparent_60%)]">
        <Container className="grid grid-cols-1 items-center gap-10 py-20 md:grid-cols-2 md:py-28">
          <div>
            <p className="text-[12px] font-medium uppercase tracking-wider2 text-gold">
              Royal · Classic · Timeless
            </p>
            <h1 className="mt-3 font-serif text-4xl leading-[1.05] text-ink md:text-6xl">
              The Atelier of
              <br />
              <span className="text-gold-2">Indian Luxury Textiles.</span>
            </h1>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-ink-2">
              Handloom-woven bedsheets, block-printed curtains, plush bath linens and heritage
              rugs — each piece signed by the artisans of Jaipur and Rajasthan.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <Link
                href="/shop/bedroom"
                className="inline-flex h-11 items-center gap-2 rounded-full bg-ink px-6 text-[13px] font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-ink/90"
              >
                Explore Collections <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/shop/handloom-heritage"
                className="inline-flex h-11 items-center rounded-full border border-gold px-6 text-[13px] font-semibold uppercase tracking-wider2 text-gold transition-colors hover:bg-gold hover:text-white"
              >
                Handloom Heritage
              </Link>
            </div>
          </div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-md border border-border bg-surface-2 shadow-luxe md:aspect-square">
            <div className="absolute inset-0 bg-[linear-gradient(135deg,_var(--gold-soft),_var(--surface))] opacity-80" />
            <div className="absolute inset-6 flex flex-col justify-end">
              <span className="font-serif text-2xl text-ink">Block-print fortnight</span>
              <span className="text-xs uppercase tracking-wider2 text-ink-2">Curated by the Bhavita atelier</span>
            </div>
          </div>
        </Container>
      </section>

      <Container className="py-8">
        <Breadcrumbs items={[{ label: 'Home' }]} />
        <p className="mt-6 max-w-2xl text-sm text-ink-2">
          Frontend Phase 2 — global layout, sticky header with mega menu &amp; debounced search,
          mobile drawer, theme toggle, Sonner toasts and luxury footer are now live. The shop,
          product detail, and account flows are scaffolded for upcoming phases.
        </p>
      </Container>
    </>
  );
}
