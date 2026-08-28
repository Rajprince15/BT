'use client';
interface ProductImageFallbackProps {
  slug: string;
  remote: string;
  alt: string;
  className?: string;
}

export default function ProductImageFallback({ slug, remote, alt, className }: ProductImageFallbackProps) {
  const fallback = `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1000"><rect width="800" height="1000" fill="#f1e7d7"/><path d="M0 760 220 540l130 110 160-210 290 320v240H0Z" fill="#b58a3b" opacity=".28"/><text x="400" y="470" text-anchor="middle" fill="#675846" font-family="Georgia,serif" font-size="34">Bhavita Textiles</text></svg>`)}`;

  return <img data-testid="product-image" src={remote || fallback} alt={alt} className={className ?? 'absolute inset-0 h-full w-full object-cover'} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallback; }} />;
}