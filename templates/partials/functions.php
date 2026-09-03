<?php
declare(strict_types=1);

/** Base -> [width, height] at the 1280 variant, used for the img width/height attrs. */
function image_dims(): array
{
    return [
        'tasacion-de-inmuebles-asuncion'          => [1280, 853],
        'tasacion-casas-departamentos-asuncion'   => [1280, 960],
        'tasacion-terrenos-paraguay'               => [1280, 960],
        'tasador-de-terrenos-gran-asuncion'        => [1280, 549],
        'tasacion-locales-comerciales-asuncion'    => [1280, 960],
        'informe-de-tasacion-linderos-paraguay'    => [1280, 960],
        'tasador-midiendo-propiedad-asuncion'      => [1280, 549],
    ];
}

/**
 * <picture> with avif/webp sources at 640/1280/1920 plus a webp <img>
 * fallback. $base is the filename stem in assets/img/ (no size, no ext).
 */
function partial_picture(string $base, string $alt, bool $eager = false): void
{
    $dims = image_dims()[$base] ?? [1280, 960];
    [$w, $h] = $dims;
    $sizes = '(min-width: 1000px) 45vw, 100vw';
    $loading = $eager ? 'eager' : 'lazy';
    $fetchpriority = $eager ? ' fetchpriority="high"' : '';
    ?>
    <picture>
      <source type="image/avif" sizes="<?= h($sizes) ?>" srcset="/assets/img/<?= h($base) ?>-640.avif 640w, /assets/img/<?= h($base) ?>-1280.avif 1280w, /assets/img/<?= h($base) ?>-1920.avif 1920w">
      <source type="image/webp" sizes="<?= h($sizes) ?>" srcset="/assets/img/<?= h($base) ?>-640.webp 640w, /assets/img/<?= h($base) ?>-1280.webp 1280w, /assets/img/<?= h($base) ?>-1920.webp 1920w">
      <img src="/assets/img/<?= h($base) ?>-1280.webp" alt="<?= h($alt) ?>" width="<?= (int)$w ?>" height="<?= (int)$h ?>" loading="<?= $loading ?>"<?= $fetchpriority ?>>
    </picture>
    <?php
}

/**
 * Hero section. $opts:
 *  h1, sub, chips (['label','variant'=>'seal'|'free']), showPrice (bool),
 *  buttons ([['label','href','variant'=>'primary'|'secondary','ev_loc'=>?]]),
 *  image (base name), imageAlt.
 */
function partial_hero(array $opts): void
{
    $cfg = site_config();
    ?>
    <section class="hero">
      <div class="container hero-inner">
        <div class="hero-text">
          <?php if (!empty($opts['chips'])): ?>
          <p class="chip-row">
            <?php foreach ($opts['chips'] as $chip): ?>
            <span class="chip chip-<?= h($chip['variant']) ?>"><?= h($chip['label']) ?></span>
            <?php endforeach; ?>
          </p>
          <?php endif; ?>
          <h1><?= $opts['h1'] ?></h1>
          <p class="hero-sub"><?= $opts['sub'] ?></p>
          <div class="hero-actions">
            <?php foreach ($opts['buttons'] as $btn): ?>
            <a class="btn btn-<?= h($btn['variant']) ?>" href="<?= h($btn['href']) ?>"<?= !empty($btn['ev_loc']) ? ' data-ev="wa_click" data-ev-loc="' . h($btn['ev_loc']) . '"' : '' ?><?= !empty($btn['scroll']) ? ' data-scroll="' . h($btn['scroll']) . '"' : '' ?>><?= h($btn['label']) ?></a>
            <?php endforeach; ?>
          </div>
          <?php if (!empty($opts['showPrice'])): ?>
          <p class="hero-price"><strong><?= h(gs($cfg['price_min'])) ?> – <?= h(number_format($cfg['price_max'], 0, ',', '.')) ?></strong><span>Informe pericial · <?= h($cfg['price_note']) ?></span></p>
          <?php endif; ?>
        </div>
        <div class="hero-media">
          <?php partial_picture($opts['image'], $opts['imageAlt'], true); ?>
        </div>
      </div>
    </section>
    <?php
}

/**
 * Type + zone selector. $currentTemplate identifies which chip is active.
 */
function partial_selector(string $currentTemplate): void
{
    $cfg = site_config();
    $types = [
        'tasacion-casas'       => ['Casas', '/tasaciones/casas/'],
        'tasacion-departamentos' => ['Departamentos', '/tasaciones/departamentos/'],
        'tasacion-terrenos'    => ['Terrenos', '/tasaciones/terrenos/'],
        'tasacion-locales'     => ['Locales comerciales', '/tasaciones/locales-comerciales/'],
        'tasacion-corporativa' => ['Corporativa', '/tasaciones/corporativa/'],
        'tasacion-hipotecaria' => ['Hipotecaria', '/tasaciones/hipotecaria/'],
        'tasacion-campos'      => ['Campos', '/tasaciones/campos/'],
    ];
    $zones = ['Asunción', 'Luque', 'San Lorenzo', 'Fernando de la Mora', 'Lambaré', 'Capiatá', 'M. R. Alonso'];
    ?>
    <section class="selector">
      <div class="container">
        <div class="selector-row">
          <p class="eyebrow">Tipo</p>
          <div class="chip-list">
            <?php foreach ($types as $tpl => [$label, $href]): ?>
            <a class="chip-link<?= $tpl === $currentTemplate ? ' is-active' : '' ?>" href="<?= h($href) ?>"><?= h($label) ?></a>
            <?php endforeach; ?>
          </div>
        </div>
        <div class="selector-row">
          <p class="eyebrow">Zona</p>
          <div class="chip-list" data-zone-selector>
            <?php foreach ($zones as $z): ?>
            <button type="button" class="chip-btn" data-zone="<?= h($z) ?>"><?= h($z) ?></button>
            <?php endforeach; ?>
            <button type="button" class="chip-btn" data-zone="">Otra zona</button>
          </div>
        </div>
      </div>
    </section>
    <?php
}

/**
 * Two-product comparison. $mode: 'default' | 'swapped' | 'informe-only'.
 * $waSrc/$waType drive the informe card's WhatsApp button.
 */
function partial_dual(string $waSrc, string $waType, string $mode = 'default'): void
{
    $cfg = site_config();
    $informeBtnLabel = $mode === 'swapped' ? 'Pedir presupuesto por WhatsApp' : 'Cotizar por WhatsApp';
    ?>
    <section class="dual">
      <div class="container">
        <div class="dual-grid<?= $mode === 'informe-only' ? ' dual-grid-single' : '' ?>">
          <article class="dual-card dual-card-seal">
            <span class="chip chip-seal">Oficial · pago</span>
            <h3>Informe pericial oficial</h3>
            <p class="dual-price"><?= h(gs($cfg['price_min'])) ?> – <?= h(number_format($cfg['price_max'], 0, ',', '.')) ?></p>
            <p class="dual-price-note"><?= h($cfg['price_note']) ?></p>
            <ul class="dual-bullets">
              <li>Firmado por tasador habilitado</li>
              <li>Validez legal: bancos, juicios, sucesiones, empresas</li>
              <li>Visita, medición, comparables y metodología</li>
              <li>Presupuesto confirmado antes de empezar</li>
            </ul>
            <a class="btn btn-primary" href="<?= h(wa_url($waSrc, $waType)) ?>" data-ev="wa_click" data-ev-loc="<?= h($waSrc) ?>"><?= h($informeBtnLabel) ?></a>
          </article>
          <?php if ($mode !== 'informe-only'): ?>
          <article class="dual-card dual-card-free">
            <span class="chip chip-free">Sin costo</span>
            <h3>Valoración comercial para vender</h3>
            <p class="dual-price-note">Equipo inmobiliario, sin costo</p>
            <ul class="dual-bullets">
              <li>Rango de precio de venta</li>
              <li>Comparables publicados en tu zona</li>
              <li>Plan de comercialización</li>
              <li>Sin validez legal, no es un informe pericial</li>
            </ul>
            <a class="btn btn-secondary" href="/valuacion-para-vender/">Pedir valoración sin costo</a>
          </article>
          <?php endif; ?>
        </div>
      </div>
    </section>
    <?php
}

/** Numbered ledger list. $rows: array of strings. */
function partial_ledger(string $title, array $rows): void
{
    ?>
    <section class="ledger-section">
      <div class="container">
        <h2><?= h($title) ?></h2>
        <ol class="ledger">
          <?php foreach ($rows as $i => $row): ?>
          <li><span class="ledger-num"><?= sprintf('%02d', $i + 1) ?></span><span class="ledger-text"><?= $row ?></span></li>
          <?php endforeach; ?>
        </ol>
      </div>
    </section>
    <?php
}

/** Factor cards grid. $items: [['title'=>,'text'=>], ...]. */
function partial_factors(string $title, array $items): void
{
    ?>
    <section class="factors-section">
      <div class="container">
        <h2><?= h($title) ?></h2>
        <div class="factors">
          <?php foreach ($items as $i => $item): ?>
          <div class="factor-card">
            <span class="factor-num"><?= sprintf('%02d', $i + 1) ?></span>
            <h3><?= h($item['title']) ?></h3>
            <p><?= $item['text'] ?></p>
          </div>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php
}

/** FAQ accordion. $items: [['q'=>,'a'=>], ...]. Also queues FAQPage JSON-LD. */
function partial_faq(string $title, array $items): void
{
    add_jsonld([
        '@context' => 'https://schema.org',
        '@type'    => 'FAQPage',
        'mainEntity' => array_map(static fn($it) => [
            '@type' => 'Question',
            'name' => strip_tags($it['q']),
            'acceptedAnswer' => ['@type' => 'Answer', 'text' => strip_tags($it['a'])],
        ], $items),
    ]);
    ?>
    <section class="faq">
      <div class="container">
        <h2><?= h($title) ?></h2>
        <div class="faq-list">
          <?php foreach ($items as $item): ?>
          <details>
            <summary><?= h($item['q']) ?></summary>
            <p><?= $item['a'] ?></p>
          </details>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php
}

/** Cross-link cards. $items: [['href'=>,'eyebrow'=>,'title'=>,'text'=>], ...]. */
function partial_crosslinks(array $items): void
{
    ?>
    <section class="crosslinks">
      <div class="container">
        <p class="eyebrow">Otras tasaciones</p>
        <div class="crosslinks-grid">
          <?php foreach ($items as $item): ?>
          <a class="crosslink-card" href="<?= h($item['href']) ?>">
            <span class="eyebrow"><?= h($item['eyebrow']) ?></span>
            <h3><?= h($item['title']) ?></h3>
            <p><?= h($item['text']) ?></p>
          </a>
          <?php endforeach; ?>
        </div>
      </div>
    </section>
    <?php
}

/**
 * Final CTA band. $opts: heading, sub, waSrc/waType (omit for no-WA band),
 * altHref/altLabel (used instead of WA button when waSrc is empty).
 */
function partial_cta_final(array $opts): void
{
    $cfg = site_config();
    ?>
    <section class="cta-final">
      <div class="container cta-final-inner">
        <h2><?= h($opts['heading']) ?></h2>
        <?php if (!empty($opts['sub'])): ?><p><?= h($opts['sub']) ?></p><?php endif; ?>
        <div class="cta-final-actions">
          <?php if (!empty($opts['waSrc'])): ?>
          <a class="btn btn-paper" href="<?= h(wa_url($opts['waSrc'], $opts['waType'] ?? 'general')) ?>" data-ev="wa_click" data-ev-loc="<?= h($opts['waSrc']) ?>">Escribinos por WhatsApp</a>
          <a class="cta-final-tel" href="tel:+<?= h($cfg['wa_number']) ?>"><?= h($cfg['wa_display']) ?></a>
          <?php else: ?>
          <a class="btn btn-paper" href="<?= h($opts['altHref']) ?>"><?= h($opts['altLabel']) ?></a>
          <?php endif; ?>
        </div>
      </div>
    </section>
    <?php
}

function partial_price_block(): void
{
    $cfg = site_config();
    ?>
    <p class="price-block"><?= h(gs($cfg['price_min'])) ?> – <?= h(number_format($cfg['price_max'], 0, ',', '.')) ?> · <?= h($cfg['price_note']) ?></p>
    <?php
}

/** Form A — /valuacion-para-vender/. */
function partial_lead_form_valuacion(): void
{
    $cfg = site_config();
    $error = ($_GET['error'] ?? '') === 'telefono';
    ?>
    <section class="form-section" id="form">
      <div class="container form-container">
        <h2>Pedí tu valoración sin costo</h2>
        <?php if ($error): ?>
        <p class="form-error">Falta el teléfono. Dejanos un número de WhatsApp para poder responderte.</p>
        <?php endif; ?>
        <form class="form" action="/api/lead.php" method="post">
          <input type="hidden" name="form" value="valuacion">
          <input type="hidden" name="page_url" id="page_url" value="">
          <div class="form-field form-honeypot" aria-hidden="true">
            <label for="website">No completes este campo</label>
            <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
          </div>
          <div class="form-field">
            <label for="nombre">Nombre</label>
            <input type="text" id="nombre" name="nombre" autocomplete="name">
          </div>
          <div class="form-field">
            <label for="telefono">WhatsApp (obligatorio)</label>
            <input type="tel" id="telefono" name="telefono" inputmode="tel" placeholder="0981 123 456" required autocomplete="tel">
          </div>
          <div class="form-field">
            <label for="email">Email (opcional)</label>
            <input type="email" id="email" name="email" autocomplete="email">
          </div>
          <div class="form-field">
            <label for="tipo">Tipo de propiedad</label>
            <select id="tipo" name="tipo">
              <option value="">Elegí una opción</option>
              <option>Casa</option>
              <option>Departamento</option>
              <option>Terreno</option>
              <option>Local comercial</option>
              <option>Dúplex</option>
              <option>Depósito/galpón</option>
              <option>Otro</option>
            </select>
          </div>
          <div class="form-field">
            <label for="zona">Zona</label>
            <select id="zona" name="zona">
              <option value="">Elegí una opción</option>
              <?php foreach ($cfg['coverage'] as $z): ?>
              <option><?= h($z) ?></option>
              <?php endforeach; ?>
              <option>Otra</option>
            </select>
          </div>
          <div class="form-field">
            <label for="superficie">Superficie aproximada (m²)</label>
            <input type="text" id="superficie" name="superficie" inputmode="numeric" placeholder="Ej. 350">
          </div>
          <div class="form-field form-field-radio">
            <p class="form-legend">¿Vas a vender?</p>
            <label><input type="radio" name="vende" value="Sí, quiero vender"> Sí, quiero vender</label>
            <label><input type="radio" name="vende" value="Estoy evaluando"> Estoy evaluando</label>
            <label><input type="radio" name="vende" value="Solo quiero saber el valor"> Solo quiero saber el valor</label>
          </div>
          <div class="form-field">
            <label for="plazo">Plazo</label>
            <select id="plazo" name="plazo">
              <option value="">Elegí una opción</option>
              <option>Este mes</option>
              <option>En 1–3 meses</option>
              <option>En 3–6 meses</option>
              <option>Sin fecha</option>
            </select>
          </div>
          <div class="form-field form-field-full">
            <label for="mensaje">Contanos de tu propiedad</label>
            <textarea id="mensaje" name="mensaje" rows="3"></textarea>
          </div>
          <button type="submit" class="btn btn-primary form-submit">Pedir valoración sin costo</button>
        </form>
        <p class="form-note">Usamos tus datos solo para responder tu consulta. No los vendemos ni los compartimos con terceros.</p>
      </div>
    </section>
    <?php
}

/** Form B — /contacto/. */
function partial_lead_form_contacto(): void
{
    $error = ($_GET['error'] ?? '') === 'telefono';
    ?>
    <form class="form" action="/api/lead.php" method="post">
      <input type="hidden" name="form" value="contacto">
      <input type="hidden" name="page_url" id="page_url" value="">
      <?php if ($error): ?>
      <p class="form-error">Falta el teléfono. Dejanos un número de WhatsApp para poder responderte.</p>
      <?php endif; ?>
      <div class="form-field form-honeypot" aria-hidden="true">
        <label for="website">No completes este campo</label>
        <input type="text" id="website" name="website" tabindex="-1" autocomplete="off">
      </div>
      <div class="form-field">
        <label for="nombre">Nombre</label>
        <input type="text" id="nombre" name="nombre" autocomplete="name">
      </div>
      <div class="form-field">
        <label for="telefono">WhatsApp (obligatorio)</label>
        <input type="tel" id="telefono" name="telefono" inputmode="tel" placeholder="0981 123 456" required autocomplete="tel">
      </div>
      <div class="form-field">
        <label for="email">Email (opcional)</label>
        <input type="email" id="email" name="email" autocomplete="email">
      </div>
      <div class="form-field">
        <label for="motivo">Motivo</label>
        <select id="motivo" name="motivo">
          <option value="">Elegí una opción</option>
          <option>Informe pericial (pago)</option>
          <option>Valoración para vender (sin costo)</option>
          <option>Otra consulta</option>
        </select>
      </div>
      <div class="form-field form-field-full">
        <label for="mensaje">Mensaje</label>
        <textarea id="mensaje" name="mensaje" rows="3"></textarea>
      </div>
      <button type="submit" class="btn btn-primary form-submit">Enviar mis datos</button>
    </form>
    <p class="form-note">Usamos tus datos solo para responder tu consulta. No los vendemos ni los compartimos con terceros.</p>
    <?php
}
