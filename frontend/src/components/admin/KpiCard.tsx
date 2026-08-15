import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  delta?: string;
  tone?: 'gold' | 'navy' | 'success' | 'danger' | 'neutral';
  testId?: string;
}

const TONE_MAP: Record<NonNullable<KpiCardProps['tone']>, string> = {
  gold: 'from-gold/20 to-gold-soft/10 text-gold-2',
  navy: 'from-navy/20 to-navy/5 text-navy',
  success: 'from-success/20 to-success/5 text-success',
  danger: 'from-danger/15 to-danger/5 text-danger',
  neutral: 'from-surface-2 to-surface text-ink',
};

export default function KpiCard({ label, value, icon, delta, tone = 'neutral', testId }: KpiCardProps) {
  return (
    <article
      data-testid={testId ?? `kpi-${label.toLowerCase().replace(/\s+/g, '-')}`}
      className={cn(
        'flex flex-col gap-3 rounded-2xl border border-border bg-gradient-to-br p-6 shadow-sm',
        TONE_MAP[tone],
      )}
    >
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-semibold uppercase tracking-wider2 text-ink-2">{label}</p>
        {icon ? (
          <span aria-hidden className="inline-flex size-9 items-center justify-center rounded-full bg-bg/60">
            {icon}
          </span>
        ) : null}
      </div>
      <p className="font-serif text-4xl leading-none text-ink">{value}</p>
      {delta ? (
        <p data-testid="kpi-delta" className="text-xs text-ink-2">
          {delta}
        </p>
      ) : null}
    </article>
  );
}
