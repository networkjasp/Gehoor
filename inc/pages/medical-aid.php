<?php
$faq = [
    ['Will my medical aid pay for hearing aids?', 'Most medical aids have a hearing aid benefit, usually with a limit and a benefit cycle (often every three to five years). Some plans pay from savings and others from a separate benefit. We\'ll check yours for you.'],
    ['Do I need a referral or a motivation?', 'Some schemes ask for a referral from a doctor or ENT, and most need a quote and a motivation from the audiologist. We prepare and submit these for you, free of charge.'],
    ['What if I don\'t have medical aid?', 'You\'re very welcome. Ask us about cash fees for hearing tests, and about hearing aid options at different price levels.'],
    ['Is a hearing test covered?', 'Many plans cover a diagnostic hearing test from day-to-day benefits or savings. We submit the claim directly.'],
];
page_head([
    'path' => 'medical-aid/',
    'breadcrumbs' => [['Medical aid', 'medical-aid/']],
    'schema' => [[
        '@context' => 'https://schema.org', '@type' => 'FAQPage',
        'mainEntity' => array_map(fn($q) => ['@type' => 'Question', 'name' => $q[0], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => $q[1]]], $faq),
    ]],
], 'medical-aid');
?>
<?php page_hero('Mediese fonds · Medical aid', 'We handle your medical aid, so you don\'t have to',
    'Medical aid rules for hearing care can be confusing. We submit claims, quotes and motivations on your behalf, at no charge, and tell you upfront what you\'ll pay.',
    'medicalaid_hero', [['Medical aid', 'medical-aid/']]); ?>

<section class="section" style="padding-top:24px">
  <div class="wrap split" style="align-items:flex-start">
    <div class="split-text">
      <h2>How it works</h2>
      <ol class="steps">
        <li><span class="num">1</span><div><strong>Tell us your scheme and plan</strong> when you make your appointment.</div></li>
        <li><span class="num">2</span><div><strong>We check your benefits:</strong> hearing tests, hearing aid limits and your benefit cycle.</div></li>
        <li><span class="num">3</span><div><strong>We send the quote and motivation</strong> to your medical aid for pre-authorisation.</div></li>
        <li><span class="num">4</span><div><strong>You know exactly what you'll pay</strong> before anything is ordered. No surprises.</div></li>
      </ol>
    </div>
    <div class="split-media">
      <div class="panel green">
        <h3>Have these ready</h3>
        <ul class="checklist">
          <li><?= icon('check', 18) ?> Your medical aid card (scheme, plan and number)</li>
          <li><?= icon('check', 18) ?> The main member's ID number</li>
          <li><?= icon('check', 18) ?> A referral letter, if your scheme asks for one</li>
          <li><?= icon('check', 18) ?> The date of your last hearing aid claim, if any</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="k2-h">
  <h2 id="k2-h" class="sr-only">What is usually covered</h2>
  <div class="wrap grid">
    <div class="card"><span class="icon-tile"><?= icon('test', 28) ?></span><h3>Hearing tests</h3><p>Usually paid from day-to-day benefits or your medical savings account.</p></div>
    <div class="card"><span class="icon-tile"><?= icon('ear', 28) ?></span><h3>Hearing aids</h3><p>Usually a separate appliance benefit with a limit per ear and a benefit cycle.</p></div>
    <div class="card"><span class="icon-tile"><?= icon('battery', 28) ?></span><h3>Repairs &amp; batteries</h3><p>Sometimes covered from savings. Batteries are cheaper through our Battery Club.</p></div>
  </div>
</section>

<section class="section" aria-labelledby="faq-h">
  <div class="wrap">
    <h2 id="faq-h" class="center">Medical aid questions</h2>
    <div class="faq">
<?php foreach ($faq as $i => [$q, $a]): ?>
      <details<?= $i === 0 ? ' open' : '' ?>><summary><?= e($q) ?></summary><p><?= e($a) ?></p></details>
<?php endforeach; ?>
    </div>
  </div>
</section>

<?php cta_band('Want us to check your benefits?', 'Send us your scheme and plan name with your message and we\'ll find out what\'s covered.'); page_footer();
