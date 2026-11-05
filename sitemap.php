<?php
declare(strict_types=1);
require __DIR__ . '/inc/bootstrap.php';
header('Content-Type: application/xml; charset=utf-8');
$prio = ['' => '1.0', 'services/' => '0.9', 'hearing-aids/' => '0.9', 'babies-and-children/' => '0.9', 'contact/' => '0.9',
         'medical-aid/' => '0.8', 'about-us/' => '0.8', 'newsletters/' => '0.6', 'privacy/' => '0.2', 'terms/' => '0.2'];
$lastmod = date('Y-m-d', max(array_map('filemtime', glob(__DIR__ . '/inc/pages/*.php'))));
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach (array_keys(seo_pages()) as $p) {
    echo '  <url><loc>' . e(abs_url($p)) . '</loc><lastmod>' . $lastmod . '</lastmod><priority>' . ($prio[$p] ?? '0.5') . '</priority></url>' . "\n";
}
foreach (newsletters() as $n) {
    echo '  <url><loc>' . e(abs_url('newsletters/' . $n['slug'])) . '</loc><lastmod>' . e($n['date']) . '</lastmod><priority>0.5</priority></url>' . "\n";
}
echo '</urlset>' . "\n";
