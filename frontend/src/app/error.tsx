'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line no-console
      console.error('[BHAVITA] Unhandled error boundary:', error);
    }
  }, [error]);

  return (
    <section
      data-testid="root-error-boundary"
      className="relative isolate flex min-h-[70vh] items-center justify-center overflow-hidden bg-[var(--bg)] px-6 py-24 text-[var(--ink)]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,_var(--gold-soft),_transparent_55%),radial-gradient(circle_at_90%_80%,_var(--surface-2),_transparent_60%)] opacity-80" />
      <div className="relative z-10 mx-auto max-w-xl text-center">
        <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-[var(--gold)]">
          A small interruption
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-[var(--ink)] md:text-5xl">
          Something has come undone in the atelier.
        </h1>
        <p className="mx-auto mt-5 max-w-md font-sans text-[14px] leading-relaxed text-[var(--ink-2)]">
          The weavers have been informed. Please refresh to try again, or return to the
          home page while we mend the thread.
        </p>
        {error?.digest && (
          <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--ink-2)]">
            Ref · {error.digest}
          </p>
        )}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            data-testid="error-reset-btn"
            onClick={() => reset()}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[var(--gold)] px-6 font-sans text-[12px] uppercase tracking-[0.24em] text-[var(--surface)] hover:bg-[var(--gold-2)]"
            style={{ transition: 'background-color 200ms, color 200ms' }}
          >
            <RefreshCcw size={14} aria-hidden="true" /> Try again
          </button>
          <Link
            href="/"
            data-testid="error-home-link"
            className="inline-flex h-11 items-center rounded-full border border-[var(--gold)] px-6 font-sans text-[12px] uppercase tracking-[0.24em] text-[var(--gold)] hover:bg-[var(--gold)] hover:text-[var(--surface)]"
            style={{ transition: 'background-color 200ms, color 200ms' }}
          >
            Return home
          </Link>
        </div>
      </div>
    </section>
  );
}
