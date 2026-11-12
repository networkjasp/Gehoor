/**
 * Local preview without Netlify: `npm run dev`, then open http://localhost:8888
 * Content and uploads are stored in ./.local-store. Contact form posts are saved
 * to ./.local-store/form-submissions.json (on Netlify they are emailed instead).
 * Log in with the built-in starting login (see README › First login).
 */
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
process.env.GIDM_LOCAL_STORE ||= path.join(root, '.local-store');
const PORT = +process.env.PORT || 8888;

const site = (await import('../netlify/functions/site.mjs')).default;
const api = (await import('../netlify/functions/api.mjs')).default;
const media = (await import('../netlify/functions/media.mjs')).default;

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.webmanifest': 'application/manifest+json', '.txt': 'text/plain', '.svg': 'image/svg+xml', '.pdf': 'application/pdf', '.json': 'application/json' };

async function staticFile(p) {
  let file = path.join(root, 'public', decodeURIComponent(p));
  if (!file.startsWith(path.join(root, 'public'))) return null;
  try {
    const st = await fs.stat(file);
    if (st.isDirectory()) { file = path.join(file, 'index.html'); await fs.stat(file); }
    return { body: await fs.readFile(file), type: TYPES[path.extname(file)] || 'application/octet-stream' };
  } catch { return null; }
}

http.createServer(async (req, res) => {
  const u = new URL(req.url, `http://${req.headers.host}`);
  const chunks = [];
  for await (const c of req) chunks.push(c);
  const body = chunks.length ? Buffer.concat(chunks) : undefined;
  const request = new Request(u, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : body });
  const context = { ip: req.socket.remoteAddress, site: { id: 'local', name: 'local', url: `http://${req.headers.host}` } };
  let response;
  try {
    if (u.pathname === '/__forms.html' && req.method === 'POST') {
      const file = path.join(process.env.GIDM_LOCAL_STORE, 'form-submissions.json');
      let list = []; try { list = JSON.parse(await fs.readFile(file, 'utf8')); } catch {}
      list.unshift({ date: new Date().toISOString(), ...Object.fromEntries(new URLSearchParams(body?.toString() || '')) });
      await fs.mkdir(process.env.GIDM_LOCAL_STORE, { recursive: true });
      await fs.writeFile(file, JSON.stringify(list, null, 2));
      response = new Response('Form submitted (local preview)', { status: 200 });
    } else if (u.pathname.startsWith('/api/')) response = await api(request, context);
    else if (u.pathname.startsWith('/media/')) response = await media(request, context);
    else {
      const s = (u.pathname !== '/' || u.pathname === '/admin/') ? await staticFile(u.pathname) : null;
      if (s) response = new Response(s.body, { headers: { 'Content-Type': s.type } });
      else if (u.pathname === '/admin') response = new Response(null, { status: 301, headers: { Location: '/admin/' } });
      else response = await site(request, context);
    }
  } catch (err) {
    console.error(err);
    response = new Response('Server error', { status: 500 });
  }
  const headers = {};
  response.headers.forEach((v, k) => { if (k === 'set-cookie') return; headers[k] = v; });
  const cookies = response.headers.getSetCookie ? response.headers.getSetCookie() : [];
  if (cookies.length) headers['set-cookie'] = cookies.map((c) => c.replace('; Secure', ''));
  res.writeHead(response.status, headers);
  res.end(req.method === 'HEAD' ? undefined : Buffer.from(await response.arrayBuffer()));
}).listen(PORT, () => console.log(`Local preview: http://localhost:${PORT}  (portal: /admin/)`));
