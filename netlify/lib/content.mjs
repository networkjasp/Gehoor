/** Default content. Everything here can be changed in the portal; these values are used until then. */

export const SITE_URL = 'https://gehoorindiemoot.co.za';

export const defaultSettings = {
  practice_name: 'Gehoor in die Moot',
  legal_name: 'Dr René Hornby Inc.',
  phone: '012 331 4469',
  phone_intl: '+27123314469',
  whatsapp: '', // e.g. 27821234567 – WhatsApp buttons stay hidden while empty
  email: 'admin@gehoorindiemoot.co.za',
  hours: 'Mon–Fri 08:00–16:30',
  practice_no: 'PR 8212155',
  company_reg: '2019/150857/21',
  google_reviews_url: '',
  facebook_url: '',
  info_officer: 'Dr René Hornby',
  ga4_id: '', // Google Analytics 4 Measurement ID – public by design
  gsc_verification: '', // Google Search Console code – public by design
};

export const practices = {
  rietfontein: {
    name: 'Rietfontein', street: '536 18th Avenue', area: 'Rietfontein', city: 'Pretoria', code: '0084',
    note: 'Secure on-site parking · Wheelchair-friendly',
    map: 'https://www.google.com/maps/search/?api=1&query=536+18th+Avenue+Rietfontein+Pretoria+0084',
    embed: 'https://www.google.com/maps?q=536+18th+Avenue,+Rietfontein,+Pretoria,+0084&output=embed',
    image: 'practice_rietfontein',
  },
  lesmarais: {
    name: 'Les Marais', street: '663 5th Avenue', area: 'Les Marais', city: 'Pretoria', code: '0084',
    note: 'Across from Life Eugene Marais Hospital · Newborn screening',
    map: 'https://www.google.com/maps/search/?api=1&query=663+5th+Avenue+Les+Marais+Pretoria+0084',
    embed: 'https://www.google.com/maps?q=663+5th+Avenue,+Les+Marais,+Pretoria,+0084&output=embed',
    image: 'practice_lesmarais',
  },
};

export const navItems = [
  ['services', 'Services', 'services/'],
  ['hearing-aids', 'Hearing aids', 'hearing-aids/'],
  ['babies-and-children', 'Babies & children', 'babies-and-children/'],
  ['medical-aid', 'Medical aid', 'medical-aid/'],
  ['about-us', 'About us', 'about-us/'],
  ['newsletters', 'Newsletters', 'newsletters/'],
  ['contact', 'Contact', 'contact/'],
];

export const imageSlots = {
  logo_header: { label: 'Header logo', group: 'Brand', def: '/assets/img/logo-full.png', size: 'Transparent PNG, about 1200×320', decorative: true },
  logo_footer: { label: 'Footer logo (white)', group: 'Brand', def: '/assets/img/logo-mark-white.png', size: 'White transparent PNG', decorative: true },
  home_hero: { label: 'Homepage – main photo', group: 'Home', def: '', size: 'Portrait or square, 1200×1300' },
  member_audiologysa: { label: 'Member of – Audiology SA logo', group: 'Home', def: '', size: 'Transparent PNG, square' },
  member_ican: { label: 'Member of – iCAN logo', group: 'Home', def: '', size: 'Transparent PNG, square' },
  services_hero: { label: 'Services – header photo', group: 'Services', def: '', size: 'Landscape, 1600×1000' },
  service_tests: { label: 'Services – hearing tests', group: 'Services', def: '', size: 'Landscape, 1200×800' },
  service_tinnitus: { label: 'Services – tinnitus', group: 'Services', def: '', size: 'Landscape, 1200×800' },
  service_protection: { label: 'Services – ear protection & swim plugs', group: 'Services', def: '', size: 'Landscape, 1200×800' },
  about_hero: { label: 'About us – team photo', group: 'About us', def: '', size: 'Landscape, 1600×1000' },
  about_community: { label: 'About us – serving the community', group: 'About us', def: '', size: 'Landscape, 1200×800' },
  hearingaids_hero: { label: 'Hearing aids – header photo', group: 'Hearing aids', def: '', size: 'Landscape, 1600×1000' },
  hearingaids_styles: { label: 'Hearing aids – styles photo', group: 'Hearing aids', def: '', size: 'Landscape, 1200×800' },
  children_hero: { label: 'Babies & children – header photo', group: 'Babies & children', def: '', size: 'Landscape, 1600×1000' },
  children_newborn: { label: 'Babies & children – newborn screening', group: 'Babies & children', def: '', size: 'Landscape, 1200×800' },
  medicalaid_hero: { label: 'Medical aid – header photo', group: 'Medical aid', def: '', size: 'Landscape, 1600×1000' },
  practice_rietfontein: { label: 'Contact – Rietfontein entrance', group: 'Contact', def: '', size: 'Landscape, 1200×800' },
  practice_lesmarais: { label: 'Contact – Les Marais entrance', group: 'Contact', def: '', size: 'Landscape, 1200×800' },
  share_default: { label: 'Social sharing image (optional – replaces the automatic ones)', group: 'SEO & sharing', def: '', size: 'Exactly 1200×630, JPG', decorative: true },
};

/** Titles stay under 60 characters and descriptions under 155, so Google shows them in full. */
export const seoPages = {
  '': { label: 'Home', og: 'home', title: 'Audiologist in Pretoria | Gehoor in die Moot',
    description: 'HPCSA-registered audiologists in the Moot, Pretoria, since 1999. Hearing tests for all ages, tinnitus care and hearing aids.' },
  'services/': { label: 'Services', og: 'services', title: 'Hearing Tests & Tinnitus Care, Pretoria | Gehoor',
    description: 'Diagnostic hearing tests, tinnitus and hyperacusis care, ear protection, swim plugs and repairs in Pretoria. Take the free hearing check.' },
  'hearing-aids/': { label: 'Hearing aids', og: 'hearing-aids', title: 'Hearing Aids in Pretoria | Gehoor in die Moot',
    description: 'Independent audiologists fitting Rexton, Unitron, Widex and Signia hearing aids, with a trial period and lifelong aftercare.' },
  'babies-and-children/': { label: 'Babies & children', og: 'children', title: 'Newborn & Child Hearing Tests | Gehoor in die Moot',
    description: 'Newborn hearing screening at Life Eugene Marais Hospital and child-friendly hearing tests in Pretoria. Signs to watch for by age.' },
  'medical-aid/': { label: 'Medical aid', og: 'medical-aid', title: 'Medical Aid for Hearing Care | Gehoor in die Moot',
    description: 'How medical aid pays for hearing tests and hearing aids. We submit claims, quotes and motivations for you, free of charge.' },
  'about-us/': { label: 'About us', og: 'about', title: 'About Dr René Hornby & Team | Gehoor in die Moot',
    description: 'Meet the HPCSA-registered audiologists at Gehoor in die Moot, caring for families in the Moot, Pretoria, since 1999.' },
  'newsletters/': { label: 'Newsletters', og: 'newsletters', title: 'Hearing Newsletters & Tips | Gehoor in die Moot',
    description: 'Hearing health tips, new hearing aid technology and practice news from the audiologists at Gehoor in die Moot, Pretoria.' },
  'contact/': { label: 'Contact', og: 'contact', title: 'Contact & Appointments | Gehoor in die Moot',
    description: 'Make an appointment at our Rietfontein or Les Marais practice. Secure parking, wheelchair access. Mon–Fri 08:00–16:30.' },
  'privacy/': { label: 'Privacy policy', og: 'home', title: 'Privacy Policy (POPIA) | Gehoor in die Moot',
    description: 'How Gehoor in die Moot collects, uses and protects your personal information under POPIA, and how cookies are used.' },
  'terms/': { label: 'Terms & conditions', og: 'home', title: 'Terms & Conditions | Gehoor in die Moot',
    description: 'Terms of use for the Gehoor in die Moot website, including medical information, appointments and legal notices.' },
};

export const seedTeam = [
  { id: 'rene-hornby', name: 'Dr René Hornby', role: 'Audiologist & owner', group: 'audiologist',
    quals: 'B.Log IV & M.Communication Path (UP), Rem Dipl (RAU), Doctor of Audiology (A.T. Still University, USA)', hpcsa: '', bio: '', photo: '', order: 1, visible: true },
  { id: 'lauren-tee', name: 'Lauren Tee', role: 'Audiologist', group: 'audiologist', quals: '', hpcsa: '', bio: '', photo: '', order: 2, visible: true },
  { id: 'rozelle-roets', name: 'Rozelle Roets', role: 'Audiologist', group: 'audiologist', quals: '', hpcsa: '', bio: '', photo: '', order: 3, visible: true },
  { id: 'wanda-vd-walt', name: 'Wanda vd Walt', role: 'Secretary', group: 'support', quals: '', hpcsa: '', bio: '', photo: '', order: 4, visible: true },
  { id: 'jenny-de-jager', name: 'Jenny de Jager', role: 'Secretary / Accounts', group: 'support', quals: '', hpcsa: '', bio: '', photo: '', order: 5, visible: true },
];

/** Old WordPress addresses → new pages (keeps Google rankings and old links working). */
export const oldRedirects = {
  'about': 'about-us/', 'about/serving-the-community': 'about-us/#community', 'testimonials': 'about-us/',
  'hearing-problems': 'services/', 'tinnitus-en-hyperacusis': 'services/#tinnitus', 'hyperacusis': 'services/#tinnitus',
  'products': 'hearing-aids/', 'contact-us': 'contact/', 'privacy-policy': 'privacy/', 'terms-and-conditions': 'terms/', 'newsletter': 'newsletters/',
};
