<?php
declare(strict_types=1);
require __DIR__ . '/inc/bootstrap.php';
header('Content-Type: text/plain; charset=utf-8');
echo "User-agent: *\n";
echo "Disallow: " . url('admin/') . "\n";
echo "Disallow: " . url('data/') . "\n";
echo "Disallow: " . url('inc/') . "\n";
echo "Disallow: " . url('contact/?sent') . "\n\n";
echo "Sitemap: " . abs_url('sitemap.xml') . "\n";
