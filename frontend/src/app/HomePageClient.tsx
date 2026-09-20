'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BedDouble, Building2, Gift, Globe2, Hospital, Hotel, Package, Palmtree, PencilRuler, Sprout, Store, Truck, Users, Wrench } from 'lucide-react';
import Container from '@/components/common/Container';
import CatalogueDownloadButton from '@/components/common/CatalogueDownloadButton';
import { useCategories } from '@/hooks/useCategories';

const images = {
  hero: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1800&q=85',
  bedroom: 'https://bhavitatextiles.lovable.app/assets/product-bedsheet-styled-B1ras_mT.jpg',
  living: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85',
  bath: 'https://bhavitatextiles.lovable.app/assets/product-mink-blankets-Cd-j1YKi.jpg',
  decor: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85',
  handloom: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=900&q=85',
  handicrafts: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=900&q=85',
  custom: 'https://bhavitatextiles.lovable.app/assets/product-bedsheet-styled-B1ras_mT.jpg',
};
const ease = [0.22, 1, 0.36, 1] as const;
const collections = [
  ['Bedroom Collection', 'Bedsheets | Blankets | Comforters\nPillows | Bedding Accessories', images.bedroom, '/shop/bedroom'],
  ['Living Room Collection', 'Sofa Furnishing | Curtains\nRugs & Carpets | Door Mats', images.living, '/shop/living-room'],
  ['Bath Collection', 'Towels | Bath Mats', images.bath, '/shop/bath'],
  ['Home Décor', 'Wall Décor | Table Linen\nDecorative Textiles | Festive Collection', images.decor, '/shop/home-decor'],
  ['Handloom Heritage', 'Jaipur Prints | Block Prints\nEthnic Weaves | Artisan Collection', images.handloom, '/shop/handloom-heritage'],
  ['Handicrafts Collection', 'Handmade Accessories\nTraditional Crafts | Gift Collection', images.handicrafts, '/shop/handicrafts'],
] as const;
const audiences = [[Hotel, 'HOTELS', 'Premium linen for luxurious hospitality'], [Palmtree, 'RESORTS', 'Comfort meets elegance'], [Hospital, 'HOSPITALS', 'Hygienic, durable and reliable'], [BedDouble, 'HOSTELS', 'Quality textiles for everyday use'], [Store, 'RETAIL STORES', 'Wide range for retail businesses'], [PencilRuler, 'INTERIOR DESIGNERS', 'Custom collections for unique spaces'], [Gift, 'CORPORATE GIFTING', 'Thoughtful gifting solutions']] as const;
const heroFeatures = [[Sprout, 'Premium Quality'], [Building2, 'Bulk Manufacturing Capability'], [PencilRuler, 'Customisation Available'], [Globe2, 'Pan India & Global Supply']] as const;

export default function HomePageClient() {
  const reduce = useReducedMotion();
  const { data: availableCategories } = useCategories();
  const visibleCollections = availableCategories
    ? collections.filter(([, , , href]) => availableCategories.some((category) => href === `/shop/${category.slug}` || href.startsWith(`/shop/${category.slug}/`)))
    : collections;
  const reveal = { hidden: { opacity: 0, y: reduce ? 0 : 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.65, ease } } };
  return <main data-testid="home-page" className="overflow-hidden bg-bg text-ink">
    <section data-testid="hero-section" className="relative min-h-[620px] overflow-hidden bg-bg">
      <Image src={images.hero} alt="Premium home textiles for bulk buyers" fill priority sizes="(min-width: 1024px) 45vw, 100vw" className="object-cover lg:left-[55%] lg:w-[45%] lg:max-w-none" />
      <div className="absolute right-5 top-6 z-10 hidden max-w-[150px] border-l border-gold/60 pl-4 text-[10px] uppercase leading-5 tracking-[.18em] text-bg lg:block">Trusted by businesses.<br />Crafted for tomorrow.</div>
      <div className="absolute inset-0 bg-gradient-to-r from-bg via-bg/95 via-[42%] to-transparent" />
      <Container className="relative z-10 flex min-h-[620px] items-center py-20"><motion.div variants={reveal} initial="hidden" animate="show" className="max-w-xl">
        <p data-testid="hero-eyebrow" className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand">WHOLESALE TEXTILE SOLUTIONS</p>
        <h1 data-testid="hero-heading" className="mt-5 font-serif text-[40px] leading-[1.05] sm:text-[44px]">Premium Home Textiles<br /><em className="font-normal">for</em> Bulk Buyers</h1>
        <p className="mt-5 font-serif text-2xl text-ink-2">Woven with tradition. Delivered at scale.</p>
        <p data-testid="hero-description" className="mt-6 max-w-lg text-[15px] leading-7 text-ink-2">Bhavita Textiles is a trusted wholesale manufacturer and supplier of premium home textiles, offering consistency, quality and customisation for businesses across India and worldwide.</p>
        <Link href="/wholesale" data-testid="hero-quote-link" className="mt-7 inline-flex items-center gap-3 bg-gold px-6 py-3 text-[11px] font-semibold uppercase tracking-[.18em] text-white">Partner with us <ArrowRight size={16} /></Link>
        <div data-testid="hero-features" className="mt-8 grid grid-cols-2 gap-y-5 border-t border-gold/25 pt-5 sm:grid-cols-4 sm:gap-y-0">
          {heroFeatures.map(([Icon, label], index) => (
            <div key={label} className={`flex items-center gap-2 pr-3 text-[10px] font-semibold leading-4 text-ink-2 sm:min-h-14 sm:justify-center sm:px-4 sm:text-center ${index > 0 ? 'sm:border-l sm:border-gold/25' : ''}`}>
              <Icon className="size-8 shrink-0 text-gold" strokeWidth={1.35} />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </motion.div></Container>
    </section>
    <section data-testid="featured-range" className="py-16"><Container><div className="text-center"><p className="text-brand">✦</p><h2 data-testid="featured-heading" className="mt-2 font-serif text-3xl uppercase tracking-[.12em]">Our Wholesale Collections</h2><p className="mt-2 text-sm text-ink-2">A complete range of home textiles for your business needs</p></div><div className="mt-10 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">{visibleCollections.map(([title, copy, image, href], i) => <Link href={href} key={title} data-testid={`product-category-card-${i + 1}`} className="group border border-border bg-bg pb-5"><div className="relative aspect-[1.25] overflow-hidden"><Image src={image} alt={title} fill sizes="20vw" className="object-cover transition-transform duration-500 group-hover:scale-105" /></div><h3 className="mt-4 px-3 text-center text-[11px] font-semibold uppercase">{title}</h3><p className="mt-2 whitespace-pre-line px-3 text-center text-[10px] leading-5 text-ink-2">{copy}</p><span className="mt-3 flex justify-center text-[10px] font-semibold uppercase tracking-wider2 text-brand">View range →</span></Link>)}</div></Container></section>
    <section data-testid="home-stats" className="bg-ink py-8 text-bg"><Container className="grid grid-cols-2 gap-5 text-center sm:grid-cols-5">{[['500+', 'Satisfied Business Clients'], ['10+', 'Product Categories'], ['PAN INDIA', 'Supply Network'], ['EXPORT READY', 'Global Deliveries'], ['CONSISTENT', 'Quality & Timely Delivery']].map(([value, label]) => <div key={value} className="border-border/40 sm:border-r last:border-0"><strong className="font-serif text-2xl text-gold">{value}</strong><span className="mt-2 block text-[10px] uppercase tracking-wider2">{label}</span></div>)}</Container></section>
    <section data-testid="audience-section" className="py-16"><Container><div className="text-center"><h2 className="font-serif text-3xl uppercase tracking-[.12em]">Who Do We Supply To?</h2><p className="mt-2 text-sm text-ink-2">Trusted textile partner for businesses across industries</p></div><div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-7">{audiences.map(([Icon, title, copy]) => <div key={title} className="text-center"><Icon className="mx-auto size-8 text-brand" strokeWidth={1.3} /><h3 className="mt-4 text-[11px] font-semibold">{title}</h3><p className="mt-2 text-xs leading-5 text-ink-2">{copy}</p></div>)}</div></Container></section>
    <section data-testid="manufacturing-process" className="grid lg:grid-cols-2"><div className="relative min-h-[360px]"><Image src={images.custom} alt="Custom textile manufacturing" fill sizes="50vw" className="object-cover" /></div><div className="grid sm:grid-cols-2"><div className="bg-ink p-10 text-bg"><p className="text-[10px] uppercase tracking-[.2em] text-gold">CUSTOM MANUFACTURING</p><h2 className="mt-4 font-serif text-4xl">Your Vision.<br />Our Expertise.</h2><p className="mt-5 text-sm leading-6 text-bg/75">Looking for custom sizes, designs, labels or packaging? We work closely with our B2B clients to deliver tailored textile solutions that match your quality standards and budget.</p><Link href="/contact" className="mt-6 inline-flex bg-brand px-5 py-3 text-[10px] font-semibold uppercase text-brand-ink">Request customisation →</Link></div><div className="p-10"><h2 className="font-serif text-3xl uppercase tracking-[.08em]">Our Wholesale Process</h2><p className="mt-2 text-sm text-ink-2">Simple. Transparent. Reliable.</p><div className="mt-8 grid grid-cols-2 gap-6">{[[Users,'1. ENQUIRE','Share your requirements'],[Package,'2. GET QUOTE','Receive pricing & samples'],[Wrench,'3. CONFIRM','Customisation & bulk order'],[Truck,'4. DELIVERY','On-time at your doorstep']].map(([Icon, title, copy]) => <div key={title as string}><Icon className="size-7 text-brand" /><h3 className="mt-3 text-[10px] font-semibold">{title as string}</h3><p className="mt-2 text-xs leading-5 text-ink-2">{copy as string}</p></div>)}</div></div></div></section>
    <section data-testid="wholesale-cta" className="bg-surface-2 py-16"><Container className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between"><div><h2 className="font-serif text-4xl">Let&apos;s Grow Together</h2><p className="mt-2 text-sm text-ink-2">Partner with Bhavita Textiles for bulk orders and long-term collaborations.</p></div><div className="flex flex-wrap gap-3"><Link href="/wholesale" className="bg-brand px-6 py-3 text-[10px] font-semibold uppercase text-brand-ink">Get wholesale quote →</Link><CatalogueDownloadButton className="border border-ink/20 px-6 py-3 text-[10px] font-semibold uppercase" /></div></Container></section>
  </main>;
}
