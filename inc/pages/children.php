<?php
$faq = [
    ['My baby "referred" on the newborn screen. Does that mean they are deaf?', 'No. A "refer" result only means the test needs to be repeated. It often happens because of fluid in the ears or a restless baby. Most babies pass the follow-up test, but it\'s important to do it promptly.'],
    ['How do you test a baby who can\'t respond?', 'Newborn screening measures the ear\'s own response to soft sounds (otoacoustic emissions) while your baby sleeps. It\'s quick, painless and safe.'],
    ['At what age can my child have a hearing test?', 'At any age, from birth. We adapt the test to your child\'s age and development, often using play.'],
];
page_head([
    'path' => 'babies-and-children/',
    'breadcrumbs' => [['Babies & children', 'babies-and-children/']],
    'schema' => [[
        '@context' => 'https://schema.org', '@type' => 'FAQPage',
        'mainEntity' => array_map(fn($q) => ['@type' => 'Question', 'name' => $q[0], 'acceptedAnswer' => ['@type' => 'Answer', 'text' => $q[1]]], $faq),
    ]],
], 'babies-and-children');
$signs = [
    ['Birth – 3 months', 'Startles at sudden loud sounds and calms to your voice.'],
    ['4 – 6 months', 'Turns eyes or head towards sounds and enjoys rattles.'],
    ['7 – 12 months', 'Responds to their name, babbles, and understands "no" and "bye-bye".'],
    ['1 – 2 years', 'Points to familiar objects when named, and uses single words that grow into short phrases.'],
    ['2 – 4 years', 'Speaks in sentences, is understood by family, and hears you from another room.'],
    ['School age', 'Follows instructions in class, keeps up with reading, and doesn\'t turn the TV up loud.'],
];
?>
<?php page_hero('Babas & kinders · Babies & children', 'Hearing care for babies and children',
    'Good hearing is the foundation of speech, language and learning. We test children of every age, from their first days, gently and with lots of patience.',
    'children_hero', [['Babies & children', 'babies-and-children/']]); ?>

<section class="section tint" id="newborn">
  <div class="wrap split">
    <div class="split-text">
      <p class="eyebrow">Life Eugene Marais Hospital</p>
      <h2>Newborn hearing screening</h2>
      <p>We screen newborns at Life Eugene Marais Hospital, right across the road from our Les Marais practice. The screen takes a few minutes while your baby sleeps, and it doesn't hurt.</p>
      <h3 style="margin-top:20px">The 1-3-6 guideline</h3>
      <ol class="steps">
        <li><span class="num">1</span><div><strong>By 1 month:</strong> hearing screened.</div></li>
        <li><span class="num">3</span><div><strong>By 3 months:</strong> a full diagnostic test if the screen needs follow-up.</div></li>
        <li><span class="num">6</span><div><strong>By 6 months:</strong> support in place, such as hearing aids, if needed.</div></li>
      </ol>
    </div>
    <div class="split-media"><?= slot_img('children_newborn', 'rounded', 'Newborn hearing screening', true, '4 / 3') ?></div>
  </div>
</section>

<section class="section" aria-labelledby="k-h">
  <h2 id="k-h" class="sr-only">At a glance</h2>
  <div class="wrap grid">
    <div class="card"><span class="icon-tile"><?= icon('child', 28) ?></span><h3>Child hearing tests</h3><p>Play-based tests matched to your child's age, plus middle-ear checks for ear infections and fluid.</p></div>
    <div class="card"><span class="icon-tile"><?= icon('doc', 28) ?></span><h3>School-readiness screening</h3><p>Hearing and listening checks before Grade R or Grade 1, with reports for teachers and therapists.</p></div>
    <div class="card"><span class="icon-tile"><?= icon('shield', 28) ?></span><h3>Swim plugs for grommets</h3><p>Custom swim plugs that keep water out after grommets, so your child can keep swimming.</p></div>
  </div>
</section>

<section class="section tint" aria-labelledby="signs-h">
  <div class="wrap">
    <div class="section-head">
      <h2 id="signs-h">Hearing milestones to watch for</h2>
      <p class="muted">If your child isn't doing these things, or you're simply worried, trust your instinct and have their hearing checked.</p>
    </div>
    <div class="table-wrap panel" tabindex="0" role="region" aria-label="Hearing milestones table" style="background:var(--bg);border:1px solid var(--line);padding:8px 16px">
      <table>
        <thead><tr><th scope="col">Age</th><th scope="col">Most children can…</th></tr></thead>
        <tbody>
<?php foreach ($signs as [$age, $sign]): ?>
          <tr><th scope="row"><?= e($age) ?></th><td><?= e($sign) ?></td></tr>
<?php endforeach; ?>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="section" aria-labelledby="faq-h">
  <div class="wrap">
    <h2 id="faq-h" class="center">Questions from parents</h2>
    <div class="faq">
<?php foreach ($faq as $i => [$q, $a]): ?>
      <details<?= $i === 0 ? ' open' : '' ?>><summary><?= e($q) ?></summary><p><?= e($a) ?></p></details>
<?php endforeach; ?>
    </div>
  </div>
</section>

<?php cta_band('Worried about your child\'s hearing?', 'Contact us. We see babies and children of all ages, and we\'ll explain every step.'); page_footer();
