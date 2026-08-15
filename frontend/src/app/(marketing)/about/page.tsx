import type { Metadata } from 'next';
import Container from '@/components/common/Container';

export const metadata: Metadata = {
  title: 'About Bhavita Textiles',
  description:
    'Bhavita Textiles is a premium home-furnishing atelier translating India’s handloom heritage into modern luxury for elegant living.',
};

const CRAFT = [
  { title: 'Handloom heritage', copy: 'Sanganeri, Bagru and Maheshwari villages weave every fabric on wooden pit-looms.' },
  { title: 'Natural dyes', copy: 'Indigo, madder and turmeric — the tones our grandmothers slept in, still soft on the skin.' },
  { title: 'Ateliers, not factories', copy: 'Small teams. Long hours. Prices that pay the maker as much as they pay us.' },
];

export default function AboutPage() {
  return (
    <main data-testid="about-page" className="bg-bg">
      <section className="border-b border-border bg-surface-2/40">
        <Container className="grid gap-10 py-20 md:grid-cols-[1.1fr_.9fr] md:items-center md:py-28">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Our story</p>
            <h1 className="mt-4 font-serif text-5xl leading-tight text-ink md:text-6xl">
              A quieter kind of luxury.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-ink-2">
              Bhavita Textiles began as a project between weavers in Rajasthan and a small studio in Jaipur.
              A decade later, we make heirloom-grade bed linen, drapery and rugs for homes across India — one
              hand-finished piece at a time.
            </p>
          </div>
          <div className="aspect-[4/5] rounded-3xl border border-gold/20 bg-[linear-gradient(135deg,_#F3EEE3,_#E5DDC9)]" aria-hidden />
        </Container>
      </section>

      <section className="border-b border-border">
        <Container className="grid gap-8 py-20 md:grid-cols-3">
          {CRAFT.map((item) => (
            <article key={item.title} data-testid={`about-pillar-${item.title.toLowerCase().replace(/\s+/g, '-')}`}
              className="rounded-2xl border border-border bg-surface p-8"
            >
              <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Craft</p>
              <h2 className="mt-3 font-serif text-2xl text-ink">{item.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-2">{item.copy}</p>
            </article>
          ))}
        </Container>
      </section>

      <section className="bg-navy text-bg">
        <Container className="py-20 text-center">
          <p className="text-xs uppercase tracking-[.35em] text-gold-soft">A promise</p>
          <blockquote className="mx-auto mt-6 max-w-2xl font-serif text-3xl leading-snug md:text-4xl">
            “Every piece leaves our workshop carrying a name — the weaver’s, then ours, then yours.”
          </blockquote>
          <p className="mt-6 text-xs uppercase tracking-wider2 text-bg/60">— Bhavita, Founder</p>
        </Container>
      </section>
    </main>
  );
}
