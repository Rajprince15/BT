import type { Product } from '@/types/Product';
import type { ProductVariant } from '@/types/ProductVariant';

const KG_PRODUCTS = new Set(['Gulliver Super Soft', 'Mink Blanket', 'Mink Cloudy']);
export function productUnitPrice(product: Product, variant?: ProductVariant): number {
  const weight = Number.parseFloat(variant?.weight ?? '');
  return KG_PRODUCTS.has(product.name) && Number.isFinite(weight) ? product.price * weight : variant?.price ?? product.price;
}
export function priceNote(product: Product): string | undefined {
  if (KG_PRODUCTS.has(product.name)) return 'GST + BAG EXTRA';
  if (product.name.includes('Grade') || product.name.includes('Towel')) return 'GST included';
  if (product.name === 'Dohar Double Bed') return '+ GST';
  return undefined;
}
export function productTotalPrice(product: Product, variant: ProductVariant | undefined, quantity: number): number {
  return productUnitPrice(product, variant) * Math.max(1, quantity);
}
