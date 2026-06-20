import Link from 'next/link';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateAction {
  label: string;
  onClick?: () => void;
  href?: string;
}

interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: EmptyStateAction;
  tone?: 'neutral' | 'error';
  className?: string;
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
  tone = 'neutral',
  className,
}: EmptyStateProps) {
  const isError = tone === 'error';

  return (
    <div
      data-testid="empty-state"
      data-tone={tone}
      className={cn(
        'flex w-full flex-col items-center justify-center gap-3 rounded-md border border-dashed px-6 py-12 text-center',
        isError ? 'border-danger/30 bg-danger/[0.04]' : 'border-border bg-surface/40',
        className,
      )}
    >
      {icon ? (
        <div
          aria-hidden
          className={cn(
            'flex size-12 items-center justify-center rounded-full',
            isError ? 'bg-danger/10 text-danger' : 'bg-gold-soft text-gold-2',
          )}
        >
          {icon}
        </div>
      ) : null}

      <h3
        data-testid="empty-state-title"
        className={cn('font-serif text-xl', isError ? 'text-danger' : 'text-ink')}
      >
        {title}
      </h3>

      {description ? (
        <p
          data-testid="empty-state-description"
          className="max-w-md text-sm leading-relaxed text-ink-2"
        >
          {description}
        </p>
      ) : null}

      {action ? (
        action.href ? (
          <Link
            href={action.href}
            data-testid="empty-state-action"
            className="mt-2 inline-flex h-10 items-center rounded-full bg-ink px-5 text-[12px] font-semibold uppercase tracking-wider2 text-bg transition-colors hover:bg-ink/90"
          >
            {action.label}
          </Link>
        ) : (
          <button
            type="button"
            onClick={action.onClick}
            data-testid="empty-state-action"
            className="mt-2 inline-flex h-10 items-center rounded-full border border-gold px-5 text-[12px] font-semibold uppercase tracking-wider2 text-gold transition-colors hover:bg-gold hover:text-white"
          >
            {action.label}
          </button>
        )
      ) : null}
    </div>
  );
}
