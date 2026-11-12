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

const CI = '/assets/img/ci/';

/**
 * Every photo and logo on the site. `def` is the built-in CI image (from the approved mock-up);
 * an upload in Portal › Images replaces it. `focus` keeps the important part of a photo in view.
 */
export const imageSlots = {
  logo_header: { label: 'Header logo', group: 'Brand', def: CI + 'logo-header.png', size: 'Transparent PNG, about 840×240', decorative: true },
  logo_footer: { label: 'Footer logo (white)', group: 'Brand', def: CI + 'logo-mark-white.png', size: 'White transparent PNG', decorative: true },
  home_hero: { label: 'Homepage – slideshow photo 1', group: 'Home', def: CI + 'hero-hearing-exam.webp', alt: 'A patient receiving a hearing examination at Gehoor in die Moot', focus: '10% 50%', size: 'Landscape, 1050×700 or larger' },
  home_hero_2: { label: 'Homepage – slideshow photo 2', group: 'Home', def: CI + 'hero-jacarandas.webp', alt: 'A street lined with blooming jacarandas, from the practice archive', focus: '50% 50%', size: 'Landscape, 1050×700 or larger' },
  home_hero_3: { label: 'Homepage – slideshow photo 3', group: 'Home', def: CI + 'hero-ear-exam.webp', alt: 'Close-up of an audiologist examining a patient’s ear', focus: '40% 50%', size: 'Landscape, 1050×700 or larger' },
  home_hero_4: { label: 'Homepage – slideshow photo 4', group: 'Home', def: CI + 'hero-rietfontein-garden.webp', alt: 'Garden and entrance at the Rietfontein practice', focus: '58% 50%', size: 'Landscape, 1050×700 or larger' },
  member_audiologysa: { label: 'Member of – SAAA logo', group: 'Home', def: CI + 'member-saaa.png', size: 'Logo, transparent PNG', decorative: true },
  member_ican: { label: 'Member of – iCAN logo', group: 'Home', def: CI + 'member-ican.png', size: 'Logo, transparent PNG', decorative: true },
  services_hero: { label: 'Services – header photo', group: 'Services', def: CI + 'services-equipment.webp', alt: 'Audiologist operating the hearing test equipment', focus: '43% 49%', size: 'Landscape, 1600×1000' },
  service_tests: { label: 'Services – hearing tests', group: 'Services', def: CI + 'services-booth.webp', alt: 'Audiologist and patient in the practice hearing test booth', focus: '57% 51%', size: 'Landscape, 1200×800' },
  service_tinnitus: { label: 'Services – tinnitus', group: 'Services', def: CI + 'services-ear-exam.webp', alt: 'Close-up of an ear examination at the practice', focus: '50% 47%', size: 'Landscape, 1200×800' },
  service_protection: { label: 'Services – ear protection & swim plugs', group: 'Services', def: CI + 'protec-ear-logo.png', alt: 'Protec-Ear protective ear wear', variant: 'brand', size: 'Landscape, 1200×800' },
  about_hero: { label: 'About us – team photo (shown once uploaded)', group: 'About us', def: '', size: 'Landscape, 1600×1000' },
  about_community: { label: 'About us – serving the community', group: 'About us', def: CI + 'community-archive.webp', alt: 'Archive photograph of a child receiving hearing care', focus: '50% 44%', size: 'Landscape, 1200×800' },
  hearingaids_hero: { label: 'Hearing aids – header photo', group: 'Hearing aids', def: CI + 'hearing-aids-fitting.webp', alt: 'Audiologist adjusting a hearing device during a fitting', focus: '42% 48%', size: 'Landscape, 1600×1000' },
  hearingaids_styles: { label: 'Hearing aids – styles photo', group: 'Hearing aids', def: CI + 'signia-charger.webp', alt: 'Signia rechargeable hearing aid and charging case', focus: '50% 51%', size: 'Landscape, 1200×800' },
  children_hero: { label: 'Babies & children – header photo', group: 'Babies & children', def: CI + 'child-hearing-test.webp', alt: 'Child wearing headphones and holding the hearing test response button', focus: '49% 49%', size: 'Landscape, 1600×1000' },
  children_newborn: { label: 'Babies & children – newborn screening', group: 'Babies & children', def: CI + 'newborn-screening.webp', alt: 'Archive image illustrating a newborn hearing screen', variant: 'newborn', size: 'Landscape, 1200×800' },
  medicalaid_hero: { label: 'Medical aid – header photo', group: 'Medical aid', def: CI + 'reception.webp', alt: 'Practice reception team assisting a visitor', focus: '47% 35%', size: 'Landscape, 1600×1000' },
  practice_rietfontein: { label: 'Practice photo – Rietfontein', group: 'Contact', def: CI + 'practice-rietfontein.webp', alt: 'Rietfontein practice entrance with the street number 536 above the gate', focus: '50% 48%', size: 'Landscape, 1200×600' },
  practice_lesmarais: { label: 'Practice photo – Les Marais', group: 'Contact', def: CI + 'practice-lesmarais.webp', alt: 'Les Marais practice from the street, with its sign beside the entrance', focus: '50% 58%', size: 'Landscape, 1200×600' },
  share_default: { label: 'Social sharing image (optional – replaces the automatic ones)', group: 'SEO & sharing', def: '', size: 'Exactly 1200×630, JPG', decorative: true },
};

/** Built-in portraits for the starting team (replaced when a photo is uploaded in Portal › Team). */
export const defaultPortraits = {
  'rene-hornby': CI + 'team-rene-hornby.webp',
  'lauren-tee': CI + 'team-lauren-tee.webp',
  'rozelle-roets': CI + 'team-rozelle-roets.webp',
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
