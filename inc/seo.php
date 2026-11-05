<?php
/**
 * Meta titles, descriptions and social share images for every page.
 * Defaults live here; the practice can override any of them in Portal › SEO & sharing.
 * Titles stay under 60 characters and descriptions under 155, so Google shows them in full.
 */
function seo_pages(): array
{
    return [
        '' => ['label' => 'Home', 'og' => 'home',
            'title' => 'Audiologist in Pretoria | Gehoor in die Moot',
            'description' => 'HPCSA-registered audiologists in the Moot, Pretoria, since 1999. Hearing tests for all ages, tinnitus care and hearing aids.'],
        'services/' => ['label' => 'Services', 'og' => 'services',
            'title' => 'Hearing Tests & Tinnitus Care, Pretoria | Gehoor',
            'description' => 'Diagnostic hearing tests, tinnitus and hyperacusis care, ear protection, swim plugs and repairs in Pretoria. Take the free hearing check.'],
        'hearing-aids/' => ['label' => 'Hearing aids', 'og' => 'hearing-aids',
            'title' => 'Hearing Aids in Pretoria | Gehoor in die Moot',
            'description' => 'Independent audiologists fitting Rexton, Unitron, Widex and Signia hearing aids, with a trial period and lifelong aftercare.'],
        'babies-and-children/' => ['label' => 'Babies & children', 'og' => 'children',
            'title' => 'Newborn & Child Hearing Tests | Gehoor in die Moot',
            'description' => 'Newborn hearing screening at Life Eugene Marais Hospital and child-friendly hearing tests in Pretoria. Signs to watch for by age.'],
        'medical-aid/' => ['label' => 'Medical aid', 'og' => 'medical-aid',
            'title' => 'Medical Aid for Hearing Care | Gehoor in die Moot',
            'description' => 'How medical aid pays for hearing tests and hearing aids. We submit claims, quotes and motivations for you, free of charge.'],
        'about-us/' => ['label' => 'About us', 'og' => 'about',
            'title' => 'About Dr René Hornby & Team | Gehoor in die Moot',
            'description' => 'Meet the HPCSA-registered audiologists at Gehoor in die Moot, caring for families in the Moot, Pretoria, since 1999.'],
        'newsletters/' => ['label' => 'Newsletters', 'og' => 'newsletters',
            'title' => 'Hearing Newsletters & Tips | Gehoor in die Moot',
            'description' => 'Hearing health tips, new hearing aid technology and practice news from the audiologists at Gehoor in die Moot, Pretoria.'],
        'contact/' => ['label' => 'Contact', 'og' => 'contact',
            'title' => 'Contact & Appointments | Gehoor in die Moot',
            'description' => 'Make an appointment at our Rietfontein or Les Marais practice. Secure parking, wheelchair access. Mon–Fri 08:00–16:30.'],
        'privacy/' => ['label' => 'Privacy policy', 'og' => 'home',
            'title' => 'Privacy Policy (POPIA) | Gehoor in die Moot',
            'description' => 'How Gehoor in die Moot collects, uses and protects your personal information under POPIA, and how cookies are used.'],
        'terms/' => ['label' => 'Terms & conditions', 'og' => 'home',
            'title' => 'Terms & Conditions | Gehoor in die Moot',
            'description' => 'Terms of use for the Gehoor in die Moot website, including medical information, appointments and legal notices.'],
    ];
}

/** Final title/description/image for a path, applying portal overrides. */
function seo_for(string $path): array
{
    $pages = seo_pages();
    if (!isset($pages[$path])) {
        return [];
    }
    $o = load_data('seo', [])[$path] ?? [];
    $d = $pages[$path];
    return [
        'title' => ($o['title'] ?? '') !== '' ? $o['title'] : $d['title'],
        'description' => ($o['description'] ?? '') !== '' ? $o['description'] : $d['description'],
        'image' => og_image_url($d['og']),
    ];
}

function og_image_url(string $key): string
{
    $own = (string)(image_data()['share_default']['file'] ?? '');
    if ($own !== '' && is_file(UPLOAD_DIR . '/images/' . $own)) {
        return abs_url('uploads/images/' . rawurlencode($own));
    }
    $file = 'assets/img/og/' . $key . '.jpg';
    return abs_url(is_file(ROOT . '/' . $file) ? $file : 'assets/img/og-image.jpg');
}
