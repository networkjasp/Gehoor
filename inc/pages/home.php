<?php
$faq = [
    ['Do I need a doctor\'s referral?', 'No. You can make an appointment with us directly. Some medical aids ask for a referral before they pay for hearing aids, and we\'ll tell you if yours does.'],
    ['Does my medical aid pay for a hearing test?', 'Most medical aids cover a diagnostic hearing test. We submit the claim for you, and help with motivations and quotes for hearing aids at no charge.'],
    ['Can I try hearing aids before I buy?', 'Yes. We offer a trial period so you can wear them at home, at work and at church before you decide.'],
    ['Which hearing aid brands do you fit?', 'Rexton, Unitron, Widex and Signia, plus Cochlear and Baha implant solutions. We\'re independent, so we recommend what suits you.'],
];
page_head([
    'path' => '',
    'schema' => [[
        '@context' => 'https://schema.org', '@type' => 'FAQPage',
        'mainEntity' => array_map(fn($q) => ['@type' => 'Question', 'name' => $q[0], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => $q[1]]], $faq),
    ]],
], 'home');
$audiologists = array_values(array_filter(team(), fn($m) => ($m['group'] ?? '') === 'audiologist'));
$latest = array_slice(newsletters(), 0, 3);
$wa = whatsapp_link();
$services = [
    ['test', 'Hearing tests', 'Full diagnostic testing in a soundproof booth, with results explained the same day.', 'services/#hearing-tests'],
    ['child', 'Babies & children', 'Child-friendly testing from birth, school-readiness screening and follow-up.', 'babies-and-children/'],
    ['heart', 'Newborn hearing screening', 'Screening for newborns at Life Eugene Marais Hospital, right across the road.', 'babies-and-children/#newborn'],
    ['wave', 'Tinnitus & hyperacusis', 'Ringing in your ears or sensitivity to sound is treatable. We build a plan around you.', 'services/#tinnitus'],
    ['ear', 'Hearing aids & fittings', 'Rexton, Unitron, Widex and Signia, with a trial period and lifelong aftercare.', 'hearing-aids/'],
    ['shield', 'Ear protection & swim plugs', 'Custom swim plugs and noise protection, plus repairs and the Battery Club.', 'services/#protection'],
];
?>
<section class="hero">
  <div class="wrap hero-in">
    <div class="hero-text">
      <p class="pill">HPCSA-registered audiologists · Since 1999</p>
      <h1>Audiologists in the Moot, Pretoria, since 1999</h1>
      <p class="lead">Hearing tests for babies, children and adults, tinnitus care and hearing aids, with personal care from a team that knows you by name. <span lang="af">Ons help graag!</span></p>
      <div class="cta-actions">
        <a class="btn btn-primary btn-lg" href="<?= e(url('contact/#form')) ?>" data-track="cta_click">Make an appointment</a>
        <span class="cta-alt">or call <a href="tel:<?= e(setting('phone_intl')) ?>" data-track="phone_click"><?= e(setting('phone')) ?></a><?php if ($wa): ?> · <a href="<?= e($wa) ?>" data-track="whatsapp_click">WhatsApp us</a><?php endif; ?></span>
      </div>
      <ul class="ticks">
        <li><?= icon('check', 20) ?> We claim from your medical aid</li>
        <li><?= icon('check', 20) ?> Babies, children &amp; adults</li>
        <li><?= icon('check', 20) ?> Secure parking, wheelchair-friendly</li>
        <li><?= icon('check', 20) ?> Afrikaans &amp; English</li>
      </ul>
    </div>
    <div class="hero-media">
      <?= slot_img('home_hero', 'rounded', 'Dr René Hornby with a patient at Gehoor in die Moot', false, '4 / 4.3') ?>
      <div class="badge-float"><strong><?= (int)date('Y') - 1999 ?></strong><span>years caring for<br>Pretoria's hearing</span></div>
    </div>
  </div>
</section>

<section class="band">
  <div class="wrap band-in">
    <div>
      <h2>Not sure if you need a hearing test?</h2>
      <p>Answer 8 quick questions in our free hearing check, with your result straight away.</p>
    </div>
    <a class="btn btn-outline-light" href="<?= e(url('services/#hearing-check')) ?>">Take the hearing check <?= icon('arrow', 18) ?></a>
  </div>
</section>

<section class="section" aria-labelledby="services-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Dienste · Services</p>
      <h2 id="services-h">Hearing care for every stage of life</h2>
      <p class="muted">From your baby's first hearing screen to fitting the latest rechargeable hearing aids, it's all under one roof with the same team.</p>
    </div>
    <div class="grid">
<?php foreach ($services as [$ic, $t, $d, $href]): ?>
      <a class="card" href="<?= e(url($href)) ?>">
        <span class="icon-tile"><?= icon($ic, 28) ?></span>
        <h3><?= e($t) ?></h3>
        <p><?= e($d) ?></p>
        <span class="more">Learn more <?= icon('arrow', 18) ?></span>
      </a>
<?php endforeach; ?>
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="visit-h">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Your first visit</p>
      <h2 id="visit-h">What to expect, step by step</h2>
      <ol class="steps">
        <li><span class="num">1</span><div><strong>A conversation.</strong> We ask about your hearing, health and the situations you find hardest.</div></li>
        <li><span class="num">2</span><div><strong>A look in your ears.</strong> We check for wax or anything blocking sound.</div></li>
        <li><span class="num">3</span><div><strong>The hearing test.</strong> Painless. You listen in a soundproof booth and press a button when you hear a tone.</div></li>
        <li><span class="num">4</span><div><strong>Your results, explained.</strong> You leave with clear options and a written report, with no pressure to buy.</div></li>
      </ol>
    </div>
    <div class="split-media">
      <div class="panel green">
        <h3>Bring along</h3>
        <ul class="checklist">
          <li><?= icon('check', 18) ?> Your ID and medical aid card</li>
          <li><?= icon('check', 18) ?> A doctor's referral, if you have one</li>
          <li><?= icon('check', 18) ?> Your current hearing aids</li>
          <li><?= icon('check', 18) ?> A list of your medication</li>
          <li><?= icon('check', 18) ?> A family member: a familiar voice helps when we fit hearing aids</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<?php if ($audiologists): ?>
<section class="section" aria-labelledby="team-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Ons span · Our team</p>
      <h2 id="team-h">Qualified, registered and here since 1999</h2>
    </div>
    <div class="team-grid">
<?php foreach ($audiologists as $m): $ph = team_photo_url($m); ?>
      <article class="person">
        <?= $ph ? '<img class="photo" src="' . e($ph) . '" alt="' . e($m['name']) . '" loading="lazy">' : '<div class="photo img-ph" role="img" aria-label="' . e($m['name']) . '"><img src="' . e(url('assets/img/logo-mark.png')) . '" alt=""></div>' ?>
        <div class="person-body">
          <h3><?= e($m['name']) ?></h3>
          <p class="role"><?= e($m['role']) ?></p>
<?php if (!empty($m['hpcsa'])): ?>          <p class="reg">HPCSA <?= e($m['hpcsa']) ?></p><?php endif; ?>
        </div>
      </article>
<?php endforeach; ?>
    </div>
    <p style="margin-top:24px"><a class="text-link" href="<?= e(url('about-us/')) ?>">Meet the whole team <?= icon('arrow', 18) ?></a></p>
  </div>
</section>
<?php endif; ?>

<section class="section tint" aria-labelledby="club-h">
  <div class="wrap grid-2">
    <div class="panel navy">
      <p class="eyebrow" style="color:#B9E38F">Battery Club</p>
      <h2 id="club-h">Buy 5 packs of batteries, get the 6th free</h2>
      <p>Open to everyone, including people who aren't our patients. Ask at reception, or send us a message with your battery size.</p>
      <a class="text-link light" href="<?= e(url('contact/?subject=battery#form')) ?>">Join the Battery Club <?= icon('arrow', 18) ?></a>
    </div>
    <div class="panel" style="background:var(--bg);border:1px solid var(--line)">
      <p class="eyebrow">Mediese fonds · Medical aid</p>
      <h2>We handle your medical aid claims</h2>
      <p class="muted">We submit claims, motivations and quotes to your medical aid for you, free of charge.</p>
      <a class="text-link" href="<?= e(url('medical-aid/')) ?>">How medical aid works <?= icon('arrow', 18) ?></a>
    </div>
  </div>
</section>

<?php if ($latest): ?>
<section class="section" aria-labelledby="news-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Nuusbriewe · Newsletters</p>
      <h2 id="news-h">Latest from the practice</h2>
    </div>
    <div class="news-grid">
<?php foreach ($latest as $n): ?>
      <a class="news-card" href="<?= e(url('newsletters/' . $n['slug'])) ?>">
        <?php if (!empty($n['cover'])): ?><img class="cover" src="<?= e(url('uploads/newsletters/' . $n['id'] . '/' . $n['cover'])) ?>" alt="" loading="lazy"><?php endif; ?>
        <div class="body"><time datetime="<?= e($n['date']) ?>"><?= e(format_date($n['date'])) ?></time><h3><?= e($n['title']) ?></h3></div>
      </a>
<?php endforeach; ?>
    </div>
  </div>
</section>
<?php endif; ?>

<section class="section tint" aria-labelledby="loc-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Praktyke · Practices</p>
      <h2 id="loc-h">Two practices in the Moot</h2>
    </div>
    <div class="grid-2">
<?php foreach (practices() as $p): ?>
      <div class="loc">
        <div class="loc-body">
          <h3><?= e($p['name']) ?></h3>
          <p style="margin:0"><?= icon('pin', 18) ?> <?= e($p['street']) ?>, <?= e($p['area']) ?>, <?= e($p['city']) ?>, <?= e($p['code']) ?></p>
          <p class="muted small" style="margin:0"><?= e($p['note']) ?></p>
          <p class="small" style="margin:0"><?= icon('clock', 18) ?> <?= e(setting('hours')) ?></p>
          <a href="<?= e($p['map']) ?>" target="_blank" rel="noopener"><strong>Get directions</strong></a>
        </div>
      </div>
<?php endforeach; ?>
    </div>
  </div>
</section>

<?php members_of(); ?>

<section class="section tint" aria-labelledby="faq-h">
  <div class="wrap">
    <h2 id="faq-h" class="center">Frequently asked questions</h2>
    <div class="faq">
<?php foreach ($faq as $i => [$q, $a]): ?>
      <details<?= $i === 0 ? ' open' : '' ?>><summary><?= e($q) ?></summary><p><?= e($a) ?></p></details>
<?php endforeach; ?>
    </div>
  </div>
</section>

<?php cta_band(); page_footer();
