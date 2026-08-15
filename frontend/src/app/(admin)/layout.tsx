import type { Metadata } from 'next';
import { noindexMetadata } from '@/lib/seo';

export const metadata: Metadata = noindexMetadata('Admin');

export default function AdminGroupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
