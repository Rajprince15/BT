import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      { userAgent: '*', disallow: ['/admin', '/account', '/cart', '/checkout', '/api'] },
    ],
    sitemap: 'http://localhost:3000/sitemap.xml',
  };
}
