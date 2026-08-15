import type { Metadata } from 'next';
import { products } from '@/mocks/products.mock';
import { buildMetadata } from '@/lib/seo';

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) {
    return buildMetadata({
      title: 'Product not found',
      description: 'The product you were looking for is no longer available.',
      path: `/product/${slug}`,
      noindex: true,
    });
  }
  const image = product.images?.[0]?.imageUrl;
  const description = (product.shortDescription ?? product.description ?? `Discover ${product.name} — handcrafted at the Bhavita Textiles atelier.`).slice(0, 180);
  return buildMetadata({
    title: product.name,
    description,
    path: `/product/${product.slug}`,
    image,
    type: 'product.item',
    keywords: [product.name, product.sku, 'luxury textiles', 'handloom'],
  });
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}
