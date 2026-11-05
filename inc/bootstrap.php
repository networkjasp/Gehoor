<?php
/**
 * Gehoor in die Moot – core bootstrap.
 * Loads settings, data helpers, security helpers and image slots.
 */
declare(strict_types=1);

date_default_timezone_set('Africa/Johannesburg');
define('ROOT', dirname(__DIR__));
define('DATA_DIR', ROOT . '/data');
define('UPLOAD_DIR', ROOT . '/uploads');

// Base URL path (supports installs in a sub-folder).
(function () {
    $docRoot = realpath($_SERVER['DOCUMENT_ROOT'] ?? '') ?: '';
    $root = realpath(ROOT) ?: ROOT;
    $base = '';
    if ($docRoot !== '' && str_starts_with($root, $docRoot)) {
        $base = str_replace('\\', '/', substr($root, strlen($docRoot)));
    }
    define('BASE', rtrim($base, '/'));
})();

function is_https(): bool
{
    return (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off')
        || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https')
        || (($_SERVER['SERVER_PORT'] ?? '') === '443');
}

function site_origin(): string
{
    $host = $_SERVER['HTTP_HOST'] ?? 'gehoorindiemoot.co.za';
    $host = preg_replace('/[^A-Za-z0-9.:-]/', '', $host);
    return (is_https() ? 'https://' : 'http://') . $host;
}

/**
 * Server-only configuration (inc/config.php – never committed to Git, never sent to the browser).
 */
function config(string $key, $default = null)
{
    static $c = null;
    if ($c === null) {
        $file = __DIR__ . '/config.php';
        $c = is_file($file) ? (array)(require $file) : [];
    }
    return $c[$key] ?? $default;
}

function is_local_host(): bool
{
    $h = strtolower((string)preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? ''));
    return $h === '' || $h === 'localhost' || $h === '127.0.0.1' || $h === '[::1]' || str_ends_with($h, '.localhost') || str_ends_with($h, '.test');
}

/** Force HTTPS in PHP too (covers hosts where .htaccess rules are ignored, e.g. Nginx). */
function enforce_https(): void
{
    if (PHP_SAPI === 'cli' || !config('force_https', true) || is_local_host()) {
        return;
    }
    if (!is_https()) {
        $host = preg_replace('/[^A-Za-z0-9.:-]/', '', (string)($_SERVER['HTTP_HOST'] ?? ''));
        header('Location: https://' . $host . ($_SERVER['REQUEST_URI'] ?? '/'), true, 301);
        exit;
    }
    header('Strict-Transport-Security: max-age=31536000');
}
enforce_https();

/** Relative URL inside the site. */
function url(string $path = ''): string
{
    return BASE . '/' . ltrim($path, '/');
}

/** Absolute URL (for canonical, sitemap, Open Graph). */
function abs_url(string $path = ''): string
{
    return site_origin() . url($path);
}

function e(?string $s): string
{
    return htmlspecialchars((string)$s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/* ---------- Data storage (JSON inside PHP files so they can never be downloaded) ---------- */

function data_path(string $name): string
{
    return DATA_DIR . '/' . preg_replace('/[^a-z0-9_-]/', '', $name) . '.json.php';
}

function load_data(string $name, $default = [])
{
    $file = data_path($name);
    if (!is_file($file)) {
        return $default;
    }
    $raw = (string)file_get_contents($file);
    $raw = preg_replace('/^<\?php[^\n]*\n/', '', $raw);
    $data = json_decode($raw, true);
    return is_array($data) ? $data : $default;
}

function save_data(string $name, $data): void
{
    if (!is_dir(DATA_DIR)) {
        mkdir(DATA_DIR, 0750, true);
    }
    $file = data_path($name);
    $tmp = $file . '.' . bin2hex(random_bytes(4)) . '.tmp';
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    file_put_contents($tmp, "<?php http_response_code(404); exit; ?>\n" . $json, LOCK_EX);
    rename($tmp, $file);
}

/* ---------- Settings ---------- */

function default_settings(): array
{
    return [
        'practice_name' => 'Gehoor in die Moot',
        'legal_name'    => 'Dr René Hornby Inc.',
        'phone'         => '012 331 4469',
        'phone_intl'    => '+27123314469',
        'whatsapp'      => '',               // e.g. 27821234567 – button hidden while empty
        'email'         => 'admin@gehoorindiemoot.co.za',
        'contact_to'    => 'admin@gehoorindiemoot.co.za',
        'hours'         => 'Mon–Fri 08:00–16:30',
        'practice_no'   => 'PR 8212155',
        'company_reg'   => '2019/150857/21',
        'google_reviews_url' => '',
        'facebook_url'  => '',
        'info_officer'  => 'Dr René Hornby',
        'ga4_id'        => '',               // Google Analytics 4 Measurement ID, e.g. G-XXXXXXXXXX (public by design)
        'gsc_verification' => '',            // Google Search Console verification code (public by design)
        'turnstile_site'   => '',            // Cloudflare Turnstile site key (public by design)
        'turnstile_secret' => '',            // Cloudflare Turnstile SECRET key – server-side only, never output
    ];
}

function settings(): array
{
    static $s = null;
    if ($s === null) {
        $s = array_merge(default_settings(), load_data('settings', []));
    }
    return $s;
}

/** Keys that must never be printed into a page. */
const SECRET_SETTINGS = ['turnstile_secret'];

function setting(string $key): string
{
    if (in_array($key, SECRET_SETTINGS, true)) {
        throw new LogicException('Secret settings must be read with secret_setting().');
    }
    return (string)(settings()[$key] ?? '');
}

function secret_setting(string $key): string
{
    return (string)(settings()[$key] ?? '');
}

/* ---------- Practices (fixed content) ---------- */

function practices(): array
{
    return [
        'rietfontein' => [
            'name'    => 'Rietfontein',
            'street'  => '536 18th Avenue',
            'area'    => 'Rietfontein',
            'city'    => 'Pretoria',
            'code'    => '0084',
            'note'    => 'Secure on-site parking · Wheelchair-friendly',
            'map'     => 'https://www.google.com/maps/search/?api=1&query=536+18th+Avenue+Rietfontein+Pretoria+0084',
            'embed'   => 'https://www.google.com/maps?q=536+18th+Avenue,+Rietfontein,+Pretoria,+0084&output=embed',
            'image'   => 'practice_rietfontein',
        ],
        'lesmarais' => [
            'name'    => 'Les Marais',
            'street'  => '663 5th Avenue',
            'area'    => 'Les Marais',
            'city'    => 'Pretoria',
            'code'    => '0084',
            'note'    => 'Across from Life Eugene Marais Hospital · Newborn screening',
            'map'     => 'https://www.google.com/maps/search/?api=1&query=663+5th+Avenue+Les+Marais+Pretoria+0084',
            'embed'   => 'https://www.google.com/maps?q=663+5th+Avenue,+Les+Marais,+Pretoria,+0084&output=embed',
            'image'   => 'practice_lesmarais',
        ],
    ];
}

/* ---------- Image slots (managed in the portal) ---------- */

function image_slots(): array
{
    return [
        'logo_header'        => ['label' => 'Header logo', 'group' => 'Brand', 'default' => 'assets/img/logo-full.png', 'size' => 'Transparent PNG, about 1200×320'],
        'logo_footer'        => ['label' => 'Footer logo (white)', 'group' => 'Brand', 'default' => 'assets/img/logo-mark-white.png', 'size' => 'White transparent PNG'],
        'home_hero'          => ['label' => 'Homepage – main photo', 'group' => 'Home', 'default' => '', 'size' => 'Portrait or square, 1200×1300'],
        'home_visit'         => ['label' => 'Homepage – first visit photo', 'group' => 'Home', 'default' => '', 'size' => 'Landscape, 1400×1000'],
        'member_audiologysa' => ['label' => 'Member of – Audiology SA logo', 'group' => 'Home', 'default' => '', 'size' => 'Transparent PNG, square'],
        'member_ican'        => ['label' => 'Member of – iCAN logo', 'group' => 'Home', 'default' => '', 'size' => 'Transparent PNG, square'],
        'services_hero'      => ['label' => 'Services – header photo', 'group' => 'Services', 'default' => '', 'size' => 'Landscape, 1600×1000'],
        'service_tests'      => ['label' => 'Services – hearing tests', 'group' => 'Services', 'default' => '', 'size' => 'Landscape, 1200×800'],
        'service_tinnitus'   => ['label' => 'Services – tinnitus', 'group' => 'Services', 'default' => '', 'size' => 'Landscape, 1200×800'],
        'service_protection' => ['label' => 'Services – ear protection & swim plugs', 'group' => 'Services', 'default' => '', 'size' => 'Landscape, 1200×800'],
        'about_hero'         => ['label' => 'About us – team photo', 'group' => 'About us', 'default' => '', 'size' => 'Landscape, 1600×1000'],
        'about_community'    => ['label' => 'About us – serving the community', 'group' => 'About us', 'default' => '', 'size' => 'Landscape, 1200×800'],
        'hearingaids_hero'   => ['label' => 'Hearing aids – header photo', 'group' => 'Hearing aids', 'default' => '', 'size' => 'Landscape, 1600×1000'],
        'hearingaids_styles' => ['label' => 'Hearing aids – styles photo', 'group' => 'Hearing aids', 'default' => '', 'size' => 'Landscape, 1200×800'],
        'children_hero'      => ['label' => 'Babies & children – header photo', 'group' => 'Babies & children', 'default' => '', 'size' => 'Landscape, 1600×1000'],
        'children_newborn'   => ['label' => 'Babies & children – newborn screening', 'group' => 'Babies & children', 'default' => '', 'size' => 'Landscape, 1200×800'],
        'medicalaid_hero'    => ['label' => 'Medical aid – header photo', 'group' => 'Medical aid', 'default' => '', 'size' => 'Landscape, 1600×1000'],
        'practice_rietfontein' => ['label' => 'Contact – Rietfontein entrance', 'group' => 'Contact', 'default' => '', 'size' => 'Landscape, 1200×800'],
        'practice_lesmarais' => ['label' => 'Contact – Les Marais entrance', 'group' => 'Contact', 'default' => '', 'size' => 'Landscape, 1200×800'],
        'share_default'      => ['label' => 'Social sharing image (optional – replaces the automatic ones)', 'group' => 'SEO & sharing', 'default' => '', 'size' => 'Exactly 1200×630, JPG'],
    ];
}

function image_data(): array
{
    static $d = null;
    if ($d === null) {
        $d = load_data('images', []);
    }
    return $d;
}

/** URL of the current image for a slot, or '' if none. */
function image_url(string $slot): string
{
    $d = image_data()[$slot] ?? null;
    if ($d && !empty($d['file']) && is_file(UPLOAD_DIR . '/images/' . $d['file'])) {
        return url('uploads/images/' . rawurlencode($d['file'])) . '?v=' . (int)($d['updated'] ?? 0);
    }
    $def = image_slots()[$slot]['default'] ?? '';
    return $def ? url($def) : '';
}

function image_alt(string $slot, string $fallback = ''): string
{
    $d = image_data()[$slot] ?? null;
    return (string)(($d['alt'] ?? '') !== '' ? $d['alt'] : $fallback);
}

/**
 * Render an image slot. Shows a soft branded placeholder when no photo is uploaded yet.
 */
function slot_img(string $slot, string $class = '', string $fallbackAlt = '', bool $lazy = true, string $ratio = ''): string
{
    $src = image_url($slot);
    $style = $ratio ? ' style="aspect-ratio:' . e($ratio) . '"' : '';
    if ($src === '') {
        $label = image_slots()[$slot]['label'] ?? 'Photo';
        return '<div class="img-ph ' . e($class) . '"' . $style . ' role="img" aria-label="' . e($fallbackAlt ?: $label) . '">'
            . '<img src="' . e(url('assets/img/logo-mark.png')) . '" alt="" width="90" height="113">'
            . '</div>';
    }
    $d = image_data()[$slot] ?? [];
    $dims = (!empty($d['w']) && !empty($d['h'])) ? ' width="' . (int)$d['w'] . '" height="' . (int)$d['h'] . '"' : '';
    return '<img class="' . e($class) . '" src="' . e($src) . '" alt="' . e(image_alt($slot, $fallbackAlt)) . '"' . $dims
        . ($lazy ? ' loading="lazy" decoding="async"' : ' fetchpriority="high"') . $style . '>';
}

/* ---------- Team & newsletters ---------- */

function team(bool $visibleOnly = true): array
{
    $t = load_data('team', []);
    if ($visibleOnly) {
        $t = array_values(array_filter($t, fn($m) => !empty($m['visible'])));
    }
    usort($t, fn($a, $b) => ((int)($a['order'] ?? 0)) <=> ((int)($b['order'] ?? 0)));
    return $t;
}

function team_photo_url(array $m): string
{
    if (!empty($m['photo']) && is_file(UPLOAD_DIR . '/team/' . $m['photo'])) {
        return url('uploads/team/' . rawurlencode($m['photo']));
    }
    return '';
}

function newsletters(bool $publishedOnly = true): array
{
    $n = load_data('newsletters', []);
    if ($publishedOnly) {
        $n = array_values(array_filter($n, fn($x) => !empty($x['published'])));
    }
    usort($n, fn($a, $b) => strcmp((string)($b['date'] ?? ''), (string)($a['date'] ?? '')));
    return $n;
}

function format_date(string $ymd): string
{
    $t = strtotime($ymd);
    return $t ? date('j F Y', $t) : $ymd;
}

function slugify(string $s): string
{
    $s = strtolower(trim($s));
    $s = strtr($s, ['é' => 'e', 'ë' => 'e', 'è' => 'e', 'ê' => 'e', 'ô' => 'o', 'ö' => 'o', 'ï' => 'i', 'î' => 'i', 'á' => 'a', 'ü' => 'u', 'û' => 'u']);
    $s = preg_replace('/[^a-z0-9]+/', '-', $s);
    return trim((string)$s, '-') ?: 'item';
}

/* ---------- Sessions & security ---------- */

function start_session(): void
{
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    session_name('gidm_sid');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => BASE . '/',
        'secure'   => is_https(),
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function csrf_token(): string
{
    start_session();
    if (empty($_SESSION['csrf'])) {
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf'];
}

function csrf_field(): string
{
    return '<input type="hidden" name="csrf" value="' . e(csrf_token()) . '">';
}

function csrf_ok(): bool
{
    start_session();
    $t = $_POST['csrf'] ?? '';
    return is_string($t) && !empty($_SESSION['csrf']) && hash_equals($_SESSION['csrf'], $t);
}

function app_secret(): string
{
    $s = load_data('secret', []);
    if (empty($s['key'])) {
        $s = ['key' => bin2hex(random_bytes(32))];
        save_data('secret', $s);
    }
    return $s['key'];
}

/** Session-free signed token for public forms (also used to reject instant bot submissions). */
function form_token(): string
{
    $t = (string)time();
    return $t . '.' . hash_hmac('sha256', 'contact|' . $t, app_secret());
}

function form_token_age(string $token): ?int
{
    $parts = explode('.', $token, 2);
    if (count($parts) !== 2 || !ctype_digit($parts[0])) {
        return null;
    }
    if (!hash_equals(hash_hmac('sha256', 'contact|' . $parts[0], app_secret()), $parts[1])) {
        return null;
    }
    return time() - (int)$parts[0];
}

function client_ip(): string
{
    return substr((string)($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0'), 0, 64);
}

/**
 * Simple rate limiter stored in data/throttle. Returns true when the action is allowed.
 */
function throttle(string $bucket, int $max, int $windowSeconds, bool $record = true): bool
{
    $all = load_data('throttle', []);
    $key = $bucket . ':' . hash('sha256', client_ip());
    $now = time();
    $hits = array_values(array_filter($all[$key] ?? [], fn($t) => $t > $now - $windowSeconds));
    // prune old buckets
    foreach ($all as $k => $v) {
        if (!array_filter((array)$v, fn($t) => $t > $now - 86400)) {
            unset($all[$k]);
        }
    }
    $allowed = count($hits) < $max;
    if ($record) {
        $hits[] = $now;
    }
    $all[$key] = $hits;
    save_data('throttle', $all);
    return $allowed;
}

function security_headers(): void
{
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('X-Frame-Options: SAMEORIGIN');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=()');
}

/* ---------- First run: create the admin account from inc/config.php (hash only) ---------- */

if (!is_file(data_path('auth')) && is_string(config('initial_admin_hash')) && str_starts_with(config('initial_admin_hash'), '$2y$')) {
    save_data('auth', [
        'user' => (string)config('initial_admin_user', 'Admin'),
        'hash' => (string)config('initial_admin_hash'),
        'changed' => null,
    ]);
}

if (!is_file(data_path('team'))) {
    require __DIR__ . '/seed.php';
}

require __DIR__ . '/seo.php';
