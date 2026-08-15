import type { Metadata } from 'next';
import Container from '@/components/common/Container';

export const metadata: Metadata = { title: 'Return Policy · Bhavita Textiles' };

const SECTIONS = [
  { title: '7-day return window', body: 'You may request a return within 7 days of delivery for any unused, unwashed piece in its original packaging.' },
  { title: 'What is not returnable', body: 'Made-to-measure items, personalised gifts, and clearance-sale pieces cannot be returned unless received damaged.' },
  { title: 'How to request a return', body: 'Head to Account → Orders, pick the order, and tap “Request return”. Our team responds within one working day with a pickup schedule.' },
  { title: 'Refund timelines', body: 'Once we receive and inspect the piece, refunds are issued to the original payment method within 5–7 business days.' },
  { title: 'Damaged or wrong item', body: 'If your parcel arrives damaged or contains a wrong item, please share photos within 48 hours. We will send a replacement or refund promptly at our cost.' },
];

export default function ReturnPolicyPage() {
  return (
    <main data-testid="return-policy-page" className="bg-bg">
      <Container size="md" className="py-16">
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Care commitment</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">Return Policy</h1>
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
