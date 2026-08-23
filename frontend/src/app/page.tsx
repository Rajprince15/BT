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
  title: 'Eight years of loom-woven trust, shipped in bulk',
  description:
    'Bhavita Textiles is a family-run manufacturer of printed bedsheets, mink blankets and floor mats for hospitality, export and corporate gifting buyers.',
};

export default function HomePage() {
  return (
    <div data-testid="home-page" className="overflow-hidden">
    
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
    </div>
  );
}