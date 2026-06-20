import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  actionHref?: string;
  actionLabel?: string;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  actionHref,
  actionLabel = 'View all',
  className,
}: SectionHeadingProps) {
  const isCentered = align === 'center';

  return (
    <div
      data-testid="section-heading"
      className={cn(
        'flex w-full flex-col gap-4 md:flex-row md:items-end md:justify-between',
        isCentered && 'md:flex-col md:items-center md:text-center',
        className,
      )}
    >
      <div className={cn('max-w-2xl', isCentered && 'mx-auto')}>
        {eyebrow ? (
          <p
            data-testid="section-heading-eyebrow"
            className="text-[11px] font-semibold uppercase tracking-wider2 text-gold"
          >
            {eyebrow}
          </p>
        ) : null}
        <h2
          data-testid="section-heading-title"
          className="mt-2 font-serif text-3xl leading-[1.1] text-ink md:text-5xl"
        >
          {title}
        </h2>
        {description ? (
          <p
            data-testid="section-heading-description"
            className="mt-3 text-[15px] leading-relaxed text-ink-2"
          >
            {description}
          </p>
        ) : null}
      </div>

      {actionHref ? (
        <Link
          href={actionHref}
          data-testid="section-heading-action"
          className="group inline-flex items-center gap-2 self-start text-[12px] font-semibold uppercase tracking-wider2 text-gold transition-colors hover:text-gold-2 md:self-end"
        >
          {actionLabel}
          <ArrowRight className="size-4 transition-transform duration-300 ease-out group-hover:translate-x-1" />
        </Link>
      ) : null}
    </div>
  );
}
