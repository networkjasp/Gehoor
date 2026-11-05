<?php
/** Shared layout: <head>, header, footer, icons and structured data. */

function icon(string $name, int $size = 24): string
{
    $paths = [
        'check'    => '<path d="M20 6 9 17l-5-5"/>',
        'phone'    => '<path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
        'whatsapp' => '<path d="M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.4A8.4 8.4 0 1 1 21 11.5z"/>',
        'mail'     => '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
        'pin'      => '<path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/>',
        'clock'    => '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
        'arrow'    => '<path d="M5 12h14M13 6l6 6-6 6"/>',
        'menu'     => '<path d="M4 7h16M4 12h16M4 17h16"/>',
        'close'    => '<path d="M6 6l12 12M18 6 6 18"/>',
        'test'     => '<path d="M3 12h2l2-6 3 12 3-9 2 3h6"/>',
        'child'    => '<circle cx="12" cy="7" r="4"/><path d="M5 21c0-4 3-7 7-7s7 3 7 7"/>',
        'heart'    => '<path d="M12 21s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 11c0 5.5-7 10-7 10z"/>',
        'wave'     => '<path d="M2 12c2-4 4-4 6 0s4 4 6 0 4-4 6 0M2 17c2-2 4-2 6 0"/>',
        'ear'      => '<path d="M7 18a5 5 0 0 1-1-9.9A6 6 0 0 1 18 9c0 3-2 4-3 5s-1 4-4 4"/><path d="M10 10a2 2 0 1 1 4 0"/>',
        'shield'   => '<path d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/>',
        'battery'  => '<rect x="3" y="7" width="16" height="10" rx="2"/><path d="M21 11v2M7 10v4M11 10v4"/>',
        'wrench'   => '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
        'doc'      => '<path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6M8 13h8M8 17h6"/>',
        'download' => '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
        'medical'  => '<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 6V4h6v2M12 10v6M9 13h6"/>',
    ];
    $p = $paths[$name] ?? '';
    return '<svg class="ic" aria-hidden="true" width="' . $size . '" height="' . $size . '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' . $p . '</svg>';
}

function nav_items(): array
{
    return [
        'services'           => ['Services', 'services/'],
        'hearing-aids'       => ['Hearing aids', 'hearing-aids/'],
        'babies-and-children'=> ['Babies & children', 'babies-and-children/'],
        'medical-aid'        => ['Medical aid', 'medical-aid/'],
        'about-us'           => ['About us', 'about-us/'],
        'newsletters'        => ['Newsletters', 'newsletters/'],
        'contact'            => ['Contact', 'contact/'],
    ];
}

function whatsapp_link(string $text = 'Hi, I would like to make an appointment'): string
{
    $n = preg_replace('/\D/', '', setting('whatsapp'));
    return $n ? 'https://wa.me/' . $n . '?text=' . rawurlencode($text) : '';
}

function schema_org(): array
{
    $team = array_values(array_filter(team(), fn($m) => ($m['group'] ?? '') === 'audiologist'));
    $locations = [];
    foreach (practices() as $p) {
        $locations[] = [
            '@type' => 'MedicalClinic',
            'name' => setting('practice_name') . ' – ' . $p['name'],
            'telephone' => setting('phone_intl'),
            'address' => [
                '@type' => 'PostalAddress',
                'streetAddress' => $p['street'],
                'addressLocality' => $p['area'] . ', ' . $p['city'],
                'postalCode' => $p['code'],
                'addressRegion' => 'Gauteng',
                'addressCountry' => 'ZA',
            ],
            'openingHoursSpecification' => [[
                '@type' => 'OpeningHoursSpecification',
                'dayOfWeek' => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                'opens' => '08:00', 'closes' => '16:30',
            ]],
        ];
    }
    $sameAs = array_values(array_filter([setting('google_reviews_url'), setting('facebook_url')]));
    $org = [
        '@context' => 'https://schema.org',
        '@type' => 'MedicalClinic',
        '@id' => abs_url('#practice'),
        'name' => setting('practice_name') . ' – Dr René Hornby Audiologists',
        'alternateName' => 'Dr René Hornby Oudioloë',
        'url' => abs_url(),
        'logo' => abs_url('assets/img/logo-full.png'),
        'image' => abs_url('assets/img/og-image.jpg'),
        'telephone' => setting('phone_intl'),
        'email' => setting('email'),
        'foundingDate' => '1999',
        'medicalSpecialty' => 'Audiology',
        'availableLanguage' => ['af', 'en'],
        'areaServed' => ['Pretoria', 'Moot', 'Rietfontein', 'Les Marais', 'Villieria', 'Queenswood', 'Wonderboom South'],
        'address' => $locations[0]['address'],
        'openingHours' => 'Mo-Fr 08:00-16:30',
        'department' => $locations,
        'employee' => array_map(fn($m) => array_filter([
            '@type' => 'Person', 'name' => $m['name'], 'jobTitle' => $m['role'],
            'hasCredential' => $m['hpcsa'] ? 'HPCSA ' . $m['hpcsa'] : null,
        ]), $team),
        'memberOf' => [
            ['@type' => 'Organization', 'name' => 'South African Association of Audiologists'],
            ['@type' => 'Organization', 'name' => 'iCAN – Independent Community of Audiologists'],
        ],
    ];
    if ($sameAs) {
        $org['sameAs'] = $sameAs;
    }
    return $org;
}

/**

/**
 * $meta: path (required), title/description (fallbacks when the path has no SEO entry), schema, image, noindex, breadcrumbs
 */
function page_head(array $meta, string $active = ''): void
{
    security_headers();
    $path = (string)($meta['path'] ?? '');
    $seo = empty($meta['use_meta']) ? seo_for($path) : [];
    $title = $seo['title'] ?? $meta['title'];
    $desc = trim((string)($seo['description'] ?? ($meta['description'] ?? '')));
    if (mb_strlen($desc) > 158) {
        $desc = rtrim(mb_substr($desc, 0, mb_strrpos(mb_substr($desc, 0, 155), ' ') ?: 155), ' ,.;:–-') . '…';
    }
    $canonical = abs_url($path);
    $image = $meta['image'] ?? ($seo['image'] ?? og_image_url('home'));
    $schemas = [schema_org()];
    if (!empty($meta['breadcrumbs'])) {
        $items = [];
        $i = 1;
        foreach (array_merge([['Home', '']], $meta['breadcrumbs']) as $b) {
            $items[] = ['@type' => 'ListItem', 'position' => $i++, 'name' => $b[0], 'item' => abs_url($b[1])];
        }
        $schemas[] = ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => $items];
    }
    foreach ($meta['schema'] ?? [] as $s) {
        $schemas[] = $s;
    }
    $ga = preg_match('/^G-[A-Z0-9]{4,15}$/', setting('ga4_id')) ? setting('ga4_id') : '';
    ?>
<!doctype html>
<html lang="en-ZA"<?= $ga ? ' data-ga="' . e($ga) . '"' : '' ?>>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title><?= e($title) ?></title>
<meta name="description" content="<?= e($desc) ?>">
<link rel="canonical" href="<?= e($canonical) ?>">
<?php if (!empty($meta['noindex'])): ?><meta name="robots" content="noindex"><?php endif; ?>
<?php if (setting('gsc_verification') !== ''): ?><meta name="google-site-verification" content="<?= e(setting('gsc_verification')) ?>"><?php endif; ?>
<meta property="og:type" content="<?= e($meta['og_type'] ?? 'website') ?>">
<meta property="og:site_name" content="Gehoor in die Moot">
<meta property="og:locale" content="en_ZA">
<meta property="og:title" content="<?= e($title) ?>">
<meta property="og:description" content="<?= e($desc) ?>">
<meta property="og:url" content="<?= e($canonical) ?>">
<meta property="og:image" content="<?= e($image) ?>">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="<?= e($title) ?>">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="<?= e($title) ?>">
<meta name="twitter:description" content="<?= e($desc) ?>">
<meta name="twitter:image" content="<?= e($image) ?>">
<meta name="theme-color" content="#1A4CA1">
<link rel="icon" href="<?= e(url('favicon.ico')) ?>" sizes="32x32">
<link rel="icon" type="image/png" sizes="32x32" href="<?= e(url('assets/img/favicon-32.png')) ?>">
<link rel="apple-touch-icon" href="<?= e(url('assets/img/apple-touch-icon.png')) ?>">
<link rel="manifest" href="<?= e(url('site.webmanifest')) ?>">
<link rel="preload" href="<?= e(url('assets/fonts/montserrat-latin-800-normal.woff2')) ?>" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="<?= e(url('assets/fonts/nunito-sans-latin-400-normal.woff2')) ?>" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="<?= e(url('assets/css/site.css')) ?>?v=3">
<script>try{var p=JSON.parse(localStorage.getItem('gidm-a11y')||'{}');if(p.size)document.documentElement.dataset.size=p.size;if(p.contrast)document.documentElement.dataset.contrast='1';}catch(e){}</script>
<?php foreach ($schemas as $s): ?>
<script type="application/ld+json"><?= json_encode($s, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE | JSON_HEX_TAG) ?></script>
<?php endforeach; ?>
<?php foreach ($meta['head_extra'] ?? [] as $x) echo $x, "\n"; ?>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<?php page_header($active);
}

function page_header(string $active): void
{
    ?>
<aside class="utility" aria-label="Opening hours, contact details and reading options">
  <div class="wrap utility-in">
    <div class="utility-info">
      <span><?= icon('clock', 16) ?> <?= e(setting('hours')) ?></span>
      <a href="tel:<?= e(setting('phone_intl')) ?>" data-track="phone_click"><?= icon('phone', 16) ?> <?= e(setting('phone')) ?></a>
      <a class="hide-sm" href="mailto:<?= e(setting('email')) ?>" data-track="email_click"><?= icon('mail', 16) ?> <?= e(setting('email')) ?></a>
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
    <a class="brand" href="<?= e(url()) ?>" aria-label="Gehoor in die Moot – home">
      <img src="<?= e(image_url('logo_header')) ?>" alt="Gehoor in die Moot – Dr René Hornby audiologists / oudioloë" width="240" height="63" fetchpriority="high">
    </a>
    <button class="menu-btn" type="button" aria-expanded="false" aria-controls="site-nav" aria-label="Menu"><?= icon('menu', 26) ?></button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>
        <li class="only-menu"><a href="<?= e(url()) ?>"<?= $active === 'home' ? ' aria-current="page"' : '' ?>>Home</a></li>
<?php foreach (nav_items() as $key => [$label, $path]): ?>
        <li><a href="<?= e(url($path)) ?>"<?= $key === $active ? ' aria-current="page"' : '' ?>><?= e($label) ?></a></li>
<?php endforeach; ?>
      </ul>
      <a class="btn btn-primary nav-cta" href="<?= e(url('contact/#form')) ?>" data-track="cta_click">Make an appointment</a>
    </nav>
  </div>
</header>
<main id="main">
<?php
}

function page_footer(): void
{
    $wa = whatsapp_link();
    $p = practices();
    ?>
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <img src="<?= e(image_url('logo_footer')) ?>" alt="" width="64" height="81" loading="lazy">
      <p>Dr René Hornby Audiologists · Oudioloë. Caring for Pretoria's hearing since 1999.</p>
    </div>
    <div>
      <h2>Contact</h2>
      <ul>
        <li><a href="tel:<?= e(setting('phone_intl')) ?>" data-track="phone_click"><?= e(setting('phone')) ?></a></li>
        <li><a href="mailto:<?= e(setting('email')) ?>" data-track="email_click"><?= e(setting('email')) ?></a></li>
<?php if ($wa): ?>        <li><a href="<?= e($wa) ?>" data-track="whatsapp_click">WhatsApp us</a></li><?php endif; ?>
        <li><?= e(setting('hours')) ?></li>
      </ul>
    </div>
    <div>
      <h2>Practices</h2>
      <ul>
<?php foreach ($p as $pr): ?>
        <li><?= e($pr['street']) ?>, <?= e($pr['area']) ?>, <?= e($pr['city']) ?>, <?= e($pr['code']) ?></li>
<?php endforeach; ?>
      </ul>
    </div>
    <div>
      <h2>Explore</h2>
      <ul>
<?php foreach (nav_items() as $key => [$label, $path]): ?>
        <li><a href="<?= e(url($path)) ?>"><?= e($label) ?></a></li>
<?php endforeach; ?>
      </ul>
    </div>
  </div>
  <div class="wrap footer-bottom">
    <span><a class="copy-link" href="<?= e(url('admin/')) ?>" aria-label="Site management" rel="nofollow">©</a> <?= date('Y') ?> <?= e(setting('legal_name')) ?> · Reg. <?= e(setting('company_reg')) ?> · <?= e(setting('practice_no')) ?></span>
    <span class="legal-links"><a href="<?= e(url('privacy/')) ?>">Privacy policy</a> <a href="<?= e(url('terms/')) ?>">Terms &amp; conditions</a> <button type="button" class="linklike" data-consent-open>Cookie settings</button></span>
  </div>
</footer>
<nav class="action-bar" aria-label="Quick contact">
  <a href="tel:<?= e(setting('phone_intl')) ?>" data-track="phone_click"><?= icon('phone', 22) ?><span>Call</span></a>
<?php if ($wa): ?>  <a href="<?= e($wa) ?>" data-track="whatsapp_click"><?= icon('whatsapp', 22) ?><span>WhatsApp</span></a><?php endif; ?>
  <a class="primary" href="<?= e(url('contact/#form')) ?>" data-track="cta_click"><?= icon('mail', 22) ?><span>Make an appointment</span></a>
</nav>
<div class="cookie-banner" id="consent" role="dialog" aria-modal="false" aria-labelledby="consent-h" hidden>
  <div class="consent-in">
    <div>
      <h2 id="consent-h">Cookies on this website</h2>
      <p>We use essential storage to remember your text-size and cookie choices. With your permission we also use Google Analytics to see which pages help people, and show Google Maps. <a href="<?= e(url('privacy/#cookies')) ?>">Read our cookie policy</a></p>
    </div>
    <div class="consent-btns">
      <button type="button" class="btn btn-outline" data-consent="essential">Essential only</button>
      <button type="button" class="btn btn-primary" data-consent="all">Accept all</button>
    </div>
  </div>
</div>
<script src="<?= e(url('assets/js/site.js')) ?>?v=3" defer></script>
</body>
</html>
<?php
}

function members_of(): void
{
    $members = [
        ['member_audiologysa', 'South African Association of Audiologists', 'Audiology SA', 'https://www.audiologysa.co.za'],
        ['member_ican', 'iCAN – Independent Community of Audiologists', 'iCAN', 'https://ican.org.za'],
    ];
    ?>
<section class="section members" aria-labelledby="members-h">
  <div class="wrap">
    <p class="eyebrow">Lid van · Member of</p>
    <h2 id="members-h">Proud members of South Africa's audiology bodies</h2>
    <div class="members-grid">
<?php foreach ($members as [$slot, $name, $short, $href]): $src = image_url($slot); ?>
      <a class="member" href="<?= e($href) ?>" rel="noopener" target="_blank">
<?php if ($src): ?>
        <img src="<?= e($src) ?>" alt="<?= e(image_alt($slot, $name . ' logo')) ?>" loading="lazy">
<?php else: ?>
        <span class="member-badge" aria-hidden="true"><?= e($short) ?></span>
<?php endif; ?>
        <span class="member-name"><?= e($name) ?></span>
      </a>
<?php endforeach; ?>
    </div>
  </div>
</section>
<?php
}

function cta_band(string $title = 'Ready to hear better?', string $text = 'Send us a message and our friendly reception team will find a time that suits you.'): void
{
    ?>
<section class="cta-band">
  <div class="wrap cta-in">
    <div>
      <h2><?= e($title) ?></h2>
      <p><?= e($text) ?></p>
    </div>
    <div class="cta-actions">
      <a class="btn btn-green btn-lg" href="<?= e(url('contact/#form')) ?>" data-track="cta_click">Make an appointment</a>
      <span class="cta-alt">or call <a href="tel:<?= e(setting('phone_intl')) ?>" data-track="phone_click"><?= e(setting('phone')) ?></a></span>
    </div>
  </div>
</section>
<?php
}

function page_hero(string $eyebrow, string $title, string $intro, string $slot, array $crumbs): void
{
    ?>
<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="<?= e(url()) ?>">Home</a><?php foreach ($crumbs as [$n, $p]): ?> <span aria-hidden="true">›</span> <a href="<?= e(url($p)) ?>" aria-current="page"><?= e($n) ?></a><?php endforeach; ?></nav>
    <div class="split">
      <div class="split-text">
        <p class="eyebrow"><?= e($eyebrow) ?></p>
        <h1><?= e($title) ?></h1>
        <p class="lead"><?= e($intro) ?></p>
        <div class="cta-actions">
          <a class="btn btn-primary btn-lg" href="<?= e(url('contact/#form')) ?>" data-track="cta_click">Make an appointment</a>
          <span class="cta-alt">or call <a href="tel:<?= e(setting('phone_intl')) ?>" data-track="phone_click"><?= e(setting('phone')) ?></a></span>
        </div>
      </div>
      <div class="split-media"><?= slot_img($slot, 'rounded', $title, false, '4 / 3') ?></div>
    </div>
  </div>
</section>
<?php
}
