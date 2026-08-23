'use client';
/* eslint-disable @next/next/no-img-element */
interface ProductImageFallbackProps {
  slug: string;
  remote: string;
  alt: string;
}

export default function ProductImageFallback({ slug, remote, alt }: ProductImageFallbackProps) {
  return <img src={`/images/products/${slug}.jpg`} alt={alt} className="absolute inset-0 h-full w-full object-cover" onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = remote; }} />;
}