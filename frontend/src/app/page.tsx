import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Premium Home Textiles for Bulk Buyers | Bhavita Textiles',
  description:
    'Bhavita Textiles is a trusted wholesale manufacturer and supplier of premium home textiles across India and worldwide.',
};

export default function HomePage() {
  return <HomePageClient />;
}
