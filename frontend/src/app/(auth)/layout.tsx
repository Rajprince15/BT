import type { Metadata } from 'next';
import { noindexMetadata } from '@/lib/seo';

export const metadata: Metadata = noindexMetadata('Account');

export default function AuthGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
