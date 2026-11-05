<?php
page_head([
    'path' => 'privacy/',
    'breadcrumbs' => [['Privacy policy', 'privacy/']],
], '');
$updated = '4 November 2026';
$p = practices();
?>
<!-- Template prepared for the practice. Have it reviewed by your compliance adviser before relying on it. -->
<section class="page-hero">
  <div class="wrap narrow">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="<?= e(url()) ?>">Home</a> › <span aria-current="page">Privacy policy</span></nav>
    <h1>Privacy policy</h1>
    <p class="lead">How we collect, use and protect your personal information, in line with the Protection of Personal Information Act 4 of 2013 (POPIA).</p>
    <p class="small muted">Last updated: <?= e($updated) ?></p>
  </div>
</section>
<section class="section legal" style="padding-top:16px">
  <div class="wrap narrow">
    <nav class="toc" aria-label="On this page">
      <ol>
        <li><a href="#who">Who we are</a></li><li><a href="#collect">What we collect</a></li><li><a href="#why">Why we use it</a></li>
        <li><a href="#share">Who we share it with</a></li><li><a href="#cookies">Cookies and similar technology</a></li><li><a href="#keep">How long we keep it</a></li>
        <li><a href="#security">How we protect it</a></li><li><a href="#rights">Your rights</a></li><li><a href="#contact-io">Contact our Information Officer</a></li>
      </ol>
    </nav>

    <h2 id="who">1. Who we are</h2>
    <p><?= e(setting('legal_name')) ?>, trading as Gehoor in die Moot (registration <?= e(setting('company_reg')) ?>, practice number <?= e(setting('practice_no')) ?>), is the "responsible party" for personal information collected through this website and at our practices at <?= e($p['rietfontein']['street']) ?>, <?= e($p['rietfontein']['area']) ?> and <?= e($p['lesmarais']['street']) ?>, <?= e($p['lesmarais']['area']) ?>, Pretoria.</p>

    <h2 id="collect">2. What we collect</h2>
    <h3>Through this website</h3>
    <ul>
      <li><strong>Contact form:</strong> your name, email address, phone number (optional), preferred practice and language, the topic and your message.</li>
      <li><strong>Technical information:</strong> your IP address is used briefly to block spam and abuse, and is stored only in scrambled (hashed) form.</li>
      <li><strong>Analytics, only if you accept:</strong> anonymous information about the pages you visit, your device type and how you arrived at the site.</li>
    </ul>
    <h3>When you become a patient</h3>
    <p>We collect the health, contact, identity and medical aid information needed to assess and treat you. Health information is special personal information under POPIA and is processed only for your care, as allowed by section 32 of POPIA and the HPCSA's rules on confidentiality.</p>

    <h2 id="why">3. Why we use it</h2>
    <ul>
      <li>To reply to your message and arrange appointments.</li>
      <li>To provide hearing care, and to submit claims, quotes and motivations to your medical aid.</li>
      <li>To keep this website secure and working, and, with your consent, to understand how it is used so we can improve it.</li>
    </ul>
    <p>We never sell your information, and we don't use it for marketing without your consent.</p>

    <h2 id="share">4. Who we share it with</h2>
    <ul>
      <li>Your medical aid scheme, referring doctor or specialist, when needed for your care and with your knowledge.</li>
      <li>Hearing aid manufacturers, for orders, warranties and repairs.</li>
      <li>Service providers who help us run the practice and this website (hosting, email, and Google Analytics if you accept). They may only use the information on our instructions.</li>
      <li>Authorities, when the law requires it.</li>
    </ul>
    <p>Some providers, such as Google, may store information outside South Africa. When this happens we rely on section 72 of POPIA: the recipient must be bound by adequate data protection rules or contract terms.</p>

    <h2 id="cookies">5. Cookies and similar technology</h2>
    <p>When you first visit, we ask whether you accept optional cookies. You can change your choice at any time with the <button type="button" class="linklike" data-consent-open>Cookie settings</button> link at the bottom of every page.</p>
    <div class="table-wrap" tabindex="0" role="region" aria-label="Table, scroll sideways on small screens">
      <table>
        <thead><tr><th scope="col">Name</th><th scope="col">Type</th><th scope="col">Purpose</th><th scope="col">Kept for</th></tr></thead>
        <tbody>
          <tr><td>gidm-consent</td><td>Essential (browser storage)</td><td>Remembers your cookie choice</td><td>12 months</td></tr>
          <tr><td>gidm-a11y</td><td>Essential (browser storage)</td><td>Remembers your text size and contrast choice</td><td>Until you clear it</td></tr>
          <tr><td>gidm_sid</td><td>Essential (cookie)</td><td>Keeps practice staff logged in to the website portal. Not set for visitors.</td><td>Until the browser closes</td></tr>
          <tr><td>_ga, _ga_*</td><td>Analytics (only if you accept)</td><td>Google Analytics: counts visits and shows which pages are useful</td><td>Up to 2 years</td></tr>
          <tr><td>Google Maps cookies</td><td>Third party (only if you accept or click "Show the map")</td><td>Shows our location maps on the Contact page</td><td>Set by Google</td></tr>
        </tbody>
      </table>
    </div>

    <h2 id="keep">6. How long we keep it</h2>
    <p>Messages sent through the website are deleted from the website system within 12 months, or sooner once they've been dealt with. Patient records are kept for as long as the HPCSA and South African law require.</p>

    <h2 id="security">7. How we protect it</h2>
    <p>The website runs only over an encrypted connection (HTTPS). The staff portal is password-protected, uses limited login attempts and automatic logout, and keeps website messages away from public access. In the practice, records are kept securely, and staff are bound by confidentiality.</p>

    <h2 id="rights">8. Your rights</h2>
    <p>Under POPIA you may:</p>
    <ul>
      <li>ask whether we hold information about you, and request a copy;</li>
      <li>ask us to correct or delete information that is wrong, out of date or no longer needed;</li>
      <li>object to how we use your information, or withdraw your consent;</li>
      <li>complain to the Information Regulator at <a href="https://inforegulator.org.za" rel="noopener" target="_blank">inforegulator.org.za</a>.</li>
    </ul>
    <p>Requests for records can also be made under our PAIA manual, which is available on request.</p>

    <h2 id="contact-io">9. Contact our Information Officer</h2>
    <p>Information Officer: <?= e(setting('info_officer')) ?><br>Email: <a href="mailto:<?= e(setting('email')) ?>"><?= e(setting('email')) ?></a><br>Phone: <a href="tel:<?= e(setting('phone_intl')) ?>"><?= e(setting('phone')) ?></a></p>
  </div>
</section>
<?php page_footer();
