'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { Mail, ShieldCheck, Sparkles } from 'lucide-react';
import Container from '@/components/common/Container';
import newsletterService from '@/services/newsletter.service';

const EMAIL_RE = /^[^s@]+@[^s@]+.[^s@]+$/;

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  /** Honeypot field — bots fill it; humans don't. */
  const [hp, setHp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (hp.trim().length > 0) {
      // Silent success for bots — keep them out of analytics.
      setDone(true);
      return;
    }

    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setError('Please enter a valid email address.');
      return;
    }

    startTransition(() => {
      newsletterService
        .subscribe({ email: value })
        .then(() => {
          setDone(true);
          setEmail('');
          toast.success('You are on the list', {
            description: 'Check your inbox to confirm the subscription.',
          });
        })
        .catch((err: unknown) => {
          const message = err instanceof Error ? err.message : 'Something went wrong.';
          setError(message);
          toast.error('Subscription failed', { description: message });
        });
    });
  }

  return (
    <section
      data-testid="newsletter-signup"
      className="bg-[color-mix(in_oklab,var(--gold-soft)_45%,var(--bg))] py-20 md:py-28"
    >
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <Sparkles aria-hidden className="mx-auto size-7 text-gold" />
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider2 text-gold">
            The Atelier Dispatch
          </p>
          <h2 className="mt-3 font-serif text-4xl leading-[1.05] text-ink md:text-5xl">
            Heirloom edits, first looks, founder notes.
          </h2>
          <p className="mt-4 text-[15px] leading-relaxed text-ink-2">
            One thoughtful letter a month. Private previews, weaver stories and a small
            welcome surprise for new subscribers.
          </p>

          {done ? (
            <div
              role="status"
              data-testid="newsletter-success"
              className="mx-auto mt-10 max-w-xl rounded-md border border-gold/40 bg-bg p-7 text-left"
            >
              <p className="font-serif text-2xl text-ink">You&apos;re almost in.</p>
              <p className="mt-2 text-[14px] leading-relaxed text-ink-2">
                We&apos;ve sent a confirmation note to your inbox. Tap the link inside to
                join the dispatch — we use double opt-in to honour your privacy.
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              noValidate
              data-testid="newsletter-form"
              className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row"
            >
              {/* Honeypot — visually hidden, ignored by humans. */}
              <label className="sr-only" aria-hidden="true">
                Leave this field empty
                <input
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={hp}
                  onChange={(e) => setHp(e.target.value)}
                  data-testid="newsletter-honeypot"
                  className="hidden"
                />
              </label>

              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <div className="relative flex-1">
                <Mail
                  aria-hidden
                  className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-ink-2"
                />
                <input
                  id="newsletter-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  required
                  placeholder="you@beautiful-home.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="newsletter-email-input"
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? 'newsletter-error' : 'newsletter-hint'}
                  className="h-12 w-full rounded-full border border-ink/15 bg-bg pl-11 pr-4 text-[14px] text-ink placeholder:text-ink-2 focus-visible:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
                />
              </div>

              <button
                type="submit"
                disabled={pending}
                data-testid="newsletter-submit"
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink px-7 text-[12px] font-semibold uppercase tracking-wider2 text-bg transition-colors duration-200 hover:bg-ink/85 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
              >
                {pending ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          )}

          {!done && error ? (
            <p
              id="newsletter-error"
              role="alert"
              data-testid="newsletter-error"
              className="mt-3 text-[13px] text-danger"
            >
              {error}
            </p>
          ) : null}

          {!done ? (
            <p
              id="newsletter-hint"
              className="mt-5 inline-flex items-center justify-center gap-2 text-[12px] text-ink-2"
            >
              <ShieldCheck aria-hidden className="size-4 text-gold-2" />
              Double opt-in · unsubscribe in one click · no spam, ever.
            </p>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
