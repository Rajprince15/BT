'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  className?: string;
}

function pageWindow(current: number, total: number): (number | 'gap')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const out: (number | 'gap')[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) out.push('gap');
  for (let i = start; i <= end; i++) out.push(i);
  if (end < total - 1) out.push('gap');
  out.push(total);
  return out;
}

export default function Pagination({ page, totalPages, onChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;
  const items = pageWindow(page, totalPages);
  const baseBtn =
    'inline-flex size-10 items-center justify-center rounded-full border border-border bg-surface text-[12px] font-semibold tracking-wider2 text-ink transition-colors hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-border';

  return (
    <nav
      data-testid="pagination"
      aria-label="Pagination"
      className={cn('mt-12 flex items-center justify-center gap-2', className)}
    >
      <button
        type="button"
        data-testid="pagination-prev"
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page <= 1}
        className={baseBtn}
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {items.map((item, i) =>
        item === 'gap' ? (
          <span key={`gap-${i}`} aria-hidden className="px-1 text-ink-2">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            data-testid={`pagination-page-${item}`}
            onClick={() => onChange(item)}
            aria-current={item === page ? 'page' : undefined}
            className={cn(
              baseBtn,
              item === page && 'border-gold bg-gold text-white hover:border-gold',
            )}
          >
            {item}
          </button>
        ),
      )}

      <button
        type="button"
        data-testid="pagination-next"
        onClick={() => onChange(Math.min(totalPages, page + 1))}
        disabled={page >= totalPages}
        className={baseBtn}
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
