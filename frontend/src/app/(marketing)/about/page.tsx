import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  Check,
  Globe2,
  Heart,
  Leaf,
  Handshake,
  Users,
} from 'lucide-react';

import Container from '@/components/common/Container';
import CatalogueDownloadButton from '@/components/common/CatalogueDownloadButton';

export const metadata: Metadata = {
  title: 'About Us | Bhavita Textiles',
  description:
    'Indian roots. Global reach. A trusted wholesale partner in home textiles.',
};

const images = {
  hero: '/images/aboutpage_firstsection.png',
  story: '/images/aboutpage_secondsection.png',
  custom: '/images/aboutpage_manufacturingsection.png',
  values: '/images/aboutpage_valuesection.png',
  india: '/images/panIndia.png',
};

const whatWeDoImages = [
  ['PREMIUM QUALITY', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=90'],
  ['WIDE RANGE', 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=90'],
  ['CUSTOM SOLUTIONS', 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=90'],
  ['RELIABLE SUPPLY', 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=900&q=90'],
] as const;

const values = [
  [Leaf, 'QUALITY IN EVERYTHING WE DO'],
  [Users, 'LOYAL PARTNERSHIPS'],
  [Heart, 'ETHICAL PRACTICES'],
  [Handshake, 'RESPECTING TRADITION'],
  [Globe2, 'A SUSTAINABLE TOMORROW'],
] as const;

const stats = [
  ['10+', 'YEARS OF EXPERIENCE'],
  ['500+', 'SATISFIED BUSINESS CLIENTS'],
  ['1000+', 'PRODUCT VARIANTS'],
  ['PAN INDIA', 'SUPPLY NETWORK'],
  ['25+', 'COUNTRIES SERVED'],
] as const;

export default function AboutPage() {
  return (
    <main
      data-testid="about-page"
      className="overflow-hidden bg-bg text-ink"
    >
      {/* ───────────────────────── HERO ─────────────────────────
          Image keeps its natural aspect ratio (no crop, no letterbox bars).
          `.photo-fade` (globals.css) melts its edges into the cream page. */}
      <section
        data-testid="about-hero"
        className="relative overflow-hidden bg-bg lg:min-h-[560px]"
      >
        <div className="relative w-full lg:absolute lg:inset-y-0 lg:left-[55%] lg:flex lg:w-[45%] lg:items-center">
          <Image
            src={images.hero}
            alt="Layered home textiles made for wholesale buyers"
            width={0}
            height={0}
            sizes="(min-width: 1024px) 45vw, 100vw"
            priority
            style={{ width: '100%', height: 'auto' }}
            className="photo-fade block"
          />
        </div>

        <Container className="relative z-10 py-12 lg:flex lg:min-h-[560px] lg:items-center lg:py-20">
          <div className="max-w-[590px] lg:max-w-[min(590px,48vw)]">
            <p
              data-testid="about-eyebrow"
              className="text-[11px] font-semibold uppercase tracking-[.22em] text-brand"
            >
              About us
            </p>

            <h1
              data-testid="about-heading"
              className="mt-5 font-serif text-5xl leading-[.98] sm:text-6xl"
            >
              A legacy woven
              <br />
              into every thread
            </h1>

            <p className="mt-5 font-accent text-2xl italic text-ink-2">
              Indian roots. Global reach. A trusted wholesale partner in home
              textiles.
            </p>

            <p
              data-testid="about-intro"
              className="mt-6 max-w-xl text-[14px] leading-7 text-ink-2 sm:text-[15px]"
            >
              At Bhavita Textiles, we bring together the richness of Indian
              heritage and modern manufacturing to create premium home textiles
              for businesses across the world. With a passion for quality,
              craftsmanship, and long-term partnerships, we are committed to
              making beautiful homes possible — at scale.
            </p>

            <Link
              href="/about#story"
              data-testid="about-journey-link"
              className="mt-7 inline-flex items-center gap-3 bg-gold px-6 py-3 text-[10px] font-semibold uppercase tracking-[.16em] text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-gold-2"
            >
              Our journey
              <ArrowRight size={15} />
            </Link>
          </div>
        </Container>

        <div className="hidden">
          More than textiles.
          <br />
          A partner in progress.
        </div>
      </section>

      {/* ─────────────────────── OUR STORY ─────────────────────── */}
      <section
        id="story"
        data-testid="about-story"
        className="grid lg:grid-cols-[42%_58%] lg:items-center"
      >
        <div className="bg-bg">
          <Image
            src={images.story}
            alt="Hands working at a traditional textile loom"
            width={0}
            height={0}
            sizes="(min-width: 1024px) 42vw, 100vw"
            style={{ width: '100%', height: 'auto' }}
            className="block"
          />
        </div>

        <div className="relative flex items-center overflow-hidden p-10 lg:p-16">
          <div className="relative z-10 max-w-xl text-sm leading-7 text-ink-2">
            <p data-testid="about-story-copy-one">
              Bhavita Textiles was founded with a simple belief — Indian
              craftsmanship deserves a global stage. What started as a
              family-driven passion for textiles has grown into a trusted
              wholesale brand serving clients across India and international
              markets.
            </p>

            <p
              data-testid="about-story-copy-two"
              className="mt-5"
            >
              With years of experience in textile manufacturing and sourcing,
              we combine traditional artistry with modern processes to deliver
              consistent quality, customised solutions, and reliable supply —
              for businesses of every size.
            </p>

            <div className="mt-8 border-t border-gold/40 pt-5">
              <p className="font-accent text-2xl italic text-brand">
                “Tradition inspires us.
                <br />
                Your trust drives us.”
              </p>
            </div>
          </div>

          <Image
            src="/images/feather.png"
            alt=""
            width={260}
            height={400}
            className="pointer-events-none absolute -right-4 bottom-0 w-40 rotate-[22deg] opacity-35 mix-blend-multiply"
          />
        </div>
      </section>

      {/* ─────────────────────── STATS STRIP ─────────────────────── */}
      <section
        data-testid="about-stats"
        className="border-y border-border bg-bg"
      >
        <Container className="grid grid-cols-2 sm:grid-cols-[repeat(5,1fr)_1.35fr]">
          {stats.map(([value, label], index) => (
            <div
              key={value}
              data-testid={`about-stat-${index + 1}`}
              className="border-r border-border px-4 py-8 text-center last:border-0"
            >
              <strong className="font-serif text-3xl text-brand">
                {value}
              </strong>

              <span className="mt-2 block text-[10px] font-semibold uppercase tracking-wider2 text-ink-2">
                {label}
              </span>
            </div>
          ))}

          <div className="flex min-h-28 items-center justify-center bg-dark-green px-6 py-5 text-center text-bg sm:min-h-0">
            <p className="font-serif text-lg uppercase tracking-[.12em] text-gold">
              Trusted by businesses.
              <br />
              Crafted for tomorrow.
            </p>
          </div>
        </Container>
      </section>

      {/* ─────────────────────── WHAT WE DO ─────────────────────── */}
      <section
        data-testid="about-what-we-do"
        className="py-16 sm:py-20"
      >
        <Container className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-center">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.2em] text-gold">
              The Bhavita way
            </p>

            <h2
              data-testid="what-we-do-heading"
              className="mt-3 font-serif text-4xl"
            >
              What we do
            </h2>

            <span className="mt-5 block h-px w-14 bg-gold" />

            <p className="mt-5 max-w-md text-sm leading-7 text-ink-2">
              We manufacture and supply a wide range of home textiles
              including bed linen, blankets, towels, curtains, rugs, home
              décor, handloom collections and handicrafts — designed for
              hotels, resorts, hospitals, retail stores, interior designers
              and more.
            </p>

            <Link
              href="/shop"
              data-testid="about-collection-link"
              className="mt-6 inline-flex items-center gap-2 bg-gold px-6 py-3 text-[10px] font-semibold uppercase text-white transition-[transform,background-color] duration-200 hover:-translate-y-0.5 hover:bg-gold-2"
            >
              View our collection
              <ArrowRight size={13} />
            </Link>
          </div>

          {/* Uniform stock-photo tiles with no baked-in text: a tight crop
              (object-cover) looks cleaner here than letterbox bars. */}
          <div
            data-testid="what-we-do-grid"
            className="grid grid-cols-2 gap-2 sm:grid-cols-4"
          >
            {whatWeDoImages.map(([label, image], index) => (
              <div
                key={label}
                data-testid={`what-we-do-card-${index + 1}`}
                className="relative aspect-[.75] overflow-hidden bg-surface"
              >
                <Image
                  src={image}
                  alt={label}
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 640px) 25vw, 50vw"
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-ink/85 to-transparent" />

                <span className="absolute bottom-5 left-2 right-2 text-center text-[10px] font-semibold tracking-[.08em] text-bg">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ─────────────────────── OUR VALUES ───────────────────────
          The photo (fabric + "Rooted in values" quote) is one baked image:
          natural ratio, no blend/opacity tint, edges feathered with
          `.photo-fade-panel`. Values column is capped at 60% so it never
          runs under the image. On mobile the image simply follows the grid. */}
      <section
        id="values"
        data-testid="about-values"
        className="relative overflow-hidden bg-cream-panel py-12 sm:py-14 lg:min-h-[340px]"
      >
        <Container className="relative z-10">
          <div className="lg:max-w-[60%]">
            <h2
              data-testid="values-heading"
              className="font-serif text-4xl sm:text-5xl"
            >
              Our Values
            </h2>

            <div
              data-testid="values-grid"
              className="mt-8 grid grid-cols-2 gap-y-8 sm:grid-cols-5 sm:gap-y-0"
            >
              {values.map(([Icon, label], index) => (
                <div
                  key={label}
                  data-testid={`value-card-${index + 1}`}
                  className="text-center"
                >
                  <Icon
                    className="mx-auto size-8 text-gold"
                    strokeWidth={1.3}
                  />

                  <p className="mt-4 text-[10px] font-semibold leading-4">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Container>

        <div className="relative mt-8 lg:absolute lg:inset-y-0 lg:right-0 lg:mt-0 lg:flex lg:w-[36%] lg:max-w-[820px] lg:items-center">
          <Image
            src={images.values}
            alt="Rooted in values. Growing with purpose."
            width={0}
            height={0}
            sizes="(min-width: 1024px) 36vw, 100vw"
            style={{ width: '100%', height: 'auto' }}
            className="photo-fade-panel block"
          />
        </div>
      </section>

      {/* ───────────────── MANUFACTURING STRENGTH ───────────────── */}
      <section
        id="strength"
        data-testid="about-strength"
        className="grid lg:grid-cols-[34%_66%] lg:items-center"
      >
        <div className="bg-bg">
          <Image
            src={images.custom}
            alt="Block printing by hand on Indian textile"
            width={0}
            height={0}
            sizes="(min-width: 1024px) 34vw, 100vw"
            style={{ width: '100%', height: 'auto' }}
            className="block"
          />
        </div>

        <div className="grid sm:grid-cols-2">
          <div className="p-10 sm:p-12">
            <h2 className="font-serif text-3xl">
              Our manufacturing strength
            </h2>

            <p className="mt-4 text-sm leading-7 text-ink-2">
              Our facilities and skilled artisans enable us to produce
              high-quality textiles with precision, scalability and
              flexibility.
            </p>

            <ul className="mt-5 space-y-3 text-xs text-ink-2">
              {[
                'In-house & partner manufacturing units',
                'Skilled artisans & experienced workforce',
                'Customisation in designs, sizes, fabrics & packaging',
                'Strict quality control at every stage',
                'Large-scale production with timely delivery',
              ].map((item, index) => (
                <li
                  key={item}
                  data-testid={`strength-point-${index + 1}`}
                  className="flex gap-2"
                >
                  <Check className="size-4 shrink-0 text-gold" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border p-10 sm:border-l sm:border-t-0 sm:p-12">
            <Leaf className="size-9 text-gold" />

            <h2 className="mt-5 font-serif text-3xl">
              Sustainable future
            </h2>

            <p className="mt-4 text-sm leading-7 text-ink-2">
              We are committed to responsible manufacturing by promoting
              eco-friendly materials, ethical sourcing and practices that
              support traditional crafts and local communities.
            </p>

            <Link
              href="/about#values"
              data-testid="sustainability-link"
              className="mt-6 inline-flex items-center gap-2 bg-gold px-5 py-3 text-[10px] font-semibold uppercase text-white"
            >
              Our sustainability
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─────────────────── OUR INDIA PRESENCE ───────────────────
          Middle column = panIndia.png at natural ratio, edges feathered
          by `.photo-fade-soft` so it melts into the cream background. */}
      <section
        data-testid="about-global"
        className="py-16 sm:py-20"
      >
        <Container className="grid gap-8 lg:grid-cols-[.8fr_1.7fr_.7fr] lg:items-center">
          <div>
            <Globe2 className="size-9 text-gold" />

            <h2
              data-testid="global-presence-heading"
              className="mt-4 font-serif text-3xl"
            >
              Our India Presence
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-7 text-ink-2">
              From Panipat to businesses across India, our textiles are
              trusted by hotels, retailers, hospitals and interior partners.
              We continue to expand our reach through dependable quality,
              reliability and service excellence.
            </p>
          </div>

          <div
            data-testid="india-map-panel"
            className="relative"
          >
            <Image
              src={images.india}
              alt="Map of India showing our pan-India supply network and export routes"
              width={0}
              height={0}
              sizes="(min-width: 1024px) 55vw, 100vw"
              style={{ width: '100%', height: 'auto' }}
              className="photo-fade-soft block"
            />
          </div>

          <div className="border-l border-border pl-7 text-right">
            <p className="font-serif text-xl uppercase tracking-[.12em] text-brand">
              Indian textiles
              <br />
              for a brighter,
              <br />
              more beautiful tomorrow.
            </p>

            <span className="mt-5 block text-gold">— ✦ —</span>
          </div>
        </Container>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section
        data-testid="about-cta"
        className="relative overflow-hidden bg-dark-green py-16 text-bg"
      >
        <Image
          src="/images/feather.png"
          alt=""
          width={270}
          height={400}
          className="pointer-events-none absolute bottom-[-75px] right-3 hidden w-40 rotate-[18deg] opacity-80 md:block"
        />

        <Container className="relative z-10 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[.22em] text-gold">
            Quality · Partnership · Growth
          </p>

          <h2
            data-testid="about-cta-heading"
            className="mt-3 font-serif text-4xl sm:text-5xl"
          >
            Let&apos;s build something beautiful together
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm text-bg/75">
            Partner with Bhavita Textiles for reliable supply, customised
            solutions and long-term growth.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/wholesale"
              data-testid="about-wholesale-cta-link"
              className="inline-flex items-center gap-2 bg-gold px-6 py-3 text-[10px] font-semibold uppercase text-white"
            >
              Get wholesale quote
              <ArrowRight size={13} />
            </Link>

            <CatalogueDownloadButton className="border border-bg/50 px-6 py-3 text-[10px] font-semibold uppercase text-bg transition-[background-color,color] duration-200 hover:bg-bg hover:text-dark-green" />
          </div>
        </Container>
      </section>
    </main>
  );
}