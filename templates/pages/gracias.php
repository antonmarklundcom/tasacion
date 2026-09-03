<?php
declare(strict_types=1);
$cfg = site_config();
$f = $_GET['f'] ?? '';
?>

<section class="hero hero-simple">
  <div class="container hero-inner">
    <div class="hero-text">
      <h1>Gracias, recibimos tu solicitud</h1>
      <?php if ($f === 'valuacion'): ?>
      <p class="hero-sub">Un asesor te escribe por WhatsApp al número que dejaste para coordinar la valoración. No es el informe pericial: si necesitás uno con validez legal, pedilo por WhatsApp.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="<?= h(wa_url('gracias-informe', 'informe')) ?>" data-ev="wa_click" data-ev-loc="gracias-informe">Pedir informe pericial por WhatsApp</a>
        <a class="btn btn-secondary" href="/">Volver al inicio</a>
      </div>
      <?php elseif ($f === 'contacto'): ?>
      <p class="hero-sub">Te respondemos por WhatsApp al número que dejaste. Si es más rápido para vos, también podés escribirnos directamente.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="<?= h(wa_url('gracias-contacto', 'contacto')) ?>" data-ev="wa_click" data-ev-loc="gracias-contacto">Escribinos por WhatsApp</a>
        <a class="btn btn-secondary" href="/">Volver al inicio</a>
      </div>
      <?php else: ?>
      <p class="hero-sub">Recibimos tu solicitud. Te contactamos al número que dejaste.</p>
      <div class="hero-actions">
        <a class="btn btn-secondary" href="/">Volver al inicio</a>
      </div>
      <?php endif; ?>
    </div>
  </div>
</section>
