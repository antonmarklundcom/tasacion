<?php
declare(strict_types=1);
$cfg = site_config();
?>

<section class="hero hero-simple">
  <div class="container hero-inner">
    <div class="hero-text">
      <h1>Términos y condiciones</h1>
      <p class="hero-sub">Alcance de cada servicio, precios de referencia y ley aplicable.</p>
    </div>
  </div>
</section>

<section class="legal-section">
  <div class="container legal-content">

    <h2>Alcance del informe pericial</h2>
    <p>El informe pericial es un documento escrito, firmado por un tasador habilitado, que incluye visita al inmueble, medición, comparables, metodología y registro fotográfico. Es un servicio pago: te pasamos el presupuesto antes de empezar y no hay nada que pagar hasta que lo aceptás. Requiere documentación de la propiedad y acceso al inmueble para la visita; sin esas dos cosas no es posible completar el informe.</p>

    <h2>Alcance de la valoración para vender</h2>
    <p>La valoración para vender es un servicio orientativo, sin costo, que arma el equipo inmobiliario para propietarios que van a poner su inmueble en venta en Gran Asunción. No tiene validez legal y no es una tasación pericial: no reemplaza al informe pericial en ningún trámite que requiera un documento firmado por un tasador habilitado.</p>

    <h2>Precios</h2>
    <p>El informe pericial cuesta entre <?= h(gs($cfg['price_min'])) ?> y <?= h(gs($cfg['price_max'])) ?>, <?= h($cfg['price_note']) ?>. Este rango es una referencia; el presupuesto exacto se confirma antes de empezar el trabajo, según el caso concreto. La valoración para vender no tiene costo.</p>

    <h2>Propiedad intelectual</h2>
    <p>Los textos, la metodología descripta y el diseño de este sitio pertenecen a <?= h($cfg['site_name']) ?>. Los informes periciales entregados son propiedad del cliente que los encargó, para el uso que corresponda al motivo de su encargo.</p>

    <h2>Ley aplicable y jurisdicción</h2>
    <p>Estos términos se rigen por las leyes de la República del Paraguay. Cualquier controversia relacionada con el uso de este sitio o con los servicios descriptos se somete a los tribunales de la ciudad de Asunción.</p>

  </div>
</section>
