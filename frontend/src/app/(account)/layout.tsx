import type { Metadata } from 'next';
import { noindexMetadata } from '@/lib/seo';

export const metadata: Metadata = noindexMetadata('Your account');

export default function AccountGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
