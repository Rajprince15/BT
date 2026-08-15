import type { Metadata } from 'next';
import Container from '@/components/common/Container';

export const metadata: Metadata = { title: 'Terms & Conditions · Bhavita Textiles' };

const SECTIONS = [
  { title: '1. Using this site', body: 'By browsing or purchasing on bhavitatextiles.com you agree to these terms. If you do not agree, please do not continue.' },
  { title: '2. Products', body: 'Handmade pieces contain small irregularities that celebrate their craft. Colours may vary slightly from screen renderings.' },
  { title: '3. Prices & taxes', body: 'All prices are in Indian Rupees (INR) and include GST unless stated. We may adjust prices without notice.' },
  { title: '4. Orders', body: 'An order is confirmed only after successful payment and internal stock verification. We reserve the right to cancel and refund any order that fails these checks.' },
  { title: '5. Intellectual property', body: 'All content — imagery, copy, design — is owned by Bhavita Textiles and its licensors. You may not reproduce it without written permission.' },
  { title: '6. Limitation of liability', body: 'Our liability is limited to the value of the purchased goods. Consequential damages are excluded to the fullest extent allowed by Indian law.' },
  { title: '7. Governing law', body: 'These terms are governed by the laws of India. Any dispute is subject to the exclusive jurisdiction of the courts of Jaipur, Rajasthan.' },
];

export default function TermsPage() {
  return (
    <main data-testid="terms-page" className="bg-bg">
      <Container size="md" className="py-16">
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Legal</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">Terms &amp; Conditions</h1>
        <p className="mt-6 text-sm text-ink-2">Last updated: 15 December 2025</p>
        <div className="mt-12 space-y-10">
          {SECTIONS.map((s) => (
            <section key={s.title}>
              <h2 className="font-serif text-2xl text-ink">{s.title}</h2>
              <p className="mt-3 text-sm leading-7 text-ink-2">{s.body}</p>
            </section>
          ))}
        </div>
      </Container>
    </main>
  );
}
