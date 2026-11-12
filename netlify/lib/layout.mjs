/** Shared layout: <head>, header, footer and reusable sections. */
import { ctx, e, url, absUrl, setting, practices, team, icon, image_url, image_alt, slot_img, seo_for, og_image_url, whatsapp_link } from './helpers.mjs';
import { navItems } from './content.mjs';

function schemaOrg() {
  const aud = team().filter((m) => m.group === 'audiologist');
  const locations = practices().map((p) => ({
    '@type': 'MedicalClinic',
    name: `${setting('practice_name')} – ${p.name}`,
    telephone: setting('phone_intl'),
    address: { '@type': 'PostalAddress', streetAddress: p.street, addressLocality: `${p.area}, ${p.city}`, postalCode: p.code, addressRegion: 'Gauteng', addressCountry: 'ZA' },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '16:30' }],
  }));
  const sameAs = [setting('google_reviews_url'), setting('facebook_url')].filter(Boolean);
  const org = {
    '@context': 'https://schema.org', '@type': 'MedicalClinic', '@id': absUrl('#practice'),
    name: `${setting('practice_name')} – Dr René Hornby Audiologists`, alternateName: 'Dr René Hornby Oudioloë',
    url: absUrl(), logo: absUrl('assets/img/logo-full.png'), image: absUrl('assets/img/og-image.jpg'),
    telephone: setting('phone_intl'), email: setting('email'), foundingDate: '1999', medicalSpecialty: 'Audiology',
    availableLanguage: ['af', 'en'], areaServed: ['Pretoria', 'Moot', 'Rietfontein', 'Les Marais', 'Villieria', 'Queenswood', 'Wonderboom South'],
    address: locations[0].address, openingHours: 'Mo-Fr 08:00-16:30', department: locations,
    employee: aud.map((m) => ({ '@type': 'Person', name: m.name, jobTitle: m.role, ...(m.hpcsa ? { hasCredential: 'HPCSA ' + m.hpcsa } : {}) })),
    memberOf: [{ '@type': 'Organization', name: 'South African Association of Audiologists' }, { '@type': 'Organization', name: 'iCAN – Independent Connected Audiology Network' }],
  };
  if (sameAs.length) org.sameAs = sameAs;
  return org;
}

const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, '\\u003c')}</script>`;

/**
 * meta: { path, title?, description?, schema?, image?, noindex?, breadcrumbs?, useMeta?, ogType? }
 */
export function pageHead(meta, active = '') {
  const path = meta.path ?? '';
  const seo = meta.useMeta ? null : seo_for(path);
  const title = seo?.title || meta.title;
  let desc = String(seo?.description || meta.description || '').trim();
  if (desc.length > 158) desc = desc.slice(0, desc.slice(0, 155).lastIndexOf(' ') || 155).replace(/[ ,.;:–-]+$/, '') + '…';
  const canonical = absUrl(path);
  let image = meta.image || seo?.image || og_image_url('home');
  if (image.startsWith('/')) image = ctx.origin.replace(/\/$/, '') + image;
  const schemas = [schemaOrg()];
  if (meta.breadcrumbs?.length) {
    schemas.push({ '@context': 'https://schema.org', '@type': 'BreadcrumbList',
      itemListElement: [['Home', ''], ...meta.breadcrumbs].map(([n, p], i) => ({ '@type': 'ListItem', position: i + 1, name: n, item: absUrl(p) })) });
  }
  schemas.push(...(meta.schema || []));
  const ga = /^G-[A-Z0-9]{4,15}$/.test(setting('ga4_id')) ? setting('ga4_id') : '';
  return `<!doctype html>
<html lang="en-ZA"${ga ? ` data-ga="${e(ga)}"` : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(title)}</title>
<meta name="description" content="${e(desc)}">
<link rel="canonical" href="${e(canonical)}">
${meta.noindex ? '<meta name="robots" content="noindex">\n' : ''}${setting('gsc_verification') ? `<meta name="google-site-verification" content="${e(setting('gsc_verification'))}">\n` : ''}<meta property="og:type" content="${e(meta.ogType || 'website')}">
<meta property="og:site_name" content="Gehoor in die Moot">
<meta property="og:locale" content="en_ZA">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:url" content="${e(canonical)}">
<meta property="og:image" content="${e(image)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${e(title)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(desc)}">
<meta name="twitter:image" content="${e(image)}">
<meta name="theme-color" content="#142949">
<link rel="icon" href="/favicon.ico" sizes="32x32">
<link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png">
<link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<link rel="preload" href="/assets/fonts/montserrat-latin-800-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/nunito-sans-latin-400-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/site.css?v=5">
<script>try{var p=JSON.parse(localStorage.getItem('gidm-a11y')||'{}');if(p.size)document.documentElement.dataset.size=p.size;if(p.contrast)document.documentElement.dataset.contrast='1';}catch(e){}</script>
${schemas.map(ld).join('\n')}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
${pageHeader(active)}`;
}

function pageHeader(active) {
  return `<aside class="utility" aria-label="Opening hours, contact details and reading options">
  <div class="wrap utility-in">
    <div class="utility-info">
      <span>${icon('clock', 16)} ${e(setting('hours'))}</span>
      <a href="tel:${e(setting('phone_intl'))}" data-track="phone_click">${icon('phone', 16)} ${e(setting('phone'))}</a>
      <a class="hide-sm" href="mailto:${e(setting('email'))}" data-track="email_click">${icon('mail', 16)} ${e(setting('email'))}</a>
    </div>
    <div class="a11y" role="group" aria-label="Reading options">
      <span class="hide-sm">Text size</span>
      <button type="button" data-a11y="smaller" aria-label="Smaller text">A−</button>
      <button type="button" data-a11y="bigger" aria-label="Larger text">A+</button>
      <button type="button" data-a11y="contrast" aria-pressed="false">High contrast</button>
    </div>
  </div>
</aside>
<header class="site-header">
  <div class="wrap header-in">
    <a class="brand" href="/" aria-label="Gehoor in die Moot – home">
      <img src="${e(image_url('logo_header'))}" alt="Gehoor in die Moot – Dr René Hornby audiologists / oudioloë" width="240" height="63" fetchpriority="high">
    </a>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>
        <li><a href="/"${active === 'home' ? ' aria-current="page"' : ''}>Home</a></li>
${navItems.map(([key, label, p]) => `        <li><a href="${e(url(p))}"${key === active ? ' aria-current="page"' : ''}>${e(label)}</a></li>`).join('\n')}
      </ul>
    </nav>
    <a class="btn btn-primary nav-cta" href="/contact/#form" data-track="cta_click">Make an appointment</a>
  </div>
</header>
<main id="main">
`;
}

export function pageFooter() {
  const wa = whatsapp_link();
  return `</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <img src="${e(image_url('logo_footer'))}" alt="" width="64" height="81" loading="lazy">
      <p>Dr René Hornby Audiologists · Oudioloë. Caring for Pretoria's hearing since 1999.</p>
    </div>
    <div>
      <h2>Contact</h2>
      <ul>
        <li><a href="tel:${e(setting('phone_intl'))}" data-track="phone_click">${e(setting('phone'))}</a></li>
        <li><a href="mailto:${e(setting('email'))}" data-track="email_click">${e(setting('email'))}</a></li>
${wa ? `        <li><a href="${e(wa)}" data-track="whatsapp_click">WhatsApp us</a></li>\n` : ''}        <li>${e(setting('hours'))}</li>
      </ul>
    </div>
    <div>
      <h2>Practices</h2>
      <ul>
${practices().map((p) => `        <li>${e(p.street)}, ${e(p.area)}, ${e(p.city)}, ${e(p.code)}</li>`).join('\n')}
      </ul>
    </div>
    <div>
      <h2>Explore</h2>
      <ul>
${navItems.map(([, label, p]) => `        <li><a href="${e(url(p))}">${e(label)}</a></li>`).join('\n')}
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <span><a class="copy-link" href="/admin/" aria-label="Site management" rel="nofollow">©</a> ${new Date().getFullYear()} ${e(setting('legal_name'))} · Reg. ${e(setting('company_reg'))} · ${e(setting('practice_no'))}</span>
    <span class="legal-links"><a href="/privacy/">Privacy policy</a> <a href="/terms/">Terms &amp; conditions</a> <button type="button" class="linklike" data-consent-open>Cookie settings</button></span>
  </div>
</footer>
<nav class="action-bar" aria-label="Quick contact">
  <a href="tel:${e(setting('phone_intl'))}" data-track="phone_click">${icon('phone', 22)}<span>Call</span></a>
${wa ? `  <a href="${e(wa)}" data-track="whatsapp_click">${icon('whatsapp', 22)}<span>WhatsApp</span></a>\n` : ''}  <a class="primary" href="/contact/#form" data-track="cta_click">${icon('mail', 22)}<span>Make an appointment</span></a>
</nav>
<div class="cookie-banner" id="consent" role="dialog" aria-modal="false" aria-labelledby="consent-h" hidden>
  <div class="consent-in">
    <div>
      <h2 id="consent-h">Cookies on this website</h2>
      <p>We use essential storage to remember your text-size and cookie choices. With your permission we also use Google Analytics to see which pages help people, and show Google Maps. <a href="/privacy/#cookies">Read our cookie policy</a></p>
    </div>
    <div class="consent-btns">
      <button type="button" class="btn btn-outline" data-consent="essential">Essential only</button>
      <button type="button" class="btn btn-primary" data-consent="all">Accept all</button>
    </div>
  </div>
</div>
<script src="/assets/js/site.js?v=5" defer></script>
</body>
</html>
`;
}

export function members_of() {
  const members = [
    ['member_audiologysa', 'South African Association of Audiologists', 'saaa', 'https://www.audiologysa.co.za'],
    ['member_ican', 'iCAN / Independent Connected Audiology Network', 'ican', 'https://ican.org.za'],
  ];
  return `<section class="section members" aria-labelledby="members-h">
  <div class="wrap">
    <p class="eyebrow">Lid van · Member of</p>
    <h2 id="members-h">Proud members of South Africa's audiology bodies</h2>
    <div class="members-grid">
${members.map(([slot, name, key, href]) => {
    const src = image_url(slot);
    return `      <a class="member" href="${e(href)}" rel="noopener" target="_blank">
        ${src ? `<span class="member-logo member-logo-${key}" aria-hidden="true"><img src="${e(src)}" alt="" decoding="async" loading="lazy"></span>` : `<span class="member-badge" aria-hidden="true">${e(key.toUpperCase())}</span>`}
        <span class="member-name">${e(name)}</span>
      </a>`;
  }).join('\n')}
    </div>
  </div>
</section>

`;
}

export function cta_band(title = 'Ready to hear better?', text = 'Send us a message and our friendly reception team will find a time that suits you.') {
  return `<section class="cta-band">
  <div class="wrap cta-in">
    <div>
      <h2>${e(title)}</h2>
      <p>${e(text)}</p>
    </div>
    <div class="cta-actions">
      <a class="btn btn-green btn-lg" href="/contact/#form" data-track="cta_click">Make an appointment</a>
      <span class="cta-alt">or call <a href="tel:${e(setting('phone_intl'))}" data-track="phone_click">${e(setting('phone'))}</a></span>
    </div>
  </div>
</section>`;
}

export function page_hero(eyebrow, title, intro, slot, crumbs) {
  return `<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a>${crumbs.map(([n, p]) => ` <span aria-hidden="true">›</span> <a href="${e(url(p))}" aria-current="page">${e(n)}</a>`).join('')}</nav>
    <div class="split">
      <div class="split-text">
        <p class="eyebrow">${e(eyebrow)}</p>
        <h1>${e(title)}</h1>
        <p class="lead">${e(intro)}</p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="/contact/#form" data-track="cta_click">Make an appointment</a>
          <span class="cta-alt">or call <a href="tel:${e(setting('phone_intl'))}" data-track="phone_click">${e(setting('phone'))}</a></span>
        </div>
      </div>
      ${(() => { const m = slot_img(slot, 'rounded', title, false, '4 / 3', { placeholder: false }); return m ? `<div class="split-media">${m}</div>` : ''; })()}
    </div>
  </div>
</section>`;
}

export const ctxRef = ctx;
