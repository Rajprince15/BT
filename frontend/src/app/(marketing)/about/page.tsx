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
      {/* ───────────────────────── HERO ───────────────────────── */}
      <section
        data-testid="about-hero"
        className="relative min-h-[560px] overflow-hidden bg-bg"
      >
        {/* FIX: object-cover → object-contain so the full photo (including
            the tag/box branding) is always fully visible, never cropped.
            bg-bg on the wrapper matches the page background, so the
            letterbox space around the image blends in seamlessly instead
            of showing a hard edge. This is pure CSS — identical on every
            host (Netlify, Vercel, etc.), it's not a deployment setting. */}
        <div className="absolute inset-y-0 right-0 h-[300px] w-full bg-bg sm:h-[400px] lg:left-[55%] lg:h-full lg:w-[45%]">
          <Image
            src={images.hero}
            alt="Layered home textiles made for wholesale buyers"
            fill
            priority
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-contain"
          />

          <div className="absolute inset-0 bg-ink/10" />
        </div>

        <div className="absolute inset-0 bg-[linear-gradient(90deg,#F9F4EC_0%,rgba(249,244,236,.96)_38%,rgba(249,244,236,.38)_65%,transparent_80%)] lg:bg-[linear-gradient(90deg,#F9F4EC_0%,#F9F4EC_42%,rgba(249,244,236,.34)_63%,transparent_78%)]" />

        <Container className="relative z-10 flex min-h-[560px] items-end pb-12 pt-[250px] sm:pt-[320px] lg:items-center lg:pb-20 lg:pt-20">
          <div className="max-w-[590px]">
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
        className="grid lg:grid-cols-[42%_58%]"
      >
        {/* FIX: object-cover → object-contain, bg-bg added so the loom
            photo is always shown whole, with any letterbox space blending
            into the page background instead of cropping the hand/loom. */}
        <div className="relative min-h-[360px] bg-bg">
          <Image
            src={images.story}
            alt="Hands working at a traditional textile loom"
            fill
            sizes="(min-width: 1024px) 42vw, 100vw"
            className="object-contain"
          />

          <div className="absolute inset-0 bg-transparent" />

          <div className="hidden">
            <div>
              <p className="text-[10px] uppercase tracking-[.2em] text-gold">
                ✦ Our story ✦
              </p>

              <h2 className="mt-3 font-serif text-5xl">
                From tradition
                <br />
                to tomorrow.
              </h2>
            </div>
          </div>
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

          {/* FIX: these 4 cards also switched to object-contain so no part
              of any product photo is cropped. Note: since these are plain
              stock photos (no baked text) with varied aspect ratios, this
              will show visible letterbox bars in some cards — if that looks
              too inconsistent, this is the one place a controlled crop
              (object-cover) is usually preferred purely for visual tidiness
              since nothing important is lost. Left as object-contain here
              to follow the "never crop, anywhere" rule strictly; flip back
              to object-cover on this grid specifically if you'd rather have
              a tighter, uniform card look. */}
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
                  className="object-contain transition-transform duration-500 hover:scale-105"
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

      {/* ─────────────────────── OUR VALUES ─────────────────────── */}
      <section
        id="values"
        data-testid="about-values"
        className="relative overflow-hidden bg-cream-panel py-12 sm:py-14"
      >
        {/* FIX: previously mixed fixed width={360} height={520} props with
            conflicting Tailwind sizing (h-full w-[42%]), producing
            unreliable rendering — and used object-cover, which cropped the
            fabric photo. Now uses `fill` inside a properly sized relative
            wrapper with object-contain, so the full image always shows;
            the wrapper has no background override so the section's own
            bg-cream-panel shows through any letterbox space automatically. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 hidden h-full w-[42%] lg:block"
        >
          <Image
            src={images.values}
            alt=""
            fill
            sizes="42vw"
            className="object-contain opacity-95 mix-blend-multiply"
          />
        </div>

        <Container className="relative z-10">
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

          <p className="hidden">
            “Rooted in values.
            <br />
            Growing with purpose.”
          </p>
        </Container>
      </section>

      {/* ───────────────── MANUFACTURING STRENGTH ───────────────── */}
      <section
        id="strength"
        data-testid="about-strength"
        className="grid lg:grid-cols-[34%_66%]"
      >
        {/* FIX: object-cover → object-contain, bg-bg added so the block-
            print photo is always shown whole. */}
        <div className="relative min-h-[360px] bg-bg">
          <Image
            src={images.custom}
            alt="Block printing by hand on Indian textile"
            fill
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="object-contain"
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

      {/* ─────────────────── OUR INDIA PRESENCE ─────────────────── */}
      <section
        data-testid="about-global"
        className="py-16 sm:py-20"
      >
        <Container className="grid gap-8 lg:grid-cols-[.9fr_1.35fr_.65fr] lg:items-center">
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

          {/* FIX: previously rendered images.india (a raster PNG,
              object-contain — already correct and fully visible) stacked
              UNDERNEATH this SVG map at z-10, so the PNG was 100% hidden,
              not cropped. Kept the SVG only, since it's branded, labeled
              with cities, and matches the site's color tokens. If the
              photographic map should be the one shown instead, delete the
              <svg> block below and re-add:
              <Image src={images.india} alt="India supply network" fill
                className="object-contain p-5" sizes="35vw" /> */}
          <div
            data-testid="india-map-panel"
            className="relative flex min-h-[390px] items-center justify-center overflow-hidden border-y border-border bg-cream-panel/50"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(173,130,71,.12)_1px,transparent_1px)] bg-[length:18px_18px]" />

            <svg
              viewBox="0 0 420 500"
              role="img"
              aria-label="Stylised map of India showing textile supply hubs"
              className="relative z-10 h-[350px] w-full max-w-[340px]"
            >
              <path
                d="M174 18 205 35l17 26 25 17 15 27 12 15 26 19 14 27 26 14-16 21-5 25 18 24-8 24-14 16-9 36-14 19-9 28-14 17-19 31-25 33-17 26-17-24-16-26-13-25-20-22-15-28-18-20-10-28-15-20 13-21-7-22 12-20 14-14-8-24 17-13 15-18 18-13 7-26-3-22 8-26Z"
                fill="#E7DECE"
                stroke="#AD8247"
                strokeWidth="3"
              />

              <path
                d="M174 18 205 35m-43 110 41 27m-72 30 47 10m-35 39 55 7m-30 34 51 13m-26 40 54 5m-16 37 38-6m-4-324 17 47m-55 17 72 13m-81 48 78 9"
                fill="none"
                stroke="#BE9C6C"
                strokeWidth="1"
                strokeDasharray="4 5"
              />

              <path
                d="M193 40 180 86 160 138 148 196 135 251 153 306 177 359 201 418 223 458"
                fill="none"
                stroke="#AD8247"
                strokeWidth="1.5"
                strokeDasharray="3 7"
              />

              <g
                fill="#0C3832"
                stroke="#F0E6CD"
                strokeWidth="3"
              >
                <circle cx="165" cy="139" r="7" />
                <circle cx="176" cy="170" r="7" />
                <circle cx="143" cy="211" r="7" />
                <circle cx="190" cy="257" r="7" />
                <circle cx="210" cy="332" r="7" />
                <circle cx="239" cy="290" r="7" />
                <circle cx="254" cy="198" r="7" />
              </g>

              <g
                fill="#2A2620"
                fontSize="10"
                fontFamily="Montserrat, sans-serif"
              >
                <text x="179" y="137">Panipat</text>
                <text x="189" y="169">Delhi</text>
                <text x="101" y="212">Mumbai</text>
                <text x="199" y="256">Jaipur</text>
                <text x="219" y="334">Bengaluru</text>
                <text x="250" y="287">Kolkata</text>
                <text x="264" y="196">Chennai</text>
              </g>
            </svg>
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