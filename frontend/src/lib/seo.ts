import type { Metadata } from 'next';
import env from '@/lib/env';

const SITE_NAME = 'BHAVITA TEXTILES';
const SITE_URL = env.NEXT_PUBLIC_APP_URL || 'https://bhavitatextiles.com';

export const seoConstants = {
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  contactEmail: 'hello@bhavitatextiles.com',
};

export function canonical(path: string) {
  const trimmed = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${trimmed}`;
}

interface BuildMetadataArgs {
  title: string;
  description: string;
  path?: string;
  image?: string;
  noindex?: boolean;
  type?: 'website' | 'article' | 'product.item';
  keywords?: string[];
}

export function buildMetadata({ title, description, path, image, noindex, type = 'website', keywords }: BuildMetadataArgs): Metadata {
  const url = path ? canonical(path) : undefined;
  return {
    title,
    description,
    keywords,
    alternates: url ? { canonical: url } : undefined,
    robots: noindex ? { index: false, follow: false, nocache: true } : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      type: type === 'product.item' ? 'website' : type,
      locale: 'en_IN',
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export const noindexMetadata = (title: string): Metadata =>
  buildMetadata({ title, description: `${title} · ${SITE_NAME}`, noindex: true });

// ---------- JSON-LD builders (schema.org) ----------

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/icons/logo.svg`,
    description: 'Handcrafted luxury textiles and home furnishings from India.',
    sameAs: [
      'https://instagram.com/bhavitatextiles',
      'https://facebook.com/bhavitatextiles',
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'customer support',
        email: seoConstants.contactEmail,
        availableLanguage: ['English', 'Hindi'],
      },
    ],
  } as const;
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  } as const;
}

export interface BreadcrumbNode {
  label: string;
  href: string;
}

export function breadcrumbListJsonLd(items: BreadcrumbNode[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: canonical(item.href),
    })),
  } as const;
}
