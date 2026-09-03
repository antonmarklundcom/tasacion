/* assets/js/site.js — shared across all pages. Vanilla, no dependencies.
   1) analytics shim (consent-gated tag load)
   2) header nav (toggle, dropdown)
   3) zone selector (sets z= on every wa_url link on the page)
   4) page glue: page_url, sticky header state
   5) consent dialog (Ley 6534/2020: nothing pre-marked, nothing loads before consent) */

(function () {
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-ev]');
    if (!t) return;
    window.dataLayer.push({
      event: t.dataset.ev,
      ev_loc: t.dataset.evLoc || '',
      page_path: location.pathname,
      site: location.hostname
    });
  }, true);

  var ID = (typeof ANALYTICS_ID === 'string' ? ANALYTICS_ID : '').trim();
  var loaded = false;

  function load() {
    if (loaded || !ID) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    if (ID.indexOf('GTM-') === 0) {
      window.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      s.src = 'https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(ID);
    } else {
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', ID, { anonymize_ip: true });
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(ID);
    }
    document.head.appendChild(s);
  }

  window.tscAnalytics = { load: load, isLoaded: function () { return loaded; } };
  try { if (localStorage.getItem('tsc_consent') === 'stats') load(); } catch (e) {}
})();

(function () {
  var d = document;

  // --- Header nav: hamburger + dropdown -------------------------------
  var toggle = d.getElementById('nav-toggle');
  var panel = d.getElementById('nav-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      var open = panel.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
  var ddBtn = d.getElementById('nav-dropdown-btn');
  var dd = d.getElementById('nav-dropdown');
  if (ddBtn && dd) {
    ddBtn.addEventListener('click', function () {
      var open = dd.classList.toggle('is-open');
      ddBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    d.addEventListener('click', function (e) {
      if (!ddBtn.contains(e.target) && !dd.contains(e.target)) {
        dd.classList.remove('is-open');
        ddBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // --- Zone selector: progressive enhancement of wa_url() links -------
  var zoneWrap = d.querySelector('[data-zone-selector]');
  if (zoneWrap) {
    var buttons = zoneWrap.querySelectorAll('[data-zone]');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        buttons.forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        var zone = btn.dataset.zone || '';
        d.querySelectorAll('a[href^="/go/whatsapp.php"]').forEach(function (a) {
          try {
            var url = new URL(a.href, location.origin);
            if (zone) { url.searchParams.set('z', zone); }
            else { url.searchParams.delete('z'); }
            a.href = url.pathname + '?' + url.searchParams.toString();
          } catch (e) {}
        });
      });
    });
  }

  // --- Smooth scroll for [data-scroll] hero buttons --------------------
  d.querySelectorAll('[data-scroll]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = d.getElementById(a.dataset.scroll);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // --- page_url hidden field for the lead handler ----------------------
  d.querySelectorAll('#page_url').forEach(function (el) { el.value = location.href; });

  // --- Sticky header state ---------------------------------------------
  var hdr = d.querySelector('[data-sticky-header]');
  if (hdr) {
    var tick = false;
    window.addEventListener('scroll', function () {
      if (tick) return;
      tick = true;
      requestAnimationFrame(function () {
        hdr.classList.toggle('is-stuck', window.scrollY > 24);
        tick = false;
      });
    }, { passive: true });
  }

  // --- Consent dialog (Ley 6534/2020). Nothing pre-marked. --------------
  var box = d.getElementById('consent');
  if (box) {
    var KEY = 'tsc_consent';
    try { if (!localStorage.getItem(KEY)) box.setAttribute('data-open', ''); } catch (e) { box.setAttribute('data-open', ''); }

    function close(v) {
      try { localStorage.setItem(KEY, v); } catch (e) {}
      box.removeAttribute('data-open');
      var a = window.tscAnalytics;
      if (!a) return;
      if (v === 'stats') a.load();
      else if (a.isLoaded()) location.reload();
    }

    var saveBtn = d.getElementById('consent-save');
    var rejectBtn = d.getElementById('consent-reject');
    var reopenBtn = d.getElementById('consent-reopen');
    var statsCheck = d.getElementById('consent-stats');

    if (saveBtn) saveBtn.addEventListener('click', function () {
      close(statsCheck && statsCheck.checked ? 'stats' : 'necessary');
    });
    if (rejectBtn) rejectBtn.addEventListener('click', function () { close('necessary'); });
    if (reopenBtn) reopenBtn.addEventListener('click', function (e) {
      e.preventDefault();
      try { if (statsCheck) statsCheck.checked = localStorage.getItem(KEY) === 'stats'; } catch (err) {}
      box.setAttribute('data-open', '');
    });
  }
})();
