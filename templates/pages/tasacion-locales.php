<?php
declare(strict_types=1);

partial_hero([
    'h1' => 'Tasación de locales comerciales',
    'sub' => 'Un local no se valora como una casa. Se valora por lo que puede producir: cuánta gente pasa por esa cuadra, cuánto frente y vidriera tiene, dónde estaciona el cliente y qué rubro está habilitado a funcionar ahí.',
    'chips' => [['label' => 'Oficial · pago', 'variant' => 'seal']],
    'showPrice' => true,
    'buttons' => [
        ['label' => 'Cotizar tasación de mi local', 'href' => wa_url('locales-hero', 'local'), 'variant' => 'primary', 'ev_loc' => 'locales-hero'],
        ['label' => 'Ver informe pericial', 'href' => '/informes-periciales/', 'variant' => 'secondary'],
    ],
    'image' => 'tasacion-locales-comerciales-asuncion',
    'imageAlt' => 'Frente de un local comercial sobre una avenida de Asunción',
]);

partial_selector('tasacion-locales');
?>

<section class="context-section">
  <div class="container">
    <p>En una vivienda, el estado de la construcción es buena parte del valor. En un local, es bastante menos: uno impecable en una cuadra sin tránsito rinde peor que uno básico sobre una avenida con paso constante, y el mercado lo paga en consecuencia.</p>
    <p>También se paga el estacionamiento. En Asunción, un local sin dónde parar pierde clientes reales todos los días, y eso ya está descontado en lo que un inquilino está dispuesto a pagar de alquiler.</p>
  </div>
</section>

<?php
partial_factors('Qué revisamos en un local', [
    ['title' => 'Tránsito y frente', 'text' => 'No del barrio: de la cuadra. Metros lineales sobre la calle, altura del ingreso y visibilidad del cartel desde un auto en movimiento.'],
    ['title' => 'Habilitación de uso', 'text' => 'Qué rubros pueden funcionar ahí según la zonificación municipal. Define quién te lo puede alquilar y por cuánto.'],
    ['title' => 'Superficie y layout', 'text' => 'Un local de 80 m² con 10 metros de frente vale distinto que uno de 80 m² con 4 metros de frente y fondo largo.'],
    ['title' => 'Contrato de alquiler vigente', 'text' => 'Un contrato con renta al día sube el valor para un comprador inversor; uno con renta atrasada o vencimiento cercano lo baja.'],
    ['title' => 'Zona comercial vs residencial', 'text' => 'El mismo local en dos zonificaciones distintas tiene mercados de alquiler distintos, incluso con la misma superficie.'],
    ['title' => 'Estacionamiento', 'text' => 'Propio, sobre la calle o inexistente. Es la primera pregunta que hace un inquilino serio.'],
]);

partial_dual('locales-dual', 'local');

partial_faq('Preguntas sobre tasación de locales', [
    ['q' => '¿Se tasa por renta?', 'a' => 'La renta que puede generar es uno de los factores centrales, junto con la ubicación y el frente. No es el único, pero pesa más que en una vivienda.'],
    ['q' => '¿Local alquilado?', 'a' => 'Sí se tasa, y decirnos que está alquilado ayuda: un contrato vigente con renta al día sube el valor para un comprador inversor.'],
]);

partial_crosslinks([
    ['href' => '/tasaciones/corporativa/', 'eyebrow' => 'Tasación', 'title' => 'Corporativa', 'text' => 'Cuando el local es un activo de una empresa.'],
    ['href' => '/tasaciones/terrenos/', 'eyebrow' => 'Tasación', 'title' => 'Terrenos', 'text' => 'Frente, forma del lote y zonificación.'],
]);

partial_cta_final([
    'heading' => 'Contanos de tu local, depósito o galpón',
    'sub' => 'Te pasamos el presupuesto antes de empezar.',
    'waSrc' => 'locales-final',
    'waType' => 'local',
]);
