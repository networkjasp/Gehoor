<?php
declare(strict_types=1);
require __DIR__ . '/inc/bootstrap.php';
require __DIR__ . '/inc/layout.php';

$path = (string)parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
if (BASE !== '' && str_starts_with($path, BASE)) {
    $path = substr($path, strlen(BASE));
}
$path = trim(rawurldecode($path), '/');
if ($path === 'index.php') {
    $path = '';
}

// Old WordPress addresses → new pages (keeps Google rankings and old links working).
$redirects = [
    'about' => 'about-us/',
    'about/serving-the-community' => 'about-us/#community',
    'testimonials' => 'about-us/',
    'hearing-problems' => 'services/',
    'tinnitus-en-hyperacusis' => 'services/#tinnitus',
    'hyperacusis' => 'services/#tinnitus',
    'products' => 'hearing-aids/',
    'contact-us' => 'contact/',
    'privacy-policy' => 'privacy/',
    'terms-and-conditions' => 'terms/',
    'newsletter' => 'newsletters/',
];
if (isset($redirects[$path])) {
    header('Location: ' . url($redirects[$path]), true, 301);
    exit;
}

$routes = [
    ''                    => 'home',
    'services'            => 'services',
    'about-us'            => 'about',
    'contact'             => 'contact',
    'hearing-aids'        => 'hearing-aids',
    'babies-and-children' => 'children',
    'medical-aid'         => 'medical-aid',
    'newsletters'         => 'newsletters',
    'privacy'             => 'privacy',
    'terms'               => 'terms',
];

if (isset($routes[$path])) {
    // Enforce trailing slash for consistent canonical URLs.
    $req = (string)parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
    if ($path !== '' && !str_ends_with($req, '/')) {
        header('Location: ' . url($path . '/'), true, 301);
        exit;
    }
    require __DIR__ . '/inc/pages/' . $routes[$path] . '.php';
    exit;
}

if (preg_match('#^newsletters/([a-z0-9-]+)$#', $path, $m)) {
    $slug = $m[1];
    require __DIR__ . '/inc/pages/newsletter.php';
    exit;
}

http_response_code(404);
require __DIR__ . '/inc/pages/404.php';
