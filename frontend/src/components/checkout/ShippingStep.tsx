'use client';

interface ShippingMethod {
  id: string;
  label: string;
  eta: string;
  price: number;
}

const METHODS: ShippingMethod[] = [
  { id: 'standard', label: 'Standard delivery', eta: '5–7 business days', price: 150 },
  { id: 'express', label: 'Express delivery', eta: '2–3 business days', price: 350 },
  { id: 'white-glove', label: 'White-glove installation', eta: '7–10 business days', price: 800 },
];

interface ShippingStepProps {
  selected?: string;
  onSelect: (methodId: string, method: ShippingMethod) => void;
}

export default function ShippingStep({ selected, onSelect }: ShippingStepProps) {
  return (
    <section data-testid="checkout-shipping-step" className="rounded-xl border border-border bg-surface p-6">
      <p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Step 2</p>
      <h2 className="mt-2 font-serif text-3xl text-ink">Delivery method</h2>
      <p className="mt-2 text-sm text-ink-2">Choose how you would like your pieces to arrive.</p>

      <div className="mt-6 grid gap-3">
        {METHODS.map((method) => {
          const isSelected = selected === method.id;
          return (
            <button
              key={method.id}
              type="button"
              data-testid={`shipping-method-${method.id}`}
              aria-pressed={isSelected}
              onClick={() => onSelect(method.id, method)}
              className={`flex items-center justify-between rounded-lg border bg-bg p-4 text-left transition-colors ${
                isSelected ? 'border-gold shadow-luxe' : 'border-border hover:border-gold/60'
              }`}
            >
              <div>
                <p className="font-serif text-lg text-ink">{method.label}</p>
                <p className="mt-1 text-xs uppercase tracking-wider2 text-ink-2">{method.eta}</p>
              </div>
              <p className="text-sm font-semibold text-ink">₹{method.price.toLocaleString('en-IN')}</p>
            </button>
          );
        })}
      </div>
    </section>
  );
}
