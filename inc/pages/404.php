<?php
page_head([
    'title' => 'Page not found | Gehoor in die Moot',
    'description' => 'This page could not be found.',
    'path' => '',
    'use_meta' => true,
    'noindex' => true,
], '');
$links = [
    ['services/', 'Services', 'Hearing tests, tinnitus care, ear protection and repairs'],
    ['hearing-aids/', 'Hearing aids', 'Brands, styles and how we choose with you'],
    ['babies-and-children/', 'Babies & children', 'Newborn screening and children\'s hearing tests'],
    ['medical-aid/', 'Medical aid', 'How claims for hearing care work'],
    ['about-us/', 'About us', 'Meet our audiologists'],
    ['newsletters/', 'Newsletters', 'Hearing tips and practice news'],
];
?>
<section class="section page-hero">
  <div class="wrap narrow center">
    <p class="eyebrow">Error 404</p>
    <h1>Sorry, we couldn't find that page</h1>
    <p class="lead" style="margin:0 auto 24px">It may have moved when we updated our website. One of these pages should help.</p>
    <div class="cta-actions" style="justify-content:center">
      <a class="btn btn-primary btn-lg" href="<?= e(url('contact/#form')) ?>">Make an appointment</a>
      <span class="cta-alt">or go to the <a href="<?= e(url()) ?>">homepage</a></span>
    </div>
  </div>
</section>
<section class="section" style="padding-top:0" aria-labelledby="popular-h">
  <div class="wrap">
    <h2 id="popular-h" class="center">Popular pages</h2>
    <div class="grid">
<?php foreach ($links as [$href, $t, $d]): ?>
      <a class="card" href="<?= e(url($href)) ?>"><h3><?= e($t) ?></h3><p><?= e($d) ?></p><span class="more">Go to page <?= icon('arrow', 18) ?></span></a>
<?php endforeach; ?>
    </div>
  </div>
</section>
<?php page_footer();
