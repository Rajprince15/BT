import type { Metadata } from 'next';
import { noindexMetadata } from '@/lib/seo';

export const metadata: Metadata = noindexMetadata('Your cart');

// The cart page uses client-only React Query hooks (useCart) which cannot be
// statically prerendered at build time. Forcing this route to be dynamic
// opts it out of static generation and lets it render at request time only.
export const dynamic = 'force-dynamic';

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
