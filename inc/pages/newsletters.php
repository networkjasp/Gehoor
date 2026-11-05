<?php
page_head([
    'path' => 'newsletters/',
    'breadcrumbs' => [['Newsletters', 'newsletters/']],
], 'newsletters');
$list = newsletters();
?>
<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="<?= e(url()) ?>">Home</a> <span aria-hidden="true">›</span> <a href="<?= e(url('newsletters/')) ?>" aria-current="page">Newsletters</a></nav>
    <p class="eyebrow">Nuusbriewe · Newsletters</p>
    <h1>Newsletters</h1>
    <p class="lead">Hearing health tips, new technology and news from the practice.</p>
  </div>
</section>
<section class="section" style="padding-top:24px">
  <div class="wrap">
<?php if (!$list): ?>
    <div class="panel center"><h2>Our first newsletter is on its way</h2><p class="muted">Check back soon.</p></div>
<?php else: ?>
    <div class="news-grid">
<?php foreach ($list as $n): ?>
      <a class="news-card" href="<?= e(url('newsletters/' . $n['slug'])) ?>">
<?php if (!empty($n['cover'])): ?>
        <img class="cover" src="<?= e(url('uploads/newsletters/' . $n['id'] . '/' . $n['cover'])) ?>" alt="" loading="lazy">
<?php else: ?>
        <div class="cover img-ph" style="border-radius:0;aspect-ratio:210/297"><img src="<?= e(url('assets/img/logo-mark.png')) ?>" alt=""></div>
<?php endif; ?>
        <div class="body">
          <time datetime="<?= e($n['date']) ?>"><?= e(format_date($n['date'])) ?></time>
          <h2 style="font-size:1.1rem;margin:0"><?= e($n['title']) ?></h2>
<?php if (!empty($n['summary'])): ?>          <p class="muted small" style="margin:0"><?= e($n['summary']) ?></p><?php endif; ?>
        </div>
      </a>
<?php endforeach; ?>
    </div>
<?php endif; ?>
  </div>
</section>
<?php cta_band(); page_footer();
