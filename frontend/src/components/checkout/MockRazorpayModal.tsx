'use client';

import { useEffect, useState } from 'react';
import { X, ShieldCheck, Loader2 } from 'lucide-react';

export type MockRazorpayResult =
  | { status: 'success'; paymentId: string; signature: string }
  | { status: 'cancelled' }
  | { status: 'failed'; reason: string };

interface MockRazorpayModalProps {
  open: boolean;
  onClose: () => void;
  onResult: (result: MockRazorpayResult) => void;
  amount: number;
  currency: string;
  orderId: string;
}

type Phase = 'idle' | 'processing' | 'done';

export default function MockRazorpayModal({ open, onClose, onResult, amount, currency, orderId }: MockRazorpayModalProps) {
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    if (!open) setPhase('idle');
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && phase !== 'processing') {
        onClose();
        onResult({ status: 'cancelled' });
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, phase, onClose, onResult]);

  if (!open) return null;

  const settle = (result: MockRazorpayResult) => {
    setPhase('processing');
    window.setTimeout(() => {
      setPhase('done');
      onResult(result);
      onClose();
    }, 900);
  };

  const paySuccess = () =>
    settle({
      status: 'success',
      paymentId: `pay_mock_${Date.now()}`,
      signature: `sig_mock_${Math.random().toString(36).slice(2, 12)}`,
    });
  const payFail = () =>
    settle({ status: 'failed', reason: 'The card was declined by the bank (mocked).' });
  const payCancel = () => {
    if (phase === 'processing') return;
    onResult({ status: 'cancelled' });
    onClose();
  };

  return (
    <div
      data-testid="mock-razorpay-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="mock-razorpay-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 p-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-gold/40 bg-surface shadow-2xl">
        <header className="flex items-center justify-between border-b border-border bg-navy px-5 py-4 text-bg">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[.35em] text-gold-soft">Razorpay · Mock</p>
            <h2 id="mock-razorpay-title" className="mt-1 font-serif text-xl">Complete payment</h2>
          </div>
          <button
            type="button"
            data-testid="mock-razorpay-close"
            onClick={payCancel}
            aria-label="Close payment window"
            className="rounded-full p-2 text-bg/70 transition-colors hover:bg-bg/10 hover:text-bg"
          >
            <X className="size-4" />
          </button>
        </header>

        <div className="px-6 py-6 text-sm">
          <dl className="space-y-2 text-ink-2">
            <div className="flex justify-between"><dt>Merchant</dt><dd className="text-ink">Bhavita Textiles</dd></div>
            <div className="flex justify-between"><dt>Order</dt><dd className="font-mono text-xs text-ink">{orderId}</dd></div>
            <div className="flex justify-between text-base font-semibold text-ink">
              <dt>Amount</dt>
              <dd data-testid="mock-razorpay-amount">{currency === 'INR' ? '₹' : `${currency} `}{amount.toLocaleString('en-IN')}</dd>
            </div>
          </dl>

          <div className="mt-6 rounded-lg border border-border bg-bg p-4 text-xs leading-6 text-ink-2">
            <p className="flex items-center gap-2 font-semibold text-ink">
              <ShieldCheck className="size-4 text-gold" /> Mock payment gateway
            </p>
            <p className="mt-1">
              This flow simulates Razorpay. No card is charged. Choose an outcome below to complete the checkout journey.
            </p>
          </div>

          {phase === 'processing' ? (
            <div data-testid="mock-razorpay-processing" className="mt-6 flex items-center justify-center gap-3 rounded-lg border border-gold/40 bg-gold-soft/20 p-4 text-sm text-ink">
              <Loader2 className="size-4 animate-spin text-gold" />
              Processing payment…
            </div>
          ) : (
            <div className="mt-6 grid gap-2">
              <button
                type="button"
                data-testid="mock-razorpay-pay-success"
                onClick={paySuccess}
                className="inline-flex h-12 items-center justify-center rounded-full bg-ink text-xs font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-gold"
              >
                Pay successfully
              </button>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  data-testid="mock-razorpay-pay-fail"
                  onClick={payFail}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-danger/40 bg-danger/10 text-xs font-semibold uppercase tracking-wider2 text-danger transition-colors hover:bg-danger hover:text-bg"
                >
                  Simulate failure
                </button>
                <button
                  type="button"
                  data-testid="mock-razorpay-pay-cancel"
                  onClick={payCancel}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-border text-xs font-semibold uppercase tracking-wider2 text-ink-2 transition-colors hover:border-gold hover:text-ink"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
