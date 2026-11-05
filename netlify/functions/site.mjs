/**
 * Renders every public page. Pages are cached on Netlify's CDN and the cache
 * is cleared automatically whenever something is changed in the portal.
 */
import { loadContext, newsletters, absUrl, e } from '../lib/helpers.mjs';
import * as P from '../lib/pages.mjs';
import { oldRedirects, seoPages } from '../lib/content.mjs';

const ROUTES = {
  '': P.home, services: P.services, 'about-us': P.about, 'hearing-aids': P.hearingAids,
  'babies-and-children': P.children, 'medical-aid': P.medicalAid, newsletters: P.newsletterList,
  privacy: P.privacy, terms: P.terms, contact: null,
};

export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'X-Frame-Options': 'SAMEORIGIN',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=31536000',
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com",
    "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://www.googletagmanager.com",
    "img-src 'self' data: https://*.google-analytics.com https://www.googletagmanager.com",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self'",
    "frame-src https://www.google.com https://maps.google.com",
    "object-src 'self'",
    "form-action 'self'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
  ].join('; '),
};

const CACHE = {
  'Cache-Control': 'public, max-age=0, must-revalidate',
  'Netlify-CDN-Cache-Control': 'public, durable, s-maxage=31536000, stale-while-revalidate=86400',
  'Netlify-Cache-Tag': 'pages',
};

const html = (body, status = 200) => new Response(body, {
  status, headers: { 'Content-Type': 'text/html; charset=utf-8', ...SECURITY_HEADERS, ...CACHE },
});
const redirect = (to) => new Response(null, { status: 301, headers: { Location: to, ...CACHE } });

export default async (req, context) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') return new Response('Method not allowed', { status: 405 });
  const u = new URL(req.url);
  const origin = (context?.site?.url && !/netlify\.app$/.test(new URL(context.site.url).host) ? context.site.url : u.origin);
  let path;
  try { path = decodeURIComponent(u.pathname).replace(/^\/+|\/+$/g, ''); } catch { path = '#'; }

  if (oldRedirects[path]) return redirect('/' + oldRedirects[path]);
  await loadContext(origin);

  if (path === 'robots.txt') {
    return new Response(`User-agent: *\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: ${absUrl('sitemap.xml')}\n`,
      { headers: { 'Content-Type': 'text/plain; charset=utf-8', ...CACHE } });
  }
  if (path === 'sitemap.xml') {
    const today = new Date().toISOString().slice(0, 10);
    const prio = { '': '1.0', 'contact/': '0.9', 'services/': '0.9', 'hearing-aids/': '0.9', 'babies-and-children/': '0.9', 'privacy/': '0.2', 'terms/': '0.2', 'newsletters/': '0.6' };
    const urls = Object.keys(seoPages).map((p) => `  <url><loc>${e(absUrl(p))}</loc><lastmod>${today}</lastmod><priority>${prio[p] || '0.8'}</priority></url>`)
      .concat(newsletters().map((n) => `  <url><loc>${e(absUrl('newsletters/' + n.slug))}</loc><lastmod>${e(n.date)}</lastmod><priority>0.5</priority></url>`));
    return new Response(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>\n`,
      { headers: { 'Content-Type': 'application/xml; charset=utf-8', ...CACHE } });
  }

  if (path in ROUTES) {
    if (path !== '' && !u.pathname.endsWith('/')) return redirect('/' + path + '/' + u.search);
    return html(path === 'contact' ? P.contact(u.searchParams) : ROUTES[path]());
  }
  const m = path.match(/^newsletters\/([a-z0-9-]+)$/);
  if (m) {
    const out = P.newsletterPage(m[1]);
    if (out) return html(out);
  }
  return html(P.notFound(), 404);
};

export const config = {
  path: '/*',
  preferStatic: true,
  excludedPath: ['/api/*', '/media/*', '/admin', '/admin/*', '/assets/*', '/__forms.html'],
};
