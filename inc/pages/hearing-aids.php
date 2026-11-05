<?php
$myths = [
    ['Smaller always costs more', 'Price depends mostly on the technology inside, not on size. A small aid can be basic, and a larger one can be top of the range.'],
    ['Hearing aids restore normal hearing', 'They make sounds and speech much clearer, but they don\'t make hearing perfect. Realistic expectations make for happier wearers.'],
    ['Batteries are a constant hassle', 'Most new hearing aids are rechargeable with a lithium-ion battery. Pop them in the charger at night, the same as your phone.'],
    ['Once fitted, they look after themselves', 'Hearing aids should be serviced at least once a year to keep them working at their best.'],
    ['I\'ll only need them for special occasions', 'Your brain adapts best when you wear them every day, all day. Part-time wearing makes it harder to get used to them.'],
];
page_head([
    'path' => 'hearing-aids/',
    'breadcrumbs' => [['Hearing aids', 'hearing-aids/']],
    'schema' => [[
        '@context' => 'https://schema.org', '@type' => 'FAQPage',
        'mainEntity' => array_map(fn($q) => ['@type' => 'Question', 'name' => 'Myth: ' . $q[0], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => $q[1]]], $myths),
    ]],
], 'hearing-aids');
$brands = [
    ['Rexton', 'Reliable, affordable hearing aids, including water-resistant models.'],
    ['Unitron', 'Natural sound and easy-to-use apps.'],
    ['Widex', 'Known for exceptionally natural sound quality.'],
    ['Signia', 'Rechargeable and Bluetooth options with smart features.'],
    ['Cochlear & Baha', 'Implant and bone-conduction solutions for severe hearing loss.'],
    ['Protec-Ear', 'Custom hearing protection and swim plugs.'],
];
?>
<?php page_hero('Gehoorapparate · Hearing aids', 'Hearing aids, chosen around your life',
    'As an independent practice we fit several leading brands, so we can recommend what suits your hearing, your lifestyle and your budget, not what one company wants sold.',
    'hearingaids_hero', [['Hearing aids', 'hearing-aids/']]); ?>

<section class="section" style="padding-top:24px">
  <div class="wrap">
    <div class="section-head">
      <h2>How we choose the right hearing aid with you</h2>
    </div>
    <div class="grid">
      <div class="card"><span class="icon-tile"><?= icon('test', 28) ?></span><h3>1. Your hearing</h3><p>We start with a full hearing test, so the technology matches your type and degree of hearing loss.</p></div>
      <div class="card"><span class="icon-tile"><?= icon('heart', 28) ?></span><h3>2. Your lifestyle</h3><p>Busy restaurants, church, the bushveld, the office: we ask where you most want to hear better.</p></div>
      <div class="card"><span class="icon-tile"><?= icon('medical', 28) ?></span><h3>3. Your budget</h3><p>We explain the options at each price level and what your medical aid will cover.</p></div>
      <div class="card"><span class="icon-tile"><?= icon('ear', 28) ?></span><h3>4. A trial at home</h3><p>Wear them in your real life before you decide.</p></div>
      <div class="card"><span class="icon-tile"><?= icon('wrench', 28) ?></span><h3>5. Fitting &amp; fine-tuning</h3><p>We programme them to your hearing and fine-tune them over the first weeks. Bring a family member: a familiar voice helps.</p></div>
      <div class="card"><span class="icon-tile"><?= icon('shield', 28) ?></span><h3>6. Lifelong aftercare</h3><p>Annual check-ups, cleaning and repairs, with courier fees waived on warranty repairs.</p></div>
    </div>
  </div>
</section>

<section class="section tint">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Style &amp; technology</p>
      <h2>Modern hearing aids are small, smart and rechargeable</h2>
      <ul class="checklist">
        <li><?= icon('check', 18) ?> <span><strong>Rechargeable:</strong> charge overnight, wear all day</span></li>
        <li><?= icon('check', 18) ?> <span><strong>Bluetooth:</strong> phone calls and TV streamed straight to your ears</span></li>
        <li><?= icon('check', 18) ?> <span><strong>Apps:</strong> adjust volume and programmes from your phone</span></li>
        <li><?= icon('check', 18) ?> <span><strong>Remote fine-tuning:</strong> on supported models we can make adjustments without you coming in</span></li>
        <li><?= icon('check', 18) ?> <span><strong>Tinnitus programmes:</strong> built-in relief sounds</span></li>
        <li><?= icon('check', 18) ?> <span><strong>Water-resistant</strong> models for an active life</span></li>
      </ul>
    </div>
    <div class="split-media"><?= slot_img('hearingaids_styles', 'rounded', 'Modern rechargeable hearing aids', true, '4 / 3') ?></div>
  </div>
</section>

<section class="section" aria-labelledby="brands-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Products &amp; partners</p>
      <h2 id="brands-h">Brands we fit and support</h2>
    </div>
    <div class="grid">
<?php foreach ($brands as [$b, $d]): ?>
      <div class="card"><h3><?= e($b) ?></h3><p><?= e($d) ?></p></div>
<?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="myths-h">
  <div class="wrap">
    <h2 id="myths-h" class="center">Myths about hearing aids</h2>
    <div class="faq">
<?php foreach ($myths as $i => [$q, $a]): ?>
      <details<?= $i === 0 ? ' open' : '' ?>><summary>Myth: <?= e($q) ?></summary><p><?= e($a) ?></p></details>
<?php endforeach; ?>
    </div>
  </div>
</section>

<?php cta_band('Curious which hearing aid would suit you?', 'Make an appointment for a hearing test and a no-obligation chat about your options.'); page_footer();
