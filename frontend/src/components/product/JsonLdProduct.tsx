import env from '@/lib/env';
import type { Product } from '@/types/Product';

export default function JsonLdProduct({ product }: { product: Product }) {
  const offerPrice = product.salePrice ?? product.price;
  const jsonLd = { '@context': 'https://schema.org', '@type': 'Product', name: product.name, description: product.shortDescription ?? product.description, sku: product.sku, image: product.images.map((image) => image.imageUrl), brand: { '@type': 'Brand', name: 'Bhavita Textiles' }, offers: { '@type': 'Offer', url: `${env.NEXT_PUBLIC_APP_URL}/product/${product.slug}`, priceCurrency: 'INR', price: offerPrice, availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock' }, aggregateRating: product.ratingCount ? { '@type': 'AggregateRating', ratingValue: product.ratingAvg, reviewCount: product.ratingCount } : undefined };
  return <script data-testid="product-json-ld" type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}