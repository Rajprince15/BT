import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found',
  description: 'The page you are looking for is no longer in this collection.',
};

export default function NotFound() {
  return (
    <section
      data-testid="not-found-page"
      className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-[var(--bg)] px-6 py-24 text-[var(--ink)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,_var(--gold-soft),_transparent_55%),radial-gradient(circle_at_85%_70%,_var(--surface-2),_transparent_60%)] opacity-80" />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <p className="font-serif text-[120px] leading-none tracking-[0.04em] text-[var(--gold)] md:text-[160px]">
          404
        </p>
        <span className="mx-auto mt-2 block h-px w-12 bg-[var(--gold)]" />
        <h1 className="mt-6 font-serif text-3xl leading-tight text-[var(--ink)] md:text-4xl">
          This page is not part of our atelier.
        </h1>
        <p className="mx-auto mt-4 max-w-md font-sans text-[14px] leading-relaxed text-[var(--ink-2)]">
          The thread you followed has been re-spun. Browse our newest collections or return
          to the home page to continue exploring.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            data-testid="not-found-home-link"
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--ink)] px-6 font-sans text-[12px] uppercase tracking-[0.24em] text-[var(--bg)] hover:bg-[var(--ink-2)]"
            style={{ transition: 'background-color 200ms' }}
          >
            Return home <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            href="/shop"
            data-testid="not-found-shop-link"
            className="inline-flex h-11 items-center rounded-full border border-[var(--gold)] px-6 font-sans text-[12px] uppercase tracking-[0.24em] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--surface)]"
            style={{ transition: 'background-color 200ms, color 200ms' }}
          >
            Browse collections
          </Link>
        </div>
      </div>
    </section>
  );
}
