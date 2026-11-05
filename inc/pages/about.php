<?php
page_head([
    'path' => 'about-us/',
    'breadcrumbs' => [['About us', 'about-us/']],
], 'about-us');
$all = team();
$aud = array_values(array_filter($all, fn($m) => ($m['group'] ?? '') === 'audiologist'));
$sup = array_values(array_filter($all, fn($m) => ($m['group'] ?? '') !== 'audiologist'));
?>
<?php page_hero('Oor ons · About us', 'Caring for the Moot\'s hearing since 1999',
    'What a privilege it has been to serve the people of the Moot and beyond for more than ' . ((int)date('Y') - 1999) . ' years. We\'re an independent practice: we recommend what\'s right for you, not what a manufacturer wants sold.',
    'about_hero', [['About us', 'about-us/']]); ?>

<section class="section" style="padding-top:24px" aria-labelledby="why-h">
  <h2 id="why-h" class="sr-only">Why patients choose us</h2>
  <div class="wrap grid">
    <div class="card"><span class="icon-tile"><?= icon('heart', 28) ?></span><h3>Personal care</h3><p>The same familiar faces, visit after visit, in Afrikaans or English.</p></div>
    <div class="card"><span class="icon-tile"><?= icon('medical', 28) ?></span><h3>We do the paperwork</h3><p>Medical aid claims, motivations and quotes are submitted for you, free of charge.</p></div>
    <div class="card"><span class="icon-tile"><?= icon('pin', 28) ?></span><h3>Easy to visit</h3><p>Two practices, secure on-site parking, and wheelchair-friendly rooms and parking.</p></div>
  </div>
</section>

<section class="section tint" id="team" aria-labelledby="team-h">
  <div class="wrap">
    <div class="section-head">
      <p class="eyebrow">Ons span · Our team</p>
      <h2 id="team-h">Meet our audiologists</h2>
      <p class="muted">All our audiologists are registered with the Health Professions Council of South Africa (HPCSA).</p>
    </div>
    <div class="team-grid">
<?php foreach ($aud as $m): $ph = team_photo_url($m); ?>
      <article class="person">
        <?= $ph ? '<img class="photo" src="' . e($ph) . '" alt="' . e($m['name']) . ', ' . e($m['role']) . '" loading="lazy">' : '<div class="photo img-ph" role="img" aria-label="' . e($m['name']) . '"><img src="' . e(url('assets/img/logo-mark.png')) . '" alt=""></div>' ?>
        <div class="person-body">
          <h3><?= e($m['name']) ?></h3>
          <p class="role"><?= e($m['role']) ?></p>
<?php if (!empty($m['quals'])): ?>          <p class="quals"><?= e($m['quals']) ?></p><?php endif; ?>
<?php if (!empty($m['hpcsa'])): ?>          <p class="reg">HPCSA <?= e($m['hpcsa']) ?></p><?php endif; ?>
<?php if (!empty($m['bio'])): ?>          <p class="bio"><?= nl2br(e($m['bio'])) ?></p><?php endif; ?>
        </div>
      </article>
<?php endforeach; ?>
    </div>
<?php if ($sup): ?>
    <h3 style="margin-top:44px">Our friendly support team</h3>
    <ul class="support-list">
<?php foreach ($sup as $m): $ph = team_photo_url($m); ?>
      <li><?= $ph ? '<img src="' . e($ph) . '" alt="" loading="lazy">' : '<span class="avatar" aria-hidden="true"></span>' ?><span><strong><?= e($m['name']) ?></strong><br><span class="muted small"><?= e($m['role']) ?></span></span></li>
<?php endforeach; ?>
    </ul>
<?php endif; ?>
    <p class="small muted" style="margin-top:28px">Practice number <?= e(setting('practice_no')) ?> · <?= e(setting('legal_name')) ?>, reg. <?= e(setting('company_reg')) ?></p>
  </div>
</section>

<section class="section" id="community">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Gemeenskap · Community</p>
      <h2>Serving the community</h2>
      <p>We provide newborn hearing screening at Life Eugene Marais Hospital, and work with local schools, care homes and community organisations to make hearing care easier to get.</p>
      <p>Through donation programmes run with manufacturers, we've helped people who could not otherwise afford hearing aids. Ask us about current programmes.</p>
    </div>
    <div class="split-media"><?= slot_img('about_community', 'rounded', 'Gehoor in die Moot serving the community', true, '4 / 3') ?></div>
  </div>
</section>

<?php members_of(); cta_band('Come and meet us'); page_footer();
