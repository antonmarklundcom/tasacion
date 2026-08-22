/* assets/js/site.js — shared across all pages.
   Contains: 1) analytics shim  2) motion.js (web-design-system, verbatim)
   3) page script (WA_NUMBER rewrite, --bleedw, page_url, #yr, consent).
   The qualifier (#q-send/#q-preview) is page-specific and lives inline
   on / and /cotizador/ only — this script tolerates its absence. */

(function(){
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function(e){
    var t = e.target.closest('[data-ev]');
    if (!t) return;
    window.dataLayer.push({
      event: t.dataset.ev,
      ev_loc: t.dataset.evLoc || '',
      page_path: location.pathname,
      site: location.hostname
    });
  }, true);

  /* Carga del tag. El ID vive en una sola linea del <head> de cada pagina
     (`ANALYTICS_ID`, igual que `WA_NUMBER`). Sin ID no se pide nada a
     terceros. Con ID, el tag se inyecta solo despues del consentimiento
     de estadisticas — los eventos de arriba quedan encolados en
     `dataLayer` y el tag los consume al cargar. */
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

/* web-design-system — motion.js. Copy verbatim. No dependencies. ~2KB.
   Budget: at most 15% of elements should carry data-reveal. */
(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d = document;

  // 1. Scroll reveal with capped stagger -------------------------------
  var items = d.querySelectorAll('[data-reveal]');
  if (reduce || !('IntersectionObserver' in window)) {
    items.forEach(function (el) { el.style.opacity = 1; el.style.transform = 'none'; });
  } else {
    items.forEach(function (el) {
      el.style.opacity = 0;
      el.style.transform = 'translateY(18px)';
      el.style.transition = 'opacity 280ms cubic-bezier(.16,1,.3,1), transform 280ms cubic-bezier(.16,1,.3,1)';
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var i = Math.min(+(e.target.dataset.reveal || 0), 6); // cap stagger at 6
        e.target.style.transitionDelay = (i * 70) + 'ms';
        e.target.style.opacity = 1;
        e.target.style.transform = 'none';
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.15 });
    items.forEach(function (el) { io.observe(el); });
  }

  // 2. Count-up on numbers --------------------------------------------
  var nums = d.querySelectorAll('[data-count]');
  if (nums.length && !reduce && 'IntersectionObserver' in window) {
    var nio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, to = parseFloat(el.dataset.count), t0 = null;
        var suffix = el.dataset.countSuffix || '';
        function step(ts) {
          if (!t0) t0 = ts;
          var p = Math.min((ts - t0) / 900, 1);
          var eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(to * eased).toLocaleString() + suffix;
          if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        nio.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(function (el) { nio.observe(el); });
  }

  // 3. Sticky header state --------------------------------------------
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
})();

(function () {
  var d = document;

  // --- 1. Un solo número. Cambiar WA_NUMBER arriba reescribe todo. ----
  (function () {
    var n = window.WA_NUMBER;
    d.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) {
      a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + n);
    });
    d.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.href = 'tel:+' + n;
    });
  })();

  // --- 2. Ancho real de página (sin barra de scroll) para los .bleed ---
  (function () {
    var root = d.documentElement, raf = false;
    function measure() {
      root.style.setProperty('--bleedw', root.clientWidth + 'px');
      raf = false;
    }
    measure();
    window.addEventListener('resize', function () {
      if (raf) return;
      raf = true;
      requestAnimationFrame(measure);
    }, { passive: true });
  })();

  // --- 3. page_url oculto para el handler de leads --------------------
  var pu = d.getElementById('page_url');
  if (pu) pu.value = location.href;

  var yr = d.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  // --- 5. Consentimiento (Ley 6534/2020). Nada pre-marcado. -----------
  var box = d.getElementById('consent');
  if (box) {
    var KEY = 'tsc_consent';
    if (!localStorage.getItem(KEY)) box.setAttribute('data-open', '');
    function close(v) {
      try { localStorage.setItem(KEY, v); } catch (e) {}
      box.removeAttribute('data-open');
      var a = window.tscAnalytics;
      if (!a) return;
      // Aceptar carga el tag al instante. Retirar el consentimiento con el
      // tag ya cargado exige recargar: no se puede desinyectar un script.
      if (v === 'stats') a.load();
      else if (a.isLoaded()) location.reload();
    }
    d.getElementById('consent-save').addEventListener('click', function () {
      close(d.getElementById('consent-stats').checked ? 'stats' : 'necessary');
    });
    d.getElementById('consent-reject').addEventListener('click', function () { close('necessary'); });
    d.getElementById('consent-reopen').addEventListener('click', function (e) {
      e.preventDefault();
      d.getElementById('consent-stats').checked = localStorage.getItem(KEY) === 'stats';
      box.setAttribute('data-open', '');
    });
  }
})();
