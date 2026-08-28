import type { Metadata } from 'next';
import { Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';

import Providers from '@/providers/Providers';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import JsonLd from '@/components/common/JsonLd';
import { organizationJsonLd, websiteJsonLd } from '@/lib/seo';
import WhatsAppWidget from '@/components/layout/WhatsAppWidget';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://bhavitatextiles.com'),
  title: {
    default: 'BHAVITA TEXTILES — Premium Luxury Textiles & Home Furnishings',
    template: '%s | BHAVITA TEXTILES',
  },
  description:
    'BHAVITA TEXTILES — handcrafted luxury bedsheets, curtains, towels, handloom heritage and home décor. Royal, classic, timeless.',
  applicationName: 'BHAVITA TEXTILES',
  keywords: [
    'BHAVITA TEXTILES',
    'luxury textiles India',
    'premium bedsheets',
    'handloom heritage',
    'home furnishings',
    'curtains',
    'bath towels',
    'home décor',
  ],
  authors: [{ name: 'BHAVITA TEXTILES' }],
  creator: 'BHAVITA TEXTILES',
  publisher: 'BHAVITA TEXTILES',
  openGraph: {
    type: 'website',
    siteName: 'BHAVITA TEXTILES',
    title: 'BHAVITA TEXTILES — Premium Luxury Textiles & Home Furnishings',
    description:
      'Royal · Classic · Timeless. Discover handcrafted luxury bedsheets, curtains, towels and handloom heritage.',
    locale: 'en_IN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BHAVITA TEXTILES',
    description:
      'Royal · Classic · Timeless. Premium luxury textiles & home furnishings.',
  },
  icons: { icon: '/favicon.ico' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable} ${mono.variable}`}
    >
      <body className="bg-bg font-sans text-ink antialiased">
        <JsonLd id="ld-organization" data={organizationJsonLd()} />
        <JsonLd id="ld-website" data={websiteJsonLd()} />

        <Providers>
          {/* Skip to content */}
          <a
            href="#main-content"
            className="sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:not-sr-only focus:rounded-md focus:bg-ink focus:px-3 focus:py-1.5 focus:text-bg"
          >
            Skip to content
          </a>

          {/* Sticky Header (takes natural document flow — no spacer needed) */}
          <Header />

          <main id="main-content" className="min-h-[60vh]">
            {children}
          </main>

          <Footer />
          <WhatsAppWidget />
        </Providers>
      </body>
    </html>
  );
}
