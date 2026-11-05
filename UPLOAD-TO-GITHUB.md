# Uploading to GitHub (for Netlify)

This folder has **no hidden folders**, so it uploads with GitHub's normal "Upload files" button. The only hidden file is `.gitignore`, which is optional.

## 1. Create the repository

1. On github.com click **New**, and name it, for example, `gehoor-website`.
2. Choose **Private**. Leave "Add a README file" unticked, and click **Create repository**.
3. Click the link **uploading an existing file**.

## 2. Upload

1. Open this folder and **select everything inside it** (Ctrl + A on Windows, Cmd + A on Mac), not the folder itself.
2. Drag the selection into the GitHub upload box, wait until every file has finished, and click **Commit changes**.

Check that the repository now shows `netlify.toml`, `package.json`, `package-lock.json`, and the folders `public`, `netlify`, `tools` and `docs`.

## 3. Connect to Netlify

Follow steps 2 to 5 in `README.md`. From then on, every change you commit on GitHub, even an edit made in your browser on github.com, is deployed by Netlify automatically within about a minute.

## Good to know

- Content added in the portal (team, photos, newsletters, page titles) is stored by Netlify, not in GitHub. Uploading a new version of these files to GitHub never overwrites it.
- Never upload a `node_modules` or `.local-store` folder, if one appears after local testing. Netlify installs what it needs by itself.
