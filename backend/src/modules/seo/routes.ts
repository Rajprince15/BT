/**
 * Public SEO surfaces: sitemap.xml + robots.txt.
 * A tiny cache holds the sitemap for 5 minutes; content is small enough that
 * regenerating on demand is acceptable, but the cache keeps unauthenticated
 * traffic from hitting the DB on every crawl.
 */
import { Router } from 'express';
import { query } from '../../config/db';
import { env } from '../../config/env';
import { asyncWrap } from '../../utils/asyncWrap';

const router = Router();

let cache: { at: number; xml: string } | null = null;
const TTL_MS = 5 * 60 * 1000;
const STATIC_PATHS = ['/', '/shop', '/about', '/contact', '/privacy', '/terms', '/return-policy', '/shipping-policy', '/wholesale'];

router.get('/sitemap.xml', asyncWrap(async (_req, res) => {
  if (cache && Date.now() - cache.at < TTL_MS) {
    res.type('application/xml').send(cache.xml);
    return;
  }

  const products = await query<{ slug: string; updated_at: Date }>(
    `SELECT slug, updated_at FROM products WHERE deleted_at IS NULL AND status = 'published' ORDER BY updated_at DESC LIMIT 5000`,
  );
  const categories = await query<{ slug: string; updated_at: Date }>(
    `SELECT slug, updated_at FROM categories WHERE deleted_at IS NULL AND is_active = 1`,
  );

  const urls: Array<{ loc: string; lastmod?: string; priority: string }> = [];
  const app = env.APP_URL.replace(/\/$/, '');
  for (const p of STATIC_PATHS) urls.push({ loc: `${app}${p}`, priority: '0.6' });
  for (const c of categories) urls.push({ loc: `${app}/collections/${c.slug}`, lastmod: c.updated_at.toISOString(), priority: '0.7' });
  for (const p of products) urls.push({ loc: `${app}/product/${p.slug}`, lastmod: p.updated_at.toISOString(), priority: '0.8' });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
    .map(
      (u) =>
        `  <url><loc>${u.loc}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}<priority>${u.priority}</priority></url>`,
    )
    .join('\n')}\n</urlset>\n`;
  cache = { at: Date.now(), xml };
  res.type('application/xml').send(xml);
}));

router.get('/robots.txt', (_req, res) => {
  const app = env.APP_URL.replace(/\/$/, '');
  const body = `User-agent: *\nAllow: /\nDisallow: /account\nDisallow: /admin\nDisallow: /checkout\nSitemap: ${app.replace(/^https?:\/\//, 'https://')}/sitemap.xml\n`;
  res.type('text/plain').send(body);
});

export default router;
