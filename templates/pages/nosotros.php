<?php
declare(strict_types=1);
$cfg = site_config();
$hasPerito = $cfg['perito_name'] !== '' || $cfg['perito_license'] !== '';
?>

<section class="hero hero-simple">
  <div class="container hero-inner">
    <div class="hero-text">
      <h1>Quiénes somos</h1>
      <p class="hero-sub">Dos equipos, dos responsabilidades distintas: un tasador habilitado que firma el informe pericial, y un equipo inmobiliario que acompaña la valoración sin costo para vender.</p>
    </div>
    <div class="hero-media">
      <?php partial_picture('tasador-midiendo-propiedad-asuncion', 'Persona midiendo una propiedad con cinta métrica', true); ?>
    </div>
  </div>
</section>

<section class="context-section">
  <div class="container">
    <p class="eyebrow">Informe pericial</p>
    <h2>El tasador</h2>
    <div class="perito-card">
      <?php if ($hasPerito): ?>
        <?php if ($cfg['perito_name'] !== ''): ?><p class="perito-name"><?= h($cfg['perito_name']) ?></p><?php endif; ?>
        <?php if ($cfg['perito_license'] !== ''): ?><p class="perito-license"><?= h($cfg['perito_license']) ?></p><?php endif; ?>
      <?php else: ?>
        <!-- PLACEHOLDER: perito_name / perito_license in config/site.php -->
        <p class="perito-name">Tasador habilitado con matrícula profesional vigente</p>
      <?php endif; ?>
      <p>El informe pericial lo firma un tasador habilitado, no el equipo inmobiliario. Esa firma es lo que le da al documento el peso que necesita frente a un banco, un juzgado o una sucesión: quien firma responde por la metodología y por la conclusión de valor.</p>
    </div>
    <p class="eyebrow">Valoración para vender</p>
    <h2>El equipo inmobiliario</h2>
    <p>La valoración comercial la arma un equipo inmobiliario, no el tasador. No tiene validez legal porque no es su función: sirve para decirte a qué precio publicar y cómo vender, y no cobra porque una parte de quienes consultan después necesitan el informe formal o deciden vender con nosotros, y ese trabajo sí se cobra aparte.</p>
  </div>
</section>

<section class="context-section">
  <div class="container">
    <p class="eyebrow">Cobertura</p>
    <h2>Dónde trabajamos</h2>
    <p><?= h(implode(', ', $cfg['coverage'])) ?>. Para campos y estancias en el interior del país coordinamos según el caso: escribinos y te confirmamos si podemos llegar.</p>
  </div>
</section>

<section class="context-section">
  <div class="container">
    <p class="eyebrow">Proceso</p>
    <h2>Cómo trabajamos</h2>
    <div class="factors">
      <div class="factor-card">
        <span class="factor-num">01</span>
        <h3>Nos contás el caso</h3>
        <p>Por WhatsApp para el informe pericial, o con el formulario para la valoración sin costo.</p>
      </div>
      <div class="factor-card">
        <span class="factor-num">02</span>
        <h3>Confirmamos el alcance</h3>
        <p>Qué tipo de informe necesitás y qué documentación hace falta, antes de pasar cualquier número.</p>
      </div>
      <div class="factor-card">
        <span class="factor-num">03</span>
        <h3>Presupuesto o valoración</h3>
        <p>Te pasamos el presupuesto del informe antes de empezar, o el rango de valor sin costo si es la vía de venta.</p>
      </div>
      <div class="factor-card">
        <span class="factor-num">04</span>
        <h3>Visita y entrega</h3>
        <p>Coordinamos la visita al inmueble y entregamos el documento firmado, o el plan de comercialización.</p>
      </div>
    </div>
  </div>
</section>

<?php
partial_cta_final([
    'heading' => 'Contanos tu caso y te decimos qué camino te conviene',
    'sub' => 'Informe pericial oficial o valoración sin costo, según lo que necesites.',
    'waSrc' => 'nosotros-final',
    'waType' => 'general',
]);
