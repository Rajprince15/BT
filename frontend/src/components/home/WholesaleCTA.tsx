'use client';

import Link from 'next/link';
import { ArrowRight, Building2, Hotel, PenTool } from 'lucide-react';
import Container from '@/components/common/Container';

interface AudienceProps {
  Icon: typeof Building2;
  label: string;
}

function AudienceChip({ Icon, label }: AudienceProps) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-bg/[0.08] px-4 py-2 text-[12px] font-semibold uppercase tracking-wider2 text-bg/90">
      <Icon aria-hidden className="size-4 text-gold" />
      {label}
    </span>
  );
}

export default function WholesaleCTA() {
  return (
    <section
      data-testid="wholesale-cta"
      className="relative overflow-hidden bg-ink py-20 text-bg md:py-28"
    >
      {/* gold hairlines + subtle radial glow (ink-based, NOT purple) */}
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gold/50" />
      <span aria-hidden className="absolute inset-x-0 bottom-0 h-px bg-gold/50" />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-gold/15 blur-3xl"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-gold/10 blur-3xl"
      />

      <Container>
        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="text-[11px] font-semibold uppercase tracking-wider2 text-gold">
              For the Trade
            </p>
            <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-bg md:text-5xl lg:text-6xl">
              Bhavita for hotels, designers and resorts.
            </h2>
            <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-bg/75">
              Custom monograms, palace-grade linens, bespoke palettes and large-format
              jacquards — delivered with a dedicated atelier manager. Minimum order quantities
              tailored to your scope; lead times honoured.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <AudienceChip Icon={Hotel} label="Hotels & resorts" />
              <AudienceChip Icon={PenTool} label="Interior designers" />
              <AudienceChip Icon={Building2} label="Hospitality groups" />
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="rounded-md border border-gold/40 bg-bg/[0.04] p-7 backdrop-blur-sm md:p-9">
              <p className="font-serif text-2xl leading-snug text-bg md:text-3xl">
                Let&apos;s craft your house style.
              </p>
              <p className="mt-3 text-[14px] leading-relaxed text-bg/70">
                Tell us about your project. We&apos;ll respond within 24 hours with a curated
                lookbook and a sample dispatch.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/wholesale"
                  data-testid="wholesale-cta-primary"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold px-7 text-[12px] font-semibold uppercase tracking-wider2 text-ink transition-colors duration-200 hover:bg-gold-2 hover:text-bg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Open a trade account
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-bg/30 px-7 text-[12px] font-semibold uppercase tracking-wider2 text-bg transition-colors duration-200 hover:border-gold hover:text-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                >
                  Talk to atelier
                </Link>
              </div>

              <ul className="mt-7 grid grid-cols-3 gap-4 border-t border-bg/15 pt-5 text-center">
                <li>
                  <p className="font-serif text-2xl text-gold">24h</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider2 text-bg/60">
                    Response
                  </p>
                </li>
                <li>
                  <p className="font-serif text-2xl text-gold">47+</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider2 text-bg/60">
                    Master artisans
                  </p>
                </li>
                <li>
                  <p className="font-serif text-2xl text-gold">PAN-IN</p>
                  <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider2 text-bg/60">
                    Delivery
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
