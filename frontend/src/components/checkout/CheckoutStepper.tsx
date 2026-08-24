'use client';

import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CheckoutStep = 'address' | 'shipping' | 'review';

const STEPS: Array<{ id: CheckoutStep; label: string }> = [
  { id: 'address', label: 'Address' },
  { id: 'shipping', label: 'Shipping' },
  { id: 'review', label: 'Review & pay' },
];

interface CheckoutStepperProps {
  current: CheckoutStep;
  completed: CheckoutStep[];
  onNavigate?: (step: CheckoutStep) => void;
}

export default function CheckoutStepper({ current, completed, onNavigate }: CheckoutStepperProps) {
  const currentIndex = STEPS.findIndex((step) => step.id === current);

  return (
    <ol data-testid="checkout-stepper" className="grid gap-3 sm:flex sm:items-center sm:gap-2" aria-label="Checkout progress">

      {STEPS.map((step, index) => {
        const isCompleted = completed.includes(step.id);
        const isCurrent = current === step.id;
        const isReachable = isCompleted || index <= currentIndex;
        const dotStyle = isCurrent
          ? 'bg-ink text-bg'
          : isCompleted
            ? 'bg-gold text-bg'
            : 'bg-surface text-ink-2 border border-border';

        return (
          <li key={step.id} className="flex items-center gap-2">
            <button
              type="button"
              data-testid={`checkout-stepper-${step.id}`}
              aria-current={isCurrent ? 'step' : undefined}
              disabled={!isReachable || !onNavigate}
              onClick={() => onNavigate?.(step.id)}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider2 transition-colors',
                isCurrent ? 'text-ink' : 'text-ink-2 hover:text-ink',
                !isReachable && 'opacity-50',
              )}
            >
              <span className={cn('inline-flex size-6 items-center justify-center rounded-full', dotStyle)}>
                {isCompleted && !isCurrent ? <Check className="size-3" /> : index + 1}
              </span>
              {step.label}
            </button>
            {index < STEPS.length - 1 ? (
              <span aria-hidden className={cn('h-px w-8', isCompleted ? 'bg-gold' : 'bg-border')} />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
