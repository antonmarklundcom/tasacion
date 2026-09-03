<?php
declare(strict_types=1);
$cfg = site_config();
?>

<section class="hero hero-simple">
  <div class="container hero-inner">
    <div class="hero-text">
      <h1>Contacto</h1>
      <p class="hero-sub">La vía más rápida para el informe pericial es WhatsApp. Si preferís que te escribamos nosotros, dejanos tus datos y te respondemos al número que pongas.</p>
    </div>
  </div>
</section>

<section class="context-section contacto-grid">
  <div class="container contacto-grid-inner">
    <div class="contacto-card">
      <h2>Escribinos por WhatsApp</h2>
      <p>Para cotizar un informe pericial. Contanos el tipo de propiedad y para qué necesitás el informe, y arrancamos desde ahí.</p>
      <a class="btn btn-primary" href="<?= h(wa_url('contacto-wa', 'contacto')) ?>" data-ev="wa_click" data-ev-loc="contacto-wa">Escribinos por WhatsApp</a>
      <p class="contacto-tel"><a href="tel:+<?= h($cfg['wa_number']) ?>"><?= h($cfg['wa_display']) ?></a></p>
      <?php if ($cfg['contact_email'] !== ''): ?>
      <p class="contacto-email"><a href="mailto:<?= h($cfg['contact_email']) ?>"><?= h($cfg['contact_email']) ?></a></p>
      <?php endif; ?>
      <p class="contacto-coverage"><?= h(implode(', ', $cfg['coverage'])) ?></p>
    </div>
    <div class="contacto-card">
      <h2>O dejanos tus datos</h2>
      <p>Te respondemos por WhatsApp al número que dejes. El teléfono es el único campo obligatorio.</p>
      <?php partial_lead_form_contacto(); ?>
    </div>
  </div>
</section>
