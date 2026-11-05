// Runs during every Netlify deploy: makes sure the pages render and the hidden form file matches the contact form.
import fs from 'node:fs';
const P = await import('../netlify/lib/pages.mjs');
const { loadContext } = await import('../netlify/lib/helpers.mjs');
process.env.GIDM_LOCAL_STORE ||= '/tmp/gidm-check-store';
await loadContext('https://gehoorindiemoot.co.za');
const pages = ['home', 'services', 'about', 'hearingAids', 'children', 'medicalAid', 'newsletterList', 'privacy', 'terms', 'notFound', 'contact'];
for (const p of pages) {
  const html = P[p]();
  if (!html.includes('</html>') || (html.match(/<h1/g) || []).length !== 1 || /\$\{|undefined|\[object Object\]/.test(html)) {
    console.error('Page check failed:', p); process.exit(1);
  }
}
fs.writeFileSync(new URL('../public/__forms.html', import.meta.url), P.formsSkeleton());
console.log('All', pages.length, 'pages render correctly; form definition written for Netlify Forms.');
