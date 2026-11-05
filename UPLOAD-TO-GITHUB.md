# Uploading to GitHub in your web browser

This folder is prepared for GitHub's **"Upload files"** button, so it has no `.git` or `.github` folders. GitHub's website won't accept the `.git` folder. Folders whose names start with a dot are hidden on Windows and Mac, which makes them easy to miss.

## 1. Create the repository

1. On github.com, click **New** (top left) and give the repository a name, for example `gehoor-website`.
2. Choose **Private**. Leave "Add a README file" **unticked**, and click **Create repository**.
3. On the next page, click the link **uploading an existing file**.

## 2. Upload the files

1. Open this folder on your computer and **select everything inside it** (Ctrl + A on Windows, Cmd + A on Mac). Don't select the folder itself.
2. Drag the selection into the GitHub upload box. Wait until every file has finished uploading. There are about 150 files, so this takes a minute.
3. Click **Commit changes**.

**Check the hidden files.** After uploading, check that `.htaccess` and `.user.ini` appear in the file list on GitHub.

- **Windows:** these files are visible, so they upload normally.
- **Mac:** Finder hides them. Press **Cmd + Shift + .** (full stop) in Finder to show them before you select everything.

If they are still missing, copies are in `setup/hidden-files/`; see step 4.

## 3. Optional: automatic checks and one-click deploy

The two automation files are in `setup/github-workflows/`. To switch them on:

1. In your repository on GitHub, click **Add file › Create new file**.
2. In the name box, type exactly `.github/workflows/check.yml`. Typing the `/` creates the folders.
3. Open `setup/github-workflows/check.yml` on your computer, copy all its text, and paste it into the big box. Click **Commit changes**.
4. Repeat for `.github/workflows/deploy.yml`, using `setup/github-workflows/deploy.yml`.

`check.yml` tests every page whenever you change something. `deploy.yml` uploads the site to your hosting; the FTP details it needs are listed at the top of that file.

## 4. If a hidden file is missing

Each file in `setup/hidden-files/` is a copy of a hidden file. To restore one, click **Add file › Create new file** on GitHub, type the real name, then paste the contents:

| Copy in setup/hidden-files | Create on GitHub as |
|---|---|
| root-folder.htaccess.txt | `.htaccess` |
| root-folder.user.ini.txt | `.user.ini` |
| root-folder.gitignore.txt | `.gitignore` |
| data-folder.htaccess.txt | `data/.htaccess` |
| inc-folder.htaccess.txt | `inc/.htaccess` |
| uploads-folder.htaccess.txt | `uploads/.htaccess` |

The `.htaccess` files matter for security: they block private folders and force HTTPS. Make sure they're on your **web hosting** too.

## 5. View the website live

Go to **Settings › Pages**. Under "Branch", choose `main` and the folder `/docs`, then click **Save**. After a minute the preview is live at `https://YOUR-USERNAME.github.io/gehoor-website/`.

On a free GitHub account, Pages only works for **public** repositories. If you keep the repository private, use the preview link you were sent in Claude instead.

## Your login

Your password is deliberately **not** in these files. See *First login* in `README.md`.
