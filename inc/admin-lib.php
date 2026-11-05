<?php
/** Helpers used only by the management portal. */

const ADMIN_IDLE = 1800; // 30 minutes

function admin_logged_in(): bool
{
    start_session();
    if (empty($_SESSION['admin'])) {
        return false;
    }
    if (time() - (int)($_SESSION['last'] ?? 0) > ADMIN_IDLE) {
        $_SESSION = [];
        session_destroy();
        return false;
    }
    $_SESSION['last'] = time();
    return true;
}

function admin_login(string $user, string $pass): bool
{
    $auth = load_data('auth', []);
    $okUser = hash_equals(strtolower((string)($auth['user'] ?? '')), strtolower(trim($user)));
    $okPass = password_verify($pass, (string)($auth['hash'] ?? ''));
    if ($okUser && $okPass) {
        if (password_needs_rehash($auth['hash'], PASSWORD_DEFAULT)) {
            $auth['hash'] = password_hash($pass, PASSWORD_DEFAULT);
        }
        $auth['last_login'] = date('c');
        save_data('auth', $auth);
        start_session();
        session_regenerate_id(true);
        $_SESSION['admin'] = $auth['user'];
        $_SESSION['last'] = time();
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        return true;
    }
    return false;
}

function flash(string $msg, string $type = 'ok'): void
{
    start_session();
    $_SESSION['flash'][] = [$type, $msg];
}

function take_flash(): array
{
    start_session();
    $f = $_SESSION['flash'] ?? [];
    unset($_SESSION['flash']);
    return $f;
}

function admin_url(string $section = '', array $q = []): string
{
    if ($section !== '') {
        $q = ['s' => $section] + $q;
    }
    return url('admin/') . ($q ? '?' . http_build_query($q) : '');
}

function redirect_to(string $to): void
{
    header('Location: ' . $to, true, 303);
    exit;
}

function json_out(array $data, int $code = 200): void
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
    exit;
}

/**
 * Validate and re-encode an uploaded image with GD (strips metadata and any hidden payload).
 * Returns the saved file name, or throws RuntimeException with a friendly message.
 */
function save_uploaded_image(array $file, string $dir, string $baseName, int $maxW = 1600, int $maxH = 1600): string
{
    if (($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException(upload_error_text((int)($file['error'] ?? UPLOAD_ERR_NO_FILE)));
    }
    if ($file['size'] > 15 * 1024 * 1024) {
        throw new RuntimeException('That image is larger than 15 MB. Please choose a smaller one.');
    }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($file['tmp_name']);
    if (!in_array($mime, ['image/jpeg', 'image/png', 'image/webp', 'image/gif'], true)) {
        throw new RuntimeException('Please upload a JPG, PNG or WebP image.');
    }
    $info = @getimagesize($file['tmp_name']);
    if (!$info || $info[0] < 10 || $info[1] < 10 || $info[0] * $info[1] > 40000000) {
        throw new RuntimeException('That file is not a usable image.');
    }
    $src = @imagecreatefromstring((string)file_get_contents($file['tmp_name']));
    if (!$src) {
        throw new RuntimeException('That image could not be read.');
    }
    // Respect phone camera orientation.
    if ($mime === 'image/jpeg' && function_exists('exif_read_data')) {
        $exif = @exif_read_data($file['tmp_name']);
        $o = (int)($exif['Orientation'] ?? 1);
        if ($o === 3) $src = imagerotate($src, 180, 0);
        if ($o === 6) $src = imagerotate($src, -90, 0);
        if ($o === 8) $src = imagerotate($src, 90, 0);
    }
    $w = imagesx($src);
    $h = imagesy($src);
    $scale = min(1, $maxW / $w, $maxH / $h);
    $nw = max(1, (int)round($w * $scale));
    $nh = max(1, (int)round($h * $scale));
    $keepAlpha = in_array($mime, ['image/png', 'image/webp', 'image/gif'], true) && image_has_alpha($src);
    $dst = imagecreatetruecolor($nw, $nh);
    if ($keepAlpha) {
        imagealphablending($dst, false);
        imagesavealpha($dst, true);
        imagefill($dst, 0, 0, imagecolorallocatealpha($dst, 0, 0, 0, 127));
    } else {
        imagefill($dst, 0, 0, imagecolorallocate($dst, 255, 255, 255));
    }
    imagecopyresampled($dst, $src, 0, 0, 0, 0, $nw, $nh, $w, $h);
    if (!is_dir($dir)) {
        mkdir($dir, 0755, true);
    }
    // Compress: WebP (about 30% smaller than JPEG, keeps transparency) when the server supports it.
    $webp = function_exists('imagewebp');
    $ext = $webp ? '.webp' : ($keepAlpha ? '.png' : '.jpg');
    $name = $baseName . '-' . bin2hex(random_bytes(4)) . $ext;
    $target = $dir . '/' . $name;
    if ($webp) {
        $ok = imagewebp($dst, $target, $keepAlpha ? 90 : 80);
    } else {
        $ok = $keepAlpha ? imagepng($dst, $target, 9) : imagejpeg($dst, $target, 80);
    }
    $GLOBALS['last_image_size'] = [$nw, $nh];
    imagedestroy($src);
    imagedestroy($dst);
    if (!$ok) {
        throw new RuntimeException('The image could not be saved. Check that the uploads folder is writable.');
    }
    return $name;
}

function image_has_alpha($img): bool
{
    $w = imagesx($img);
    $h = imagesy($img);
    $step = max(1, (int)(min($w, $h) / 40));
    for ($x = 0; $x < $w; $x += $step) {
        for ($y = 0; $y < $h; $y += $step) {
            if (((imagecolorat($img, $x, $y) >> 24) & 0x7F) > 0) {
                return true;
            }
        }
    }
    return false;
}

function upload_error_text(int $code): string
{
    return match ($code) {
        UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE => 'The file is larger than the server allows (' . ini_get('upload_max_filesize') . ').',
        UPLOAD_ERR_PARTIAL => 'The upload was interrupted. Please try again.',
        UPLOAD_ERR_NO_FILE => 'Please choose a file.',
        default => 'The upload failed (code ' . $code . ').',
    };
}

function delete_file_safe(string $dir, string $name): void
{
    if ($name === '' || str_contains($name, '/') || str_contains($name, '..')) {
        return;
    }
    $p = $dir . '/' . $name;
    if (is_file($p)) {
        @unlink($p);
    }
}

function rrmdir(string $dir): void
{
    if (!is_dir($dir)) {
        return;
    }
    foreach (scandir($dir) as $f) {
        if ($f === '.' || $f === '..') continue;
        $p = $dir . '/' . $f;
        is_dir($p) ? rrmdir($p) : @unlink($p);
    }
    @rmdir($dir);
}

function unique_slug(string $title, array $items, string $exceptId = ''): string
{
    $base = slugify($title);
    $slug = $base;
    $i = 2;
    $taken = array_column(array_filter($items, fn($x) => ($x['id'] ?? '') !== $exceptId), 'slug');
    while (in_array($slug, $taken, true)) {
        $slug = $base . '-' . $i++;
    }
    return $slug;
}

function post_str(string $k, int $max = 500): string
{
    return trim(mb_substr(str_replace("\0", '', (string)($_POST[$k] ?? '')), 0, $max));
}
