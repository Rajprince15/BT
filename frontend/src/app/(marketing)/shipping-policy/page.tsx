import type { Metadata } from 'next';
import Container from '@/components/common/Container';

export const metadata: Metadata = { title: 'Shipping Policy · Bhavita Textiles' };

const ROWS = [
  { region: 'Metro cities', eta: '3–5 business days', charge: '₹150 · Free over ₹5,000' },
  { region: 'Rest of India', eta: '5–8 business days', charge: '₹250 · Free over ₹5,000' },
  { region: 'International (select geographies)', eta: '10–14 business days', charge: 'Calculated at checkout' },
];

const SECTIONS = [
  { title: 'Handling time', body: 'In-stock pieces ship within 48 working hours. Made-to-measure or artisan-order items may take 2–4 weeks; you will see the estimated dispatch date on the product page and at checkout.' },
  { title: 'Tracking', body: 'You will receive a tracking link the moment the parcel leaves our atelier. You can also follow it live inside Account → Orders.' },
  { title: 'Undeliverable addresses', body: 'If a delivery is refused or returned undelivered, we reship at additional cost or refund the order value minus the courier charges.' },
];

export default function ShippingPolicyPage() {
  return (
    <main data-testid="shipping-policy-page" className="bg-bg">
      <Container size="md" className="py-16">
        <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">On the way to you</p>
        <h1 className="mt-3 font-serif text-5xl leading-tight text-ink">Shipping Policy</h1>

        <div className="mt-12 overflow-hidden rounded-2xl border border-border bg-surface">
          <table className="w-full text-sm">
            <thead className="bg-surface-2 text-[11px] uppercase tracking-wider2 text-ink-2">
              <tr>
                <th className="px-4 py-3 text-left font-semibold">Destination</th>
                <th className="px-4 py-3 text-left font-semibold">Estimated delivery</th>
                <th className="px-4 py-3 text-left font-semibold">Shipping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ROWS.map((row) => (
                <tr key={row.region} data-testid={`shipping-row-${row.region.replace(/\s+/g, '-').toLowerCase()}`}>
                  <td className="px-4 py-3 font-serif text-ink">{row.region}</td>
                  <td className="px-4 py-3 text-ink-2">{row.eta}</td>
                  <td className="px-4 py-3 text-ink-2">{row.charge}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

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
