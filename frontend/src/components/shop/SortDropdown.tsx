'use client';

import { Check, ChevronDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { ProductSort } from '@/services/product.service';
import { cn } from '@/lib/utils';

const OPTIONS: { value: ProductSort; label: string }[] = [
  { value: 'new', label: 'Newest first' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'best_sellers', label: 'Best Sellers' },
  { value: 'rating', label: 'Top Rated' },
];

interface SortDropdownProps {
  value: ProductSort;
  onChange: (value: ProductSort) => void;
  className?: string;
}

export default function SortDropdown({ value, onChange, className }: SortDropdownProps) {
  const current = OPTIONS.find((o) => o.value === value) ?? OPTIONS[0];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          data-testid="sort-dropdown-trigger"
          className={cn(
            'inline-flex h-10 items-center justify-between gap-3 rounded-full border border-border bg-surface px-4 text-[12px] font-semibold uppercase tracking-wider2 text-ink transition-colors hover:border-gold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
            className,
          )}
        >
          <span className="text-ink-2">Sort:</span>
          <span className="text-ink">{current.label}</span>
          <ChevronDown className="size-4 text-gold" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        {OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.value}
            data-testid={`sort-option-${opt.value}`}
            onSelect={() => onChange(opt.value)}
            className="flex items-center justify-between"
          >
            <span className={cn('text-sm', value === opt.value && 'text-gold')}>{opt.label}</span>
            {value === opt.value ? <Check className="size-4 text-gold" /> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
