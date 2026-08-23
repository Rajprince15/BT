'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import Container from '@/components/common/Container';
import contactService from '@/services/contact.service';
import { whatsappUrl } from '@/components/layout/WhatsAppWidget';

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string; // honeypot
}

const EMPTY: ContactFormState = { name: '', email: '', phone: '', subject: '', message: '', website: '' };

export default function ContactPage() {
  const [form, setForm] = useState<ContactFormState>(EMPTY);
  const [busy, setBusy] = useState(false);

  const update = <K extends keyof ContactFormState>(key: K, value: ContactFormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  return (
    <main data-testid="contact-page" className="bg-bg">
      <Container className="grid gap-12 py-16 lg:grid-cols-[.9fr_1.1fr]">
        <aside>
          <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Write to us</p>
          <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">We answer every letter.</h1>
          <p className="mt-6 max-w-md text-sm leading-7 text-ink-2">
            Whether it’s a question about a specific handloom, help with your order, or a collaboration,
            our atelier team replies within one working day.
          </p>
          <dl className="mt-10 space-y-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-wider2 text-gold">Email</dt>
              <dd data-testid="contact-email" className="mt-1 text-ink">hello@bhavitatextiles.com</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider2 text-gold">Studio</dt>
              <dd className="mt-1 text-ink">Bhavita Textiles Atelier, Jaipur 302017, Rajasthan</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wider2 text-gold">Care line</dt>
              <dd className="mt-1 text-ink">+91-141-000-1000</dd>
            </div>
          </dl>
        </aside>

        <form
          data-testid="contact-form"
          className="grid gap-4 rounded-2xl border border-border bg-surface p-8"
          onSubmit={async (event) => {
            event.preventDefault();
            if (form.website) return; // honeypot triggered
            setBusy(true);
            try {
              await contactService.submit({
                name: form.name,
                email: form.email,
                phone: form.phone || undefined,
                subject: form.subject || undefined,
                message: form.message,
              });
              const inquiry = `Hello, I’m interested in your products.\n\nName: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone || 'Not provided'}\nSubject: ${form.subject || 'General enquiry'}\nMessage: ${form.message}`;
              window.open(whatsappUrl(inquiry), '_blank', 'noopener,noreferrer');
              toast.success('Thank you — we will reply within one working day.');
              setForm(EMPTY);
            } catch (error) {
              toast.error(error instanceof Error ? error.message : 'Unable to send message');
            } finally {
              setBusy(false);
            }
          }}
        >
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden
            value={form.website}
            onChange={(event) => update('website', event.target.value)}
            className="hidden"
          />
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-ink">
              Full name
              <input
                data-testid="contact-name"
                required
                value={form.name}
                onChange={(event) => update('name', event.target.value)}
                className="h-12 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
              />
            </label>
            <label className="grid gap-2 text-sm text-ink">
              Email
              <input
                data-testid="contact-email-input"
                type="email"
                required
                value={form.email}
                onChange={(event) => update('email', event.target.value)}
                className="h-12 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
              />
            </label>
            <label className="grid gap-2 text-sm text-ink">
              Phone
              <input
                data-testid="contact-phone"
                type="tel"
                value={form.phone}
                onChange={(event) => update('phone', event.target.value)}
                className="h-12 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
              />
            </label>
            <label className="grid gap-2 text-sm text-ink">
              Subject
              <input
                data-testid="contact-subject"
                value={form.subject}
                onChange={(event) => update('subject', event.target.value)}
                className="h-12 rounded border border-border bg-bg px-4 outline-none focus:border-gold"
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-ink">
            Your message
            <textarea
              data-testid="contact-message"
              rows={6}
              required
              value={form.message}
              onChange={(event) => update('message', event.target.value)}
              className="min-h-[160px] rounded border border-border bg-bg p-4 outline-none focus:border-gold"
            />
          </label>
          <button
            data-testid="contact-submit"
            type="submit"
            disabled={busy}
            className="mt-2 inline-flex h-12 items-center justify-center rounded-full bg-ink px-6 text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold disabled:opacity-50"
          >
            {busy ? 'Sending…' : 'Send message'}
          </button>
        </form>
      </Container>
    </main>
  );
}
