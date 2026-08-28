'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, Check, Download, Factory, PackageCheck, ShieldCheck, Truck } from 'lucide-react';
import ProductImageFallback from '@/components/common/ProductImageFallback';

const images = {
  hero: 'https://bhavitatextiles.lovable.app/assets/hero-loom-factory-yO9x27s4.jpg',
  bedsheets: 'https://bhavitatextiles.lovable.app/assets/product-bedsheet-styled-B1ras_mT.jpg',
  blankets: 'https://bhavitatextiles.lovable.app/assets/product-mink-blankets-Cd-j1YKi.jpg',
  mats: 'https://bhavitatextiles.lovable.app/assets/product-floor-mats-D-ey-gLp.jpg',
  factory: 'https://bhavitatextiles.lovable.app/assets/factory-packaging-uSpSkn1N.jpg',
};

const range = [
  { title: 'Printed Double Bedsheets', label: '01 / Bestseller', copy: 'Reactive-print cotton and poly-cotton layers with a dependable hand-feel and colour-fast finish.', bullets: ['90×100 / 100×108 in', 'MOQ 500 pcs / design', 'Custom prints'], href: '/shop/printed-bedsheets', image: images.bedsheets, slug: 'printed-double-bedsheets' },
  { title: 'Mink Blankets', label: '02 / Winter line', copy: 'Double-ply mink and Korean-mink blankets in premium GSM, embossed or printed for retail.', bullets: ['1.6–2.2 kg GSM', 'Single / Double sizes', 'Retail-ready packing'], href: '/shop/winter-blankets', image: images.blankets, slug: 'mink-blankets' },
  { title: 'Floor Mats & Dhurries', label: '03 / Craft range', copy: 'Handloom cotton dhurries and durable floor mats, finished for homes, hospitality and gifting.', bullets: ['2×3–6×9 ft', 'MOQ 300 pcs', 'Vegetable dyes on request'], href: '/shop/cotton-door-mats', image: images.mats, slug: 'floor-mats-dhurries' },
];

const assurances = [
  { Icon: Factory, title: 'Direct from the loom', copy: 'No middlemen, no directory markups. You buy factory-priced, factory-quality.' },
  { Icon: ShieldCheck, title: 'Export-buyer ready', copy: 'Spec sheets, pre-shipment inspection and GSM testing on request.' },
  { Icon: PackageCheck, title: 'Private label, easy', copy: 'Custom prints, packaging, hangtags and cartons for your program.' },
  { Icon: Truck, title: 'Global logistics', copy: 'FOB Nhava Sheva / Mundra and LCL consolidation across categories.' },
];

const ease = [0.22, 1, 0.36, 1] as const;

export default function HomePageClient() {
  const reduce = useReducedMotion();
  const reveal = { hidden: { opacity: 0, y: reduce ? 0 : 18 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } };
  return (
    <div data-testid="home-page" className="overflow-hidden bg-bg">
      <section data-testid="hero-section" className="grain relative isolate min-h-[680px] overflow-hidden bg-ink text-bg lg:min-h-[calc(100vh-101px)]">
        <Image src={images.hero} alt="Bhavita Textiles power-loom manufacturing floor in Panipat" fill priority sizes="100vw" className="object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/80 to-ink/10" /><div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
        <div className="relative z-10 mx-auto flex min-h-[680px] max-w-[1440px] items-end px-6 pb-28 pt-28 sm:px-10 lg:min-h-[calc(100vh-101px)] lg:px-14 lg:pb-36">
          <motion.div initial="hidden" animate="show" variants={reveal} className="max-w-4xl">
            <p data-testid="hero-eyebrow" className="text-[10px] uppercase tracking-[0.3em] text-gold">Panipat · India&apos;s home-textile capital</p>
            <h1 data-testid="hero-heading" className="mt-7 max-w-4xl text-balance font-serif text-6xl leading-[0.88] tracking-[-0.045em] sm:text-8xl lg:text-[8.4rem]">The quiet luxury of a well-made layer.</h1>
            <p data-testid="hero-description" className="mt-8 max-w-xl text-sm leading-7 text-bg/75 sm:text-base">Family-run manufacturing for hospitality, export and furnishing buyers who care about hand-feel, finish and consistency.</p>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"><Link href="/shop" data-testid="hero-catalogue-link" className="group inline-flex items-center gap-3 bg-bg px-7 py-4 text-[10px] uppercase tracking-[0.22em] text-ink hover:bg-gold hover:text-ink">View the catalogue <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" /></Link><Link href="/wholesale" data-testid="hero-quote-link" className="inline-flex items-center gap-3 border-b border-bg/50 px-1 py-4 text-[10px] uppercase tracking-[0.22em] text-bg hover:border-gold hover:text-gold">Request a bulk quote <ArrowUpRight size={15} /></Link><a href="/download-frontend" download="bhavita-textiles-frontend.zip" data-testid="home-download-frontend-button" className="inline-flex items-center gap-2 border-b border-bg/25 px-1 py-3 text-[9px] uppercase tracking-[0.18em] text-bg/65 hover:border-gold hover:text-gold"><Download size={14} strokeWidth={1.4} />Download frontend ZIP</a></div>
          </motion.div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-bg/15"><div className="mx-auto flex max-w-[1440px] flex-wrap gap-x-10 gap-y-3 px-6 py-5 text-[9px] uppercase tracking-[0.2em] text-bg/65 sm:px-10 lg:px-14"><span data-testid="hero-stat-years">8+ years in Panipat</span><span data-testid="hero-stat-skus">30+ active SKUs</span><span data-testid="hero-stat-capacity">50K units / month</span><span data-testid="hero-stat-markets">12+ export markets</span></div></div>
      </section>

      <section data-testid="featured-range" className="bg-bg py-24 sm:py-32"><div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14"><motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }} variants={reveal} className="grid gap-7 lg:grid-cols-[1fr_.55fr] lg:items-end"><div><p className="text-[10px] uppercase tracking-[0.28em] text-gold-2">Featured range</p><h2 data-testid="featured-heading" className="mt-5 max-w-3xl text-balance font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl">Materials for rooms with a point of view.</h2></div><p className="max-w-sm text-sm leading-7 text-ink-2">A considered edit of the categories our buyers return to every season, with technical specifications and MOQ tiers ready for the next conversation.</p></motion.div>
          <div className="mt-16 grid gap-x-8 gap-y-16 lg:grid-cols-3">{range.map((item, index) => <motion.article key={item.slug} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }} variants={reveal}><Link href={item.href} data-testid={`product-category-card-${index + 1}`} className="group block"><div className="relative aspect-[4/5] overflow-hidden bg-surface-2"><ProductImageFallback slug={item.slug} remote={item.image} alt={item.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" /><span className="absolute left-5 top-5 text-[9px] uppercase tracking-[0.24em] text-bg drop-shadow">{item.label}</span><span className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/35 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" /></div><div className="pt-6"><h3 data-testid={`product-category-title-${index + 1}`} className="font-serif text-3xl leading-none text-ink group-hover:text-gold-2">{item.title}</h3><p className="mt-4 max-w-sm text-sm leading-6 text-ink-2">{item.copy}</p><ul className="mt-5 grid gap-2 text-[11px] text-ink-2">{item.bullets.map((bullet) => <li key={bullet} className="flex items-center gap-2"><Check size={13} className="text-gold-2" />{bullet}</li>)}</ul><span className="mt-7 inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-ink group-hover:text-gold-2">Explore range <ArrowUpRight size={14} /></span></div></Link></motion.article>)}</div><Link href="/shop" data-testid="browse-all-categories-link" className="mt-16 inline-flex items-center gap-3 border-b border-ink/30 pb-2 text-[10px] uppercase tracking-[0.22em] text-ink hover:border-gold-2 hover:text-gold-2">Browse the full catalogue <ArrowRight size={14} /></Link></div></section>

      <section data-testid="plant-scale-section" className="bg-surface py-24 sm:py-32"><div className="mx-auto grid max-w-[1440px] gap-12 px-6 sm:px-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center lg:gap-20 lg:px-14"><motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={reveal}><p className="text-[10px] uppercase tracking-[0.28em] text-gold-2">Plant scale</p><h2 className="mt-5 max-w-xl font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl">A working mill you can walk through — not a directory listing.</h2><p className="mt-7 max-w-lg text-sm leading-7 text-ink-2">Our 40,000 sq.ft. facility in Panipat brings weaving, printing, stitching and packaging under one roof. Every order is one shift on our floor — not a resold job order.</p><div className="mt-10 grid grid-cols-2 gap-6 border-t border-border pt-7 sm:grid-cols-4">{[['40,000', 'sq. ft. floor'], ['120+', 'team members'], ['5-stage', 'inspection'], ['< 21', 'days lead time']].map(([value, label]) => <div key={label}><strong data-testid={`plant-${label.replace(/\W/g, '-')}`} className="font-serif text-3xl text-ink">{value}</strong><span className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-ink-2">{label}</span></div>)}</div></motion.div><motion.div initial={{ opacity: 0, scale: reduce ? 1 : .98 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: .8, ease }} className="relative aspect-[1.3] overflow-hidden"><Image src={images.factory} alt="Bhavita Textiles packaging zone" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover transition-transform duration-[1200ms] hover:scale-[1.03]" /><span data-testid="factory-image-caption" className="absolute bottom-5 left-5 bg-bg/90 px-3 py-2 text-[9px] uppercase tracking-[0.18em] text-ink">Live packaging zone</span></motion.div></div></section>

      <section data-testid="why-bhavita-section" className="bg-bg py-24 sm:py-32"><div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-14"><div className="max-w-2xl"><p className="text-[10px] uppercase tracking-[0.28em] text-gold-2">Why Bhavita</p><h2 className="mt-5 font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl">Built for procurement teams that hate surprises.</h2></div><div className="mt-16 grid divide-y divide-border border-y border-border sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">{assurances.map(({ Icon, title, copy }) => <article key={title} className="group px-0 py-8 sm:px-8 sm:py-9 first:sm:pl-0 lg:px-9 lg:first:pl-0"><Icon size={21} strokeWidth={1.2} className="text-gold-2" /><h3 className="mt-6 font-serif text-2xl text-ink group-hover:text-gold-2">{title}</h3><p className="mt-3 text-sm leading-6 text-ink-2">{copy}</p></article>)}</div></div></section>

      <section data-testid="wholesale-cta" className="grain bg-ink py-24 text-bg sm:py-32"><div className="mx-auto flex max-w-[1440px] flex-col gap-10 px-6 sm:px-10 md:flex-row md:items-end md:justify-between lg:px-14"><div><p className="text-[10px] uppercase tracking-[0.28em] text-gold">Talk to the mill</p><h2 className="mt-5 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.035em] sm:text-6xl">Share your volume, sizes and brief. We&apos;ll return with a clear quote.</h2></div><Link href="/contact" data-testid="cta-contact-link" className="group inline-flex shrink-0 items-center gap-3 bg-bg px-7 py-4 text-[10px] uppercase tracking-[0.22em] text-ink hover:bg-gold">Send an enquiry <ArrowRight size={15} className="transition-transform duration-300 group-hover:translate-x-1" /></Link></div></section>
    </div>
  );
}