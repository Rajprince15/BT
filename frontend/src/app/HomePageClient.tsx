'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Factory, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import ProductImageFallback from '@/components/common/ProductImageFallback';

const images = {
  hero: 'https://images.unsplash.com/photo-1638741280080-02e3f4267020?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1OTN8MHwxfHNlYXJjaHw3fHxsdXh1cnklMjBob21lJTIwdGV4dGlsZXMlMjBpbnRlcmlvciUyMGRyYXBlcnklMjBzb2ZhJTIwdGhyb3clMjBjdXNoaW9uc3xlbnwwfHx8fDE3ODc5MTQyODB8MA&ixlib=rb-4.1.0&q=85',
  linen: 'https://images.unsplash.com/photo-1528458909336-e7a0adfed0a5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBsaW5lbiUyMGZhYnJpYyUyMHRleHR1cmUlMjBiZWlnZSUyMG9yZ2FuaWMlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzg3OTE0MjgwfDA&ixlib=rb-4.1.0&q=85',
  fabricMacro: 'https://images.unsplash.com/photo-1686806374120-e7ae3f19801d?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBsaW5lbiUyMGZhYnJpYyUyMHRleHR1cmUlMjBiZWlnZSUyMG9yZ2FuaWMlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzg3OTE0MjgwfDA&ixlib=rb-4.1.0&q=85',
  loom: 'https://images.unsplash.com/photo-1598616068517-c75ad397a436?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTF8MHwxfHNlYXJjaHxffGhhbmRsb29tJTIwd2VhdmluZyUyMGxvb20lMjBhcnRpc2FuJTIwdGV4dGlsZSUyMGNyYWZ0c21hbnNoaXB8ZW58MHx8fHwxNzg3OTE0MjkwfDA&ixlib=rb-4.1.0&q=85',
  drapery: 'https://images.unsplash.com/photo-1601000785676-f9b0ade234d3?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBjdXJ0YWluJTIwZHJhcGVyeSUyMGxpbmVuJTIwdmVsdmV0JTIwYmVpZ2UlMjB3aW5kb3clMjBuYXR1cmFsJTIwbGlnaHR8ZW58MHx8fHwxNzg3OTE0MjkwfDA&ixlib=rb-4.1.0&q=85',
  sheer: 'https://images.unsplash.com/photo-1574197635162-68e4b468e4e9?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Nzh8MHwxfHNlYXJjaHwyfHxsdXh1cnklMjBjdXJ0YWluJTIwZHJhcGVyeSUyMGxpbmVuJTIwdmVsdmV0JTIwYmVpZ2UlMjB3aW5kb3clMjBuYXR1cmFsJTIwbGlnaHR8ZW58MHx8fHwxNzg3OTE0MjkwfDA&ixlib=rb-4.1.0&q=85',
  bedFold: 'https://images.unsplash.com/photo-1634665810235-011d663754e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NzB8MHwxfHNlYXJjaHwzfHxsdXh1cnklMjBsaW5lbiUyMGZhYnJpYyUyMHRleHR1cmUlMjBiZWlnZSUyMG9yZ2FuaWMlMjBhZXN0aGV0aWN8ZW58MHx8fHwxNzg3OTE0MjgwfDA&ixlib=rb-4.1.0&q=85',
};

const stories = [
  {
    n: 'N° 01',
    kicker: 'Craft & Heritage',
    title: 'Printed Cotton Drapes',
    copy: 'Reactive-print cotton and poly-cotton woven for hospitality-grade wear, with the softness a private home deserves.',
    href: '/shop/printed-bedsheets',
    image: images.drapery,
    slug: 'printed-double-bedsheets',
  },
  {
    n: 'N° 02',
    kicker: 'Winter Line',
    title: 'Mink & Korean-Mink',
    copy: 'Double-ply mink blankets in premium GSM — embossed, printed, retail-ready. Warmth engineered for winter programmes.',
    href: '/shop/winter-blankets',
    image: images.bedFold,
    slug: 'mink-blankets',
  },
  {
    n: 'N° 03',
    kicker: 'Craft Range',
    title: 'Floor Mats & Dhurries',
    copy: 'Handloom cotton dhurries and durable floor mats — vegetable dyed on request, finished for homes and hospitality alike.',
    href: '/shop/cotton-door-mats',
    image: images.linen,
    slug: 'floor-mats-dhurries',
  },
];

const assurances = [
  { Icon: Factory, title: 'Direct from the loom', copy: 'No middlemen, no directory markups — factory-priced, factory-quality.' },
  { Icon: ShieldCheck, title: 'Export-buyer ready', copy: 'Spec sheets, pre-shipment inspection and GSM testing on request.' },
  { Icon: PackageCheck, title: 'Private label, easy', copy: 'Custom prints, packaging, hangtags and cartons for your programme.' },
  { Icon: Truck, title: 'Global logistics', copy: 'FOB Nhava Sheva / Mundra and LCL consolidation across categories.' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomePageClient() {
  const reduce = useReducedMotion();
  const reveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 22 },
    show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
  };

  return (
    <div data-testid="home-page" className="bg-bg text-ink">
      {/* -------- Editorial Hero -------- */}
      <section
        data-testid="hero-section"
        className="paper-grain relative border-b border-border bg-bg"
      >
        <div className="mx-auto grid max-w-[1560px] gap-10 px-5 pb-16 pt-14 sm:px-10 md:grid-cols-12 md:gap-14 md:pb-24 md:pt-20 lg:gap-20 lg:px-16 lg:pt-24">
          <motion.div initial="hidden" animate="show" variants={reveal} className="md:col-span-7">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-terracotta">
                Volume I · MMXXVI
              </span>
              <span aria-hidden className="h-px w-24 bg-border" />
              <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-ink-3">
                Panipat Handloom
              </span>
            </div>

            <h1
              data-testid="hero-heading"
              className="mt-10 font-serif font-normal leading-[0.96] tracking-[-0.035em] text-ink text-balance"
              style={{ fontSize: 'clamp(2.75rem, 7vw, 6rem)' }}
            >
              The quiet luxury <em className="font-serif italic text-terracotta not-italic-sm">of</em> a
              well-made layer.
            </h1>

            <p
              data-testid="hero-description"
              className="mt-10 max-w-xl text-[15px] leading-[1.8] text-ink-2"
            >
              A family-run mill in Panipat, weaving printed bedsheets, mink blankets and
              handloom dhurries for hospitality chains, export houses and considered homes.
              Eight years of loom-woven trust — shipped in bulk, finished by hand.
            </p>

            <div className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link
                href="/shop"
                data-testid="hero-catalogue-link"
                className="group inline-flex items-center gap-3 bg-ink px-8 py-4 font-mono text-[10px] uppercase tracking-[0.28em] text-bg transition-colors hover:bg-terracotta"
              >
                Enter the catalogue
                <ArrowRight
                  size={14}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>
              <Link
                href="/wholesale"
                data-testid="hero-quote-link"
                className="group inline-flex items-center gap-3 border-b border-ink/40 px-1 py-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:border-terracotta hover:text-terracotta"
              >
                Request a bulk quote
                <ArrowUpRight size={14} />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease }}
            className="relative md:col-span-5"
          >
            <div className="relative aspect-[3/4] w-full overflow-hidden bg-surface-2">
              <Image
                src={images.hero}
                alt="Bhavita Textiles editorial home"
                fill
                priority
                sizes="(min-width: 1024px) 42vw, 100vw"
                className="object-cover"
              />
              <span className="absolute left-6 top-6 font-mono text-[9px] uppercase tracking-[0.32em] text-bg/90 drop-shadow">
                Plate&nbsp;· I
              </span>
              <span className="absolute bottom-6 right-6 font-mono text-[9px] uppercase tracking-[0.32em] text-bg/80 drop-shadow">
                The Ivory Room
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center font-mono text-[9px] uppercase tracking-[0.22em] text-ink-3">
              <div className="border-t border-border pt-3">
                <strong className="block font-serif text-2xl font-normal text-ink">08</strong>
                Years
              </div>
              <div className="border-t border-border pt-3">
                <strong className="block font-serif text-2xl font-normal text-ink">50k</strong>
                Units / mo
              </div>
              <div className="border-t border-border pt-3">
                <strong className="block font-serif text-2xl font-normal text-ink">12+</strong>
                Markets
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* -------- Editorial Story Spreads -------- */}
      <section
        data-testid="featured-range"
        className="mx-auto max-w-[1560px] px-5 py-20 sm:px-10 sm:py-28 lg:px-16 lg:py-36"
      >
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={reveal}
          className="grid gap-8 md:grid-cols-12 md:items-end"
        >
          <div className="md:col-span-7">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-terracotta">
              The Range · N° 02
            </span>
            <h2
              data-testid="featured-heading"
              className="mt-6 font-serif font-normal leading-[0.98] tracking-[-0.03em] text-ink text-balance"
              style={{ fontSize: 'clamp(2.25rem, 5vw, 4.25rem)' }}
            >
              Materials for rooms with a point of view.
            </h2>
          </div>
          <p className="md:col-span-5 max-w-md text-[15px] leading-[1.8] text-ink-2">
            A considered edit of the categories buyers return to every season, with
            technical specifications and MOQ tiers ready for the conversation ahead.
          </p>
        </motion.div>

        <div className="mt-20 space-y-24 md:space-y-32">
          {stories.map((story, index) => (
            <motion.article
              key={story.slug}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              variants={reveal}
              className="grid gap-10 md:grid-cols-12 md:items-center md:gap-16"
            >
              <div
                className={`relative aspect-[4/5] overflow-hidden bg-surface-2 md:col-span-7 md:aspect-[3/4] ${
                  index % 2 === 1 ? 'md:order-2' : ''
                }`}
              >
                <ProductImageFallback
                  slug={story.slug}
                  remote={story.image}
                  alt={story.title}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] hover:scale-[1.03]"
                />
                <span className="absolute left-6 top-6 font-mono text-[9px] uppercase tracking-[0.32em] text-bg/90 drop-shadow">
                  Plate · {String(index + 2).padStart(2, '0')}
                </span>
              </div>
              <div className={`md:col-span-5 ${index % 2 === 1 ? 'md:order-1 md:pr-8' : 'md:pl-4'}`}>
                <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-terracotta">
                  {story.n} · {story.kicker}
                </span>
                <h3
                  className="mt-6 font-serif font-normal leading-[1.02] tracking-[-0.02em] text-ink"
                  style={{ fontSize: 'clamp(2rem, 3.6vw, 3rem)' }}
                >
                  {story.title}
                </h3>
                <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-ink-2">
                  {story.copy}
                </p>
                <Link
                  href={story.href}
                  data-testid={`product-category-card-${index + 1}`}
                  className="group mt-8 inline-flex items-center gap-3 border-b border-ink/40 pb-2 font-mono text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:border-terracotta hover:text-terracotta"
                >
                  Explore the range
                  <ArrowUpRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      {/* -------- Triptych Swatch Rhythm -------- */}
      <section
        data-testid="swatch-triptych"
        className="paper-grain border-y border-border bg-surface"
      >
        <div className="mx-auto max-w-[1560px] px-5 py-20 sm:px-10 sm:py-28 lg:px-16">
          <div className="mb-14 max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-terracotta">
              The Swatches · N° 03
            </span>
            <h2
              className="mt-6 font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
            >
              Fibre, weave, hand-feel.
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-12 md:gap-10">
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-2 md:col-span-5">
              <Image
                src={images.fabricMacro}
                alt="Macro close-up of textile weave"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="relative aspect-[3/4] overflow-hidden bg-surface-2 md:col-span-3 md:mt-16">
              <Image src={images.sheer} alt="Sheer curtain fall" fill sizes="(min-width: 1024px) 25vw, 50vw" className="object-cover" />
            </div>
            <div className="relative aspect-[4/5] overflow-hidden bg-surface-2 md:col-span-4">
              <Image src={images.linen} alt="Folded linen" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* -------- Plant scale -------- */}
      <section
        data-testid="plant-scale-section"
        className="mx-auto max-w-[1560px] px-5 py-20 sm:px-10 sm:py-28 lg:px-16"
      >
        <div className="grid gap-14 md:grid-cols-12 md:items-center md:gap-20">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={reveal}
            className="md:col-span-5"
          >
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-terracotta">
              Plant Scale · N° 04
            </span>
            <h2
              className="mt-6 font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink text-balance"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}
            >
              A working mill you can walk through — not a directory listing.
            </h2>
            <p className="mt-7 max-w-lg text-[15px] leading-[1.8] text-ink-2">
              Our 40,000 sq. ft. facility in Panipat brings weaving, printing, stitching
              and packaging under one roof. Every order is one shift on our floor — never
              a resold job order.
            </p>
            <div className="mt-12 grid grid-cols-2 gap-8 border-t border-border pt-8 sm:grid-cols-4">
              {[
                ['40,000', 'sq. ft. floor'],
                ['120+', 'team'],
                ['5-stage', 'inspection'],
                ['< 21d', 'lead time'],
              ].map(([value, label]) => (
                <div key={label}>
                  <strong
                    data-testid={`plant-${label.replace(/\W/g, '-')}`}
                    className="block font-serif text-3xl font-normal text-ink"
                  >
                    {value}
                  </strong>
                  <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.22em] text-ink-3">
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, ease }}
            className="relative aspect-[4/5] overflow-hidden bg-surface-2 md:col-span-7 md:aspect-[16/12]"
          >
            <Image
              src={images.loom}
              alt="Bhavita Textiles handloom weaving"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
            <span
              data-testid="factory-image-caption"
              className="absolute bottom-6 left-6 bg-bg/90 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.28em] text-ink"
            >
              On the loom floor
            </span>
          </motion.div>
        </div>
      </section>

      {/* -------- Why Bhavita -------- */}
      <section
        data-testid="why-bhavita-section"
        className="border-t border-border bg-bg py-20 sm:py-28"
      >
        <div className="mx-auto max-w-[1560px] px-5 sm:px-10 lg:px-16">
          <div className="max-w-2xl">
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-terracotta">
              The Assurances · N° 05
            </span>
            <h2
              className="mt-6 font-serif font-normal leading-[1.02] tracking-[-0.025em] text-ink"
              style={{ fontSize: 'clamp(2rem, 4vw, 3.25rem)' }}
            >
              Built for procurement teams that hate surprises.
            </h2>
          </div>
          <div className="mt-14 grid divide-border border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {assurances.map(({ Icon, title, copy }) => (
              <article
                key={title}
                className="group px-6 py-10 first:pl-0 sm:first:pl-6 lg:px-8"
              >
                <Icon size={22} strokeWidth={1.2} className="text-terracotta" />
                <h3 className="mt-6 font-serif text-2xl font-normal text-ink transition-colors group-hover:text-terracotta">
                  {title}
                </h3>
                <p className="mt-3 text-sm leading-[1.7] text-ink-2">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* -------- CTA -------- */}
      <section
        data-testid="wholesale-cta"
        className="grain relative isolate overflow-hidden bg-ink py-20 text-bg sm:py-28"
      >
        <div className="mx-auto flex max-w-[1560px] flex-col gap-10 px-5 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-16">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.32em] text-ochre">
              Talk to the mill
            </span>
            <h2
              className="mt-6 max-w-3xl font-serif font-normal leading-[1.02] tracking-[-0.025em] text-bg text-balance"
              style={{ fontSize: 'clamp(2rem, 4.5vw, 3.75rem)' }}
            >
              Share your volume, sizes and brief. We&apos;ll return with a clear quote.
            </h2>
          </div>
          <Link
            href="/contact"
            data-testid="cta-contact-link"
            className="group inline-flex shrink-0 items-center gap-3 bg-bg px-8 py-4 font-mono text-[10px] uppercase tracking-[0.28em] text-ink transition-colors hover:bg-ochre"
          >
            Send an enquiry
            <ArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
