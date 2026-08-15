'use client';

import { useQuery } from '@tanstack/react-query';
import productService from '@/services/product.service';
import ProductCard from '@/components/product/ProductCard';

export default function RelatedProducts({ productId }: { productId: number }) {
  const { data = [], isLoading } = useQuery({ queryKey: ['related-products', productId], queryFn: () => productService.related(productId), enabled: Boolean(productId) });
  if (!isLoading && !data.length) return null;
  return <section data-testid="related-products" className="mt-20 border-t border-border pt-12"><p className="text-xs font-semibold uppercase tracking-wider2 text-gold">Complete the room</p><h2 className="mt-2 font-serif text-3xl text-ink">Pieces with a similar story</h2><div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">{isLoading ? Array.from({ length: 4 }).map((_, index) => <ProductCard.Skeleton key={index} />) : data.slice(0, 4).map((product) => <ProductCard key={product.id} product={product} />)}</div></section>;
}