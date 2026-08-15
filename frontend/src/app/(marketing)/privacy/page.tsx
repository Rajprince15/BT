import type { Metadata } from 'next';
import Container from '@/components/common/Container';

export const metadata: Metadata = { title: 'Privacy Policy · Bhavita Textiles' };

const SECTIONS = [
  {
    title: '1. What we collect',
    body: 'We collect information you give us — name, email, phone, address — and what we need to keep your account safe (device, login timestamps, IP). We never sell personal data.',
  },
  {
    title: '2. How we use it',
    body: 'To fulfil orders, ship them, offer support, and — with your consent — send occasional letters from the studio. That’s all.',
  },
  {
    title: '3. Payments',
    body: 'Card details never touch our servers. All payments are handled by Razorpay, PCI-DSS Level 1 compliant, over TLS 1.3.',
  },
  {
    title: '4. Cookies',
    body: 'We use strictly necessary cookies (session, cart) and, if you consent, one analytics cookie. You may withdraw consent from your account settings.',
  },
  {
    title: '5. Your rights',
    body: 'You may access, correct, or delete your data at any time from Account → Profile. Reach us at privacy@bhavitatextiles.com for anything else.',
  },
  {
    title: '6. Retention',
    body: 'Order data is retained for 7 years to satisfy Indian tax law. Everything else is deleted within 30 days of your request.',
  },
];

export default function PrivacyPage() {
  return (
    <main data-testid="privacy-page" className="bg-bg">
      <Container size="md" className="py-16">
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Legal</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">Privacy Policy</h1>
        <p className="mt-6 text-sm text-ink-2">Last updated: 15 December 2025</p>
        <div className="mt-12 space-y-10">
          {SECTIONS.map((section) => (
            <section key={section.title}>
              <h2 className="font-serif text-2xl text-ink">{section.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-2">{section.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
