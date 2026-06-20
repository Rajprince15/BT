import { cn } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  salePrice?: number;
  size?: 'sm' | 'md' | 'lg';
  currency?: string;
  className?: string;
}

const SIZE_MAP = {
  sm: { current: 'text-sm', strike: 'text-xs', off: 'text-[10px]' },
  md: { current: 'text-base', strike: 'text-sm', off: 'text-xs' },
  lg: { current: 'text-2xl', strike: 'text-base', off: 'text-xs' },
};

const formatter = new Intl.NumberFormat('en-IN', {
  maximumFractionDigits: 0,
});

export default function PriceTag({
  price,
  salePrice,
  size = 'md',
  currency = 'u20B9',
  className,
}: PriceTagProps) {
  const hasSale = typeof salePrice === 'number' && salePrice > 0 && salePrice < price;
  const final = hasSale ? salePrice! : price;
  const sizes = SIZE_MAP[size];
  const percentOff = hasSale ? Math.round(((price - salePrice!) / price) * 100) : 0;

  return (
    <div
      data-testid="price-tag"
      className={cn('flex flex-wrap items-baseline gap-2 font-sans', className)}
    >
      <span
        data-testid="price-tag-final"
        className={cn('font-semibold text-ink', sizes.current)}
      >
        {currency}
        {formatter.format(final)}
      </span>

      {hasSale ? (
        <>
          <span
            data-testid="price-tag-original"
            className={cn('text-ink-2 line-through', sizes.strike)}
          >
            {currency}
            {formatter.format(price)}
          </span>
          <span
            data-testid="price-tag-off"
            className={cn(
              'rounded-sm bg-danger/10 px-1.5 py-0.5 font-semibold uppercase tracking-wider2 text-danger',
              sizes.off,
            )}
          >
            {percentOff}% off
          </span>
        </>
      ) : null}
    </div>
  );
}
