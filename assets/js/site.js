/* assets/js/site.js — un solo número de WhatsApp, un solo ID de analítica.
   Header sticky, hamburguesa móvil y menú WhatsApp (§4 de plan.md). */
(function () {
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-ev]');
    if (!t) return;
    window.dataLayer.push({ event: t.dataset.ev, ev_loc: t.dataset.evLoc || '', page_path: location.pathname, wa_option: t.dataset.waOpen || t.dataset.waOption || '' });
  }, true);

  var ID = (typeof ANALYTICS_ID === 'string' ? ANALYTICS_ID : '').trim();
  if (ID) {
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

  var n = window.WA_NUMBER;
  document.querySelectorAll('a[href^="https://wa.me/"]').forEach(function (a) {
    a.href = a.href.replace(/wa\.me\/\d+/, 'wa.me/' + n);
  });
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.href = 'tel:+' + n;
  });

  var pu = document.getElementById('page_url');
  if (pu) pu.value = location.href;

  var yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------- header stuck */
  var hdr = document.querySelector('[data-hdr]');
  if (hdr) {
    var onScroll = function () {
      hdr.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    document.addEventListener('scroll', onScroll, { passive: true });

    var burger = document.querySelector('[data-hdr-burger]');
    var panel = document.querySelector('[data-hdr-panel]');
    if (burger && panel) {
      burger.addEventListener('click', function () {
        var open = panel.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }
  }

  /* -------------------------------------------------------------- WA menu
     Every [data-wa-trigger] opens the single [data-wa-menu] panel. A trigger
     may carry data-wa-open="<optionId>" to preselect/focus that option
     (defaults to the first, "informe"); [data-wa-anchor] positions the panel
     next to the header pill or the FAB. Progressive enhancement: without
     this script every trigger stays a plain <a href="https://wa.me/...">. */
  var menu = document.querySelector('[data-wa-menu]');
  var triggers = Array.prototype.slice.call(document.querySelectorAll('[data-wa-trigger]'));
  if (menu && triggers.length) {
    var panelEl = menu.querySelector('[data-wa-panel]');
    var options = Array.prototype.slice.call(menu.querySelectorAll('.wa-menu__option'));
    var lastTrigger = null;

    function isOpen() { return menu.classList.contains('is-open'); }

    function open(trigger) {
      lastTrigger = trigger || null;
      var anchor = (trigger && trigger.dataset.waAnchor) || 'fab';
      panelEl.setAttribute('data-anchor', anchor);
      menu.hidden = false;
      requestAnimationFrame(function () { menu.classList.add('is-open'); });
      triggers.forEach(function (t) { t.setAttribute('aria-expanded', t === trigger ? 'true' : 'false'); });
      var wantId = trigger && trigger.dataset.waOpen;
      var target = (wantId && options.filter(function (o) { return o.dataset.waOption === wantId; })[0]) || options[0];
      options.forEach(function (o) { o.classList.toggle('wa-menu__option--current', o === target); });
      if (target) target.focus();
    }

    function close(returnFocus) {
      if (!isOpen()) { menu.hidden = true; return; }
      menu.classList.remove('is-open');
      triggers.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
      window.setTimeout(function () { menu.hidden = true; }, 200);
      if (returnFocus && lastTrigger) lastTrigger.focus();
      lastTrigger = null;
    }

    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (isOpen()) { close(true); } else { open(trigger); }
      });
    });

    menu.querySelectorAll('[data-wa-close]').forEach(function (closer) {
      closer.addEventListener('click', function (e) { e.preventDefault(); close(true); });
    });

    options.forEach(function (option) {
      option.addEventListener('click', function () { close(false); });
    });

    document.addEventListener('click', function (e) {
      if (!isOpen()) return;
      if (panelEl && panelEl.contains(e.target)) return;
      if (triggers.some(function (t) { return t.contains(e.target); })) return;
      close(false);
    });

    document.addEventListener('keydown', function (e) {
      if (!isOpen()) return;
      if (e.key === 'Escape') { close(true); return; }
      if (e.key !== 'Tab') return;
      var focusable = Array.prototype.slice.call(
        menu.querySelectorAll('.wa-menu__option, [data-wa-close]:not([aria-hidden="true"])')
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }
})();
