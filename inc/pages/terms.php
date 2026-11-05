<?php
page_head([
    'path' => 'terms/',
    'breadcrumbs' => [['Terms & conditions', 'terms/']],
], '');
$updated = '4 November 2026';
$p = practices();
?>
<!-- Template prepared for the practice. Have it reviewed by your legal adviser before relying on it. -->
<section class="page-hero">
  <div class="wrap narrow">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="<?= e(url()) ?>">Home</a> › <span aria-current="page">Terms &amp; conditions</span></nav>
    <h1>Terms &amp; conditions</h1>
    <p class="lead">The terms for using this website. By using the site, you agree to them.</p>
    <p class="small muted">Last updated: <?= e($updated) ?></p>
  </div>
</section>
<section class="section legal" style="padding-top:16px">
  <div class="wrap narrow">
    <h2>1. About us</h2>
    <p>This website is owned and run by <?= e(setting('legal_name')) ?>, trading as Gehoor in die Moot. The following details are provided under section 43 of the Electronic Communications and Transactions Act 25 of 2002:</p>
    <div class="table-wrap" tabindex="0" role="region" aria-label="Table, scroll sideways on small screens">
      <table>
        <tbody>
          <tr><th scope="row">Legal name</th><td><?= e(setting('legal_name')) ?> (a private company / incorporated practice)</td></tr>
          <tr><th scope="row">Registration number</th><td><?= e(setting('company_reg')) ?></td></tr>
          <tr><th scope="row">Practice number</th><td><?= e(setting('practice_no')) ?></td></tr>
          <tr><th scope="row">Directors</th><td>Dr René Hornby</td></tr>
          <tr><th scope="row">Physical addresses</th><td><?php foreach ($p as $pr): ?><?= e($pr['street']) ?>, <?= e($pr['area']) ?>, <?= e($pr['city']) ?>, <?= e($pr['code']) ?><br><?php endforeach; ?></td></tr>
          <tr><th scope="row">Phone</th><td><?= e(setting('phone')) ?></td></tr>
          <tr><th scope="row">Email</th><td><?= e(setting('email')) ?></td></tr>
          <tr><th scope="row">Professional body</th><td>Health Professions Council of South Africa (HPCSA). Members of the South African Association of Audiologists and iCAN.</td></tr>
        </tbody>
      </table>
    </div>

    <h2>2. Health information is general, not personal advice</h2>
    <p>The information on this website, including the online hearing and tinnitus self-checks, is general and educational. It is not a diagnosis and doesn't replace an assessment by a qualified audiologist or doctor. If you have sudden hearing loss, ear pain, discharge, dizziness or tinnitus in one ear only, see a doctor or audiologist promptly.</p>

    <h2>3. Appointments</h2>
    <p>Sending a message through the website is a request, not a confirmed appointment. Our reception team will confirm a date and time with you. If you can't make your appointment, please let us know as soon as possible so we can offer the time to someone else.</p>

    <h2>4. Fees and medical aid</h2>
    <p>Our fees are available from reception on request. We submit claims to your medical aid on your behalf. You remain responsible for any amount your medical aid doesn't pay, including co-payments and amounts above your benefit limit. We will tell you about expected costs, and quote for hearing aids, before you commit.</p>

    <h2>5. Products, trials and warranties</h2>
    <p>Hearing aids and accessories carry the manufacturer's warranty. The terms of any trial period, returns and repairs are explained, and given to you in writing, before you buy.</p>

    <h2>6. Using this website</h2>
    <ul>
      <li>Don't misuse the site: for example, by sending spam, trying to access the staff portal without permission, or interfering with how the site works.</li>
      <li>The text, logo, photos and design belong to Gehoor in die Moot or its licensors. You may share links and print pages for personal use, but not copy them for commercial use without permission.</li>
      <li>Product names and logos are trademarks of their owners.</li>
    </ul>

    <h2>7. Links to other websites</h2>
    <p>We link to other websites, such as professional bodies and Google Maps, for your convenience. We are not responsible for their content or privacy practices.</p>

    <h2>8. Limitation of liability</h2>
    <p>We work hard to keep this website accurate and available, but we can't guarantee that it will always be error-free or uninterrupted. To the extent the law allows, we aren't liable for any loss that results from using the website or relying on its general information. Nothing in these terms limits your rights under the Consumer Protection Act 68 of 2008 or any other law that cannot be excluded.</p>

    <h2>9. Privacy</h2>
    <p>Our <a href="<?= e(url('privacy/')) ?>">privacy policy</a> explains how we handle personal information and cookies.</p>

    <h2>10. Changes and governing law</h2>
    <p>We may update these terms from time to time; the date at the top shows the latest version. These terms are governed by the laws of the Republic of South Africa.</p>

    <h2>11. Questions</h2>
    <p>Contact us on <a href="tel:<?= e(setting('phone_intl')) ?>"><?= e(setting('phone')) ?></a> or <a href="mailto:<?= e(setting('email')) ?>"><?= e(setting('email')) ?></a>.</p>
  </div>
</section>
<?php page_footer();
