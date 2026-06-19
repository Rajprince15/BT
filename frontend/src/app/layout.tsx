import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import Providers from '@/providers/Providers';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = Manrope({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
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
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang='en'
      suppressHydrationWarning
      className={`${serif.variable} ${sans.variable}`}
    >
      <body className='font-sans antialiased bg-bg text-ink'>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
