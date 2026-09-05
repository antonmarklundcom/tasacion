/* assets/js/site.js — MVP. Un solo número de WhatsApp, un solo ID de analítica. */
(function () {
  window.dataLayer = window.dataLayer || [];
  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-ev]');
    if (!t) return;
    window.dataLayer.push({ event: t.dataset.ev, ev_loc: t.dataset.evLoc || '', page_path: location.pathname });
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
})();
