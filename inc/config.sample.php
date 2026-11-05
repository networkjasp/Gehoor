<?php
/**
 * Server-only settings. Copy this file to inc/config.php on your web server.
 * inc/config.php is listed in .gitignore, so it is never uploaded to GitHub,
 * and inc/ is blocked from the web, so it can never be downloaded.
 *
 * To create a password hash, run on any computer with PHP:
 *   php -r "echo password_hash('YourPassword', PASSWORD_DEFAULT), PHP_EOL;"
 * The hash is only used once, the first time the portal is opened.
 * After that, change the password inside the portal (Settings).
 */
return [
    'initial_admin_user' => 'Admin',
    'initial_admin_hash' => '',     // paste the $2y$... hash here
    'force_https'        => true,   // redirect every visit to https://
];
