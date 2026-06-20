import type { Metadata } from 'next';
import HeroCarousel from '@/components/home/HeroCarousel';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import NewArrivals from '@/components/home/NewArrivals';
import BestSellers from '@/components/home/BestSellers';
import SeasonalEdit from '@/components/home/SeasonalEdit';
import HandloomHeritage from '@/components/home/HandloomHeritage';
import Testimonials from '@/components/home/Testimonials';
import BrandStory from '@/components/home/BrandStory';
import WholesaleCTA from '@/components/home/WholesaleCTA';
import NewsletterSignup from '@/components/home/NewsletterSignup';

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
      <SeasonalEdit />
      <HandloomHeritage />
      <Testimonials />
      <BrandStory />
      <WholesaleCTA />
      <NewsletterSignup />
    </main>
  );
}
