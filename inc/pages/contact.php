<?php
$subjects = [
    'test'      => 'Hearing test (adult)',
    'child'     => 'Baby or child hearing test',
    'tinnitus'  => 'Tinnitus or sound sensitivity',
    'aids'      => 'Hearing aids',
    'repair'    => 'Hearing aid service or repair',
    'battery'   => 'Battery Club',
    'protect'   => 'Ear protection or swim plugs',
    'medical'   => 'Medical aid question',
    'other'     => 'Something else',
];
$errors = [];
$old = ['name' => '', 'email' => '', 'phone' => '', 'practice' => 'Either', 'subject' => (string)($_GET['subject'] ?? 'test'), 'message' => '', 'lang' => 'Afrikaans'];
if (!isset($subjects[$old['subject']])) {
    $old['subject'] = 'test';
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST') {
    $clean = fn($k, $max) => trim(mb_substr(str_replace(["\r", "\0"], '', (string)($_POST[$k] ?? '')), 0, $max));
    $old = [
        'name' => $clean('name', 100),
        'email' => $clean('email', 150),
        'phone' => $clean('phone', 30),
        'practice' => $clean('practice', 20),
        'subject' => $clean('subject', 20),
        'message' => $clean('message', 5000),
        'lang' => $clean('lang', 20),
    ];
    foreach (['name', 'email', 'phone', 'practice', 'subject', 'lang'] as $k) {
        $old[$k] = str_replace("\n", ' ', $old[$k]);
    }
    $age = form_token_age((string)($_POST['t'] ?? ''));
    $bot = ($_POST['website'] ?? '') !== '' || $age === null || $age < 3 || $age > 86400;

    if (mb_strlen($old['name']) < 2) $errors['name'] = 'Please enter your name.';
    if (!filter_var($old['email'], FILTER_VALIDATE_EMAIL)) $errors['email'] = 'Please enter a valid email address.';
    if ($old['phone'] !== '' && !preg_match('/^[0-9 +()-]{9,20}$/', $old['phone'])) $errors['phone'] = 'Please check your phone number.';
    if (!isset($subjects[$old['subject']])) $old['subject'] = 'other';
    if (!in_array($old['practice'], ['Either', 'Rietfontein', 'Les Marais'], true)) $old['practice'] = 'Either';
    if (!in_array($old['lang'], ['Afrikaans', 'English'], true)) $old['lang'] = 'English';
    if (mb_strlen($old['message']) < 5) $errors['message'] = 'Please tell us a little about what you need.';
    if (empty($_POST['consent'])) $errors['consent'] = 'Please tick the box so we may use your details to reply.';

    // Spam protection (in addition to the hidden honeypot field and the timing token above)
    if (preg_match_all('#https?://|www\.#i', $old['message']) > 2) {
        $errors['message'] = 'Please remove the web links from your message.';
    }
    if (preg_match('/\b(viagra|cialis|casino|porn|crypto ?currency|bitcoin|forex|backlinks?|seo services|loan offer)\b/i', $old['message'] . ' ' . $old['name'])) {
        $bot = true;
    }
    if (preg_match('/[\x{0400}-\x{04FF}\x{4E00}-\x{9FFF}]{6,}/u', $old['message'])) {
        $bot = true; // long runs of Cyrillic/CJK text are almost always spam for this practice
    }
    $tsSite = setting('turnstile_site');
    $tsSecret = secret_setting('turnstile_secret');
    if (!$bot && !$errors && $tsSite !== '' && $tsSecret !== '') {
        $ctx = stream_context_create(['http' => [
            'method' => 'POST', 'timeout' => 8,
            'header' => "Content-Type: application/x-www-form-urlencoded\r\n",
            'content' => http_build_query(['secret' => $tsSecret, 'response' => (string)($_POST['cf-turnstile-response'] ?? ''), 'remoteip' => client_ip()]),
        ]]);
        $res = json_decode((string)@file_get_contents('https://challenges.cloudflare.com/turnstile/v0/siteverify', false, $ctx), true);
        if (empty($res['success'])) {
            $errors['form'] = 'Please complete the "I am human" check and try again.';
        }
    }
    // Ignore exact duplicates sent within 10 minutes (double clicks, reloads)
    if (!$bot && !$errors) {
        foreach (array_slice(load_data('messages', []), 0, 20) as $prev) {
            if (($prev['email'] ?? '') === $old['email'] && ($prev['message'] ?? '') === $old['message'] && time() - strtotime($prev['date']) < 600) {
                $bot = true;
            }
        }
    }

    if (!$errors && !$bot && !throttle('contact', 5, 3600)) {
        $errors['form'] = 'Too many messages have been sent from this connection. Please call us on ' . setting('phone') . '.';
    }

    if (!$errors) {
        if (!$bot) {
            $to = setting('contact_to') ?: 'admin@gehoorindiemoot.co.za';
            $host = preg_replace('/^www\./', '', (string)parse_url(site_origin(), PHP_URL_HOST)) ?: 'gehoorindiemoot.co.za';
            if ($host === 'localhost' || filter_var($host, FILTER_VALIDATE_IP)) $host = 'gehoorindiemoot.co.za';
            $subjectLine = 'Website enquiry: ' . $subjects[$old['subject']] . ' – ' . $old['name'];
            $body = "New message from the website contact form\n"
                . str_repeat('-', 44) . "\n"
                . "Name:       {$old['name']}\n"
                . "Email:      {$old['email']}\n"
                . "Phone:      " . ($old['phone'] ?: '-') . "\n"
                . "About:      {$subjects[$old['subject']]}\n"
                . "Practice:   {$old['practice']}\n"
                . "Language:   {$old['lang']}\n"
                . "Sent:       " . date('j F Y, H:i') . "\n"
                . str_repeat('-', 44) . "\n\n"
                . $old['message'] . "\n\n"
                . "--\nThe sender agreed to the privacy policy (POPIA). Reply to this email to answer them directly.\n";
            $headers = [
                'From' => 'Gehoor in die Moot website <website@' . $host . '>',
                'Reply-To' => $old['name'] . ' <' . $old['email'] . '>',
                'MIME-Version' => '1.0',
                'Content-Type' => 'text/plain; charset=UTF-8',
                'Content-Transfer-Encoding' => '8bit',
                'X-Mailer' => 'GehoorWebsite',
            ];
            $sent = @mail($to, '=?UTF-8?B?' . base64_encode($subjectLine) . '?=', $body, $headers, '-f website@' . $host);

            $msgs = load_data('messages', []);
            array_unshift($msgs, [
                'id' => bin2hex(random_bytes(6)),
                'date' => date('c'),
                'name' => $old['name'], 'email' => $old['email'], 'phone' => $old['phone'],
                'subject' => $subjects[$old['subject']], 'practice' => $old['practice'], 'lang' => $old['lang'],
                'message' => $old['message'],
                'emailed' => (bool)$sent, 'read' => false,
            ]);
            save_data('messages', array_slice($msgs, 0, 500));
        }
        header('Location: ' . url('contact/?sent=1#form'), true, 303);
        exit;
    }
}

page_head([
    'path' => 'contact/',
    'head_extra' => setting('turnstile_site') !== '' ? ['<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>'] : [],
    'breadcrumbs' => [['Contact', 'contact/']],
], 'contact');
$wa = whatsapp_link();
$err = fn($k) => isset($errors[$k]) ? '<span class="hint" style="color:#8A1C1C;font-weight:700" id="err-' . $k . '">' . e($errors[$k]) . '</span>' : '';
$inv = fn($k) => isset($errors[$k]) ? ' aria-invalid="true" aria-describedby="err-' . $k . '"' : '';
?>
<section class="page-hero">
  <div class="wrap">
    <nav class="crumbs" aria-label="Breadcrumb"><a href="<?= e(url()) ?>">Home</a> <span aria-hidden="true">›</span> <a href="<?= e(url('contact/')) ?>" aria-current="page">Contact</a></nav>
    <p class="eyebrow">Kontak · Contact</p>
    <h1>Contact our friendly team</h1>
    <p class="lead">Send us a message and we'll get back to you within one working day to arrange your appointment. Or call us, we're happy to help.</p>
    <ul class="contact-methods">
      <li><?= icon('phone', 20) ?> <a href="tel:<?= e(setting('phone_intl')) ?>" data-track="phone_click"><?= e(setting('phone')) ?></a></li>
      <li><?= icon('mail', 20) ?> <a href="mailto:<?= e(setting('email')) ?>" data-track="email_click"><?= e(setting('email')) ?></a></li>
<?php if ($wa): ?>      <li><?= icon('whatsapp', 20) ?> <a href="<?= e($wa) ?>" data-track="whatsapp_click">WhatsApp us</a></li><?php endif; ?>
    </ul>
  </div>
</section>

<section class="section" id="form" style="padding-top:32px">
  <div class="wrap split" style="align-items:flex-start">
    <div class="split-text" style="flex-basis:560px">
      <div class="panel" style="background:var(--bg);border:1px solid var(--line);box-shadow:var(--shadow)">
        <h2>Send us a message</h2>
<?php if (isset($_GET['sent'])): ?>
        <div class="alert ok" role="status" data-lead>Thank you, your message has been sent. We'll be in touch within one working day.</div>
<?php elseif ($errors): ?>
        <div class="alert err" role="alert"><?= e($errors['form'] ?? 'Please check the fields marked below.') ?></div>
<?php endif; ?>
        <form class="form" id="contact-form" method="post" action="<?= e(url('contact/')) ?>#form" novalidate data-validate>
          <input type="hidden" name="t" value="<?= e((isset($_POST['t']) && form_token_age((string)$_POST['t']) !== null) ? (string)$_POST['t'] : form_token()) ?>">
          <div class="hp" aria-hidden="true"><label for="website">Leave this empty</label><input type="text" id="website" name="website" tabindex="-1" autocomplete="off"></div>
          <div class="field"><label for="name">Full name</label><input type="text" id="name" name="name" autocomplete="name" required minlength="2" maxlength="100" data-msg="Please enter your name." value="<?= e($old['name']) ?>"<?= $inv('name') ?>><?= $err('name') ?></div>
          <div class="field"><label for="email">Email address</label><input type="email" id="email" name="email" autocomplete="email" required maxlength="150" data-msg="Please enter a valid email address, like name@example.com." value="<?= e($old['email']) ?>"<?= $inv('email') ?>><?= $err('email') ?></div>
          <div class="field"><label for="phone">Cellphone <span class="muted">(optional)</span></label><input type="tel" id="phone" name="phone" autocomplete="tel" inputmode="tel" pattern="[\d\s\+\(\)\-]{9,20}" maxlength="20" data-msg="Please check your phone number, for example 082 123 4567." value="<?= e($old['phone']) ?>"<?= $inv('phone') ?>><?= $err('phone') ?></div>
          <div class="field"><label for="subject">What is it about?</label>
            <select id="subject" name="subject">
<?php foreach ($subjects as $k => $v): ?>              <option value="<?= e($k) ?>"<?= $old['subject'] === $k ? ' selected' : '' ?>><?= e($v) ?></option>
<?php endforeach; ?>
            </select></div>
          <div class="field"><label for="practice">Preferred practice</label>
            <select id="practice" name="practice">
<?php foreach (['Either', 'Rietfontein', 'Les Marais'] as $v): ?>              <option<?= $old['practice'] === $v ? ' selected' : '' ?>><?= e($v) ?></option>
<?php endforeach; ?>
            </select></div>
          <div class="field"><label for="lang">Preferred language</label>
            <select id="lang" name="lang">
<?php foreach (['Afrikaans', 'English'] as $v): ?>              <option<?= $old['lang'] === $v ? ' selected' : '' ?>><?= e($v) ?></option>
<?php endforeach; ?>
            </select></div>
          <div class="field full"><label for="message">Your message</label><textarea id="message" name="message" required minlength="5" maxlength="5000" data-msg="Please tell us a little about what you need." placeholder="For example: I'd like a hearing test, mornings suit me best."<?= $inv('message') ?>><?= e($old['message']) ?></textarea><?= $err('message') ?></div>
          <div class="full"><label class="consent"><input type="checkbox" id="consent" name="consent" value="1" required data-msg="Please tick the box so we may use your details to reply."<?= !empty($_POST['consent']) ? ' checked' : '' ?><?= $inv('consent') ?>> <span>I agree that Gehoor in die Moot may use these details to reply to me, as set out in the <a href="<?= e(url('privacy/')) ?>">privacy policy</a>.</span></label><?= $err('consent') ?></div>
<?php if (setting('turnstile_site') !== ''): ?>
          <div class="full"><div class="cf-turnstile" data-sitekey="<?= e(setting('turnstile_site')) ?>"></div></div>
<?php endif; ?>
          <div class="full"><button class="btn btn-primary btn-lg" type="submit">Send message</button> <span class="small muted">We reply within one working day.</span></div>
        </form>
      </div>
    </div>
    <div class="split-media" style="flex-basis:340px">
      <div class="panel">
        <h2 style="font-size:1.3rem">Office hours</h2>
        <p style="margin:0"><?= icon('clock', 18) ?> <?= e(setting('hours')) ?></p>
        <p class="muted small" style="margin:8px 0 0">Closed on weekends and public holidays.</p>
      </div>
      <div class="panel navy" style="margin-top:20px">
        <h2 style="font-size:1.3rem">Good to know</h2>
        <p style="margin:0">You don't need a referral. We claim from your medical aid for you. Both practices have secure parking and are wheelchair-friendly.</p>
      </div>
    </div>
  </div>
</section>

<section class="section tint" aria-labelledby="loc-h">
  <div class="wrap">
    <h2 id="loc-h">Our practices</h2>
    <div class="grid-2">
<?php foreach (practices() as $p): ?>
      <div class="loc">
        <?= image_url($p['image']) ? slot_img($p['image'], '', $p['name'] . ' practice entrance', true, '16 / 9') : '' ?>
        <div class="map-slot" data-map-src="<?= e($p['embed']) ?>" data-map-title="Map of the <?= e($p['name']) ?> practice">
          <p>Google Maps sets its own cookies, so the map loads only with your permission.</p>
          <button type="button" class="btn btn-outline" data-map-load>Show the map</button>
        </div>
        <div class="loc-body">
          <h3><?= e($p['name']) ?></h3>
          <p style="margin:0"><?= e($p['street']) ?>, <?= e($p['area']) ?>, <?= e($p['city']) ?>, <?= e($p['code']) ?></p>
          <p class="muted small" style="margin:0"><?= e($p['note']) ?></p>
          <a href="<?= e($p['map']) ?>" target="_blank" rel="noopener"><strong>Open in Google Maps</strong></a>
        </div>
      </div>
<?php endforeach; ?>
    </div>
  </div>
</section>
<?php page_footer();
