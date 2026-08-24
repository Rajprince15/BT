'use client';
/* eslint-disable @next/next/no-img-element */
interface ProductImageFallbackProps {
  slug: string;
  remote: string;
  alt: string;
  className?: string;
}

export default function ProductImageFallback({ slug, remote, alt, className }: ProductImageFallbackProps) {
  return <img data-testid="product-image" src={`/images/products/${slug}.jpg`} alt={alt} className={className ?? 'absolute inset-0 h-full w-full object-cover'} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = remote; }} />;
}