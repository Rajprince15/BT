import type { Metadata } from 'next';
import HeroCarousel from '@/components/home/HeroCarousel';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import BestSellers from '@/components/home/BestSellers';

export const metadata: Metadata = {
  title: 'Bhavita Textiles — Heritage Luxury for the Indian Home',
  description:
    'Handloom-woven bedsheets, block-printed curtains, plush bath linens and heritage rugs — signed by the master artisans of Jaipur and Rajasthan.',
  openGraph: {
    title: 'Bhavita Textiles — Heritage Luxury for the Indian Home',
    description:
      'Handloom-woven bedsheets, block-printed curtains, plush bath linens and heritage rugs.',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <main data-testid="home-page">
      <HeroCarousel />
      <FeaturedCategories />
      <NewArrivals />
      <BestSellers />
      {/* Phase 3B will compose: Seasonal, Handloom Heritage, Testimonials, Brand Story, Wholesale CTA, Newsletter */}
    </main>
  );
}