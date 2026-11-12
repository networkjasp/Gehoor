/** Template helpers shared by all pages. `ctx` is filled once per request by loadContext(). */
import { readJSON } from './store.mjs';
import { defaultSettings, practices as PRACTICES, imageSlots, seedTeam, seoPages, SITE_URL, defaultPortraits } from './content.mjs';

export const ctx = { settings: defaultSettings, seo: {}, team: seedTeam, images: {}, newsletters: [], origin: SITE_URL };

export async function loadContext(origin) {
  const [settings, seo, team, images, newsletters] = await Promise.all([
    readJSON('settings', {}), readJSON('seo', {}), readJSON('team', null), readJSON('images', {}), readJSON('newsletters', []),
  ]);
  ctx.settings = { ...defaultSettings, ...settings };
  ctx.seo = seo || {};
  ctx.team = Array.isArray(team) ? team : seedTeam;
  ctx.images = images || {};
  ctx.newsletters = Array.isArray(newsletters) ? newsletters : [];
  ctx.origin = origin || SITE_URL;
  return ctx;
}

const ESC = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' };
export const e = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ESC[c]);
export const nl2br = (s) => String(s).replace(/\r?\n/g, '<br>\n');
export const url = (p = '') => '/' + String(p).replace(/^\/+/, '');
export const absUrl = (p = '') => ctx.origin.replace(/\/$/, '') + url(p);
export const media = (key) => (key ? '/media/' + String(key).split('/').map(encodeURIComponent).join('/') : '');
export const setting = (k) => String(ctx.settings[k] ?? '');
export const practices = () => Object.values(PRACTICES);

export function team(visibleOnly = true) {
  const t = ctx.team.filter((m) => !visibleOnly || m.visible);
  return [...t].sort((a, b) => (a.order || 0) - (b.order || 0));
}
export const team_photo_url = (m) => (m.photo ? media(m.photo) : (defaultPortraits[m.id] || ''));

export function newsletters(publishedOnly = true) {
  return ctx.newsletters.filter((n) => !publishedOnly || n.published).sort((a, b) => String(b.date).localeCompare(String(a.date)));
}

export function format_date(ymd) {
  const d = new Date(ymd + 'T12:00:00Z');
  if (isNaN(d)) return ymd;
  return d.toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Johannesburg' });
}

export function whatsapp_link(text = 'Hi, I would like to make an appointment') {
  const n = setting('whatsapp').replace(/\D/g, '');
  return n ? `https://wa.me/${n}?text=${encodeURIComponent(text)}` : '';
}

export function image_url(slot) {
  const d = ctx.images[slot];
  if (d && d.file) return media(d.file);
  return imageSlots[slot]?.def || '';
}
export const image_alt = (slot, fallback = '') => {
  const d = ctx.images[slot];
  if (d && d.file) return d.alt || fallback;
  return imageSlots[slot]?.alt || fallback;
};
/** True when the slot shows the built-in CI image (not an upload). */
const usesDefault = (slot) => !(ctx.images[slot] && ctx.images[slot].file);

/**
 * Image slot in a framed photo. Shows the uploaded photo, else the built-in CI photo,
 * else a soft branded placeholder (or nothing when `placeholder` is false).
 */
export function slot_img(slot, cls = '', fallbackAlt = '', lazy = true, ratio = '', { placeholder = true } = {}) {
  const src = image_url(slot);
  const def = imageSlots[slot] || {};
  if (!src) {
    if (!placeholder) return '';
    const style = ratio ? ` style="aspect-ratio:${e(ratio)}"` : '';
    return `<div class="img-ph ${e(cls)}"${style} role="img" aria-label="${e(fallbackAlt || def.label || 'Photo')}"><img src="/assets/img/logo-mark.png" alt="" width="90" height="113"></div>`;
  }
  const alt = image_alt(slot, fallbackAlt);
  const loading = lazy ? ' loading="lazy" decoding="async"' : ' decoding="async" fetchpriority="high"';
  if (usesDefault(slot) && def.variant === 'brand') {
    return `<div class="img-ph ${e(cls)} ci-protection-brand" style="aspect-ratio:${e(ratio || '4 / 3')}" role="img" aria-label="${e(alt)}"><img src="${e(src)}" alt=""${loading}></div>`;
  }
  const focus = usesDefault(slot) ? (def.focus || 'center') : 'center';
  const extra = usesDefault(slot) && def.variant === 'newborn' ? ' class="ci-newborn-photo"' : '';
  return `<div class="img-ph ${e(cls)} ci-photo" style="${ratio ? `aspect-ratio:${e(ratio)};` : ''}--ci-photo-focus:${e(focus)}" role="img" aria-label="${e(alt)}"><img src="${e(src)}" alt=""${loading}${extra}></div>`;
}

/** Plain image (practice photos), with its focus point. */
export function slot_plain(slot, cls, fallbackAlt = '') {
  const src = image_url(slot);
  if (!src) return '';
  const def = imageSlots[slot] || {};
  const pos = usesDefault(slot) && def.focus ? ` style="object-position:${e(def.focus)}"` : '';
  return `<img src="${e(src)}" alt="${e(image_alt(slot, fallbackAlt))}" loading="lazy" decoding="async"${pos} class="${e(cls)}">`;
}

/** Homepage slideshow photos: uploads or CI defaults, skipping any slot left empty. */
export function hero_slides() {
  return ['home_hero', 'home_hero_2', 'home_hero_3', 'home_hero_4']
    .map((slot) => ({ slot, src: image_url(slot), alt: image_alt(slot, 'Gehoor in die Moot'), focus: usesDefault(slot) ? (imageSlots[slot]?.focus || 'center') : 'center' }))
    .filter((x) => x.src);
}

export function seo_for(path) {
  const d = seoPages[path];
  if (!d) return null;
  const o = ctx.seo[path] || {};
  return { title: o.title || d.title, description: o.description || d.description, image: og_image_url(d.og) };
}

export function og_image_url(key) {
  const own = ctx.images.share_default?.file;
  if (own) return ctx.origin.replace(/\/$/, '') + media(own);
  return absUrl(`assets/img/og/${key}.jpg`);
}

export function icon(name, size = 24) {
  const p = {
    check: '<path d="M20 6 9 17l-5-5"/>',
    phone: '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    whatsapp: '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
    pin: '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    test: '<path d="M3 12h2l2-6 3 12 3-9 2 3h6"/>',
    child: '<circle cx="12" cy="7" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/>',
    heart: '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
    wave: '<path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0M2 17c2-2 4-2 6 0"/>',
    ear: '<path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 18 9c0 3-2 4-3 5s-1 4-4 4"/><path d="M10 10a2 2 0 1 1 4 0"/>',
    shield: '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
    battery: '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2M7 10v4M11 10v4"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    doc: '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/>',
    download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
    medical: '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 6V4h6v2M12 10v6M9 13h6"/>',
  }[name] || '';
  return `<svg class="ic" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
}
