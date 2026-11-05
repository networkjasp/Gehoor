/**
 * Management portal API (/api/...). Every call except login needs a valid session cookie
 * and the X-Requested-With: portal header (blocks cross-site requests).
 */
import crypto from 'node:crypto';
import { purgeCache } from '@netlify/functions';
import { content, media, readJSON, writeJSON } from '../lib/store.mjs';
import { getAuth, checkPassword, changePassword, makeSessionCookie, clearSessionCookie, readSession, throttleCheck } from '../lib/auth.mjs';
import { defaultSettings, imageSlots, seoPages, seedTeam } from '../lib/content.mjs';

class HttpError extends Error { constructor(status, msg) { super(msg); this.status = status; } }
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...headers },
});
const rand = (n = 4) => crypto.randomBytes(n).toString('hex');
const str = (v, max = 500) => String(v ?? '').replace(/\0/g, '').trim().slice(0, max);
const slugify = (s) => (String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item');

async function purge() {
  if (process.env.GIDM_LOCAL_STORE) return;
  try { await purgeCache(); } catch (err) { console.error('Cache purge failed', err); }
}

/** Accept only real images/PDFs, checked by their first bytes (not the file name). */
function sniff(buf) {
  const b = new Uint8Array(buf.slice(0, 12));
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return ['jpg', 'image/jpeg'];
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return ['png', 'image/png'];
  if (String.fromCharCode(...b.slice(0, 4)) === 'RIFF' && String.fromCharCode(...b.slice(8, 12)) === 'WEBP') return ['webp', 'image/webp'];
  if (String.fromCharCode(...b.slice(0, 5)) === '%PDF-') return ['pdf', 'application/pdf'];
  return [null, null];
}

async function readImage(req, maxBytes = 4 * 1024 * 1024) {
  const buf = await req.arrayBuffer();
  if (!buf.byteLength) throw new HttpError(400, 'Please choose an image.');
  if (buf.byteLength > maxBytes) throw new HttpError(413, 'That image is too large. Please choose a smaller one.');
  const [ext, type] = sniff(buf);
  if (!ext || ext === 'pdf') throw new HttpError(415, 'Please upload a JPG, PNG or WebP image.');
  return { buf, ext, type };
}

async function putMedia(key, buf, contentType) {
  await media().set(key, buf, { metadata: { contentType } });
}
async function delMedia(key) {
  if (key) await media().delete(key).catch(() => {});
}

async function loadTeam() {
  const t = await readJSON('team', null);
  return Array.isArray(t) ? t : structuredClone(seedTeam);
}
const sortTeam = (t) => [...t].sort((a, b) => (a.order || 0) - (b.order || 0));

async function state() {
  const [settings, seo, team, images, newsletters, auth] = await Promise.all([
    readJSON('settings', {}), readJSON('seo', {}), loadTeam(), readJSON('images', {}), readJSON('newsletters', []), getAuth(),
  ]);
  return {
    user: auth?.user, passwordChanged: !!auth?.changed,
    settings: { ...defaultSettings, ...settings },
    seo: Object.fromEntries(Object.entries(seoPages).map(([p, d]) => [p, { ...d, title: seo[p]?.title || d.title, description: seo[p]?.description || d.description, custom: !!(seo[p]?.title || seo[p]?.description) }])),
    team: sortTeam(team), images, slots: imageSlots,
    newsletters: [...newsletters].sort((a, b) => String(b.date).localeCompare(String(a.date))).map(({ text, ...n }) => ({ ...n, hasText: !!text })),
  };
}

export default async (req, context) => {
  const u = new URL(req.url);
  const parts = u.pathname.replace(/^\/api\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  const method = req.method;
  const secure = u.protocol === 'https:';
  try {
    if (req.headers.get('x-requested-with') !== 'portal') throw new HttpError(403, 'Forbidden');
    const origin = req.headers.get('origin');
    if (origin && origin !== u.origin) throw new HttpError(403, 'Forbidden');

    // ---- Login / logout / status (no session needed)
    if (parts[0] === 'status' && method === 'GET') {
      const auth = await getAuth();
      const s = await readSession(req);
      return json({ setupNeeded: !auth, loggedIn: !!s });
    }
    if (parts[0] === 'login' && method === 'POST') {
      const auth = await getAuth();
      if (!auth) throw new HttpError(503, 'The portal is not set up yet. Add ADMIN_PASSWORD_HASH in Netlify (see the README).');
      if (!(await throttleCheck(context?.ip, false))) throw new HttpError(429, 'Too many failed attempts. Please wait 15 minutes and try again.');
      const body = await req.json().catch(() => ({}));
      const user = await checkPassword(body.user, body.pass);
      if (!user) {
        await throttleCheck(context?.ip, true);
        await new Promise((r) => setTimeout(r, 400));
        throw new HttpError(401, 'The username or password is incorrect.');
      }
      return json({ ok: true }, 200, { 'Set-Cookie': await makeSessionCookie(user, secure) });
    }
    if (parts[0] === 'logout' && method === 'POST') return json({ ok: true }, 200, { 'Set-Cookie': clearSessionCookie(secure) });

    const session = await readSession(req);
    if (!session) throw new HttpError(401, 'Your session has expired. Please log in again.');
    const refreshed = { 'Set-Cookie': await makeSessionCookie(session.u, secure) };
    const ok = async (data = { ok: true }, mutated = true) => { if (mutated) await purge(); return json(data, 200, refreshed); };

    // ---- Everything the portal shows
    if (parts[0] === 'state' && method === 'GET') return ok(await state(), false);

    // ---- Team
    if (parts[0] === 'team') {
      let team = await loadTeam();
      const id = parts[1];
      const idx = team.findIndex((m) => m.id === id);
      if (method === 'POST' && !id) {
        const b = await req.json();
        const name = str(b.name, 100);
        if (!name) throw new HttpError(400, 'Please enter a name.');
        const data = { name, role: str(b.role, 100), group: b.group === 'support' ? 'support' : 'audiologist', quals: str(b.quals, 300), hpcsa: str(b.hpcsa, 40), bio: str(b.bio, 1500), visible: !!b.visible };
        let saved;
        if (b.id) {
          const i = team.findIndex((m) => m.id === b.id);
          if (i < 0) throw new HttpError(404, 'Team member not found.');
          team[i] = { ...team[i], ...data }; saved = team[i];
        } else {
          saved = { id: slugify(name) + '-' + rand(2), photo: '', order: Math.max(0, ...team.map((m) => m.order || 0)) + 1, ...data };
          team.push(saved);
        }
        await writeJSON('team', team);
        return ok({ ok: true, member: saved });
      }
      if (idx < 0) throw new HttpError(404, 'Team member not found.');
      if (method === 'DELETE' && !parts[2]) {
        await delMedia(team[idx].photo);
        team.splice(idx, 1);
        await writeJSON('team', team);
        return ok();
      }
      if (parts[2] === 'move' && method === 'POST') {
        const dir = (await req.json()).dir === 'up' ? -1 : 1;
        team = sortTeam(team);
        const i = team.findIndex((m) => m.id === id);
        if (team[i + dir]) [team[i], team[i + dir]] = [team[i + dir], team[i]];
        team.forEach((m, n) => { m.order = n + 1; });
        await writeJSON('team', team);
        return ok();
      }
      if (parts[2] === 'photo' && method === 'PUT') {
        const img = await readImage(req);
        const key = `team/${slugify(team[idx].name)}-${rand()}.${img.ext}`;
        await putMedia(key, img.buf, img.type);
        await delMedia(team[idx].photo);
        team[idx].photo = key;
        await writeJSON('team', team);
        return ok({ ok: true, photo: key });
      }
      if (parts[2] === 'photo' && method === 'DELETE') {
        await delMedia(team[idx].photo);
        team[idx].photo = '';
        await writeJSON('team', team);
        return ok();
      }
    }

    // ---- Website images
    if (parts[0] === 'images' && parts[1]) {
      const slot = parts[1];
      if (!imageSlots[slot]) throw new HttpError(404, 'Unknown image.');
      const images = await readJSON('images', {});
      const cur = images[slot] || {};
      if (method === 'PUT') {
        const alt = str(u.searchParams.get('alt'), 200);
        if (!alt && !imageSlots[slot].decorative) throw new HttpError(400, `Please add a short description (alt text) for "${imageSlots[slot].label}". It helps blind visitors and Google.`);
        const img = await readImage(req);
        const key = `images/${slot.replace(/_/g, '-')}-${rand()}.${img.ext}`;
        await putMedia(key, img.buf, img.type);
        await delMedia(cur.file);
        images[slot] = { file: key, alt, w: +u.searchParams.get('w') || null, h: +u.searchParams.get('h') || null, updated: Date.now() };
        await writeJSON('images', images);
        return ok({ ok: true, image: images[slot] });
      }
      if (method === 'POST' && parts[2] === 'alt') {
        const alt = str((await req.json()).alt, 200);
        if (!alt && cur.file && !imageSlots[slot].decorative) throw new HttpError(400, 'Please add a short description (alt text).');
        images[slot] = { ...cur, alt };
        await writeJSON('images', images);
        return ok();
      }
      if (method === 'DELETE') {
        await delMedia(cur.file);
        delete images[slot];
        await writeJSON('images', images);
        return ok();
      }
    }

    // ---- Newsletters: create → upload PDF parts → upload page images → finish
    if (parts[0] === 'newsletters') {
      let all = await readJSON('newsletters', []);
      const id = parts[1];
      if (method === 'POST' && !id) {
        const b = await req.json();
        const title = str(b.title, 150);
        if (!title) throw new HttpError(400, 'Please enter a title.');
        const date = /^\d{4}-\d{2}-\d{2}$/.test(b.date) ? b.date : new Date().toISOString().slice(0, 10);
        let slug = slugify(title), n = 2;
        while (all.some((x) => x.slug === slug)) slug = `${slugify(title)}-${n++}`;
        const nl = { id: `${date}-${rand(3)}`, slug, title, date, summary: str(b.summary, 400), pdf: '', pages: [], cover: '', text: '',
          published: false, publishWhenReady: !!b.published, created: new Date().toISOString() };
        all.push(nl);
        await writeJSON('newsletters', all);
        return ok({ ok: true, id: nl.id }, false);
      }
      const nl = all.find((x) => x.id === id);
      if (!nl) throw new HttpError(404, 'Newsletter not found.');
      const dir = `newsletters/${nl.id}`;
      if (parts[2] === 'pdf-part' && method === 'PUT') {
        const part = +u.searchParams.get('part');
        if (!(part >= 0 && part < 10)) throw new HttpError(400, 'Invalid part.');
        const buf = await req.arrayBuffer();
        if (buf.byteLength > 4 * 1024 * 1024) throw new HttpError(413, 'Part too large.');
        if (part === 0 && sniff(buf)[0] !== 'pdf') throw new HttpError(415, 'Please upload a PDF file.');
        await media().set(`${dir}/upload-part-${part}`, buf);
        return ok({ ok: true }, false);
      }
      if (parts[2] === 'page' && method === 'PUT') {
        const n = +parts[3];
        if (!(n >= 1 && n <= 60)) throw new HttpError(400, 'Invalid page.');
        const img = await readImage(req, 3 * 1024 * 1024);
        const key = `${dir}/page-${String(n).padStart(2, '0')}-${rand()}.${img.ext}`;
        await putMedia(key, img.buf, img.type);
        return ok({ ok: true, key }, false);
      }
      if (parts[2] === 'finish' && method === 'POST') {
        const b = await req.json();
        // Join the PDF parts into one file
        const partsCount = Math.min(10, Math.max(1, +b.pdfParts || 1));
        const chunks = [];
        for (let i = 0; i < partsCount; i++) {
          const c = await media().get(`${dir}/upload-part-${i}`, { type: 'arrayBuffer' });
          if (!c) throw new HttpError(400, 'The PDF upload was incomplete. Please try again.');
          chunks.push(Buffer.from(c));
        }
        const pdf = Buffer.concat(chunks);
        if (pdf.length > 30 * 1024 * 1024 || sniff(pdf)[0] !== 'pdf') throw new HttpError(415, 'Please upload a PDF file under 30 MB.');
        const pdfKey = `${dir}/${nl.slug}-${rand(3)}.pdf`;
        await putMedia(pdfKey, pdf, 'application/pdf');
        for (let i = 0; i < partsCount; i++) await media().delete(`${dir}/upload-part-${i}`).catch(() => {});
        const pages = (Array.isArray(b.pages) ? b.pages : []).filter((k) => typeof k === 'string' && k.startsWith(dir + '/page-'));
        nl.pdf = pdfKey; nl.pages = pages; nl.cover = pages[0] || '';
        nl.text = String(b.text || '').slice(0, 200000).trim();
        if (!nl.summary && nl.text) { const plain = nl.text.replace(/\s+/g, ' '); nl.summary = plain.slice(0, 180) + (plain.length > 180 ? '…' : ''); }
        nl.published = !!nl.publishWhenReady; delete nl.publishWhenReady;
        await writeJSON('newsletters', all);
        return ok({ ok: true, url: '/newsletters/' + nl.slug, published: nl.published });
      }
      if (method === 'POST' && !parts[2]) {
        const b = await req.json();
        const title = str(b.title, 150);
        if (!title) throw new HttpError(400, 'Please enter a title.');
        if (title !== nl.title) {
          let slug = slugify(title), n = 2;
          while (all.some((x) => x.slug === slug && x.id !== nl.id)) slug = `${slugify(title)}-${n++}`;
          nl.slug = slug;
        }
        nl.title = title;
        if (/^\d{4}-\d{2}-\d{2}$/.test(b.date)) nl.date = b.date;
        nl.summary = str(b.summary, 400);
        nl.published = !!b.published;
        await writeJSON('newsletters', all);
        return ok();
      }
      if (method === 'DELETE') {
        const { blobs } = await media().list({ prefix: dir + '/' });
        for (const bl of blobs) await media().delete(bl.key).catch(() => {});
        all = all.filter((x) => x.id !== nl.id);
        await writeJSON('newsletters', all);
        return ok();
      }
    }

    // ---- Settings
    if (parts[0] === 'settings' && method === 'POST') {
      const b = await req.json();
      const s = { ...(await readJSON('settings', {})) };
      for (const [k, max] of Object.entries({ phone: 30, whatsapp: 20, email: 150, hours: 60, google_reviews_url: 300, facebook_url: 300, info_officer: 100, ga4_id: 20, gsc_verification: 300 })) {
        if (k in b) s[k] = str(b[k], max);
      }
      if (s.email !== undefined && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.email)) throw new HttpError(400, 'Please enter a valid email address.');
      for (const k of ['google_reviews_url', 'facebook_url']) if (s[k] && !/^https:\/\//i.test(s[k])) throw new HttpError(400, 'Links must start with https://');
      if (s.ga4_id) { s.ga4_id = s.ga4_id.toUpperCase(); if (!/^G-[A-Z0-9]{4,15}$/.test(s.ga4_id)) throw new HttpError(400, 'The Google Analytics ID looks like G-ABC123XYZ. Find it in Google Analytics › Admin › Data streams.'); }
      if (s.gsc_verification) { const m = s.gsc_verification.match(/content=["']([^"']+)["']/); s.gsc_verification = (m ? m[1] : s.gsc_verification).replace(/[^A-Za-z0-9_-]/g, ''); }
      if (s.phone) { const d = s.phone.replace(/\D/g, ''); s.phone_intl = '+27' + (d.startsWith('27') ? d.slice(2) : d).replace(/^0+/, ''); }
      if (s.whatsapp !== undefined) { s.whatsapp = s.whatsapp.replace(/\D/g, ''); if (s.whatsapp.startsWith('0')) s.whatsapp = '27' + s.whatsapp.slice(1); }
      await writeJSON('settings', s);
      return ok();
    }

    // ---- SEO
    if (parts[0] === 'seo' && method === 'POST') {
      const b = await req.json();
      const out = {};
      for (const [p, d] of Object.entries(seoPages)) {
        const t = str(b[p]?.title, 120), ds = str(b[p]?.description, 300);
        out[p] = { title: t === d.title ? '' : t, description: ds === d.description ? '' : ds };
      }
      await writeJSON('seo', out);
      return ok();
    }

    // ---- Password
    if (parts[0] === 'password' && method === 'POST') {
      const b = await req.json();
      if (String(b.next) !== String(b.confirm)) throw new HttpError(400, 'The new passwords do not match.');
      try {
        const user = await changePassword(b.current, b.next, b.user);
        return json({ ok: true }, 200, { 'Set-Cookie': await makeSessionCookie(user, secure) });
      } catch (err) { throw new HttpError(400, err.message); }
    }

    // ---- Messages (Netlify Forms), shown here when NETLIFY_API_TOKEN is set
    if (parts[0] === 'messages') {
      const token = process.env.NETLIFY_API_TOKEN;
      const siteId = context?.site?.id;
      const dashboard = context?.site?.name ? `https://app.netlify.com/projects/${context.site.name}/forms` : 'https://app.netlify.com/';
      if (!token || !siteId) return ok({ configured: false, dashboard }, false);
      const api = (p, init = {}) => fetch('https://api.netlify.com/api/v1' + p, { ...init, headers: { Authorization: `Bearer ${token}`, ...(init.headers || {}) } });
      if (method === 'DELETE' && parts[1]) {
        if (!/^[a-f0-9]{24}$/.test(parts[1])) throw new HttpError(400, 'Invalid message.');
        await api(`/submissions/${parts[1]}`, { method: 'DELETE' });
        return ok({ ok: true }, false);
      }
      const forms = await (await api(`/sites/${siteId}/forms`)).json();
      const form = Array.isArray(forms) ? forms.find((f) => f.name === 'contact') : null;
      if (!form) return ok({ configured: true, dashboard, messages: [] }, false);
      const subs = await (await api(`/forms/${form.id}/submissions?per_page=50`)).json();
      return ok({ configured: true, dashboard, messages: (Array.isArray(subs) ? subs : []).map((s) => ({ id: s.id, date: s.created_at, ...s.data })) }, false);
    }

    throw new HttpError(404, 'Not found.');
  } catch (err) {
    if (err instanceof HttpError) return json({ ok: false, error: err.message }, err.status);
    console.error(err);
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500);
  }
};

export const config = { path: '/api/*' };
