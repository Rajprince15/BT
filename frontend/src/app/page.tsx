import type { Metadata } from 'next';
import HomePageClient from './HomePageClient';

export const metadata: Metadata = {
  title: 'Eight years of loom-woven trust, shipped in bulk',
  description:
    'Bhavita Textiles is a family-run manufacturer of printed bedsheets, mink blankets and floor mats for hospitality, export and corporate gifting buyers.',
};

export default function HomePage() {
  return <HomePageClient />;
}
