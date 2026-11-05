<?php
/** Single newsletter, rendered into the branded template. $slug is set by the router. */
$all = newsletters();
$idx = null;
foreach ($all as $i => $n) {
    if ($n['slug'] === $slug) { $idx = $i; break; }
}
if ($idx === null) {
    http_response_code(404);
    require __DIR__ . '/404.php';
    return;
}
$n = $all[$idx];
$dir = 'uploads/newsletters/' . $n['id'] . '/';
$newer = $all[$idx - 1] ?? null;
$older = $all[$idx + 1] ?? null;
$desc = $n['summary'] ?: mb_substr(preg_replace('/\s+/', ' ', (string)($n['text'] ?? '')), 0, 150);
page_head([
    'use_meta' => true,
    'og_type' => 'article',
    'title' => $n['title'] . ' – Newsletter | Gehoor in die Moot',
    'description' => $desc ?: 'Newsletter from Gehoor in die Moot audiologists, Pretoria.',
    'path' => 'newsletters/' . $n['slug'],
    'image' => !empty($n['cover']) ? abs_url($dir . $n['cover']) : null,
    'breadcrumbs' => [['Newsletters', 'newsletters/'], [$n['title'], 'newsletters/' . $n['slug']]],
    'schema' => [[
        '@context' => 'https://schema.org', '@type' => 'Article',
        'headline' => $n['title'], 'datePublished' => $n['date'],
        'author' => ['@type' => 'Organization', 'name' => 'Gehoor in die Moot'],
        'publisher' => ['@type' => 'Organization', 'name' => 'Gehoor in die Moot', 'logo' => ['@type' => 'ImageObject', 'url' => abs_url('assets/img/logo-full.png')]],
        'image' => !empty($n['cover']) ? abs_url($dir . $n['cover']) : abs_url('assets/img/og-image.jpg'),
    ]],
], 'newsletters');
?>
<section class="nl-head">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="<?= e(url()) ?>">Home</a> › <a href="<?= e(url('newsletters/')) ?>">Newsletters</a> › <span aria-current="page"><?= e($n['title']) ?></span></nav>
    <div class="nl-head-in">
      <div class="nl-brand">
        <img src="<?= e(url('assets/img/logo-mark-white.png')) ?>" alt="" width="64" height="81">
        <div>
          <p class="eyebrow" style="color:#B9E38F;margin:0">Nuusbrief · Newsletter · <time datetime="<?= e($n['date']) ?>"><?= e(format_date($n['date'])) ?></time></p>
          <h1 style="margin:4px 0 0"><?= e($n['title']) ?></h1>
        </div>
      </div>
      <a class="btn btn-green" href="<?= e(url($dir . $n['pdf'])) ?>" download><?= icon('download', 18) ?> Download PDF</a>
    </div>
<?php if (!empty($n['summary'])): ?>    <p style="margin:18px 0 0;max-width:46em;opacity:.92"><?= e($n['summary']) ?></p><?php endif; ?>
  </div>
</section>

<section class="section tint" style="padding-top:40px">
  <div class="wrap">
    <div class="nl-pages">
<?php if (!empty($n['pages'])): foreach ($n['pages'] as $i => $p): ?>
      <figure class="nl-page" style="margin:0">
        <img src="<?= e(url($dir . $p)) ?>" alt="<?= e($n['title']) ?>, page <?= $i + 1 ?> of <?= count($n['pages']) ?>"<?= $i ? ' loading="lazy"' : '' ?> width="1200" height="1697">
      </figure>
<?php endforeach; else: ?>
      <object class="nl-embed" data="<?= e(url($dir . $n['pdf'])) ?>" type="application/pdf" aria-label="<?= e($n['title']) ?>">
        <p>Your browser can't show the newsletter here. <a href="<?= e(url($dir . $n['pdf'])) ?>">Open the PDF</a>.</p>
      </object>
<?php endif; ?>
<?php if (!empty($n['text'])): ?>
      <details>
        <summary>Read this newsletter as text (easier with a screen reader or larger text)</summary>
        <div class="nl-text"><?= e($n['text']) ?></div>
      </details>
<?php endif; ?>
      <nav class="pager" aria-label="More newsletters">
        <?= $older ? '<a class="btn btn-outline" href="' . e(url('newsletters/' . $older['slug'])) . '">← ' . e($older['title']) . '</a>' : '<span></span>' ?>
        <?= $newer ? '<a class="btn btn-outline" href="' . e(url('newsletters/' . $newer['slug'])) . '">' . e($newer['title']) . ' →</a>' : '' ?>
      </nav>
    </div>
  </div>
</section>
<?php cta_band(); page_footer();
