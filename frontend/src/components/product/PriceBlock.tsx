import PriceTag from '@/components/common/PriceTag';

export default function PriceBlock({ price, salePrice, note }: { price: number; salePrice?: number; note?: string }) {
  return <div data-testid="product-price-block" className="flex items-baseline gap-3"><PriceTag price={price} salePrice={salePrice} size="lg" /><span className="text-xs uppercase tracking-wider2 text-ink-2">{note ?? 'Inclusive of taxes'}</span></div>;
}
