<?php
declare(strict_types=1);
$cfg = site_config();
$path = current_path();
$page = current_page();
$year = date('Y');
$noSticky = in_array($path, ['/valuacion-para-vender/', '/gracias/'], true);

// Auto breadcrumb for all non-home, non-404 pages.
if ($path !== '/' && ($page['template'] ?? '') !== '404') {
    add_jsonld([
        '@context' => 'https://schema.org',
        '@type'    => 'BreadcrumbList',
        'itemListElement' => [
            ['@type' => 'ListItem', 'position' => 1, 'name' => 'Inicio', 'item' => abs_url('/')],
            ['@type' => 'ListItem', 'position' => 2, 'name' => $page['nav'] ?? $page['title'] ?? '', 'item' => abs_url($path)],
        ],
    ]);
}
?>
<?php if (!$noSticky): ?>
<div class="sticky-wa">
  <a class="btn btn-primary" href="<?= h(wa_url(($page['template'] ?? 'page') . '-sticky', $page['type'] ?? 'general')) ?>" data-ev="wa_click" data-ev-loc="<?= h(($page['template'] ?? 'page') . '-sticky') ?>">
    Escribinos por WhatsApp
  </a>
</div>
<?php endif; ?>

<footer class="site-footer">
  <div class="container footer-grid">
    <div class="footer-col footer-brand">
      <p class="footer-wordmark">Tasación<span>.com.py</span></p>
      <p>Informe pericial de tasación con validez legal, y valoración comercial sin costo para vender, en Asunción y Gran Asunción.</p>
      <p class="footer-coverage"><?= h(implode(' · ', array_slice($cfg['coverage'], 0, 7))) ?></p>
    </div>
    <div class="footer-col">
      <p class="footer-col-title">Tasaciones</p>
      <ul>
        <li><a href="/tasaciones/casas/">Casas</a></li>
        <li><a href="/tasaciones/departamentos/">Departamentos</a></li>
        <li><a href="/tasaciones/terrenos/">Terrenos</a></li>
        <li><a href="/tasaciones/corporativa/">Corporativa</a></li>
        <li><a href="/tasaciones/hipotecaria/">Hipotecaria</a></li>
        <li><a href="/tasaciones/locales-comerciales/">Locales comerciales</a></li>
        <li><a href="/tasaciones/campos/">Campos</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <p class="footer-col-title">Sitio</p>
      <ul>
        <li><a href="/informes-periciales/">Informe pericial</a></li>
        <li><a href="/valuacion-para-vender/">Valoración gratuita</a></li>
        <li><a href="/nosotros/">Nosotros</a></li>
        <li><a href="/preguntas-frecuentes/">Preguntas frecuentes</a></li>
        <li><a href="/contacto/">Contacto</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <p class="footer-col-title">Contacto</p>
      <ul>
        <li><a href="<?= h(wa_url('footer', 'general')) ?>" data-ev="wa_click" data-ev-loc="footer">Escribinos por WhatsApp</a></li>
        <li><a href="tel:+<?= h($cfg['wa_number']) ?>"><?= h($cfg['wa_display']) ?></a></li>
        <?php if ($cfg['contact_email'] !== ''): ?>
        <li><a href="mailto:<?= h($cfg['contact_email']) ?>"><?= h($cfg['contact_email']) ?></a></li>
        <?php endif; ?>
        <?php if ($cfg['contact_phone'] !== ''): ?>
        <li><a href="tel:<?= h($cfg['contact_phone']) ?>"><?= h($cfg['contact_phone']) ?></a></li>
        <?php endif; ?>
        <li><?= h($cfg['address']) ?></li>
      </ul>
    </div>
  </div>
  <div class="container footer-legal">
    <p>© <?= h($year) ?> Tasación.com.py</p>
    <nav class="footer-legal-links">
      <a href="/politica-de-privacidad/">Política de privacidad</a>
      <a href="/politica-de-cookies/">Política de cookies</a>
      <a href="/terminos-y-condiciones/">Términos y condiciones</a>
      <a href="#" id="consent-reopen">Preferencias de cookies</a>
    </nav>
  </div>
</footer>

<div class="consent" id="consent" role="dialog" aria-modal="true" aria-labelledby="consent-title">
  <div class="consent-box">
    <p class="consent-title" id="consent-title">Tu privacidad</p>
    <p>Usamos una cookie funcional para recordar tu preferencia. Si activás las estadísticas, guardamos datos anónimos de uso para entender qué páginas sirven. Esta página no usa cookies de publicidad ni de seguimiento de terceros.</p>
    <label class="consent-check">
      <input type="checkbox" id="consent-stats">
      Activar estadísticas anónimas
    </label>
    <div class="consent-actions">
      <button type="button" class="btn btn-ghost" id="consent-reject">Solo lo necesario</button>
      <button type="button" class="btn btn-primary" id="consent-save">Guardar preferencias</button>
    </div>
  </div>
</div>

<?php foreach (jsonld_blocks() as $block): ?>
<script type="application/ld+json"><?= json_encode($block, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) ?></script>
<?php endforeach; ?>

<script src="/assets/js/site.js"></script>
</body>
</html>
