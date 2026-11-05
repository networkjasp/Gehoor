(function () {
  'use strict';
  var html = document.documentElement;
  function store(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key) || 'null');
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) { return null; }
  }

  /* ---------- Reading options: text size + high contrast ---------- */
  var prefs = store('gidm-a11y') || {};
  function applyPrefs() {
    if (prefs.size && prefs.size > 1) html.dataset.size = prefs.size; else delete html.dataset.size;
    if (prefs.contrast) html.dataset.contrast = '1'; else delete html.dataset.contrast;
    var b = document.querySelector('[data-a11y="contrast"]');
    if (b) b.setAttribute('aria-pressed', prefs.contrast ? 'true' : 'false');
  }
  applyPrefs();
  document.addEventListener('click', function (ev) {
    var b = ev.target.closest('[data-a11y]');
    if (!b) return;
    var a = b.getAttribute('data-a11y'), size = prefs.size || 1;
    if (a === 'bigger') prefs.size = Math.min(3, size + 1);
    if (a === 'smaller') prefs.size = Math.max(1, size - 1);
    if (a === 'contrast') prefs.contrast = !prefs.contrast;
    store('gidm-a11y', prefs); applyPrefs();
  });

  /* ---------- Mobile menu ---------- */
  var btn = document.querySelector('.menu-btn');
  var nav = document.getElementById('site-nav');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) { nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.focus(); }
    });
  }

  /* ---------- Cookie consent (POPIA) + Google Analytics only after consent ---------- */
  var banner = document.getElementById('consent');
  var consent = store('gidm-consent'); // {analytics:bool, at:timestamp}
  var gaId = html.getAttribute('data-ga');
  var gaLoaded = false;
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  function loadAnalytics() {
    if (!gaId || gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(gaId);
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', gaId, { anonymize_ip: true });
  }
  function track(name, params) {
    if (gaLoaded) gtag('event', name, params || {});
  }
  function showBanner(show) { if (banner) banner.hidden = !show; }
  function setConsent(all) {
    consent = { analytics: !!all, at: Date.now() };
    store('gidm-consent', consent);
    showBanner(false);
    if (all) { loadAnalytics(); loadAllMaps(); }
  }
  if (!consent || (Date.now() - consent.at) > 365 * 864e5) showBanner(true);
  else if (consent.analytics) loadAnalytics();
  document.addEventListener('click', function (ev) {
    var c = ev.target.closest('[data-consent]');
    if (c) setConsent(c.getAttribute('data-consent') === 'all');
    if (ev.target.closest('[data-consent-open]')) { showBanner(true); var f = banner && banner.querySelector('button'); if (f) f.focus(); }
  });

  /* ---------- Google Maps: load only with permission ---------- */
  function loadMap(slot) {
    if (!slot || slot.querySelector('iframe')) return;
    var f = document.createElement('iframe');
    f.src = slot.getAttribute('data-map-src');
    f.title = slot.getAttribute('data-map-title') || 'Map';
    f.loading = 'lazy';
    f.referrerPolicy = 'no-referrer-when-downgrade';
    slot.innerHTML = '';
    slot.appendChild(f);
  }
  function loadAllMaps() { document.querySelectorAll('[data-map-src]').forEach(loadMap); }
  if (consent && consent.analytics) loadAllMaps();
  document.addEventListener('click', function (ev) {
    var m = ev.target.closest('[data-map-load]');
    if (m) loadMap(m.closest('[data-map-src]'));
  });

  /* ---------- Event tracking (only sent when analytics was accepted) ---------- */
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-track]');
    if (t) track(t.getAttribute('data-track'), { link_text: (t.textContent || '').trim().slice(0, 60), page_path: location.pathname });
  });

  /* ---------- Form validation (the server checks everything again) ---------- */
  document.querySelectorAll('form[data-validate]').forEach(function (form) {
    function fieldError(el) {
      if (el.validity.valid) return '';
      return el.getAttribute('data-msg') || el.validationMessage;
    }
    function show(el, msg) {
      var holder = el.closest('.field') || el.closest('.full') || el.parentNode;
      var id = 'err-' + (el.id || el.name);
      var box = document.getElementById(id);
      if (msg) {
        if (!box) {
          box = document.createElement('span');
          box.className = 'hint field-error';
          box.id = id;
          holder.appendChild(box);
        }
        box.textContent = msg;
        el.setAttribute('aria-invalid', 'true');
        el.setAttribute('aria-describedby', id);
      } else {
        if (box) box.remove();
        el.removeAttribute('aria-invalid');
        el.removeAttribute('aria-describedby');
      }
    }
    var fields = form.querySelectorAll('input:not([type=hidden]):not([tabindex="-1"]), textarea, select');
    fields.forEach(function (el) {
      el.addEventListener('blur', function () { if (el.value !== '' || el.getAttribute('aria-invalid')) show(el, fieldError(el)); });
      el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) show(el, fieldError(el)); });
      el.addEventListener('change', function () { if (el.getAttribute('aria-invalid')) show(el, fieldError(el)); });
    });
    form.addEventListener('submit', function (ev) {
      var first = null;
      fields.forEach(function (el) {
        var msg = fieldError(el);
        show(el, msg);
        if (msg && !first) first = el;
      });
      if (first) {
        ev.preventDefault();
        first.focus();
        return;
      }
      if (form.hasAttribute('data-netlify-ajax')) { ev.preventDefault(); sendNetlify(form); return; }
      var b = form.querySelector('button[type=submit]');
      if (b) { b.disabled = true; b.textContent = 'Sending…'; }
    });
  });

  /* ---------- Contact form → Netlify Forms (emails the practice; spam filtered by Netlify) ---------- */
  var loadedAt = Date.now();
  function formStatus(form, cls, msg) {
    var box = form.parentNode.querySelector('.form-status');
    box.className = 'form-status alert ' + cls;
    box.textContent = msg;
    box.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
  function sendNetlify(form) {
    var btn = form.querySelector('button[type=submit]');
    var msg = form.querySelector('[name=message]');
    var links = (msg.value.match(/https?:\/\/|www\./gi) || []).length;
    if (links > 2) { formStatus(form, 'err', 'Please remove the web links from your message.'); msg.focus(); return; }
    var data = new FormData(form);
    var topic = data.get('topic') || 'Enquiry';
    data.set('subject', 'Website enquiry: ' + topic + ' – ' + (data.get('name') || ''));
    var done = function () {
      form.hidden = true;
      formStatus(form, 'ok', 'Thank you, your message has been sent. We\'ll be in touch within one working day.');
      track('generate_lead', { form: 'contact', topic: topic });
    };
    // Bots fill forms in a split second or fill the hidden field: pretend it worked, send nothing.
    if (data.get('website') || Date.now() - loadedAt < 3000) { done(); return; }
    btn.disabled = true; btn.textContent = 'Sending…';
    fetch(form.getAttribute('action') || '/__forms.html', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams(data).toString()
    }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      done();
    }).catch(function () {
      btn.disabled = false; btn.textContent = 'Send message';
      formStatus(form, 'err', 'Sorry, your message could not be sent. Please try again, or call us on ' + ((document.querySelector('a[href^="tel:"]') || {}).textContent || '').trim() + '.');
    });
  }

  /* ---------- Yes/No self-checks ---------- */
  document.querySelectorAll('[data-quiz]').forEach(function (quiz) {
    var result = quiz.querySelector('.quiz-result');
    var threshold = parseInt(quiz.getAttribute('data-threshold') || '2', 10);
    quiz.addEventListener('click', function (ev) {
      var b = ev.target.closest('.yn button');
      if (!b) return;
      b.parentNode.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var qs = quiz.querySelectorAll('.quiz-q');
      var answered = 0, yes = 0;
      qs.forEach(function (q) {
        var p = q.querySelector('button[aria-pressed="true"]');
        if (p) { answered++; if (p.value === 'yes') yes++; }
      });
      if (answered === qs.length) {
        result.textContent = yes >= threshold ? quiz.getAttribute('data-high') : quiz.getAttribute('data-low');
        track('hearing_check_complete', { quiz: quiz.id, result: yes >= threshold ? 'recommend_test' : 'fine' });
      } else {
        result.textContent = 'Answered ' + answered + ' of ' + qs.length + ' questions.';
      }
    });
  });
})();
