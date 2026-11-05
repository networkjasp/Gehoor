/* Gehoor in die Moot – management portal (runs in the browser, talks to /api/). */
(function () {
  'use strict';
  var app = document.getElementById('app');
  var S = null; // state from /api/state
  var flash = [];

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]; }); }
  function mediaUrl(k) { return k ? '/media/' + k.split('/').map(encodeURIComponent).join('/') : ''; }
  function fmtDate(d) { try { return new Date(d + 'T12:00:00').toLocaleDateString('en-ZA', { day: 'numeric', month: 'long', year: 'numeric' }); } catch (e) { return d; } }
  function api(path, opts) {
    opts = opts || {};
    var headers = Object.assign({ 'X-Requested-With': 'portal' }, opts.headers || {});
    var body = opts.body;
    if (body && !(body instanceof Blob) && !(body instanceof ArrayBuffer) && typeof body === 'object') { body = JSON.stringify(body); headers['Content-Type'] = 'application/json'; }
    return fetch('/api/' + path, { method: opts.method || 'GET', headers: headers, body: body, credentials: 'same-origin' })
      .then(function (r) {
        return r.json().catch(function () { return { ok: false, error: 'Unexpected response from the server (' + r.status + ').' }; })
          .then(function (j) {
            if (r.status === 401 && path !== 'login') { S = null; route('login'); throw new Error(j.error || 'Please log in again.'); }
            if (!r.ok || j.ok === false) throw new Error(j.error || 'Something went wrong.');
            return j;
          });
      });
  }
  function note(msg, type) { flash.push([type || 'ok', msg]); }
  function flashes() { var h = flash.map(function (f) { return '<div class="alert ' + (f[0] === 'err' ? 'err' : 'ok') + '" role="status">' + esc(f[1]) + '</div>'; }).join(''); flash = []; return h; }
  function reload() { return api('state').then(function (j) { S = j; }); }
  function busy(btn, on, label) { if (!btn) return; btn.disabled = on; if (label) btn.textContent = label; }

  /* Resize + compress an image in the browser before upload (WebP, falls back to JPEG). */
  function compressImage(file, maxW, maxH) {
    return new Promise(function (resolve, reject) {
      if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) return reject(new Error('Please choose a JPG, PNG or WebP image.'));
      var img = new Image();
      var urlObj = URL.createObjectURL(file);
      img.onload = function () {
        var scale = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
        var w = Math.round(img.naturalWidth * scale), h = Math.round(img.naturalHeight * scale);
        var c = document.createElement('canvas'); c.width = w; c.height = h;
        var ctx = c.getContext('2d');
        if (file.type === 'image/jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, w, h); }
        ctx.drawImage(img, 0, 0, w, h);
        URL.revokeObjectURL(urlObj);
        c.toBlob(function (b) {
          if (b && b.type === 'image/webp') return resolve({ blob: b, w: w, h: h });
          c.toBlob(function (b2) { b2 ? resolve({ blob: b2, w: w, h: h }) : reject(new Error('The image could not be prepared.')); }, file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.82);
        }, 'image/webp', 0.82);
      };
      img.onerror = function () { URL.revokeObjectURL(urlObj); reject(new Error('That file is not a usable image.')); };
      img.src = urlObj;
    });
  }

  /* ---------- shell ---------- */
  var NAV = [['dashboard', 'Dashboard'], ['team', 'Team'], ['images', 'Images'], ['newsletters', 'Newsletters'], ['messages', 'Messages'], ['seo', 'SEO & sharing'], ['settings', 'Settings']];
  function shell(section, title, inner) {
    app.innerHTML =
      '<header class="admin-top"><div class="admin-top-in">' +
      '<a class="admin-brand" href="#dashboard"><img src="/assets/img/logo-mark-white.png" alt="" width="34"> Portal</a>' +
      '<nav aria-label="Portal">' + NAV.map(function (n) { return '<a href="#' + n[0] + '"' + (n[0] === section ? ' aria-current="page"' : '') + '>' + esc(n[1]) + '</a>'; }).join('') + '</nav>' +
      '<div class="admin-user"><a href="/" target="_blank" rel="noopener">View site ↗</a><button type="button" id="logout">Log out</button></div>' +
      '</div></header><main class="admin-main"><h1>' + esc(title) + '</h1>' + flashes() + inner + '</main>';
    document.getElementById('logout').onclick = function () { api('logout', { method: 'POST' }).catch(function () {}).then(function () { S = null; location.href = '/'; }); };
    window.scrollTo(0, 0);
  }

  /* ---------- login / setup ---------- */
  function viewLogin(err) {
    app.innerHTML = '<main class="login-wrap"><form class="login-card" id="login">' +
      '<img src="/assets/img/logo-full.png" alt="Gehoor in die Moot" width="260"><h1>Management portal</h1>' +
      (err ? '<div class="alert err" role="alert">' + esc(err) + '</div>' : '') +
      '<div class="field"><label for="user">Username</label><input type="text" id="user" autocomplete="username" required autofocus></div>' +
      '<div class="field"><label for="pass">Password</label><input type="password" id="pass" autocomplete="current-password" required></div>' +
      '<button class="btn btn-primary" type="submit">Log in</button><a class="small" href="/">← Back to the website</a></form></main>';
    document.getElementById('login').onsubmit = function (ev) {
      ev.preventDefault();
      var b = ev.target.querySelector('button'); busy(b, true, 'Logging in…');
      api('login', { method: 'POST', body: { user: document.getElementById('user').value, pass: document.getElementById('pass').value } })
        .then(reload).then(function () { go('#dashboard'); })
        .catch(function (e) { viewLogin(e.message); });
    };
  }
  function viewSetup() {
    app.innerHTML = '<main class="login-wrap"><div class="login-card"><img src="/assets/img/logo-full.png" alt="Gehoor in die Moot" width="260">' +
      '<h1>Portal not set up yet</h1><p>For security, the login is not stored in the website files. In Netlify, open <strong>Site configuration › Environment variables</strong> and add <code>ADMIN_PASSWORD_HASH</code>, as described in the README. Then redeploy the site and reload this page.</p>' +
      '<a class="small" href="/">← Back to the website</a></div></main>';
  }

  /* ---------- dashboard ---------- */
  function viewDashboard() {
    var photos = Object.keys(S.images).length, slots = Object.keys(S.slots).length;
    shell('dashboard', 'Welcome, ' + S.user,
      (!S.passwordChanged ? '<div class="alert err">For security, please <a href="#settings">change the starting password</a>.</div>' : '') +
      '<div class="tiles">' +
      '<a class="tile" href="#team"><strong>' + S.team.length + '</strong><span>team members</span></a>' +
      '<a class="tile" href="#newsletters"><strong>' + S.newsletters.length + '</strong><span>newsletters</span></a>' +
      '<a class="tile" href="#images"><strong>' + photos + '/' + slots + '</strong><span>photos uploaded</span></a>' +
      '<a class="tile" href="#messages"><strong>→</strong><span>contact messages</span></a></div>' +
      '<div class="box" style="margin-top:24px"><h2>Quick tasks</h2><ul class="quick">' +
      '<li><a href="#newsletters">Upload a new newsletter (PDF)</a></li><li><a href="#team/new">Add a team member</a></li>' +
      '<li><a href="#images">Replace a photo on the website</a></li><li><a href="#settings">Add your WhatsApp number or Google Analytics</a></li></ul>' +
      '<p class="small muted" style="margin-top:14px">Changes appear on the website within a few seconds.</p></div>');
  }

  /* ---------- team ---------- */
  function viewTeam(editId) {
    if (editId) {
      var m = editId === 'new' ? { id: '', name: '', role: 'Audiologist', group: 'audiologist', quals: '', hpcsa: '', bio: '', photo: '', visible: true } : S.team.find(function (x) { return x.id === editId; });
      if (!m) { location.hash = '#team'; return; }
      shell('team', m.id ? 'Edit ' + m.name : 'Add a team member',
        '<form class="box form" id="tm">' +
        '<div class="field"><label for="name">Name</label><input type="text" id="name" required value="' + esc(m.name) + '"></div>' +
        '<div class="field"><label for="role">Role / job title</label><input type="text" id="role" value="' + esc(m.role) + '"></div>' +
        '<div class="field"><label for="group">Show under</label><select id="group"><option value="audiologist"' + (m.group === 'audiologist' ? ' selected' : '') + '>Audiologists (large profile)</option><option value="support"' + (m.group === 'support' ? ' selected' : '') + '>Support team (small profile)</option></select></div>' +
        '<div class="field"><label for="hpcsa">HPCSA registration number</label><input type="text" id="hpcsa" value="' + esc(m.hpcsa) + '" placeholder="e.g. AU 0012345"><span class="hint">Shown as a badge. Leave empty for support staff.</span></div>' +
        '<div class="field full"><label for="quals">Qualifications</label><input type="text" id="quals" value="' + esc(m.quals) + '"></div>' +
        '<div class="field full"><label for="bio">Short introduction (optional)</label><textarea id="bio">' + esc(m.bio) + '</textarea></div>' +
        '<div class="field full"><label for="photo">Photo</label><div class="photo-row">' + (m.photo ? '<img class="thumb" src="' + mediaUrl(m.photo) + '" alt="">' : '<span class="thumb empty">No photo</span>') +
        '<div><input type="file" id="photo" accept="image/jpeg,image/png,image/webp"><span class="hint">A portrait photo works best. It is resized and compressed automatically.</span>' +
        (m.photo ? '<label class="consent"><input type="checkbox" id="rmphoto"> Remove the current photo</label>' : '') + '</div></div></div>' +
        '<label class="consent full"><input type="checkbox" id="visible"' + (m.visible ? ' checked' : '') + '> Show on the website</label>' +
        '<div class="full btn-row"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-outline" href="#team">Cancel</a></div></form>');
      document.getElementById('tm').onsubmit = function (ev) {
        ev.preventDefault();
        var b = ev.target.querySelector('button[type=submit]'); busy(b, true, 'Saving…');
        var body = { id: m.id, name: val('name'), role: val('role'), group: val('group'), hpcsa: val('hpcsa'), quals: val('quals'), bio: val('bio'), visible: document.getElementById('visible').checked };
        var file = document.getElementById('photo').files[0];
        var rm = document.getElementById('rmphoto');
        api('team', { method: 'POST', body: body }).then(function (j) {
          var id = j.member.id;
          if (file) return compressImage(file, 900, 1100).then(function (img) { return api('team/' + encodeURIComponent(id) + '/photo', { method: 'PUT', body: img.blob, headers: { 'Content-Type': img.blob.type } }); });
          if (rm && rm.checked) return api('team/' + encodeURIComponent(id) + '/photo', { method: 'DELETE' });
        }).then(reload).then(function () { note('Saved ' + body.name + '.'); go('#team'); })
          .catch(function (e) { busy(b, false, 'Save'); note(e.message, 'err'); viewTeam(editId); });
      };
      return;
    }
    shell('team', 'Team',
      '<p class="muted">These people appear on the About us page (and audiologists on the homepage). Use the arrows to change the order.</p>' +
      '<p><a class="btn btn-primary" href="#team/new">+ Add a team member</a></p><div class="list">' +
      S.team.map(function (m, i) {
        return '<div class="row">' + (m.photo ? '<img class="thumb sm" src="' + mediaUrl(m.photo) + '" alt="">' : '<span class="thumb sm empty"></span>') +
          '<div class="grow"><strong>' + esc(m.name) + '</strong>' + (m.visible ? '' : ' <span class="tag">Hidden</span>') + '<br><span class="muted small">' + esc(m.role) +
          (m.hpcsa ? ' · HPCSA ' + esc(m.hpcsa) : (m.group === 'audiologist' ? ' · <em>HPCSA number missing</em>' : '')) + '</span></div>' +
          '<button class="icon-btn" data-move="up" data-id="' + esc(m.id) + '" aria-label="Move ' + esc(m.name) + ' up"' + (i === 0 ? ' disabled' : '') + '>↑</button>' +
          '<button class="icon-btn" data-move="down" data-id="' + esc(m.id) + '" aria-label="Move ' + esc(m.name) + ' down"' + (i === S.team.length - 1 ? ' disabled' : '') + '>↓</button>' +
          '<a class="btn btn-outline sm" href="#team/' + encodeURIComponent(m.id) + '">Edit</a>' +
          '<button class="btn btn-danger sm" data-del="' + esc(m.id) + '" data-name="' + esc(m.name) + '">Delete</button></div>';
      }).join('') + '</div>');
    app.querySelectorAll('[data-move]').forEach(function (b) {
      b.onclick = function () { api('team/' + encodeURIComponent(b.dataset.id) + '/move', { method: 'POST', body: { dir: b.dataset.move } }).then(reload).then(function () { viewTeam(); }); };
    });
    app.querySelectorAll('[data-del]').forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.confirm !== '1') { b.dataset.confirm = '1'; b.textContent = 'Click again to delete'; return; }
        api('team/' + encodeURIComponent(b.dataset.del), { method: 'DELETE' }).then(reload).then(function () { note('Removed ' + b.dataset.name + '.'); viewTeam(); });
      };
    });
  }
  function val(id) { return document.getElementById(id).value; }
  function go(h) { if (location.hash === h) route(); else location.hash = h; }

  /* ---------- images ---------- */
  function viewImages() {
    var groups = {};
    Object.keys(S.slots).forEach(function (k) { var s = S.slots[k]; (groups[s.group] = groups[s.group] || []).push([k, s]); });
    shell('images', 'Website images',
      '<p class="muted">Every photo and logo on the website is listed here. Choose a new picture to replace it: it is resized and compressed automatically. Please always add a short description; it helps people using screen readers, and Google.</p>' +
      Object.keys(groups).map(function (g) {
        return '<h2 class="group-h">' + esc(g) + '</h2><div class="slot-grid">' + groups[g].map(function (pair) {
          var k = pair[0], s = pair[1], cur = S.images[k] || {}, src = cur.file ? mediaUrl(cur.file) : (s.def || '');
          return '<form class="slot" id="slot-' + k + '" data-slot="' + k + '">' +
            '<div class="slot-img' + (k === 'logo_footer' ? ' dark' : '') + '">' + (src ? '<img src="' + esc(src) + '" alt="">' : '<span>No photo yet<br><small>a soft placeholder is shown</small></span>') + '</div>' +
            '<strong>' + esc(s.label) + '</strong><span class="hint">Best size: ' + esc(s.size) + '</span>' +
            '<label class="sr" for="f-' + k + '">New image for ' + esc(s.label) + '</label><input type="file" id="f-' + k + '" accept="image/jpeg,image/png,image/webp">' +
            '<label class="hint" for="a-' + k + '">Description (alt text)' + (s.decorative ? ' – optional' : '') + '</label>' +
            '<input type="text" id="a-' + k + '" value="' + esc(cur.alt || '') + '" placeholder="e.g. Dr René Hornby testing a patient\'s hearing">' +
            '<div class="btn-row"><button class="btn btn-primary sm" type="submit">Save</button>' +
            (cur.file ? '<button class="btn btn-outline sm" type="button" data-reset>Remove</button>' : '') + '</div></form>';
        }).join('') + '</div>';
      }).join(''));
    app.querySelectorAll('form.slot').forEach(function (f) {
      var k = f.dataset.slot, s = S.slots[k];
      f.onsubmit = function (ev) {
        ev.preventDefault();
        var file = f.querySelector('input[type=file]').files[0], alt = f.querySelector('input[type=text]').value.trim();
        var b = f.querySelector('button[type=submit]'); busy(b, true, 'Saving…');
        var done = function (msg) { return reload().then(function () { note(msg); viewImages(); var el = document.getElementById('slot-' + k); if (el) el.scrollIntoView(); }); };
        var fail = function (e) { busy(b, false, 'Save'); note(e.message, 'err'); viewImages(); var el = document.getElementById('slot-' + k); if (el) el.scrollIntoView(); };
        if (!alt && !s.decorative && (file || S.images[k])) return fail(new Error('Please add a short description (alt text) for "' + s.label + '".'));
        if (file) {
          var logo = /^(logo_|member_)/.test(k);
          compressImage(file, logo ? 1200 : 1800, logo ? 1200 : 1800).then(function (img) {
            return api('images/' + k + '?alt=' + encodeURIComponent(alt) + '&w=' + img.w + '&h=' + img.h, { method: 'PUT', body: img.blob, headers: { 'Content-Type': img.blob.type } });
          }).then(function () { return done('Updated "' + s.label + '".'); }).catch(fail);
        } else {
          api('images/' + k + '/alt', { method: 'POST', body: { alt: alt } }).then(function () { return done('Description saved.'); }).catch(fail);
        }
      };
      var r = f.querySelector('[data-reset]');
      if (r) r.onclick = function () {
        if (r.dataset.confirm !== '1') { r.dataset.confirm = '1'; r.textContent = 'Click again to remove'; return; }
        api('images/' + k, { method: 'DELETE' }).then(reload).then(function () { note('Image removed. The default is shown again.'); viewImages(); });
      };
    });
  }

  /* ---------- newsletters ---------- */
  function viewNewsletters(editId) {
    var ed = editId && S.newsletters.find(function (n) { return n.id === editId; });
    if (ed) {
      shell('newsletters', 'Edit newsletter',
        '<form class="box form" id="nle"><div class="field"><label for="t">Title</label><input type="text" id="t" required value="' + esc(ed.title) + '"></div>' +
        '<div class="field"><label for="d">Date</label><input type="date" id="d" value="' + esc(ed.date) + '"></div>' +
        '<div class="field full"><label for="sm">Short summary (shown on the newsletter list and in Google)</label><textarea id="sm" style="min-height:90px">' + esc(ed.summary) + '</textarea></div>' +
        '<label class="consent full"><input type="checkbox" id="pub"' + (ed.published ? ' checked' : '') + '> Published (visible on the website)</label>' +
        '<div class="full btn-row"><button class="btn btn-primary" type="submit">Save</button><a class="btn btn-outline" href="#newsletters">Cancel</a></div></form>');
      document.getElementById('nle').onsubmit = function (ev) {
        ev.preventDefault();
        api('newsletters/' + ed.id, { method: 'POST', body: { title: val('t'), date: val('d'), summary: val('sm'), published: document.getElementById('pub').checked } })
          .then(reload).then(function () { note('Newsletter updated.'); go('#newsletters'); })
          .catch(function (e) { note(e.message, 'err'); viewNewsletters(editId); });
      };
      return;
    }
    var today = new Date().toISOString().slice(0, 10);
    shell('newsletters', 'Newsletters',
      '<section class="box" id="upload"><h2>Upload a new newsletter</h2>' +
      '<p class="muted">Choose the PDF and give it a title. The portal turns every page into an image on the branded newsletter page, keeps the PDF for downloading, and reads the text so Google can find it. Allow a minute for longer newsletters.</p>' +
      '<form id="nl-form" class="form"><div class="field"><label for="nl-title">Title</label><input type="text" id="nl-title" required placeholder="e.g. Winter 2026: protecting your hearing"></div>' +
      '<div class="field"><label for="nl-date">Date</label><input type="date" id="nl-date" value="' + today + '"></div>' +
      '<div class="field full"><label for="nl-pdf">PDF file</label><input type="file" id="nl-pdf" accept="application/pdf" required><span class="hint">Up to 30 MB and 40 pages.</span></div>' +
      '<div class="field full"><label for="nl-sum">Short summary (optional: if left empty, the opening text of the PDF is used)</label><textarea id="nl-sum" style="min-height:80px"></textarea></div>' +
      '<label class="consent full"><input type="checkbox" id="nl-pub" checked> Publish on the website straight away</label>' +
      '<div class="full"><button class="btn btn-primary" type="submit">Upload newsletter</button></div>' +
      '<div class="full progress" id="nl-progress" hidden><div class="bar"><span></span></div><p class="small" role="status" aria-live="polite"></p></div></form></section>' +
      '<h2 class="group-h">All newsletters</h2>' + (S.newsletters.length ? '' : '<p class="muted">No newsletters yet.</p>') +
      '<div class="list">' + S.newsletters.map(function (n) {
        return '<div class="row">' + (n.cover ? '<img class="thumb sm doc" src="' + mediaUrl(n.cover) + '" alt="">' : '<span class="thumb sm empty"></span>') +
          '<div class="grow"><strong>' + esc(n.title) + '</strong> ' + (n.published ? '' : '<span class="tag">Draft</span>') + '<br><span class="muted small">' + esc(fmtDate(n.date)) + ' · ' + (n.pages || []).length + ' pages</span></div>' +
          '<a class="btn btn-outline sm" href="/newsletters/' + encodeURIComponent(n.slug) + '" target="_blank" rel="noopener">View</a>' +
          '<a class="btn btn-outline sm" href="#newsletters/' + encodeURIComponent(n.id) + '">Edit</a>' +
          '<button class="btn btn-danger sm" data-del="' + esc(n.id) + '">Delete</button></div>';
      }).join('') + '</div>');
    app.querySelectorAll('[data-del]').forEach(function (b) {
      b.onclick = function () {
        if (b.dataset.confirm !== '1') { b.dataset.confirm = '1'; b.textContent = 'Click again to delete'; return; }
        api('newsletters/' + b.dataset.del, { method: 'DELETE' }).then(reload).then(function () { note('Newsletter deleted.'); viewNewsletters(); });
      };
    });
    document.getElementById('nl-form').onsubmit = uploadNewsletter;
  }

  function uploadNewsletter(ev) {
    ev.preventDefault();
    var form = ev.target, file = document.getElementById('nl-pdf').files[0];
    var prog = document.getElementById('nl-progress'), bar = prog.querySelector('.bar span'), status = prog.querySelector('p');
    var btn = form.querySelector('button[type=submit]');
    function setP(pct, t) { prog.hidden = false; bar.style.width = Math.max(2, Math.min(100, pct)) + '%'; status.textContent = t; }
    if (!file) return alertBox('Please choose a PDF file.');
    if (file.size > 30 * 1024 * 1024) return alertBox('The PDF is larger than 30 MB. Please compress it first.');
    if (!val('nl-title').trim()) return alertBox('Please enter a title.');
    function alertBox(m) { setP(100, m); bar.style.background = '#B42318'; }
    busy(btn, true); bar.style.background = '';
    var id, pages = [], text = '', CHUNK = 3 * 1024 * 1024, partsN = Math.ceil(file.size / CHUNK);
    setP(2, 'Creating the newsletter…');
    api('newsletters', { method: 'POST', body: { title: val('nl-title'), date: val('nl-date'), summary: val('nl-sum'), published: document.getElementById('nl-pub').checked } })
      .then(function (j) {
        id = j.id;
        var chain = Promise.resolve();
        for (var i = 0; i < partsN; i++) (function (i) {
          chain = chain.then(function () {
            setP(4 + (i / partsN) * 16, 'Uploading the PDF (' + (i + 1) + ' of ' + partsN + ')…');
            return api('newsletters/' + id + '/pdf-part?part=' + i, { method: 'PUT', body: file.slice(i * CHUNK, (i + 1) * CHUNK), headers: { 'Content-Type': 'application/octet-stream' } });
          });
        })(i);
        return chain;
      })
      .then(function () {
        if (!window.pdfjsLib) return null;
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = '/admin/vendor/pdf.worker.min.js';
        return file.arrayBuffer().then(function (buf) { return window.pdfjsLib.getDocument({ data: buf }).promise; });
      })
      .then(function (pdf) {
        if (!pdf) return;
        var total = Math.min(pdf.numPages, 40), chain = Promise.resolve();
        for (var n = 1; n <= total; n++) (function (n) {
          chain = chain.then(function () {
            setP(20 + ((n - 1) / total) * 74, 'Preparing page ' + n + ' of ' + total + '…');
            return pdf.getPage(n).then(function (page) {
              var vp = page.getViewport({ scale: 1200 / page.getViewport({ scale: 1 }).width });
              var c = document.createElement('canvas'); c.width = Math.round(vp.width); c.height = Math.round(vp.height);
              var ctx = c.getContext('2d'); ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
              return page.render({ canvasContext: ctx, viewport: vp }).promise
                .then(function () { return page.getTextContent(); })
                .then(function (tc) {
                  var t = ''; tc.items.forEach(function (it) { t += it.str + (it.hasEOL ? '\n' : ' '); });
                  text += t.replace(/[ \t]+\n/g, '\n').trim() + '\n\n';
                  return new Promise(function (res) { c.toBlob(function (b) { if (b && b.type === 'image/webp') res(b); else c.toBlob(res, 'image/jpeg', 0.8); }, 'image/webp', 0.8); });
                })
                .then(function (blob) { return api('newsletters/' + id + '/page/' + n, { method: 'PUT', body: blob, headers: { 'Content-Type': blob.type } }); })
                .then(function (r) { pages.push(r.key); });
            });
          });
        })(n);
        return chain;
      })
      .then(function () { setP(96, 'Publishing…'); return api('newsletters/' + id + '/finish', { method: 'POST', body: { pdfParts: partsN, pages: pages, text: text.trim() } }); })
      .then(function (r) { note('Newsletter "' + val('nl-title') + '" ' + (r.published ? 'is published.' : 'is saved as a draft.')); return reload(); })
      .then(function () { viewNewsletters(); })
      .catch(function (e) { busy(btn, false); alertBox('Something went wrong: ' + e.message); });
  }

  /* ---------- messages ---------- */
  function viewMessages() {
    shell('messages', 'Messages from the website', '<p class="muted">Loading…</p>');
    api('messages').then(function (j) {
      var intro = '<p class="muted">Every contact form message is emailed to the practice by Netlify Forms (set the email address in Netlify under <strong>Forms › Form notifications</strong>), and Netlify filters out spam. Please delete messages you no longer need (POPIA).</p>';
      if (!j.configured) {
        shell('messages', 'Messages from the website', intro + '<div class="box"><p>Messages are kept safely in your Netlify account.</p><p><a class="btn btn-primary" href="' + esc(j.dashboard) + '" target="_blank" rel="noopener">Open messages in Netlify ↗</a></p><p class="small muted">To read them here as well, add a Netlify personal access token as the environment variable <code>NETLIFY_API_TOKEN</code> (see README).</p></div>');
        return;
      }
      shell('messages', 'Messages from the website', intro + (j.messages.length ? '' : '<p class="muted">No messages yet.</p>') + j.messages.map(function (m) {
        return '<article class="box msg"><div class="msg-head"><div><strong>' + esc(m.name) + '</strong> · ' + esc(m.topic || '') + '<br><span class="small"><a href="mailto:' + esc(m.email) + '">' + esc(m.email) + '</a>' +
          (m.phone ? ' · <a href="tel:' + esc(String(m.phone).replace(/[^0-9+]/g, '')) + '">' + esc(m.phone) + '</a>' : '') + ' · ' + esc(m.practice || '') + ' · ' + esc(m.lang || '') + '</span></div>' +
          '<span class="muted small">' + esc(new Date(m.date).toLocaleString('en-ZA')) + '</span></div><p class="msg-body">' + esc(m.message).replace(/\n/g, '<br>') + '</p>' +
          '<div class="btn-row"><button class="btn btn-danger sm" data-del="' + esc(m.id) + '">Delete</button></div></article>';
      }).join(''));
      app.querySelectorAll('[data-del]').forEach(function (b) {
        b.onclick = function () {
          if (b.dataset.confirm !== '1') { b.dataset.confirm = '1'; b.textContent = 'Click again to delete'; return; }
          api('messages/' + b.dataset.del, { method: 'DELETE' }).then(function () { note('Message deleted.'); viewMessages(); });
        };
      });
    }).catch(function (e) { note(e.message, 'err'); viewDashboard(); });
  }

  /* ---------- SEO & sharing ---------- */
  function viewSeo() {
    var host = location.host;
    shell('seo', 'SEO & social sharing',
      '<p class="muted">These are the titles and descriptions Google shows in search results, and that appear when someone shares a page on WhatsApp, Facebook or LinkedIn. Keep titles under 60 characters and descriptions under 155. To use your own sharing picture, upload it under <a href="#images">Images › SEO &amp; sharing</a>.</p>' +
      '<form id="seo" class="seo-list">' + Object.keys(S.seo).map(function (p) {
        var d = S.seo[p], key = p === '' ? 'home' : p.replace(/\/$/, '');
        var img = S.images.share_default ? mediaUrl(S.images.share_default.file) : '/assets/img/og/' + d.og + '.jpg';
        return '<section class="box seo-item"><h2>' + esc(d.label) + ' <span class="muted small">/' + esc(p) + '</span></h2><div class="seo-grid"><div class="seo-fields">' +
          '<div class="field"><label for="t_' + key + '">Meta title</label><input type="text" id="t_' + key + '" data-path="' + esc(p) + '" data-kind="title" maxlength="120" data-count="60" value="' + esc(d.title) + '"><span class="hint counter"></span></div>' +
          '<div class="field"><label for="d_' + key + '">Meta description</label><textarea id="d_' + key + '" data-path="' + esc(p) + '" data-kind="description" maxlength="300" data-count="155" style="min-height:90px">' + esc(d.description) + '</textarea><span class="hint counter"></span></div></div>' +
          '<div class="seo-previews"><div class="g-preview" aria-label="Google preview"><span class="g-url">' + esc(host + '/' + p).replace(/\/$/, '') + '</span><span class="g-title" data-pt="' + key + '">' + esc(d.title) + '</span><span class="g-desc" data-pd="' + key + '">' + esc(d.description) + '</span></div>' +
          '<div class="s-preview" aria-label="Social media preview"><img src="' + esc(img) + '" alt="" loading="lazy"><div><span class="s-host">' + esc(host.toUpperCase()) + '</span><strong data-pt="' + key + '">' + esc(d.title) + '</strong><span data-pd="' + key + '">' + esc(d.description) + '</span></div></div></div></div></section>';
      }).join('') + '<div class="save-bar"><button class="btn btn-primary" type="submit">Save all titles and descriptions</button></div></form>');
    app.querySelectorAll('[data-count]').forEach(function (el) {
      var max = +el.dataset.count, counter = el.parentNode.querySelector('.counter'), key = el.id.slice(2), kind = el.dataset.kind;
      function upd() {
        var n = el.value.length;
        counter.textContent = n + ' / ' + max + ' characters' + (n > max ? ' – too long, Google will cut it off' : (n < max * 0.5 ? ' – a little short' : ' – good'));
        counter.className = 'hint counter ' + (n > max ? 'bad' : 'good');
        app.querySelectorAll(kind === 'title' ? '[data-pt="' + key + '"]' : '[data-pd="' + key + '"]').forEach(function (x) { x.textContent = el.value; });
      }
      el.addEventListener('input', upd); upd();
    });
    document.getElementById('seo').onsubmit = function (ev) {
      ev.preventDefault();
      var body = {};
      app.querySelectorAll('[data-path]').forEach(function (el) { (body[el.dataset.path] = body[el.dataset.path] || {})[el.dataset.kind] = el.value; });
      var b = ev.target.querySelector('.save-bar button'); busy(b, true, 'Saving…');
      api('seo', { method: 'POST', body: body }).then(reload).then(function () { note('Page titles and descriptions saved.'); viewSeo(); })
        .catch(function (e) { note(e.message, 'err'); viewSeo(); });
    };
  }

  /* ---------- settings ---------- */
  function viewSettings() {
    var s = S.settings;
    var f = function (id, label, value, extra, hint) { return '<div class="field"><label for="' + id + '">' + label + '</label><input type="text" id="' + id + '" value="' + esc(value) + '"' + (extra || '') + '>' + (hint ? '<span class="hint">' + hint + '</span>' : '') + '</div>'; };
    shell('settings', 'Settings',
      '<form class="box form" id="st"><h2 class="full">Contact details on the website</h2>' +
      f('phone', 'Phone number', s.phone) + f('whatsapp', 'WhatsApp number', s.whatsapp, ' placeholder="e.g. 082 123 4567"', 'WhatsApp buttons appear across the site once this is filled in.') +
      f('email', 'Email shown on the website', s.email, ' type="email"') + f('hours', 'Office hours', s.hours) +
      f('google_reviews_url', 'Google reviews link', s.google_reviews_url, ' placeholder="https://g.page/…"') + f('facebook_url', 'Facebook page', s.facebook_url, ' placeholder="https://facebook.com/…"') +
      f('info_officer', 'Information Officer (POPIA)', s.info_officer, '', 'Shown in the privacy policy.') +
      '<h2 class="full" style="margin-top:12px">Analytics &amp; Google</h2>' +
      f('ga4_id', 'Google Analytics 4 Measurement ID', s.ga4_id, ' placeholder="G-XXXXXXXXXX"', 'Analytics only runs for visitors who accept cookies.') +
      f('gsc_verification', 'Google Search Console verification', s.gsc_verification, ' placeholder="Paste the code or the whole meta tag"') +
      '<p class="full small muted">Contact form emails and spam filtering are set up in Netlify under <strong>Forms › Form notifications</strong>.</p>' +
      '<div class="full"><button class="btn btn-primary" type="submit">Save settings</button></div></form>' +
      '<form class="box form" id="pw" style="margin-top:24px"><h2 class="full">Change your login</h2>' +
      '<div class="field"><label for="u">Username</label><input type="text" id="u" autocomplete="username" value="' + esc(S.user) + '"></div>' +
      '<div class="field"><label for="cur">Current password</label><input type="password" id="cur" autocomplete="current-password" required></div>' +
      '<div class="field"><label for="nw">New password (at least 10 characters)</label><input type="password" id="nw" autocomplete="new-password" minlength="10" required></div>' +
      '<div class="field"><label for="cf">Repeat new password</label><input type="password" id="cf" autocomplete="new-password" minlength="10" required></div>' +
      '<div class="full"><button class="btn btn-primary" type="submit">Change login</button></div></form>');
    document.getElementById('st').onsubmit = function (ev) {
      ev.preventDefault();
      var body = {}; ['phone', 'whatsapp', 'email', 'hours', 'google_reviews_url', 'facebook_url', 'info_officer', 'ga4_id', 'gsc_verification'].forEach(function (k) { body[k] = val(k); });
      api('settings', { method: 'POST', body: body }).then(reload).then(function () { note('Settings saved.'); viewSettings(); }).catch(function (e) { note(e.message, 'err'); viewSettings(); });
    };
    document.getElementById('pw').onsubmit = function (ev) {
      ev.preventDefault();
      api('password', { method: 'POST', body: { user: val('u'), current: val('cur'), next: val('nw'), confirm: val('cf') } })
        .then(reload).then(function () { note('Your login details have been changed.'); viewSettings(); })
        .catch(function (e) { note(e.message, 'err'); viewSettings(); });
    };
  }

  /* ---------- router ---------- */
  function route() {
    var h = location.hash.replace(/^#/, '').split('/');
    if (!S) return viewLogin();
    switch (h[0]) {
      case 'team': return viewTeam(h[1] ? decodeURIComponent(h[1]) : '');
      case 'images': return viewImages();
      case 'newsletters': return viewNewsletters(h[1] ? decodeURIComponent(h[1]) : '');
      case 'messages': return viewMessages();
      case 'seo': return viewSeo();
      case 'settings': return viewSettings();
      default: return viewDashboard();
    }
  }
  window.addEventListener('hashchange', route);
  api('status').then(function (st) {
    if (st.setupNeeded) return viewSetup();
    if (!st.loggedIn) return viewLogin();
    return reload().then(route);
  }).catch(function (e) { viewLogin(e.message); });
})();
