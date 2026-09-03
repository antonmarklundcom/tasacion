<?php
declare(strict_types=1);
$cfg = site_config();
$path = current_path();

$tasacionTypes = [
    '/tasaciones/casas/'               => 'Casas',
    '/tasaciones/departamentos/'       => 'Departamentos',
    '/tasaciones/terrenos/'            => 'Terrenos',
    '/tasaciones/corporativa/'         => 'Corporativa',
    '/tasaciones/hipotecaria/'         => 'Hipotecaria',
    '/tasaciones/locales-comerciales/' => 'Locales comerciales',
    '/tasaciones/campos/'              => 'Campos',
];
$inTasaciones = str_starts_with($path, '/tasaciones/');
?>
<header class="nav" data-sticky-header>
  <div class="nav-inner container">
    <a class="nav-brand" href="/">Tasación<span>.com.py</span></a>

    <button class="nav-toggle" id="nav-toggle" aria-expanded="false" aria-controls="nav-panel">
      <span class="sr-only">Abrir menú</span>
      <span class="nav-toggle-bars" aria-hidden="true"></span>
    </button>

    <nav class="nav-panel" id="nav-panel">
      <ul class="nav-links">
        <li class="nav-has-dropdown<?= $inTasaciones ? ' is-current' : '' ?>">
          <button class="nav-dropdown-btn" id="nav-dropdown-btn" aria-expanded="false" aria-controls="nav-dropdown">Tasaciones</button>
          <ul class="nav-dropdown" id="nav-dropdown">
            <?php foreach ($tasacionTypes as $href => $label): ?>
            <li><a href="<?= h($href) ?>"<?= $path === $href ? ' aria-current="page"' : '' ?>><?= h($label) ?></a></li>
            <?php endforeach; ?>
          </ul>
        </li>
        <li><a href="/informes-periciales/"<?= $path === '/informes-periciales/' ? ' aria-current="page"' : '' ?>>Informe pericial</a></li>
        <li><a href="/valuacion-para-vender/"<?= $path === '/valuacion-para-vender/' ? ' aria-current="page"' : '' ?>>Valoración gratuita</a></li>
        <li><a href="/nosotros/"<?= $path === '/nosotros/' ? ' aria-current="page"' : '' ?>>Nosotros</a></li>
        <li><a href="/preguntas-frecuentes/"<?= $path === '/preguntas-frecuentes/' ? ' aria-current="page"' : '' ?>>Preguntas</a></li>
        <li><a href="/contacto/"<?= $path === '/contacto/' ? ' aria-current="page"' : '' ?>>Contacto</a></li>
      </ul>
      <a class="btn btn-primary nav-cta" href="<?= h(wa_url('nav-cta', 'general')) ?>" data-ev="wa_click" data-ev-loc="nav-cta">
        <svg class="ic-wa" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.8 1-.2.2-.3.2-.5.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.2-.3 0-.5.1-.6l.4-.5c.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.1 0 1.2.9 2.4 1 2.6.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.2 1.6.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.6-.3z"/><path fill="currentColor" d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1112 20.2z"/></svg>
        <?= h($cfg['wa_display']) ?>
      </a>
    </nav>
  </div>
</header>
