# Gehoor in die Moot – website (Netlify)

The website and management portal for Gehoor in die Moot, built to run on **Netlify**. The files live on **GitHub**, and every change saved on GitHub is deployed by Netlify automatically.

- **Pages** are created by Netlify Functions and cached on Netlify's CDN, so they load fast everywhere.
- **Portal content** (team, photos, newsletters, page titles, settings) is stored in **Netlify Blobs**, Netlify's built-in storage. It needs no setup and is never stored in GitHub.
- **Contact form** messages go through **Netlify Forms**, which emails each one to the practice and filters spam.

## 1. Put the files on GitHub

See `UPLOAD-TO-GITHUB.md`. In short: create a **private** repository, then upload everything in this folder.

## 2. Connect GitHub to Netlify (one time)

1. Log in at app.netlify.com and choose **Add new project › Import an existing project › GitHub**. Then pick your repository.
2. Netlify reads `netlify.toml` and fills in the build settings itself (publish folder `public`, functions folder `netlify/functions`). Don't change anything.
3. Click **Deploy**. After about a minute, the site is live on a `*.netlify.app` address. No environment variables are needed.

## 3. Turn on the contact form emails (one time)

1. In Netlify open **Forms**. The form called **contact** appears after the first deploy. If Netlify asks, click **Enable form detection** and redeploy once.
2. Open **Project configuration › Notifications › Emails and webhooks › Form submission notifications**. Add an **Email notification** to `admin@gehoorindiemoot.co.za` for the form `contact`.
3. Send yourself a test message from the Contact page.

Spam protection: a hidden honeypot field, a minimum time to fill in the form and a links filter run in the visitor's browser. Netlify's own spam filter (Akismet) runs on every submission.

## 4. Your domain

In Netlify open **Domain management**. Add `gehoorindiemoot.co.za` and set it as the **primary domain**, then follow Netlify's DNS instructions. You can also add `rhearing.co.za` as a domain alias so it forwards to the main domain. Netlify issues the free SSL certificate and forces HTTPS automatically. Old WordPress addresses, like `/about/` and `/tinnitus-en-hyperacusis/`, redirect to the new pages.

## 5. First login

Click the **©** at the bottom of any page, or go to `/admin/`. Log in with username `Admin` and the starting password the practice was given. The login is built in, so there's nothing to set up.

**Change the password straight after your first login** (*Portal › Settings*). Only a scrambled (hashed) form of the starting password is in the code, but anyone who can see the GitHub repository can see that hash, so:

- keep the GitHub repository **private**;
- change the password on day one. The new password is stored by Netlify, not in GitHub, and the built-in one stops working.

### Resetting a forgotten password

Set an environment variable `ADMIN_PASSWORD_HASH` in Netlify containing a new hash, then redeploy. To reset after a password change, also delete the `auth` entry in Netlify's Blobs storage (*Blobs › gidm-content*). To make a hash, use one of these; each produces a value starting with `$2`:

- **With Node.js:** inside this folder, after `npm install`, run `node -e "console.log(require('bcryptjs').hashSync('YourPassword', 12))"`.
- **With PHP:** run `php -r "echo password_hash('YourPassword', PASSWORD_DEFAULT), PHP_EOL;"`.

The hash can't be turned back into the password, but keep it private all the same. Never put the password itself anywhere in these files.

## Optional settings

| Environment variable | What it does |
|---|---|
| `NETLIFY_API_TOKEN` | Shows contact-form messages inside the portal, in **Messages**. Create one in Netlify under **User settings › Applications › Personal access tokens**. Without it, the portal links to the messages in Netlify instead. |
| `SESSION_SECRET` | Optional: a random string of at least 32 characters used to sign portal logins. If it's missing, one is created and stored automatically. |
| `ADMIN_PASSWORD_HASH` | Optional: replaces the built-in starting password (see *Resetting a forgotten password*). |
| `ADMIN_USER` | A different starting username. The default is `Admin`. |

Google Analytics, Search Console, WhatsApp, phone numbers and similar details are set in **Portal › Settings**.

## What's built in

- **Pages:** Home, Services, About us, Hearing aids, Babies & children, Medical aid, Newsletters, Contact, Privacy policy (POPIA) and Terms & conditions, plus a custom 404 page.
- **Portal:**
  - Team: photos, qualifications and HPCSA numbers.
  - Images: every photo and logo on the site, with alt text required.
  - Newsletters: upload a PDF, and each page becomes an image on the branded newsletter page. The PDF stays downloadable and its text is indexed.
  - SEO & sharing: edit page titles and descriptions, with Google and social previews.
  - Messages and Settings, including password change.
  - Every change is live within seconds, because the CDN cache is cleared automatically.
- **SEO:**
  - Unique titles and descriptions for every page.
  - Structured data (MedicalClinic, FAQ, Breadcrumb, Article) and canonical links.
  - An automatic `/sitemap.xml` and `/robots.txt`, plus branded 1200×630 share images.
- **Privacy:** a cookie consent banner. Google Analytics and Google Maps load only after the visitor accepts.
- **Security:**
  - HTTPS with HSTS, plus security headers and a Content Security Policy.
  - Logins limited to 5 attempts per 15 minutes and automatic logout after 30 minutes.
  - Protection against cross-site requests.
  - Uploads are checked by their actual file contents, not the file name, and served from a sandbox.
  - No plain-text passwords in the code: only the hash of the starting password, which is replaced at the first password change.
- **Design:** the approved CI mock-up: CI colours (navy #142949, blue #3256A3, green #8FC344), practice photos, a homepage photo slideshow, team portraits, member and brand logos, and green service icons. All photos are defaults: replace any of them in *Portal › Images* or *Portal › Team*.
- **Accessibility and speed:** WCAG 2.2 AA contrast, a high-contrast mode and text size buttons, and self-hosted fonts. Images are compressed to WebP in the browser before upload. Lighthouse scores 99–100.

## Folder map

```
netlify.toml              Netlify settings (build, functions, security headers)
package.json              the three packages the functions use
public/                   static files: styles, scripts, fonts, logos, share images, portal
  admin/                  the management portal (opens at /admin/)
  __forms.html            hidden copy of the contact form so Netlify Forms detects it (don't delete)
netlify/functions/        site.mjs (pages), api.mjs (portal), media.mjs (uploaded files)
netlify/lib/              page templates, layout, default content, login, storage
tools/                    check.mjs (runs on every deploy), dev-server.mjs (local preview)
docs/screenshots/         screenshots of every page and portal screen
```

## Local preview (optional, for developers)

```
npm install
npm run dev
```

Then open http://localhost:8888. Content is stored in `.local-store/` and contact-form posts are saved there instead of emailed.
