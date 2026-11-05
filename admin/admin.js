(function () {
  'use strict';

  // Confirmation before deleting.
  document.addEventListener('submit', function (ev) {
    var f = ev.target;
    var sub = ev.submitter;
    var msg = (sub && sub.getAttribute('data-confirm-btn')) || f.getAttribute('data-confirm');
    if (msg && !window.confirm(msg)) ev.preventDefault();
  });

  // SEO: live character counters and previews.
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var max = parseInt(el.getAttribute('data-count'), 10);
    var counter = el.parentNode.querySelector('.counter');
    var tKey = el.getAttribute('data-preview-title'), dKey = el.getAttribute('data-preview-desc');
    function upd() {
      var n = el.value.length;
      counter.textContent = n + ' / ' + max + ' characters' + (n > max ? ' – too long, Google will cut it off' : (n < max * 0.5 ? ' – a little short' : ' – good'));
      counter.className = 'hint counter ' + (n > max ? 'bad' : 'good');
      if (tKey) document.querySelectorAll('[data-pt="' + tKey + '"]').forEach(function (x) { x.textContent = el.value; });
      if (dKey) document.querySelectorAll('[data-pd="' + dKey + '"]').forEach(function (x) { x.textContent = el.value; });
    }
    el.addEventListener('input', upd); upd();
  });

  // Newsletter upload: PDF → page images + text, then publish.
  var form = document.getElementById('nl-form');
  if (!form) return;
  var prog = document.getElementById('nl-progress');
  var bar = prog.querySelector('.bar span');
  var status = prog.querySelector('p');
  var btn = form.querySelector('button[type=submit]');
  var MAX_PAGES = 40;

  function setProgress(pct, text) {
    prog.hidden = false;
    bar.style.width = Math.max(2, Math.min(100, pct)) + '%';
    status.textContent = text;
  }

  function post(fd) {
    return fetch(form.getAttribute('action'), { method: 'POST', body: fd, headers: { 'X-Requested-With': 'fetch' }, credentials: 'same-origin' })
      .then(function (r) {
        return r.json().catch(function () { return { ok: false, error: 'The server returned an unexpected response (' + r.status + '). The file may be larger than your hosting allows.' }; });
      })
      .then(function (j) { if (!j.ok) throw new Error(j.error || 'Upload failed.'); return j; });
  }

  function canvasToBlob(canvas) {
    return new Promise(function (res) { canvas.toBlob(function (b) { res(b); }, 'image/jpeg', 0.82); });
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    var file = form.querySelector('#nl-pdf').files[0];
    if (!file) { alert('Please choose a PDF file.'); return; }
    if (!form.querySelector('#nl-title').value.trim()) { alert('Please enter a title.'); return; }
    var csrf = form.querySelector('[name=csrf]').value;
    btn.disabled = true;
    setProgress(3, 'Uploading the PDF…');

    var id;
    var pages = [];
    var text = '';
    post(new FormData(form)).then(function (j) {
      id = j.id;
      if (!window.pdfjsLib) {
        setProgress(90, 'Page images could not be made in this browser. The newsletter will show the PDF instead.');
        return null;
      }
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = window.PDFJS_WORKER;
      return file.arrayBuffer().then(function (buf) { return window.pdfjsLib.getDocument({ data: buf }).promise; });
    }).then(function (pdf) {
      if (!pdf) return;
      var total = Math.min(pdf.numPages, MAX_PAGES);
      var chain = Promise.resolve();
      for (var i = 1; i <= total; i++) {
        (function (n) {
          chain = chain.then(function () {
            setProgress(5 + (n - 1) / total * 88, 'Preparing page ' + n + ' of ' + total + '…');
            return pdf.getPage(n).then(function (page) {
              var base = page.getViewport({ scale: 1 });
              var scale = 1200 / base.width;
              var vp = page.getViewport({ scale: scale });
              var canvas = document.createElement('canvas');
              canvas.width = Math.round(vp.width);
              canvas.height = Math.round(vp.height);
              var ctx = canvas.getContext('2d');
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              return page.render({ canvasContext: ctx, viewport: vp }).promise
                .then(function () { return page.getTextContent(); })
                .then(function (tc) {
                  var t = '';
                  tc.items.forEach(function (it) { t += it.str + (it.hasEOL ? '\n' : ' '); });
                  text += t.replace(/[ \t]+\n/g, '\n').trim() + '\n\n';
                  return canvasToBlob(canvas);
                })
                .then(function (blob) {
                  var fd = new FormData();
                  fd.append('csrf', csrf);
                  fd.append('action', 'nl_page');
                  fd.append('id', id);
                  fd.append('n', String(n));
                  fd.append('page', blob, 'page-' + n + '.jpg');
                  return post(fd);
                })
                .then(function (r) { pages.push(r.file); });
            });
          });
        })(i);
      }
      return chain;
    }).then(function () {
      setProgress(96, 'Publishing…');
      var fd = new FormData();
      fd.append('csrf', csrf);
      fd.append('action', 'nl_finish');
      fd.append('id', id);
      fd.append('pages', JSON.stringify(pages));
      fd.append('text', text.trim());
      return post(fd);
    }).then(function () {
      setProgress(100, 'Done!');
      window.location.reload();
    }).catch(function (err) {
      btn.disabled = false;
      setProgress(100, 'Something went wrong: ' + err.message);
      bar.style.background = '#B42318';
    });
  });
})();
