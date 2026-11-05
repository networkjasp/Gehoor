# Gehoor in die Moot – website

A complete website with a built-in management portal. It runs on PHP and needs no database.

**Everything is in this one folder:**

- the website itself (everything except `docs/`), ready for your hosting;
- `docs/preview/`, a clickable preview you can view on GitHub Pages;
- `docs/screenshots/`, screenshots of every page and portal screen.

## View it live on GitHub

After uploading, go to *Settings › Pages*. Choose *Deploy from a branch*, then branch `main` and folder `/docs`, and save. After a minute the preview is live at `https://YOUR-USERNAME.github.io/REPOSITORY-NAME/`.

The preview is a static copy. The contact form, the portal and the Google Maps work only on your real hosting.

## First login

For security, the portal password is not stored in this folder. The first time you install the site, do one of the following:

- **Deploying from GitHub:** add a repository secret named `ADMIN_PASSWORD_HASH`, containing your password hash (see below). The deploy workflow creates `inc/config.php` on the server for you.
- **Uploading by hand:** copy `inc/config.sample.php` to `inc/config.php` on the server and paste the hash into it.

To make a hash for a password, run `php -r "echo password_hash('YourPassword', PASSWORD_DEFAULT), PHP_EOL;"` on any computer with PHP. Your host's support can also do this for you. Change the password in *Portal › Settings* after your first login.

## What you need

- Any standard South African web host with **PHP 8.1 or newer** and the GD extension. This is the same hosting your WordPress site uses, for example Afrihost, xneelo or Domains.co.za.
- Apache hosting, where the included `.htaccess` files take care of web addresses, HTTPS and security. On Nginx, ask your host to block the `data/` and `inc/` folders and to send unknown addresses to `index.php`. The site forces HTTPS from PHP as well, so it stays secure either way.

## Installing

1. **Back up the current WordPress site** in your hosting control panel.
2. Upload everything **except `docs/`** to your website's root folder (usually `public_html`), including the hidden files `.htaccess` and `.user.ini`.
3. **Login details:** see *First login* above.
4. Make sure `data/` and `uploads/` are **writable** (permissions 755, or 775 if your host asks for it).
5. Make sure the domain has an **SSL certificate**. Most hosts include a free Let's Encrypt certificate. Every visit is then redirected to `https://`.
6. Click the **©** at the bottom of any page to open the portal. Log in, then **change the password** under *Settings*.
7. In *Settings*, add your WhatsApp number and Information Officer. Under *Analytics & spam protection*, add your Google Analytics ID.
8. Send a test message through the Contact page and check that it arrives at admin@gehoorindiemoot.co.za.

## What's built in

| Area | Details |
|---|---|
| Legal | Privacy policy (POPIA, including a cookie table) and Terms & conditions (including the ECT Act section 43 disclosures). Both are templates: have them checked by your compliance adviser. |
| Cookie consent | A banner offers "Accept all" or "Essential only". Google Analytics and Google Maps load only after consent. "Cookie settings" in the footer lets visitors change their choice. |
| Analytics | Google Analytics 4, turned on in the portal. It tracks page views, appointment-button clicks, phone, email and WhatsApp clicks, contact form sends (as leads), and completed hearing checks. |
| SEO | A unique title (under 60 characters) and description (under 155) on every page, all editable in *Portal › SEO & sharing* with live Google and social previews. It also has structured data (MedicalClinic, FAQ, Breadcrumb, Article), canonical links, an automatic `sitemap.xml`, `robots.txt`, and 301 redirects from the old WordPress addresses. |
| Social sharing | A branded 1200×630 share image for every page, plus Open Graph and Twitter tags. You can upload your own share image in *Images*. |
| Icons | `favicon.ico`, a PNG favicon, an Apple touch icon, Android icons and `site.webmanifest`. |
| Speed | Self-hosted fonts, compressed logos, uploads automatically resized and saved as WebP, and lazy-loaded images. Lighthouse scores 99–100 for performance on mobile and desktop. |
| Accessibility | WCAG 2.2 AA colour contrast, a high-contrast mode and text-size buttons, alt text required on uploads, keyboard-friendly navigation, and 44 px touch targets. |
| Forms | Instant on-page validation with clear messages, checked again on the server. Spam protection uses a hidden honeypot field, a minimum fill time, rate limiting, link and keyword filters, duplicate blocking and optional Cloudflare Turnstile. |
| Errors | A custom 404 page with links to popular pages. |

## Security

- **No secrets in the browser or in Git.** The admin password exists only as a bcrypt hash: first in `inc/config.php` (blocked from the web and excluded from Git), then in the `data/` folder. The Turnstile secret key is kept server-side and never shown again after you save it. The Google Analytics and Turnstile *site* keys are public by design.
- HTTPS is forced by `.htaccess` and by PHP, with HSTS.
- Logins are limited to 5 failed attempts per 15 minutes. You're logged out after 30 minutes of inactivity. Every portal form has a security token (CSRF protection).
- Uploads are checked and re-saved, which strips hidden content, and uploaded files can never run as code.

## Email delivery

The contact form uses your host's built-in mail sender. To keep messages out of spam, create the mailbox `website@gehoorindiemoot.co.za` (or ask your host to allow sending from it), and check that the domain's SPF record includes your host. Every message is also saved in *Portal › Messages*.

## GitHub

1. Create a new **private** repository on github.com. Don't add a README.
2. In this folder, run `git remote add origin https://github.com/YOUR-USERNAME/gehoor-website.git`, then `git push -u origin main`. Or use GitHub Desktop: *Add local repository*, then *Publish*.
3. Every push runs *Check PHP*, which tests that every page loads.
4. To deploy from GitHub, add the FTP secrets listed in `.github/workflows/deploy.yml` (plus `ADMIN_PASSWORD_HASH` for the first install). Then use *Actions › Deploy to hosting › Run workflow*. Deploying never overwrites portal content on the server, and `docs/` is never uploaded.

The portal data never goes into Git: team details, messages, login hashes and uploaded photos and newsletters stay on the server.

## Domain

Once `gehoorindiemoot.co.za` points at this site, uncomment the "one domain" lines in `.htaccess`, so `rhearing.co.za` redirects to it. Then submit `https://gehoorindiemoot.co.za/sitemap.xml` in Google Search Console, and claim a Google Business Profile for each practice.

## Files

```
index.php            page router and redirects
robots.php           robots.txt (automatic)
sitemap.php          sitemap.xml (automatic, includes newsletters)
site.webmanifest     app icons for phones
inc/                 layout, pages, SEO and config (blocked from the web)
admin/               management portal (pdf.js included)
assets/              styles, scripts, fonts, logos and share images
data/                portal data (blocked from the web, not in Git)
uploads/             uploaded photos and newsletters (not in Git)
docs/                preview and screenshots for GitHub (never uploaded to hosting)
```

Licences: Montserrat and Nunito Sans fonts are under the SIL Open Font License; pdf.js is under the Apache 2.0 licence.
