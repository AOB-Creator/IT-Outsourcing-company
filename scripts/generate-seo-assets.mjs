// Writes public/sitemap.xml and public/robots.txt from SITE_URL in src/app/core/site.ts.
// Run after changing the domain or adding a page: node scripts/generate-seo-assets.mjs
import { readFileSync, writeFileSync } from 'node:fs';

const site = readFileSync(new URL('../src/app/core/site.ts', import.meta.url), 'utf8');
const SITE_URL = site.match(/SITE_URL = '([^']+)'/)[1];
const LANGS = ['uz', 'ru', 'en'];
const PAGES = ['', '/services', '/industries', '/portfolio', '/about', '/contact'];

const url = (lang, page) => `${SITE_URL}/${lang}${page}`;
const entries = PAGES.flatMap((page) =>
  LANGS.map((lang) => {
    const alternates = [...LANGS.map((l) => [l, url(l, page)]), ['x-default', url('uz', page)]]
      .map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}"/>`)
      .join('\n');
    return `  <url>\n    <loc>${url(lang, page)}</loc>\n${alternates}\n    <priority>${page ? '0.8' : '1.0'}</priority>\n  </url>`;
  }),
);

writeFileSync(
  new URL('../public/sitemap.xml', import.meta.url),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${entries.join('\n')}\n</urlset>\n`,
);
writeFileSync(
  new URL('../public/robots.txt', import.meta.url),
  `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
);
console.log(`sitemap.xml: ${entries.length} URLs for ${SITE_URL}`);
