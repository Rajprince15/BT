import type { Metadata } from 'next';
import { noindexMetadata } from '@/lib/seo';

export const metadata: Metadata = noindexMetadata('Your cart');

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
