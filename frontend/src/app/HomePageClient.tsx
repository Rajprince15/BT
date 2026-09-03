'use client';

import type { ComponentType } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Check,
  Factory,
  PackageCheck,
  ShieldCheck,
  Truck,
} from 'lucide-react';

import ProductImageFallback from '@/components/common/ProductImageFallback';

const images = {
  hero: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
  bedsheets:
    'https://bhavitatextiles.lovable.app/assets/product-bedsheet-styled-B1ras_mT.jpg',
  blankets:
    'https://bhavitatextiles.lovable.app/assets/product-mink-blankets-Cd-j1YKi.jpg',
  mats: 'https://bhavitatextiles.lovable.app/assets/product-floor-mats-D-ey-gLp.jpg',
  factory:
    'https://bhavitatextiles.lovable.app/assets/factory-packaging-uSpSkn1N.jpg',
};

interface RangeItem {
  slug: string;
  href: string;
  title: string;
  label: string;
  copy: string;
  bullets: string[];
  image: string;
}

const range: RangeItem[] = [
  {
    slug: 'printed-double-bedsheets',
    href: '/shop/printed-bedsheets',
    title: 'Printed Double Bedsheets',
    label: 'Bestseller',
    copy:
      '100% cotton & poly-cotton, 144 TC / 180 TC / 210 TC, reactive-print, colour-fast.',
    bullets: [
      'Sizes 90×100 / 100×108 in',
      'MOQ 500 pcs / design',
      'Custom prints',
    ],
    image: images.bedsheets,
  },
  {
    slug: 'mink-blankets',
    href: '/shop/winter-blankets',
    title: 'Mink Blankets',
    label: 'Winter Line',
    copy:
      'Double-ply mink & korean-mink blankets in premium GSM. Embossed and printed.',
    bullets: [
      '1.6 – 2.2 kg GSM',
      'Single / Double sizes',
      'Retail-ready packing',
    ],
    image: images.blankets,
  },
  {
    slug: 'floor-mats-dhurries',
    href: '/shop/cotton-door-mats',
    title: 'Floor Mats & Dhurries',
    label: 'Craft Range',
    copy:
      'Handloom cotton dhurries and durable floor mats, block-print and pit-loom weaves.',
    bullets: [
      'Sizes 2×3 – 6×9 ft',
      'MOQ 300 pcs',
      'Vegetable dyes on request',
    ],
    image: images.mats,
  },
];

interface WhyItem {
  Icon: ComponentType<{ size?: number; className?: string }>;
  title: string;
  copy: string;
}

const whyBhavita: WhyItem[] = [
  {
    Icon: Factory,
    title: 'Direct from the loom',
    copy:
      'No middlemen, no directory markups. You buy factory-priced, factory-quality.',
  },
  {
    Icon: ShieldCheck,
    title: 'Export-buyer ready',
    copy:
      'Pre-shipment inspection reports, spec sheets, GSM & shrinkage tests on request.',
  },
  {
    Icon: PackageCheck,
    title: 'Private label, easy',
    copy:
      'Custom prints, packaging, hangtags and cartons for retail and gifting programs.',
  },
  {
    Icon: Truck,
    title: 'Global logistics',
    copy:
      'FOB Nhava Sheva / Mundra. Consolidation for LCL orders across categories.',
  },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HomePageClient() {
  const reduce = useReducedMotion();

  const fadeUp = {
    hidden: { opacity: 0, y: reduce ? 0 : 20 },
    show: (i = 0) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: reduce ? 0 : i * 0.08,
        duration: 0.6,
        ease: EASE,
      },
    }),
  };

  return (
    <div data-testid="home-page" className="overflow-hidden bg-bg">
      {/* ─────────────────────────── HERO ─────────────────────────── */}
      <section
        data-testid="hero-section"
        className="grain relative isolate min-h-[440px] overflow-hidden bg-neutral-900 text-white lg:min-h-[520px]"
      >
        <Image
          src={images.hero}
          alt="Bhavita Textiles power-loom manufacturing floor in Panipat"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/25 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[440px] max-w-7xl items-center px-4 py-12 pb-24 sm:px-6 lg:min-h-[520px] lg:px-8">
          <div className="max-w-2xl">
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={0}
              data-testid="hero-eyebrow"
              className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-black/40 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.28em] text-gold backdrop-blur-sm"
            >
              <span className="size-1.5 rounded-full bg-gold" />
              Panipat · India&apos;s Home-Textile Capital
            </motion.p>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={1}
              data-testid="hero-heading"
              className="text-balance mt-5 font-serif text-3xl leading-[1] text-white sm:text-4xl lg:text-5xl"
            >
              Eight years of loom-woven trust, shipped in bulk.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={2}
              data-testid="hero-description"
              className="mt-4 max-w-xl text-sm leading-6 text-white/85 sm:text-[15px]"
            >
              Bhavita Textiles is a family-run manufacturer of printed
              bedsheets, mink blankets and floor mats — built for hospitality
              chains, export houses and corporate gifting programs that need
              consistent quality at plant scale.
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="show"
              custom={3}
              className="mt-6 flex flex-wrap gap-3"
            >
              <Link
                href="/shop"
                data-testid="hero-catalogue-link"
                className="group inline-flex items-center gap-3 rounded-full bg-brand px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-ink shadow-lg shadow-black/25 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-2 hover:shadow-xl"
              >
                View Full Catalogue
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/wholesale"
                data-testid="hero-quote-link"
                className="inline-flex items-center rounded-full border border-white/40 bg-black/25 px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm transition-colors duration-300 hover:border-gold hover:text-gold"
              >
                Request Bulk Quote
              </Link>
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduce ? 0 : 0.6, duration: 0.6 }}
          className="absolute inset-x-0 bottom-5 z-10 sm:bottom-7"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-white/90 sm:gap-3 sm:px-6 lg:px-8">
            <span data-testid="hero-stat-years" className="rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-sm">8+ Years in Panipat</span>
            <span data-testid="hero-stat-skus" className="rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-sm">30+ Active SKUs</span>
            <span data-testid="hero-stat-capacity" className="rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-sm">50K Units / month</span>
            <span data-testid="hero-stat-markets" className="rounded-full bg-black/45 px-3 py-1.5 backdrop-blur-sm">12+ Export markets</span>
          </div>
        </motion.div>
      </section>

      {/* ─────────────────────── FEATURED RANGE ─────────────────────── */}
      <section
        data-testid="featured-range"
        className="bg-bg py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mx-auto max-w-2xl text-center"
          >
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
                Featured Range
              </p>

              <h2
                data-testid="featured-heading"
                className="mt-2 mx-auto max-w-2xl text-balance font-serif text-2xl leading-[1.08] sm:text-[2rem]"
              >
                Categories our buyers reorder every season.
              </h2>
            </div>

            <p className="mt-3 mx-auto max-w-xl font-serif text-lg italic leading-6 text-ink-2">
              A curated look at three of our seven categories. Full technical
              specifications, GSM options and MOQ tiers are in the catalogue.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduce ? 0 : 0.1,
                },
              },
            }}
            className="mx-auto mt-8 grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3"
          >
            {range.map((item, index) => (
              <motion.div
                key={item.slug}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: reduce ? 0 : 24,
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.55,
                      ease: EASE,
                    },
                  },
                }}
              >
                <Link
                  href={item.href}
                  data-testid={`product-category-card-${index + 1}`}
                  className="group relative flex aspect-[0.86] h-full min-h-0 flex-col overflow-hidden rounded-md border border-border/80 bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-brand/50 hover:shadow-[0_20px_42px_-24px_rgba(30,26,24,0.45)]"
                >
                  <div className="absolute inset-0 overflow-hidden bg-surface-2">
                    <ProductImageFallback
                      slug={item.slug}
                      remote={item.image}
                      alt={item.title}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/15 to-transparent opacity-90 transition-opacity duration-300 group-hover:opacity-100" />

                    <div className="absolute left-4 top-4 rounded-full border border-bg/30 bg-ink/45 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-bg backdrop-blur-sm">
                      {item.label}
                    </div>
                  </div>

                  <div className="relative z-10 mt-auto flex flex-1 flex-col justify-end bg-gradient-to-t from-ink/95 via-ink/65 to-transparent p-4 pt-24 text-bg sm:p-5 sm:pt-28">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold">
                      0{index + 1} · Category
                    </p>

                    <h3
                      data-testid={`product-category-title-${index + 1}`}
                      className="mt-2 font-serif text-2xl leading-none text-bg transition-colors duration-300 group-hover:text-gold sm:text-[1.7rem]"
                    >
                      {item.title}
                    </h3>

                    <p className="mt-2 line-clamp-2 min-h-0 text-xs leading-5 text-bg/75">
                      {item.copy}
                    </p>

                    <ul className="mt-3 grid gap-1 text-[10px] text-bg/75">
                      {item.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="flex items-center gap-2"
                        >
                          <Check
                            size={12}
                            className="shrink-0 text-gold"
                          />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    <span className="mt-4 inline-flex items-center gap-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-bg transition-colors group-hover:text-gold">
                      Explore range
                      <ArrowUpRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                      />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <Link
            href="/shop"
            data-testid="browse-all-categories-link"
            className="group mt-8 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-ink transition-colors hover:text-brand"
          >
            Browse all 7 categories
            <ArrowUpRight
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </div>
      </section>

      {/* ─────────────────────── PLANT SCALE ─────────────────────── */}
      <section
        data-testid="plant-scale-section"
        className="bg-surface-2 py-14 sm:py-20"
      >
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-12 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              Plant Scale
            </p>

            <h2 className="mt-3 text-balance font-serif text-3xl leading-[1.02] sm:text-4xl lg:text-5xl">
              A working mill you can walk through — not a directory listing.
            </h2>

            <p className="mt-5 max-w-lg text-sm leading-6 text-ink-2">
              Our 40,000 sq.ft. facility in Panipat runs power-looms,
              stitching, digital &amp; rotary printing, and packaging under one
              roof. Every order you place is one shift on our floor — not a
              resold job order.
            </p>

            <div className="mt-7 grid grid-cols-2 gap-5 border-t border-border pt-6 sm:grid-cols-4">
              {[
                {
                  key: 'plant-area-stat',
                  value: '40,000',
                  label: 'sq. ft. floor',
                },
                {
                  key: 'plant-team-stat',
                  value: '120+',
                  label: 'team members',
                },
                {
                  key: 'plant-stage-stat',
                  value: '5-stage',
                  label: 'inspection',
                },
                {
                  key: 'plant-lead-stat',
                  value: '< 21',
                  label: 'days lead time',
                },
              ].map((stat) => (
                <div key={stat.key}>
                  <strong
                    data-testid={stat.key}
                    className="font-serif text-2xl text-ink"
                  >
                    {stat.value}
                  </strong>

                  <span className="mt-1 block text-[10px] uppercase tracking-wider2 text-ink-2">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: reduce ? 1 : 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: EASE }}
            className="relative aspect-[4/3] w-full overflow-hidden rounded-md lg:ml-auto lg:max-w-[440px]"
          >
            <Image
              src={images.factory}
              alt="Bhavita Textiles packaging zone"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-[1200ms] ease-out hover:scale-105"
            />

            <span
              data-testid="factory-image-caption"
              className="absolute bottom-5 left-5 rounded-full bg-bg/95 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-ink shadow-sm"
            >
              Live packaging zone
            </span>
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────── WHY BHAVITA ─────────────────────── */}
      <section
        data-testid="why-bhavita-section"
        className="bg-bg py-14 sm:py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: reduce ? 0 : 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: EASE }}
            className="max-w-xl"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand">
              Why Bhavita
            </p>

            <h2 className="mt-3 text-balance font-serif text-3xl leading-[1.02] sm:text-4xl lg:text-5xl">
              Built for procurement teams that hate surprises.
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-60px' }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: reduce ? 0 : 0.08,
                },
              },
            }}
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            {whyBhavita.map(({ Icon, title, copy }) => (
              <motion.div
                key={title}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: reduce ? 0 : 20,
                  },
                  show: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.5,
                      ease: EASE,
                    },
                  },
                }}
                className="group rounded-md border border-border bg-surface p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand/40 hover:shadow-[0_20px_50px_-30px_rgba(125,44,40,0.35)] sm:p-6"
              >
                <div className="inline-flex size-11 items-center justify-center rounded-full bg-brand-soft text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-brand-ink">
                  <Icon size={20} />
                </div>

                <h3 className="mt-4 font-serif text-xl text-ink">{title}</h3>

                <p className="mt-2 text-sm leading-6 text-ink-2">{copy}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─────────────────────── BULK CTA ─────────────────────── */}
      <section
        data-testid="wholesale-cta"
        className="relative overflow-hidden bg-ink py-14 text-bg sm:py-20"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 size-[420px] rounded-full bg-brand/30 blur-3xl"
        />

        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-32 -left-24 size-[420px] rounded-full bg-gold/10 blur-3xl"
        />

        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: EASE }}
          className="relative mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 sm:px-6 md:flex-row md:items-end lg:px-8"
        >
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
              Talk to the mill
            </p>

            <h2 className="mt-3 max-w-2xl text-balance font-serif text-3xl leading-[1.02] sm:text-4xl lg:text-5xl">
              Share your sizes, GSM and volume — get a factory quote within 24
              hours.
            </h2>
          </div>

          <div className="flex shrink-0 flex-wrap gap-3">
            <Link
              href="/contact"
              data-testid="cta-contact-link"
              className="group inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-ink shadow-lg shadow-brand/30 transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-2"
            >
              Send RFQ
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

