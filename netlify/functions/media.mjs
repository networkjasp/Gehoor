/** Serves photos, logos and newsletters uploaded in the portal (stored in Netlify Blobs). */
import { media } from '../lib/store.mjs';

const TYPES = { webp: 'image/webp', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', pdf: 'application/pdf' };

export default async (req) => {
  const u = new URL(req.url);
  let key;
  try { key = decodeURIComponent(u.pathname.replace(/^\/media\//, '')); } catch { return new Response('Not found', { status: 404 }); }
  if (!/^(images|team|newsletters)\/[A-Za-z0-9._\/-]+$/.test(key) || key.includes('..')) return new Response('Not found', { status: 404 });
  const local = !!process.env.GIDM_LOCAL_STORE;
  const res = await media().getWithMetadata(key, { type: local ? 'arrayBuffer' : 'stream' }).catch(() => null);
  if (!res || res.data == null) return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'public, max-age=60' } });
  const ext = key.split('.').pop().toLowerCase();
  const isPdf = ext === 'pdf';
  return new Response(res.data, {
    headers: {
      'Content-Type': res.metadata?.contentType || TYPES[ext] || 'application/octet-stream',
      // File names contain a random code, so a new upload always gets a new address.
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Netlify-CDN-Cache-Control': 'public, durable, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
      ...(isPdf
        ? { 'Content-Disposition': `inline; filename="${key.split('/').pop()}"` }
        : { 'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; sandbox" }),
    },
  });
};

export const config = { path: '/media/*' };
