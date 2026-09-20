'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BedDouble,
  Building2,
  Gift,
  Globe2,
  Hospital,
  Hotel,
  Package,
  Palmtree,
  PencilRuler,
  Sprout,
  Store,
  Truck,
  Users,
  Wrench,
} from 'lucide-react';

import Container from '@/components/common/Container';
import CatalogueDownloadButton from '@/components/common/CatalogueDownloadButton';
import { useCategories } from '@/hooks/useCategories';

const images = {
  hero: '/images/homepage_first_section.jpg',
  bedroom:
    'https://bhavitatextiles.lovable.app/assets/product-bedsheet-styled-B1ras_mT.jpg',
  living:
    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85',
  bath:
    'https://images.unsplash.com/photo-1640747669771-b82a6e40f534?auto=format&fit=crop&w=900&q=85',
  decor:
    'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85',
  handloom:
    'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85',
  handicrafts:
    'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85',
  custom:
    'https://images.pexels.com/photos/6332002/pexels-photo-6332002.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=900&w=1200',
};

const collections = [
  [
    'Bedroom Collection',
    'Bedsheets · Blankets · Comforters\nPillows · Bedding accessories',
    images.bedroom,
    '/shop/bedroom',
  ],
  [
    'Living Room Collection',
    'Sofa furnishing · Curtains\nRugs · Carpets · Door mats',
    images.living,
    '/shop/living-room',
  ],
  ['Bath Collection', 'Towels · Bath mats', images.bath, '/shop/bath'],
  [
    'Home Décor',
    'Wall décor · Table linen\nDecorative textiles · Festive edits',
    images.decor,
    '/shop/home-decor',
  ],
  [
    'Handloom Heritage',
    'Jaipur prints · Block prints\nEthnic weaves · Artisan collection',
    images.handloom,
    '/shop/handloom-heritage',
  ],
  [
    'Handicrafts Collection',
    'Handmade accessories\nTraditional crafts · Gift collection',
    images.handicrafts,
    '/shop/handicrafts',
  ],
] as const;

const audiences = [
  [Hotel, 'HOTELS', 'Premium linen for luxurious hospitality'],
  [Palmtree, 'RESORTS', 'Comfort meets elegance'],
  [Hospital, 'HOSPITALS', 'Hygienic, durable and reliable'],
  [BedDouble, 'HOSTELS', 'Quality textiles for everyday use'],
  [Store, 'RETAIL STORES', 'Wide range for retail businesses'],
  [PencilRuler, 'INTERIOR DESIGNERS', 'Custom collections for unique spaces'],
  [Gift, 'CORPORATE GIFTING', 'Thoughtful gifting solutions'],
] as const;

const heroFeatures = [
  [Sprout, 'Premium quality'],
  [Building2, 'Bulk manufacturing'],
  [PencilRuler, 'Customisation available'],
  [Globe2, 'Pan India & global supply'],
] as const;

const stats = [
  ['500+', 'Satisfied business clients'],
  ['10+', 'Product categories'],
  ['PAN INDIA', 'Supply network'],
  ['EXPORT READY', 'Global deliveries'],
  ['CONSISTENT', 'Quality & timely delivery'],
] as const;

export default function HomePageClient() {
  const reduce = useReducedMotion();
  const { data: availableCategories } = useCategories();

  const visibleCollections = availableCategories
    ? collections.filter(([, , , href]) =>
        availableCategories.some(
          (category) =>
            href === `/shop/${category.slug}` ||
            href.startsWith(`/shop/${category.slug}/`),
        ),
      )
    : collections;

  const reveal = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1] as const,
      },
    },
  };

  return (
    <main
      data-testid="home-page"
      className="overflow-hidden bg-bg text-ink"
    >
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section
        data-testid="hero-section"
        className="relative min-h-[470px] overflow-hidden bg-bg"
      >
        {/* FIX: object-cover → object-contain so the full hero photo
            (folded textiles, branded box) is always visible, never
            cropped — at any screen size, on any host. bg-bg on the
            wrapper matches the page background so any letterbox space
            blends in instead of showing a hard edge. */}
        <div className="absolute inset-y-0 right-0 h-[330px] w-full bg-bg sm:h-[430px] lg:left-[55%] lg:h-full lg:w-[45%]">
          <Image
            src={images.hero}
            alt="Folded luxury home textiles ready for wholesale supply"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-contain"
          />

          <div className="absolute inset-0 bg-ink/10" />

          <div className="absolute bottom-5 right-5 hidden max-w-[150px] border-l border-gold/70 pl-4 text-[10px] uppercase leading-5 tracking-[.18em] text-bg lg:block">
            Trusted by businesses.
            <br />
            Crafted for tomorrow.
          </div>

          <Image
            src="/images/feather.png"
            alt=""
            width={180}
            height={260}
            className="absolute -bottom-14 right-8 hidden w-28 rotate-[18deg] opacity-60 mix-blend-multiply lg:block"
          />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#F9F4EC_0%,rgba(249,244,236,.96)_35%,rgba(249,244,236,.56)_56%,transparent_75%)] lg:bg-[linear-gradient(90deg,#F9F4EC_0%,#F9F4EC_42%,rgba(249,244,236,.4)_62%,transparent_75%)]" />

        <Container className="relative z-10 flex min-h-[470px] items-end pb-10 pt-[220px] sm:pt-[250px] lg:items-center lg:pb-12 lg:pt-12">
          <motion.div
            variants={reveal}
            initial="hidden"
            animate="show"
            className="max-w-[600px]"
          >
            <p
              data-testid="hero-eyebrow"
              className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand"
            >
              Wholesale textile solutions
            </p>

            <h1
              data-testid="hero-heading"
              className="mt-5 max-w-xl font-serif text-[42px] leading-[1.02] sm:text-5xl lg:text-6xl"
            >
              Premium home textiles
              <br />
              <em className="font-accent font-normal">for</em> bulk buyers
            </h1>

            <p
              data-testid="hero-subtitle"
              className="mt-5 font-accent text-2xl italic text-ink-2"
            >
              Woven with tradition. Delivered at scale.
            </p>

            <p
              data-testid="hero-description"
              className="mt-5 max-w-lg text-[14px] leading-7 text-ink-2 sm:text-[15px]"
            >
              Bhavita Textiles is a trusted wholesale manufacturer and supplier
              of premium home textiles, offering consistency, quality and
              customisation for businesses across India and worldwide.
            </p>

            <Link
              href="/wholesale"
              data-testid="hero-quote-link"
              className="mt-7 inline-flex items-center gap-3 bg-gold px-6 py-3 text-[11px] font-semibold uppercase tracking-[.18em] text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-gold-2"
            >
              Partner with us
              <ArrowRight size={16} />
            </Link>

            <div
              data-testid="hero-features"
              className="mt-9 grid grid-cols-2 gap-y-5 border-t border-gold/30 pt-5 sm:grid-cols-4 sm:gap-y-0"
            >
              {heroFeatures.map(([Icon, label], index) => (
                <div
                  key={label}
                  data-testid={`hero-feature-${index + 1}`}
                  className={`flex items-center gap-2 pr-3 text-[10px] font-semibold leading-4 text-ink-2 sm:min-h-14 sm:justify-center sm:px-4 sm:text-center ${
                    index > 0 ? 'sm:border-l sm:border-gold/30' : ''
                  }`}
                >
                  <Icon
                    className="size-8 shrink-0 text-gold"
                    strokeWidth={1.3}
                  />
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </Container>
      </section>

      {/* ─────────────────── WHOLESALE COLLECTIONS ─────────────────── */}
      <section
        data-testid="featured-range"
        className="border-t border-border bg-bg py-16 sm:py-20"
      >
        <Container>
          <div className="text-center">
            <p className="text-brand">✦</p>

            <h2
              data-testid="featured-heading"
              className="mt-2 font-serif text-3xl uppercase tracking-[.12em] sm:text-4xl"
            >
              Our wholesale collections
            </h2>

            <p className="mt-3 text-sm text-ink-2">
              A complete range of home textiles for your business needs
            </p>
          </div>

          {/* FIX: object-cover → object-contain on each card image, plus
              a bg-surface fallback behind the image so any letterbox
              space (where a photo's aspect ratio doesn't exactly match
              the 1.25 card ratio) blends in cleanly instead of showing a
              transparent gap. Nothing in any of these 6 product photos
              gets cropped now, at any screen size. */}
          <div
            data-testid="collection-grid"
            className="mt-10 grid gap-2 sm:grid-cols-3 lg:grid-cols-6"
          >
            {visibleCollections.map(
              ([title, copy, image, href], index) => (
                <Link
                  href={href}
                  key={title}
                  data-testid={`product-category-card-${index + 1}`}
                  className="group border border-border bg-bg pb-5 transition-[transform,box-shadow] duration-300 hover:-translate-y-1 hover:shadow-[0_18px_35px_-25px_rgba(42,38,32,.6)]"
                >
                  <div className="relative aspect-[1.25] overflow-hidden bg-surface">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      sizes="(min-width: 1024px) 16vw, 33vw"
                      className="object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <h3 className="mt-4 px-3 text-center text-[11px] font-semibold uppercase">
                    {title}
                  </h3>

                  <p className="mt-2 whitespace-pre-line px-3 text-center text-[10px] leading-5 text-ink-2">
                    {copy}
                  </p>

                  <span className="mt-3 flex justify-center text-[10px] font-semibold uppercase tracking-wider2 text-brand">
                    View range →
                  </span>
                </Link>
              ),
            )}
          </div>
        </Container>
      </section>

      {/* ─────────────────────── STATS BANNER ─────────────────────── */}
      <section
        data-testid="home-stats"
        className="bg-dark-green py-8 text-bg"
      >
        <Container className="grid grid-cols-2 gap-5 text-center sm:grid-cols-5">
          {stats.map(([value, label], index) => (
            <div
              key={value}
              data-testid={`home-stat-${index + 1}`}
              className="border-gold/35 sm:border-r last:border-0"
            >
              <strong className="font-serif text-2xl text-gold sm:text-3xl">
                {value}
              </strong>

              <span className="mt-2 block text-[10px] uppercase tracking-wider2">
                {label}
              </span>
            </div>
          ))}
        </Container>
      </section>

      {/* ─────────────────── WHO DO WE SUPPLY TO ─────────────────── */}
      <section
        data-testid="audience-section"
        className="py-16 sm:py-20"
      >
        <Container>
          <div className="text-center">
            <p className="text-brand">✦</p>

            <h2
              data-testid="audience-heading"
              className="mt-2 font-serif text-3xl uppercase tracking-[.12em]"
            >
              Who do we supply to?
            </h2>

            <p className="mt-3 text-sm text-ink-2">
              Trusted textile partner for businesses across industries
            </p>
          </div>

          <div
            data-testid="audience-grid"
            className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4 lg:grid-cols-7"
          >
            {audiences.map(([Icon, title, copy], index) => (
              <div
                key={title}
                data-testid={`audience-card-${index + 1}`}
                className="text-center"
              >
                <Icon
                  className="mx-auto size-8 text-gold"
                  strokeWidth={1.25}
                />

                <h3 className="mt-4 text-[11px] font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-xs leading-5 text-ink-2">
                  {copy}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ────────────── CUSTOM MANUFACTURING + PROCESS ────────────── */}
      <section
        data-testid="manufacturing-process"
        className="grid lg:grid-cols-[23%_77%]"
      >
        {/* FIX: object-cover → object-contain, bg-bg added so the full
            manufacturing-workshop photo is always shown whole. */}
        <div className="relative min-h-[360px] bg-bg lg:min-h-[420px]">
          <Image
            src={images.custom}
            alt="Textile rolls in a custom manufacturing workshop"
            fill
            sizes="(min-width: 1024px) 23vw, 100vw"
            className="object-contain"
          />
        </div>

        <div className="grid sm:grid-cols-[.9fr_1.1fr]">
          <div className="bg-dark-green p-9 text-bg sm:p-12">
            <p className="text-[10px] uppercase tracking-[.2em] text-gold">
              Custom manufacturing
            </p>

            <h2 className="mt-4 font-serif text-4xl">
              Your vision.
              <br />
              Our expertise.
            </h2>

            <p className="mt-5 text-sm leading-6 text-bg/75">
              Looking for custom sizes, designs, labels or packaging? We work
              closely with our B2B clients to deliver tailored textile
              solutions that match your brand, quality standards and budget.
            </p>

            <Link
              href="/contact"
              data-testid="customisation-link"
              className="mt-6 inline-flex items-center gap-2 bg-gold px-5 py-3 text-[10px] font-semibold uppercase text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-gold-2"
            >
              Request customisation
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="p-9 sm:p-12">
            <h2 className="font-serif text-3xl uppercase tracking-[.08em]">
              Our wholesale process
            </h2>

            <p className="mt-2 text-sm text-ink-2">
              Simple. Transparent. Reliable.
            </p>

            <div
              data-testid="wholesale-process-steps"
              className="mt-8 grid grid-cols-2 gap-7 sm:grid-cols-4"
            >
              {[
                [Users, '1. Enquire', 'Share your requirements'],
                [Package, '2. Get quote', 'Receive pricing & samples'],
                [Wrench, '3. Confirm', 'Customisation & bulk order'],
                [Truck, '4. Delivery', 'On-time at your doorstep'],
              ].map(([Icon, title, copy], index) => (
                <div
                  key={title as string}
                  data-testid={`wholesale-step-${index + 1}`}
                >
                  <Icon className="size-7 text-gold" />

                  <h3 className="mt-3 text-[10px] font-semibold uppercase">
                    {title as string}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-ink-2">
                    {copy as string}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────── LET'S GROW TOGETHER ─────────────────── */}
      <section
        data-testid="wholesale-cta"
        className="relative overflow-hidden bg-cream-panel py-16"
      >
        <Image
          src="/images/feather.png"
          alt=""
          width={270}
          height={400}
          className="pointer-events-none absolute -right-5 top-1/2 hidden w-44 -translate-y-1/2 rotate-[12deg] opacity-25 mix-blend-multiply md:block"
        />

        <Container className="relative grid gap-8 md:grid-cols-[1.1fr_1fr] md:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-gold">
              A partnership that lasts
            </p>

            <h2 className="mt-3 font-serif text-4xl sm:text-5xl">
              Let&apos;s grow together
            </h2>

            <p className="mt-2 max-w-xl text-sm text-ink-2">
              Partner with Bhavita Textiles for bulk orders, dependable supply
              and long-term collaborations.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:col-start-1 md:row-start-2">
            <Link
              href="/wholesale"
              data-testid="home-wholesale-cta-link"
              className="inline-flex items-center gap-2 bg-gold px-6 py-3 text-[10px] font-semibold uppercase text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-gold-2"
            >
              Get wholesale quote
              <ArrowRight size={13} />
            </Link>

            <CatalogueDownloadButton className="border border-ink/30 px-6 py-3 text-[10px] font-semibold uppercase text-ink transition-[background-color,color] duration-200 hover:bg-dark-green hover:text-white" />
          </div>

          <div className="grid grid-cols-2 gap-5 border-l border-gold/30 pl-6 sm:grid-cols-4 md:col-start-2 md:row-span-2 md:row-start-1 md:items-center">
            {[
              [Sprout, 'Best wholesale pricing'],
              [Package, 'Consistent supply'],
              [Users, 'Long-term partnerships'],
              [Truck, 'Dedicated account support'],
            ].map(([Icon, label]) => {
              const BenefitIcon = Icon as typeof Sprout;
              return (
                <div key={label as string} className="text-center">
                  <BenefitIcon className="mx-auto size-7 text-gold" strokeWidth={1.25} />
                  <p className="mt-3 text-[9px] font-semibold uppercase leading-4 text-ink-2">
                    {label as string}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>
    </main>
  );
}