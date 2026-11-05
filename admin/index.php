<?php
/**
 * Gehoor in die Moot – management portal.
 * Reached from the © in the website footer.
 */
declare(strict_types=1);
require dirname(__DIR__) . '/inc/bootstrap.php';
require dirname(__DIR__) . '/inc/admin-lib.php';

security_headers();
header('X-Robots-Tag: noindex, nofollow');
header('Cache-Control: no-store');
start_session();

$section = (string)($_GET['s'] ?? 'dashboard');
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$isAjax = ($_SERVER['HTTP_X_REQUESTED_WITH'] ?? '') === 'fetch';

/* ---------------- First-time setup check ---------------- */
if (!is_file(data_path('auth'))) {
    admin_head('Setup needed'); ?>
<main class="login-wrap"><div class="login-card">
  <img src="<?= e(url('assets/img/logo-full.png')) ?>" alt="Gehoor in die Moot" width="260">
  <h1>Portal not set up yet</h1>
  <p>For security, the login details are not stored in the website code. To finish the setup, copy <code>inc/config.sample.php</code> to <code>inc/config.php</code> on the server and add the password hash, as explained in the README. Then reload this page.</p>
  <a class="small" href="<?= e(url()) ?>">← Back to the website</a>
</div></main></body></html>
<?php
    exit;
}

/* ---------------- Login / logout ---------------- */
if (!admin_logged_in()) {
    $loginError = '';
    if ($method === 'POST' && ($_POST['action'] ?? '') === 'login') {
        if (!csrf_ok()) {
            $loginError = 'Your session expired. Please try again.';
        } elseif (!throttle('login', 5, 900, false)) {
            $loginError = 'Too many failed attempts. Please wait 15 minutes and try again.';
        } elseif (admin_login((string)($_POST['user'] ?? ''), (string)($_POST['pass'] ?? ''))) {
            redirect_to(admin_url());
        } else {
            throttle('login', 5, 900, true);
            usleep(400000);
            $loginError = 'The username or password is incorrect.';
        }
    }
    if ($isAjax) {
        json_out(['ok' => false, 'error' => 'Your session has expired. Please log in again.'], 401);
    }
    render_login($loginError);
    exit;
}

/* ---------------- Actions (all POST + CSRF) ---------------- */
if ($method === 'POST') {
    if (!csrf_ok()) {
        if ($isAjax) json_out(['ok' => false, 'error' => 'Security check failed. Reload the page and try again.'], 403);
        flash('Security check failed. Please try again.', 'err');
        redirect_to(admin_url($section));
    }
    $action = (string)($_POST['action'] ?? '');
    try {
        handle_action($action);
    } catch (RuntimeException $ex) {
        if ($isAjax) json_out(['ok' => false, 'error' => $ex->getMessage()], 400);
        flash($ex->getMessage(), 'err');
        redirect_to($_SERVER['REQUEST_URI'] ?? admin_url());
    }
}

function handle_action(string $action): void
{
    global $section;
    switch ($action) {
        case 'logout':
            $_SESSION = [];
            session_destroy();
            redirect_to(url());

        /* ----- Team ----- */
        case 'team_save':
            $team = load_data('team', []);
            $id = post_str('id', 80);
            $member = null;
            foreach ($team as $i => $m) {
                if ($m['id'] === $id) { $member = $i; break; }
            }
            $name = post_str('name', 100);
            if ($name === '') throw new RuntimeException('Please enter a name.');
            $data = [
                'name' => $name,
                'role' => post_str('role', 100),
                'group' => post_str('group') === 'support' ? 'support' : 'audiologist',
                'quals' => post_str('quals', 300),
                'hpcsa' => post_str('hpcsa', 40),
                'bio' => post_str('bio', 1500),
                'visible' => !empty($_POST['visible']),
            ];
            if ($member === null) {
                $data['id'] = slugify($name) . '-' . bin2hex(random_bytes(2));
                $data['photo'] = '';
                $data['order'] = count($team) ? max(array_column($team, 'order')) + 1 : 1;
                $team[] = $data;
                $member = array_key_last($team);
            } else {
                $team[$member] = array_merge($team[$member], $data);
            }
            if (!empty($_POST['remove_photo'])) {
                delete_file_safe(UPLOAD_DIR . '/team', (string)$team[$member]['photo']);
                $team[$member]['photo'] = '';
            }
            if (!empty($_FILES['photo']['name'])) {
                $new = save_uploaded_image($_FILES['photo'], UPLOAD_DIR . '/team', slugify($name), 900, 1100);
                delete_file_safe(UPLOAD_DIR . '/team', (string)$team[$member]['photo']);
                $team[$member]['photo'] = $new;
            }
            save_data('team', $team);
            flash('Saved ' . $name . '.');
            redirect_to(admin_url('team'));

        case 'team_delete':
            $team = load_data('team', []);
            $id = post_str('id', 80);
            foreach ($team as $i => $m) {
                if ($m['id'] === $id) {
                    delete_file_safe(UPLOAD_DIR . '/team', (string)$m['photo']);
                    unset($team[$i]);
                    flash('Removed ' . $m['name'] . '.');
                }
            }
            save_data('team', array_values($team));
            redirect_to(admin_url('team'));

        case 'team_move':
            $team = team(false);
            $id = post_str('id', 80);
            $dir = post_str('dir') === 'up' ? -1 : 1;
            foreach ($team as $i => $m) {
                if ($m['id'] === $id && isset($team[$i + $dir])) {
                    [$team[$i], $team[$i + $dir]] = [$team[$i + $dir], $team[$i]];
                    break;
                }
            }
            foreach ($team as $i => &$m) { $m['order'] = $i + 1; }
            unset($m);
            save_data('team', $team);
            redirect_to(admin_url('team'));

        /* ----- Images ----- */
        case 'image_save':
            $slot = post_str('slot', 60);
            $slots = image_slots();
            if (!isset($slots[$slot])) throw new RuntimeException('Unknown image.');
            $all = load_data('images', []);
            $cur = $all[$slot] ?? ['file' => '', 'alt' => ''];
            $cur['alt'] = post_str('alt', 200);
            $isDecor = str_starts_with($slot, 'logo_');
            if ($cur['alt'] === '' && !$isDecor && (!empty($_FILES['image']['name']) || !empty($cur['file']))) {
                throw new RuntimeException('Please add a short description (alt text) for "' . $slots[$slot]['label'] . '". It helps blind visitors and Google.');
            }
            if (!empty($_FILES['image']['name'])) {
                $isLogo = str_starts_with($slot, 'logo_') || str_starts_with($slot, 'member_');
                $new = save_uploaded_image($_FILES['image'], UPLOAD_DIR . '/images', str_replace('_', '-', $slot), $isLogo ? 1200 : 1800, $isLogo ? 1200 : 1800);
                delete_file_safe(UPLOAD_DIR . '/images', (string)($cur['file'] ?? ''));
                $cur['file'] = $new;
                $cur['w'] = $GLOBALS['last_image_size'][0] ?? null;
                $cur['h'] = $GLOBALS['last_image_size'][1] ?? null;
            }
            $cur['updated'] = time();
            $all[$slot] = $cur;
            save_data('images', $all);
            flash('Updated "' . $slots[$slot]['label'] . '".');
            redirect_to(admin_url('images') . '#slot-' . $slot);

        case 'image_reset':
            $slot = post_str('slot', 60);
            $all = load_data('images', []);
            if (isset($all[$slot])) {
                delete_file_safe(UPLOAD_DIR . '/images', (string)($all[$slot]['file'] ?? ''));
                unset($all[$slot]);
                save_data('images', $all);
            }
            flash('Image removed. The default is shown again.');
            redirect_to(admin_url('images') . '#slot-' . $slot);

        /* ----- Newsletters (step 1: PDF + details) ----- */
        case 'nl_create':
            $title = post_str('title', 150);
            $date = post_str('date', 10);
            if ($title === '') throw new RuntimeException('Please enter a title.');
            if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $date)) $date = date('Y-m-d');
            $f = $_FILES['pdf'] ?? null;
            if (!$f || ($f['error'] ?? 4) !== UPLOAD_ERR_OK) throw new RuntimeException(upload_error_text((int)($f['error'] ?? 4)));
            if ($f['size'] > 30 * 1024 * 1024) throw new RuntimeException('The PDF is larger than 30 MB. Please compress it first.');
            $mime = (new finfo(FILEINFO_MIME_TYPE))->file($f['tmp_name']);
            $head = (string)file_get_contents($f['tmp_name'], false, null, 0, 5);
            if ($mime !== 'application/pdf' || $head !== '%PDF-') throw new RuntimeException('Please upload a PDF file.');
            $all = load_data('newsletters', []);
            $id = $date . '-' . bin2hex(random_bytes(3));
            $dir = UPLOAD_DIR . '/newsletters/' . $id;
            mkdir($dir, 0755, true);
            $pdfName = slugify($title) . '.pdf';
            if (!move_uploaded_file($f['tmp_name'], $dir . '/' . $pdfName)) throw new RuntimeException('The PDF could not be saved. Check that the uploads folder is writable.');
            $all[] = [
                'id' => $id, 'slug' => unique_slug($title, $all), 'title' => $title, 'date' => $date,
                'summary' => post_str('summary', 400), 'pdf' => $pdfName, 'pages' => [], 'cover' => '',
                'text' => '', 'published' => false, 'created' => date('c'),
                'publish_when_ready' => !empty($_POST['published']),
            ];
            save_data('newsletters', $all);
            json_out(['ok' => true, 'id' => $id]);

        /* step 2: each rendered page image */
        case 'nl_page':
            $id = post_str('id', 40);
            $n = (int)($_POST['n'] ?? 0);
            if (!preg_match('/^[0-9a-f-]+$/', $id) || $n < 1 || $n > 60) throw new RuntimeException('Invalid page.');
            $dir = UPLOAD_DIR . '/newsletters/' . $id;
            if (!is_dir($dir)) throw new RuntimeException('Newsletter not found.');
            $name = save_uploaded_image($_FILES['page'] ?? [], $dir, sprintf('page-%02d', $n), 1400, 2400);
            json_out(['ok' => true, 'file' => $name]);

        /* step 3: finish – attach pages, text and publish */
        case 'nl_finish':
            $id = post_str('id', 40);
            $all = load_data('newsletters', []);
            foreach ($all as &$nl) {
                if ($nl['id'] !== $id) continue;
                $pages = json_decode((string)($_POST['pages'] ?? '[]'), true);
                $pages = array_values(array_filter(is_array($pages) ? $pages : [], fn($p) => is_string($p) && preg_match('/^page-\d{2}-[0-9a-f]{8}\.(jpg|png|webp)$/', $p) && is_file(UPLOAD_DIR . '/newsletters/' . $id . '/' . $p)));
                $nl['pages'] = $pages;
                $nl['cover'] = $pages[0] ?? '';
                $nl['text'] = trim(mb_substr((string)($_POST['text'] ?? ''), 0, 200000));
                if ($nl['summary'] === '' && $nl['text'] !== '') {
                    $plain = preg_replace('/\s+/', ' ', $nl['text']);
                    $nl['summary'] = mb_substr($plain, 0, 180) . (mb_strlen($plain) > 180 ? '…' : '');
                }
                $nl['published'] = !empty($nl['publish_when_ready']);
                unset($nl['publish_when_ready']);
                save_data('newsletters', $all);
                flash('Newsletter "' . $nl['title'] . '" ' . ($nl['published'] ? 'is published.' : 'is saved as a draft.'));
                json_out(['ok' => true, 'url' => url('newsletters/' . $nl['slug'])]);
            }
            unset($nl);
            throw new RuntimeException('Newsletter not found.');

        case 'nl_update':
            $id = post_str('id', 40);
            $all = load_data('newsletters', []);
            foreach ($all as &$nl) {
                if ($nl['id'] !== $id) continue;
                $title = post_str('title', 150);
                if ($title === '') throw new RuntimeException('Please enter a title.');
                if ($title !== $nl['title']) $nl['slug'] = unique_slug($title, $all, $id);
                $nl['title'] = $title;
                $d = post_str('date', 10);
                if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $d)) $nl['date'] = $d;
                $nl['summary'] = post_str('summary', 400);
                $nl['published'] = !empty($_POST['published']);
            }
            unset($nl);
            save_data('newsletters', $all);
            flash('Newsletter updated.');
            redirect_to(admin_url('newsletters'));

        case 'nl_delete':
            $id = post_str('id', 40);
            $all = load_data('newsletters', []);
            $all = array_values(array_filter($all, function ($nl) use ($id) {
                if ($nl['id'] === $id && preg_match('/^[0-9a-f-]+$/', $id)) {
                    rrmdir(UPLOAD_DIR . '/newsletters/' . $id);
                    return false;
                }
                return true;
            }));
            save_data('newsletters', $all);
            flash('Newsletter deleted.');
            redirect_to(admin_url('newsletters'));

        /* ----- Messages ----- */
        case 'msg_read':
        case 'msg_delete':
            $id = post_str('id', 20);
            $msgs = load_data('messages', []);
            foreach ($msgs as $i => $m) {
                if ($m['id'] === $id) {
                    if ($action === 'msg_delete') unset($msgs[$i]); else $msgs[$i]['read'] = true;
                }
            }
            save_data('messages', array_values($msgs));
            redirect_to(admin_url('messages'));

        /* ----- Settings ----- */
        case 'settings_save':
            $s = load_data('settings', []);
            foreach (['phone' => 30, 'whatsapp' => 20, 'email' => 150, 'contact_to' => 150, 'hours' => 60, 'google_reviews_url' => 300, 'facebook_url' => 300, 'info_officer' => 100] as $k => $max) {
                $s[$k] = post_str($k, $max);
            }
            foreach (['email', 'contact_to'] as $k) {
                if (!filter_var($s[$k], FILTER_VALIDATE_EMAIL)) throw new RuntimeException('Please enter a valid email address.');
            }
            foreach (['google_reviews_url', 'facebook_url'] as $k) {
                if ($s[$k] !== '' && !preg_match('#^https://#i', $s[$k])) throw new RuntimeException('Links must start with https://');
            }
            $digits = preg_replace('/\D/', '', $s['phone']);
            $s['phone_intl'] = '+27' . ltrim(str_starts_with($digits, '27') ? substr($digits, 2) : $digits, '0');
            $s['whatsapp'] = preg_replace('/\D/', '', $s['whatsapp']);
            if (str_starts_with($s['whatsapp'], '0')) $s['whatsapp'] = '27' . substr($s['whatsapp'], 1);
            save_data('settings', $s);
            flash('Settings saved.');
            redirect_to(admin_url('settings'));

        case 'integrations_save':
            $s = load_data('settings', []);
            $ga = strtoupper(post_str('ga4_id', 20));
            if ($ga !== '' && !preg_match('/^G-[A-Z0-9]{4,15}$/', $ga)) throw new RuntimeException('The Google Analytics ID looks like G-ABC123XYZ. Find it in Google Analytics › Admin › Data streams.');
            $s['ga4_id'] = $ga;
            $gsc = post_str('gsc_verification', 300);
            if (preg_match('/content=["\']([^"\']+)["\']/', $gsc, $m)) $gsc = $m[1]; // accept the whole meta tag
            $s['gsc_verification'] = preg_replace('/[^A-Za-z0-9_\-]/', '', $gsc);
            $s['turnstile_site'] = preg_replace('/[^A-Za-z0-9_\-]/', '', post_str('turnstile_site', 100));
            $newSecret = preg_replace('/[^A-Za-z0-9_\-]/', '', post_str('turnstile_secret', 100));
            if ($newSecret !== '') $s['turnstile_secret'] = $newSecret;          // blank = keep the saved secret
            if (!empty($_POST['clear_turnstile'])) { $s['turnstile_site'] = ''; $s['turnstile_secret'] = ''; }
            if (($s['turnstile_site'] === '') !== (($s['turnstile_secret'] ?? '') === '')) {
                save_data('settings', $s);
                throw new RuntimeException('Saved, but the spam check only switches on when both Turnstile keys are filled in.');
            }
            save_data('settings', $s);
            flash('Analytics and spam protection saved.');
            redirect_to(admin_url('settings') . '#integrations');

        case 'seo_save':
            $all = load_data('seo', []);
            foreach (seo_pages() as $path => $d) {
                $key = $path === '' ? 'home' : rtrim($path, '/');
                $t = post_str('t_' . $key, 120);
                $ds = post_str('d_' . $key, 300);
                $all[$path] = [
                    'title' => $t === $d['title'] ? '' : $t,
                    'description' => $ds === $d['description'] ? '' : $ds,
                ];
            }
            save_data('seo', $all);
            flash('Page titles and descriptions saved.');
            redirect_to(admin_url('seo'));

        case 'password_save':
            $auth = load_data('auth', []);
            if (!password_verify((string)($_POST['current'] ?? ''), (string)$auth['hash'])) throw new RuntimeException('Your current password is incorrect.');
            $new = (string)($_POST['new'] ?? '');
            if (strlen($new) < 10) throw new RuntimeException('The new password must be at least 10 characters.');
            if ($new !== (string)($_POST['confirm'] ?? '')) throw new RuntimeException('The new passwords do not match.');
            $user = post_str('user', 40);
            if ($user !== '') $auth['user'] = $user;
            $auth['hash'] = password_hash($new, PASSWORD_DEFAULT);
            $auth['changed'] = date('c');
            save_data('auth', $auth);
            $_SESSION['admin'] = $auth['user'];
            flash('Your login details have been changed.');
            redirect_to(admin_url('settings'));
    }
    throw new RuntimeException('Unknown action.');
}

/* ---------------- Views ---------------- */

function admin_head(string $title): void
{ ?>
<!doctype html>
<html lang="en-ZA">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title><?= e($title) ?> – Gehoor in die Moot portal</title>
<link rel="icon" href="<?= e(url('favicon.ico')) ?>">
<link rel="stylesheet" href="<?= e(url('assets/css/site.css')) ?>?v=1">
<link rel="stylesheet" href="<?= e(url('admin/admin.css')) ?>?v=1">
</head>
<body class="admin">
<?php }

function render_login(string $error): void
{
    admin_head('Log in'); ?>
<main class="login-wrap">
  <form class="login-card" method="post" action="<?= e(admin_url()) ?>">
    <img src="<?= e(url('assets/img/logo-full.png')) ?>" alt="Gehoor in die Moot" width="260">
    <h1>Management portal</h1>
<?php if ($error): ?>    <div class="alert err" role="alert"><?= e($error) ?></div><?php endif; ?>
    <?= csrf_field() ?>
    <input type="hidden" name="action" value="login">
    <div class="field"><label for="user">Username</label><input type="text" id="user" name="user" autocomplete="username" required autofocus></div>
    <div class="field"><label for="pass">Password</label><input type="password" id="pass" name="pass" autocomplete="current-password" required></div>
    <button class="btn btn-primary" type="submit">Log in</button>
    <a class="small" href="<?= e(url()) ?>">← Back to the website</a>
  </form>
</main>
</body></html>
<?php }

function admin_shell_start(string $section, string $title): void
{
    admin_head($title);
    $unread = count(array_filter(load_data('messages', []), fn($m) => empty($m['read'])));
    $nav = ['dashboard' => 'Dashboard', 'team' => 'Team', 'images' => 'Images', 'newsletters' => 'Newsletters', 'messages' => 'Messages', 'seo' => 'SEO & sharing', 'settings' => 'Settings'];
    ?>
<header class="admin-top">
  <div class="admin-top-in">
    <a class="admin-brand" href="<?= e(admin_url()) ?>"><img src="<?= e(url('assets/img/logo-mark-white.png')) ?>" alt="" width="34"> Portal</a>
    <nav aria-label="Portal">
<?php foreach ($nav as $k => $label): ?>
      <a href="<?= e(admin_url($k === 'dashboard' ? '' : $k)) ?>"<?= $section === $k ? ' aria-current="page"' : '' ?>><?= e($label) ?><?= $k === 'messages' && $unread ? ' <span class="count">' . $unread . '</span>' : '' ?></a>
<?php endforeach; ?>
    </nav>
    <div class="admin-user">
      <a href="<?= e(url()) ?>" target="_blank" rel="noopener">View site ↗</a>
      <form method="post" action="<?= e(admin_url()) ?>"><?= csrf_field() ?><input type="hidden" name="action" value="logout"><button type="submit">Log out</button></form>
    </div>
  </div>
</header>
<main class="admin-main">
  <h1><?= e($title) ?></h1>
<?php foreach (take_flash() as [$t, $m]): ?>
  <div class="alert <?= $t === 'err' ? 'err' : 'ok' ?>" role="status"><?= e($m) ?></div>
<?php endforeach;
}

function admin_shell_end(): void
{ ?>
</main>
<script src="<?= e(url('admin/admin.js')) ?>?v=1"></script>
</body></html>
<?php }

function view_dashboard(): void
{
    $auth = load_data('auth', []);
    $msgs = load_data('messages', []);
    $unread = count(array_filter($msgs, fn($m) => empty($m['read'])));
    $nls = newsletters(false);
    admin_shell_start('dashboard', 'Welcome, ' . ($_SESSION['admin'] ?? 'Admin'));
    if (empty($auth['changed'])): ?>
  <div class="alert err">For security, please <a href="<?= e(admin_url('settings')) ?>#password">change the starting password</a>.</div>
<?php endif; ?>
  <div class="tiles">
    <a class="tile" href="<?= e(admin_url('messages')) ?>"><strong><?= $unread ?></strong><span>unread messages</span></a>
    <a class="tile" href="<?= e(admin_url('team')) ?>"><strong><?= count(team(false)) ?></strong><span>team members</span></a>
    <a class="tile" href="<?= e(admin_url('newsletters')) ?>"><strong><?= count($nls) ?></strong><span>newsletters</span></a>
    <a class="tile" href="<?= e(admin_url('images')) ?>"><strong><?= count(load_data('images', [])) ?>/<?= count(image_slots()) ?></strong><span>photos uploaded</span></a>
  </div>
  <div class="grid-2" style="margin-top:28px">
    <div class="box">
      <h2>Quick tasks</h2>
      <ul class="quick">
        <li><a href="<?= e(admin_url('newsletters')) ?>#upload">Upload a new newsletter (PDF)</a></li>
        <li><a href="<?= e(admin_url('team', ['edit' => 'new'])) ?>">Add a team member</a></li>
        <li><a href="<?= e(admin_url('images')) ?>">Replace a photo on the website</a></li>
        <li><a href="<?= e(admin_url('settings')) ?>">Add your WhatsApp number</a></li>
      </ul>
    </div>
    <div class="box">
      <h2>Latest messages</h2>
<?php if (!$msgs): ?>      <p class="muted">No messages yet.</p>
<?php else: foreach (array_slice($msgs, 0, 4) as $m): ?>
      <p><strong><?= e($m['name']) ?></strong> · <?= e($m['subject']) ?><br><span class="muted small"><?= e(date('j M Y H:i', strtotime($m['date']))) ?></span></p>
<?php endforeach; endif; ?>
    </div>
  </div>
<?php admin_shell_end();
}

function view_team(): void
{
    $team = team(false);
    $editId = (string)($_GET['edit'] ?? '');
    $edit = null;
    if ($editId === 'new') {
        $edit = ['id' => '', 'name' => '', 'role' => 'Audiologist', 'group' => 'audiologist', 'quals' => '', 'hpcsa' => '', 'bio' => '', 'photo' => '', 'visible' => true];
    } else {
        foreach ($team as $m) if ($m['id'] === $editId) $edit = $m;
    }
    admin_shell_start('team', $edit ? ($edit['id'] ? 'Edit ' . $edit['name'] : 'Add a team member') : 'Team');
    if ($edit):
        $ph = team_photo_url($edit); ?>
  <form class="box form" method="post" enctype="multipart/form-data" action="<?= e(admin_url('team')) ?>">
    <?= csrf_field() ?><input type="hidden" name="action" value="team_save"><input type="hidden" name="id" value="<?= e($edit['id']) ?>">
    <div class="field"><label for="name">Name</label><input type="text" id="name" name="name" required value="<?= e($edit['name']) ?>"></div>
    <div class="field"><label for="role">Role / job title</label><input type="text" id="role" name="role" value="<?= e($edit['role']) ?>"></div>
    <div class="field"><label for="group">Show under</label><select id="group" name="group"><option value="audiologist"<?= $edit['group'] === 'audiologist' ? ' selected' : '' ?>>Audiologists (large profile)</option><option value="support"<?= $edit['group'] === 'support' ? ' selected' : '' ?>>Support team (small profile)</option></select></div>
    <div class="field"><label for="hpcsa">HPCSA registration number</label><input type="text" id="hpcsa" name="hpcsa" value="<?= e($edit['hpcsa']) ?>" placeholder="e.g. AU 0012345"><span class="hint">Shown as a badge. Leave empty for support staff.</span></div>
    <div class="field full"><label for="quals">Qualifications</label><input type="text" id="quals" name="quals" value="<?= e($edit['quals']) ?>" placeholder="e.g. B.Communication Pathology (UP)"></div>
    <div class="field full"><label for="bio">Short introduction (optional)</label><textarea id="bio" name="bio"><?= e($edit['bio']) ?></textarea></div>
    <div class="field full">
      <label for="photo">Photo</label>
      <div class="photo-row">
        <?= $ph ? '<img src="' . e($ph) . '" alt="" class="thumb">' : '<span class="thumb empty">No photo</span>' ?>
        <div><input type="file" id="photo" name="photo" accept="image/jpeg,image/png,image/webp"><span class="hint">A portrait photo works best. It's resized automatically.</span>
<?php if ($ph): ?>        <label class="consent"><input type="checkbox" name="remove_photo" value="1"> Remove the current photo</label><?php endif; ?>
        </div>
      </div>
    </div>
    <label class="consent full"><input type="checkbox" name="visible" value="1"<?= !empty($edit['visible']) ? ' checked' : '' ?>> Show on the website</label>
    <div class="full btn-row"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-outline" href="<?= e(admin_url('team')) ?>">Cancel</a></div>
  </form>
<?php else: ?>
  <p class="muted">These people appear on the About us page (and audiologists on the homepage). Use the arrows to change the order.</p>
  <p><a class="btn btn-primary" href="<?= e(admin_url('team', ['edit' => 'new'])) ?>">+ Add a team member</a></p>
  <div class="list">
<?php foreach ($team as $i => $m): $ph = team_photo_url($m); ?>
    <div class="row">
      <?= $ph ? '<img src="' . e($ph) . '" alt="" class="thumb sm">' : '<span class="thumb sm empty"></span>' ?>
      <div class="grow"><strong><?= e($m['name']) ?></strong><?= empty($m['visible']) ? ' <span class="tag">Hidden</span>' : '' ?><br><span class="muted small"><?= e($m['role']) ?><?= $m['hpcsa'] ? ' · HPCSA ' . e($m['hpcsa']) : ($m['group'] === 'audiologist' ? ' · <em>HPCSA number missing</em>' : '') ?></span></div>
      <form method="post" action="<?= e(admin_url('team')) ?>"><?= csrf_field() ?><input type="hidden" name="action" value="team_move"><input type="hidden" name="id" value="<?= e($m['id']) ?>"><input type="hidden" name="dir" value="up"><button class="icon-btn" type="submit" aria-label="Move <?= e($m['name']) ?> up"<?= $i === 0 ? ' disabled' : '' ?>>↑</button></form>
      <form method="post" action="<?= e(admin_url('team')) ?>"><?= csrf_field() ?><input type="hidden" name="action" value="team_move"><input type="hidden" name="id" value="<?= e($m['id']) ?>"><input type="hidden" name="dir" value="down"><button class="icon-btn" type="submit" aria-label="Move <?= e($m['name']) ?> down"<?= $i === count($team) - 1 ? ' disabled' : '' ?>>↓</button></form>
      <a class="btn btn-outline sm" href="<?= e(admin_url('team', ['edit' => $m['id']])) ?>">Edit</a>
      <form method="post" action="<?= e(admin_url('team')) ?>" data-confirm="Remove <?= e($m['name']) ?> from the website?"><?= csrf_field() ?><input type="hidden" name="action" value="team_delete"><input type="hidden" name="id" value="<?= e($m['id']) ?>"><button class="btn btn-danger sm" type="submit">Delete</button></form>
    </div>
<?php endforeach; ?>
  </div>
<?php endif;
    admin_shell_end();
}

function view_images(): void
{
    admin_shell_start('images', 'Website images');
    $data = load_data('images', []);
    $groups = [];
    foreach (image_slots() as $k => $s) $groups[$s['group']][$k] = $s;
    ?>
  <p class="muted">Every photo and logo on the website is listed here. Upload a new picture to replace it. Images are resized and optimised automatically. Always add a short description: it helps people using screen readers, and Google.</p>
<?php foreach ($groups as $g => $slots): ?>
  <h2 class="group-h"><?= e($g) ?></h2>
  <div class="slot-grid">
<?php foreach ($slots as $k => $s): $src = image_url($k); $custom = !empty($data[$k]['file']); ?>
    <form class="slot" id="slot-<?= e($k) ?>" method="post" enctype="multipart/form-data" action="<?= e(admin_url('images')) ?>">
      <?= csrf_field() ?><input type="hidden" name="action" value="image_save"><input type="hidden" name="slot" value="<?= e($k) ?>">
      <div class="slot-img<?= str_starts_with($k, 'logo_footer') ? ' dark' : '' ?>"><?= $src ? '<img src="' . e($src) . '" alt="">' : '<span>No photo yet<br><small>a soft placeholder is shown</small></span>' ?></div>
      <strong><?= e($s['label']) ?></strong>
      <span class="hint">Best size: <?= e($s['size']) ?></span>
      <label class="sr" for="f-<?= e($k) ?>">New image for <?= e($s['label']) ?></label>
      <input type="file" id="f-<?= e($k) ?>" name="image" accept="image/jpeg,image/png,image/webp">
      <label class="hint" for="a-<?= e($k) ?>">Description (alt text)</label>
      <input type="text" id="a-<?= e($k) ?>" name="alt" value="<?= e($data[$k]['alt'] ?? '') ?>" placeholder="e.g. Dr René Hornby testing a patient's hearing">
      <div class="btn-row"><button class="btn btn-primary sm" type="submit">Save</button>
<?php if ($custom): ?>        <button class="btn btn-outline sm" type="submit" name="action" value="image_reset" formnovalidate data-confirm-btn="Remove this image?">Remove</button><?php endif; ?>
      </div>
    </form>
<?php endforeach; ?>
  </div>
<?php endforeach;
    admin_shell_end();
}

function view_newsletters(): void
{
    $all = newsletters(false);
    $editId = (string)($_GET['edit'] ?? '');
    admin_shell_start('newsletters', 'Newsletters');
    foreach ($all as $n) {
        if ($n['id'] !== $editId) continue; ?>
  <form class="box form" method="post" action="<?= e(admin_url('newsletters')) ?>">
    <?= csrf_field() ?><input type="hidden" name="action" value="nl_update"><input type="hidden" name="id" value="<?= e($n['id']) ?>">
    <h2 class="full">Edit "<?= e($n['title']) ?>"</h2>
    <div class="field"><label for="t">Title</label><input type="text" id="t" name="title" required value="<?= e($n['title']) ?>"></div>
    <div class="field"><label for="d">Date</label><input type="date" id="d" name="date" value="<?= e($n['date']) ?>"></div>
    <div class="field full"><label for="sm">Short summary (shown on the newsletter list and in Google)</label><textarea id="sm" name="summary" style="min-height:90px"><?= e($n['summary']) ?></textarea></div>
    <label class="consent full"><input type="checkbox" name="published" value="1"<?= !empty($n['published']) ? ' checked' : '' ?>> Published (visible on the website)</label>
    <div class="full btn-row"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-outline" href="<?= e(admin_url('newsletters')) ?>">Cancel</a></div>
  </form>
<?php
        admin_shell_end();
        return;
    } ?>
  <section class="box" id="upload">
    <h2>Upload a new newsletter</h2>
    <p class="muted">Choose the PDF and give it a title. The portal turns every page into an image on the branded newsletter page, keeps the PDF for downloading, and reads the text so Google can find it. Allow a minute for longer newsletters.</p>
    <form id="nl-form" class="form" method="post" enctype="multipart/form-data" action="<?= e(admin_url('newsletters')) ?>">
      <?= csrf_field() ?><input type="hidden" name="action" value="nl_create">
      <div class="field"><label for="nl-title">Title</label><input type="text" id="nl-title" name="title" required placeholder="e.g. Winter 2026: protecting your hearing"></div>
      <div class="field"><label for="nl-date">Date</label><input type="date" id="nl-date" name="date" value="<?= e(date('Y-m-d')) ?>"></div>
      <div class="field full"><label for="nl-pdf">PDF file</label><input type="file" id="nl-pdf" name="pdf" accept="application/pdf" required><span class="hint">Up to 30 MB and 40 pages.</span></div>
      <div class="field full"><label for="nl-sum">Short summary (optional: if left empty, the opening text of the PDF is used)</label><textarea id="nl-sum" name="summary" style="min-height:80px"></textarea></div>
      <label class="consent full"><input type="checkbox" name="published" value="1" checked> Publish on the website straight away</label>
      <div class="full"><button class="btn btn-primary" type="submit">Upload newsletter</button></div>
      <div class="full progress" id="nl-progress" hidden><div class="bar"><span></span></div><p class="small" role="status" aria-live="polite"></p></div>
    </form>
  </section>
  <h2 class="group-h">All newsletters</h2>
<?php if (!$all): ?>  <p class="muted">No newsletters yet.</p><?php endif; ?>
  <div class="list">
<?php foreach ($all as $n): ?>
    <div class="row">
      <?= !empty($n['cover']) ? '<img class="thumb sm doc" src="' . e(url('uploads/newsletters/' . $n['id'] . '/' . $n['cover'])) . '" alt="">' : '<span class="thumb sm empty"></span>' ?>
      <div class="grow"><strong><?= e($n['title']) ?></strong> <?= empty($n['published']) ? '<span class="tag">Draft</span>' : '' ?><br><span class="muted small"><?= e(format_date($n['date'])) ?> · <?= count($n['pages'] ?? []) ?> pages</span></div>
      <a class="btn btn-outline sm" href="<?= e(url('newsletters/' . $n['slug'])) ?>" target="_blank" rel="noopener">View</a>
      <a class="btn btn-outline sm" href="<?= e(admin_url('newsletters', ['edit' => $n['id']])) ?>">Edit</a>
      <form method="post" action="<?= e(admin_url('newsletters')) ?>" data-confirm="Delete this newsletter permanently?"><?= csrf_field() ?><input type="hidden" name="action" value="nl_delete"><input type="hidden" name="id" value="<?= e($n['id']) ?>"><button class="btn btn-danger sm" type="submit">Delete</button></form>
    </div>
<?php endforeach; ?>
  </div>
  <script src="<?= e(url('admin/vendor/pdf.min.js')) ?>"></script>
  <script>window.PDFJS_WORKER = <?= json_encode(url('admin/vendor/pdf.worker.min.js')) ?>;</script>
<?php admin_shell_end();
}

function view_messages(): void
{
    $msgs = load_data('messages', []);
    admin_shell_start('messages', 'Messages from the website');
    ?>
  <p class="muted">Every contact form message is emailed to <strong><?= e(setting('contact_to')) ?></strong> and also kept here, so nothing is lost if an email lands in spam. Please delete messages you no longer need (POPIA).</p>
<?php if (!$msgs): ?>  <p class="muted">No messages yet.</p><?php endif; ?>
<?php foreach ($msgs as $m): ?>
  <article class="box msg<?= empty($m['read']) ? ' unread' : '' ?>">
    <div class="msg-head">
      <div><strong><?= e($m['name']) ?></strong> · <?= e($m['subject']) ?><br>
        <span class="small"><a href="mailto:<?= e($m['email']) ?>?subject=<?= rawurlencode('Re: ' . $m['subject']) ?>"><?= e($m['email']) ?></a><?= $m['phone'] ? ' · <a href="tel:' . e(preg_replace('/[^0-9+]/', '', $m['phone'])) . '">' . e($m['phone']) . '</a>' : '' ?> · <?= e($m['practice']) ?> · <?= e($m['lang']) ?></span></div>
      <span class="muted small"><?= e(date('j M Y, H:i', strtotime($m['date']))) ?><?= empty($m['emailed']) ? ' · <span class="tag warn">Email not sent</span>' : '' ?></span>
    </div>
    <p class="msg-body"><?= nl2br(e($m['message'])) ?></p>
    <div class="btn-row">
<?php if (empty($m['read'])): ?>      <form method="post" action="<?= e(admin_url('messages')) ?>"><?= csrf_field() ?><input type="hidden" name="action" value="msg_read"><input type="hidden" name="id" value="<?= e($m['id']) ?>"><button class="btn btn-outline sm" type="submit">Mark as read</button></form><?php endif; ?>
      <form method="post" action="<?= e(admin_url('messages')) ?>" data-confirm="Delete this message?"><?= csrf_field() ?><input type="hidden" name="action" value="msg_delete"><input type="hidden" name="id" value="<?= e($m['id']) ?>"><button class="btn btn-danger sm" type="submit">Delete</button></form>
    </div>
  </article>
<?php endforeach;
    admin_shell_end();
}

function view_settings(): void
{
    $s = settings();
    $auth = load_data('auth', []);
    admin_shell_start('settings', 'Settings');
    ?>
  <form class="box form" method="post" action="<?= e(admin_url('settings')) ?>">
    <?= csrf_field() ?><input type="hidden" name="action" value="settings_save">
    <h2 class="full">Contact details on the website</h2>
    <div class="field"><label for="phone">Phone number</label><input type="text" id="phone" name="phone" value="<?= e($s['phone']) ?>"></div>
    <div class="field"><label for="whatsapp">WhatsApp number</label><input type="text" id="whatsapp" name="whatsapp" value="<?= e($s['whatsapp']) ?>" placeholder="e.g. 082 123 4567"><span class="hint">WhatsApp buttons appear across the site once this is filled in.</span></div>
    <div class="field"><label for="email">Email shown on the website</label><input type="email" id="email" name="email" value="<?= e($s['email']) ?>"></div>
    <div class="field"><label for="contact_to">Contact form messages go to</label><input type="email" id="contact_to" name="contact_to" value="<?= e($s['contact_to']) ?>"></div>
    <div class="field"><label for="hours">Office hours</label><input type="text" id="hours" name="hours" value="<?= e($s['hours']) ?>"></div>
    <div class="field"><label for="g">Google reviews link</label><input type="text" id="g" name="google_reviews_url" value="<?= e($s['google_reviews_url']) ?>" placeholder="https://g.page/…"></div>
    <div class="field"><label for="fb">Facebook page</label><input type="text" id="fb" name="facebook_url" value="<?= e($s['facebook_url']) ?>" placeholder="https://facebook.com/…"></div>
    <div class="field"><label for="io">Information Officer (POPIA)</label><input type="text" id="io" name="info_officer" value="<?= e($s['info_officer']) ?>"><span class="hint">Shown in the privacy policy.</span></div>
    <div class="full"><button class="btn btn-primary" type="submit">Save settings</button></div>
  </form>

  <form class="box form" id="integrations" method="post" action="<?= e(admin_url('settings')) ?>" style="margin-top:24px">
    <?= csrf_field() ?><input type="hidden" name="action" value="integrations_save">
    <h2 class="full">Analytics &amp; spam protection</h2>
    <div class="field"><label for="ga">Google Analytics 4 Measurement ID</label><input type="text" id="ga" name="ga4_id" value="<?= e($s['ga4_id']) ?>" placeholder="G-XXXXXXXXXX"><span class="hint">Analytics only runs for visitors who accept cookies. Tracks page views, appointment-button clicks, calls, WhatsApp and contact form sends.</span></div>
    <div class="field"><label for="gsc">Google Search Console verification</label><input type="text" id="gsc" name="gsc_verification" value="<?= e($s['gsc_verification']) ?>" placeholder="Paste the code or the whole meta tag"></div>
    <div class="field"><label for="tss">Cloudflare Turnstile site key (optional)</label><input type="text" id="tss" name="turnstile_site" value="<?= e($s['turnstile_site']) ?>"><span class="hint">Adds a free "I am human" check to the contact form. Spam is already filtered without it.</span></div>
    <div class="field"><label for="tsk">Cloudflare Turnstile secret key</label><input type="password" id="tsk" name="turnstile_secret" autocomplete="off" placeholder="<?= secret_setting('turnstile_secret') !== '' ? 'Saved – leave blank to keep' : 'Paste the secret key' ?>"><span class="hint">Stored on the server only. It is never shown again or sent to visitors' browsers.</span></div>
<?php if ($s['turnstile_site'] !== ''): ?>    <label class="consent full"><input type="checkbox" name="clear_turnstile" value="1"> Switch off Turnstile and delete both keys</label><?php endif; ?>
    <div class="full"><button class="btn btn-primary" type="submit">Save</button></div>
  </form>

  <form class="box form" id="password" method="post" action="<?= e(admin_url('settings')) ?>" style="margin-top:24px">
    <?= csrf_field() ?><input type="hidden" name="action" value="password_save">
    <h2 class="full">Change your login</h2>
    <div class="field"><label for="u">Username</label><input type="text" id="u" name="user" autocomplete="username" value="<?= e($auth['user'] ?? 'Admin') ?>"></div>
    <div class="field"><label for="cur">Current password</label><input type="password" id="cur" name="current" autocomplete="current-password" required></div>
    <div class="field"><label for="new">New password (at least 10 characters)</label><input type="password" id="new" name="new" autocomplete="new-password" minlength="10" required></div>
    <div class="field"><label for="conf">Repeat new password</label><input type="password" id="conf" name="confirm" autocomplete="new-password" minlength="10" required></div>
    <div class="full"><button class="btn btn-primary" type="submit">Change login</button></div>
  </form>
<?php
    admin_shell_end();
}

function view_seo(): void
{
    $over = load_data('seo', []);
    admin_shell_start('seo', 'SEO & social sharing');
    ?>
  <p class="muted">These are the titles and descriptions Google shows in search results, and that appear when someone shares a page on WhatsApp, Facebook or LinkedIn. Keep titles under 60 characters and descriptions under 155. Leave a box unchanged to keep the recommended text. To use your own sharing picture, upload it under <a href="<?= e(admin_url('images')) ?>#slot-share_default">Images › SEO &amp; sharing</a>.</p>
  <form method="post" action="<?= e(admin_url('seo')) ?>" class="seo-list">
    <?= csrf_field() ?><input type="hidden" name="action" value="seo_save">
<?php foreach (seo_pages() as $path => $d):
        $key = $path === '' ? 'home' : rtrim($path, '/');
        $f = seo_for($path);
        $link = abs_url($path); ?>
    <section class="box seo-item">
      <h2><?= e($d['label']) ?> <span class="muted small">/<?= e($path) ?></span></h2>
      <div class="seo-grid">
        <div class="seo-fields">
          <div class="field"><label for="t_<?= e($key) ?>">Meta title</label><input type="text" id="t_<?= e($key) ?>" name="t_<?= e($key) ?>" value="<?= e($f['title']) ?>" maxlength="120" data-count="60" data-preview-title="<?= e($key) ?>"><span class="hint counter"></span></div>
          <div class="field"><label for="d_<?= e($key) ?>">Meta description</label><textarea id="d_<?= e($key) ?>" name="d_<?= e($key) ?>" maxlength="300" data-count="155" data-preview-desc="<?= e($key) ?>" style="min-height:90px"><?= e($f['description']) ?></textarea><span class="hint counter"></span></div>
        </div>
        <div class="seo-previews">
          <div class="g-preview" aria-label="Google preview">
            <span class="g-url"><?= e(preg_replace('#^https?://#', '', rtrim($link, '/'))) ?></span>
            <span class="g-title" data-pt="<?= e($key) ?>"><?= e($f['title']) ?></span>
            <span class="g-desc" data-pd="<?= e($key) ?>"><?= e($f['description']) ?></span>
          </div>
          <div class="s-preview" aria-label="Social media preview">
            <img src="<?= e($f['image']) ?>" alt="" loading="lazy">
            <div><span class="s-host"><?= e(strtoupper(preg_replace('#^https?://([^/]+).*#', '$1', $link))) ?></span><strong data-pt="<?= e($key) ?>"><?= e($f['title']) ?></strong><span data-pd="<?= e($key) ?>"><?= e($f['description']) ?></span></div>
          </div>
        </div>
      </div>
    </section>
<?php endforeach; ?>
    <div class="save-bar"><button class="btn btn-primary" type="submit">Save all titles and descriptions</button></div>
  </form>
<?php
    admin_shell_end();
}

match ($section) {
    'seo' => view_seo(),
    'team' => view_team(),
    'images' => view_images(),
    'newsletters' => view_newsletters(),
    'messages' => view_messages(),
    'settings' => view_settings(),
    default => view_dashboard(),
};
