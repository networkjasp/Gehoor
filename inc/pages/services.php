<?php
page_head([
    'path' => 'services/',
    'breadcrumbs' => [['Services', 'services/']],
], 'services');

$check = [
    'Do you often ask people to repeat themselves?',
    'Is it hard to follow a conversation in a restaurant or at church?',
    'Do family members say the TV or radio is too loud?',
    'Do people seem to mumble or speak softly?',
    'Is it hard to hear on the phone?',
    'Do you struggle to hear women\'s or children\'s voices?',
    'Do you hear ringing, buzzing or hissing in your ears?',
    'Do you avoid social situations because of your hearing?',
];
$tinnitus = [
    'Do you hear ringing, buzzing or hissing most days?',
    'Does it bother you when you try to sleep?',
    'Does it make it hard to concentrate?',
    'Do everyday sounds feel too loud or painful?',
    'Has it lasted longer than 3 months?',
];
function quiz(array $qs, string $id, int $threshold, string $high, string $low): void { ?>
  <div class="panel" style="background:var(--bg);border:1px solid var(--line)" data-quiz id="<?= e($id) ?>" data-threshold="<?= $threshold ?>" data-high="<?= e($high) ?>" data-low="<?= e($low) ?>">
<?php foreach ($qs as $i => $q): ?>
    <div class="quiz-q"><span><?= ($i + 1) ?>. <?= e($q) ?></span>
      <span class="yn" role="group" aria-label="Answer to question <?= $i + 1 ?>"><button type="button" value="yes" aria-pressed="false">Yes</button><button type="button" value="no" aria-pressed="false">No</button></span>
    </div>
<?php endforeach; ?>
    <p class="quiz-result" role="status" aria-live="polite">Answer the questions to see your result.</p>
    <p class="small muted" style="margin:10px 0 0">This isn't a diagnosis. It helps you decide whether to make an appointment.</p>
  </div>
<?php }
?>
<?php page_hero('Dienste · Services', 'Hearing tests and hearing care in Pretoria',
    'Everything your ears need under one roof: diagnostic hearing tests, tinnitus care, hearing aids, children\'s audiology, ear protection and repairs.',
    'services_hero', [['Services', 'services/']]); ?>

<section class="section" style="padding-top:24px" aria-labelledby="all-services-h">
  <h2 id="all-services-h" class="sr-only">All our services</h2>
  <div class="wrap grid">
    <a class="card" href="#hearing-tests"><span class="icon-tile"><?= icon('test', 28) ?></span><h3>Hearing tests</h3><p>For adults, from screening to full diagnostic testing.</p></a>
    <a class="card" href="#tinnitus"><span class="icon-tile"><?= icon('wave', 28) ?></span><h3>Tinnitus &amp; hyperacusis</h3><p>Assessment, sound therapy and ongoing support.</p></a>
    <a class="card" href="<?= e(url('hearing-aids/')) ?>"><span class="icon-tile"><?= icon('ear', 28) ?></span><h3>Hearing aids</h3><p>Independent advice, trial period and aftercare.</p></a>
    <a class="card" href="<?= e(url('babies-and-children/')) ?>"><span class="icon-tile"><?= icon('child', 28) ?></span><h3>Babies &amp; children</h3><p>Newborn screening and child-friendly testing.</p></a>
    <a class="card" href="#protection"><span class="icon-tile"><?= icon('shield', 28) ?></span><h3>Ear protection &amp; swim plugs</h3><p>Custom-made from impressions of your ears.</p></a>
    <a class="card" href="#repairs"><span class="icon-tile"><?= icon('wrench', 28) ?></span><h3>Repairs &amp; batteries</h3><p>Servicing, warranty repairs and the Battery Club.</p></a>
  </div>
</section>

<section class="section tint" id="hearing-tests">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Gehoortoetse</p>
      <h2>Diagnostic hearing tests</h2>
      <p>A full hearing assessment takes about an hour in our soundproof booth. It tells us the type and degree of any hearing loss, and whether there's an underlying medical issue that needs a referral.</p>
      <ul class="checklist">
        <li><?= icon('check', 18) ?> Pure-tone and speech testing</li>
        <li><?= icon('check', 18) ?> Middle-ear (tympanometry) testing</li>
        <li><?= icon('check', 18) ?> Results explained the same day, with a written report</li>
        <li><?= icon('check', 18) ?> Reports for your doctor, ENT, employer or medical aid</li>
      </ul>
    </div>
    <div class="split-media"><?= slot_img('service_tests', 'rounded', 'Hearing test in a soundproof booth', true, '4 / 3') ?></div>
  </div>
</section>

<section class="section" id="hearing-check">
  <div class="wrap split">
    <div class="split-text" style="flex-basis:340px">
      <p class="eyebrow">Free hearing check</p>
      <h2>Do I need a hearing test?</h2>
      <p class="muted">Answer these 8 questions honestly. If you answer "yes" to three or more, a hearing test is a good idea. Hearing loss usually creeps up slowly, and the people around you often notice it first.</p>
    </div>
    <div class="split-media" style="flex-basis:520px">
      <?php quiz($check, 'quiz-hearing', 3,
        'Your answers suggest a hearing test would be worthwhile. Contact us to make an appointment.',
        'Your hearing seems fine for now. We still recommend a baseline test from age 50, or sooner if things change.'); ?>
    </div>
  </div>
</section>

<section class="section tint" id="tinnitus">
  <div class="wrap">
    <div class="split">
      <div class="split-text">
        <p class="eyebrow">Tinnitus &amp; hiperakusis</p>
        <h2>Tinnitus and hyperacusis treatment</h2>
        <p>Tinnitus is ringing, buzzing or hissing that no one else can hear. Hyperacusis makes everyday sounds feel too loud or even painful. Both are common, and you don't have to "just live with it". There's no one-size-fits-all cure, but most people get real relief with the right plan.</p>
        <ol class="steps">
          <li><span class="num">1</span><div><strong>Full assessment:</strong> a hearing test, tinnitus pitch and loudness matching, and a sound-tolerance check.</div></li>
          <li><span class="num">2</span><div><strong>Understanding it:</strong> knowing what causes your tinnitus takes away much of the fear and stress.</div></li>
          <li><span class="num">3</span><div><strong>Sound therapy:</strong> hearing aids with built-in tinnitus programmes, sound generators or apps.</div></li>
          <li><span class="num">4</span><div><strong>Follow-up:</strong> regular check-ins, and a referral to an ENT or psychologist when needed.</div></li>
        </ol>
      </div>
      <div class="split-media"><?= slot_img('service_tinnitus', 'rounded', 'Tinnitus consultation', true, '4 / 3') ?></div>
    </div>
    <div style="margin-top:40px; max-width:820px">
      <h3>Tinnitus self-check</h3>
      <?php quiz($tinnitus, 'quiz-tinnitus', 2,
        'Your answers suggest a tinnitus assessment would help. Contact us to make an appointment.',
        'Your tinnitus seems mild. Keep an eye on it, and come in if it changes or starts to bother you.'); ?>
    </div>
  </div>
</section>

<section class="section" id="protection">
  <div class="wrap split reverse">
    <div class="split-text">
      <p class="eyebrow">Gehoorbeskerming</p>
      <h2>Ear protection and custom swim plugs</h2>
      <p>Noise damage is permanent, but it's preventable. We take impressions of your ears to make protection that fits comfortably all day.</p>
      <ul class="checklist">
        <li><?= icon('check', 18) ?> Custom swim plugs for children with grommets, and for swimmers</li>
        <li><?= icon('check', 18) ?> Hearing protection for shooting, hunting, motorsport and industry</li>
        <li><?= icon('check', 18) ?> Musicians' earplugs that lower volume without muffling sound</li>
        <li><?= icon('check', 18) ?> Sleep plugs and Protec-Ear products</li>
      </ul>
    </div>
    <div class="split-media"><?= slot_img('service_protection', 'rounded', 'Custom ear protection and swim plugs', true, '4 / 3') ?></div>
  </div>
</section>

<section class="section tint" id="repairs">
  <div class="wrap grid-2">
    <div class="panel" style="background:var(--bg);border:1px solid var(--line)">
      <span class="icon-tile"><?= icon('wrench', 28) ?></span>
      <h2 style="margin-top:14px">Repairs and servicing</h2>
      <p class="muted">We clean, check and repair hearing aids of all brands. Warranty repairs are sent to the manufacturer with the courier fee waived. Hearing aids should be serviced at least once a year.</p>
    </div>
    <div class="panel navy">
      <span class="icon-tile"><?= icon('battery', 28) ?></span>
      <h2 style="margin-top:14px">Battery Club</h2>
      <p>Buy 5 packs of hearing aid batteries and get the 6th free. Open to everyone, including people who aren't our patients.</p>
      <a class="text-link light" href="<?= e(url('contact/?subject=battery#form')) ?>">Join the Battery Club <?= icon('arrow', 18) ?></a>
    </div>
  </div>
</section>

<?php cta_band('Questions about any of our services?'); page_footer();
