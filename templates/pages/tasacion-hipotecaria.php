<?php
declare(strict_types=1);

partial_hero([
    'h1' => 'Tasación hipotecaria',
    'sub' => 'Informe pericial para presentar un inmueble como garantía ante bancos, cooperativas y financieras, con el formato y contenido que esas entidades exigen. Confirmá con tu entidad si acepta tasadores externos.',
    'chips' => [['label' => 'Oficial · pago', 'variant' => 'seal']],
    'showPrice' => true,
    'buttons' => [
        ['label' => 'Cotizar informe para garantía', 'href' => wa_url('hipotecaria-hero', 'hipotecaria'), 'variant' => 'primary', 'ev_loc' => 'hipotecaria-hero'],
        ['label' => 'Ver informe pericial', 'href' => '/informes-periciales/', 'variant' => 'secondary'],
    ],
    'image' => 'informe-de-tasacion-linderos-paraguay',
    'imageAlt' => 'Documentación de un inmueble con planos y linderos sobre una mesa',
]);

partial_selector('tasacion-hipotecaria');
?>

<section class="context-section">
  <div class="container">
    <p>Cuando un inmueble se presenta como garantía de un préstamo, la entidad financiera necesita un informe pericial con el formato que exigen bancos, cooperativas y financieras: identificación clara del inmueble, metodología, comparables y fotos. Confirmá con tu entidad si acepta tasadores externos antes de encargar el informe.</p>
    <p>El valor que interesa a una entidad no siempre coincide con el valor de mercado que le interesa a un vendedor: la entidad mira también la liquidez del inmueble, es decir, qué tan rápido se podría vender si hiciera falta ejecutar la garantía.</p>
  </div>
</section>

<?php
partial_factors('Qué revisamos para una tasación hipotecaria', [
    ['title' => 'Valor de mercado vs valor de garantía', 'text' => 'La entidad suele trabajar con un criterio más conservador que el precio de venta esperado. El informe deja explícita la diferencia.'],
    ['title' => 'Documentación registral', 'text' => 'Titularidad, gravámenes y linderos tienen que estar claros antes de que la entidad acepte el inmueble como garantía.'],
    ['title' => 'Estado y habitabilidad', 'text' => 'El estado real de la construcción afecta tanto el valor como la liquidez del inmueble ante una eventual ejecución.'],
    ['title' => 'Ubicación y liquidez', 'text' => 'Qué tan fácil sería vender el inmueble si hiciera falta, según la zona y la demanda real.'],
    ['title' => 'Construcción regularizada', 'text' => 'Ampliaciones sin planos se documentan como tales; muchas entidades solo consideran la superficie regularizada.'],
    ['title' => 'Plazo del trámite', 'text' => 'Los créditos suelen tener plazos ajustados. Confirmamos fecha de visita y entrega del informe antes de empezar.'],
]);

partial_dual('hipotecaria-dual', 'hipotecaria', 'informe-only');

partial_faq('Preguntas sobre tasación hipotecaria', [
    ['q' => '¿El banco acepta este informe?', 'a' => 'Preparamos el informe con el formato que exigen bancos, cooperativas y financieras, pero cada entidad decide qué tasadores acepta. Confirmá con la tuya antes de encargarlo.'],
    ['q' => '¿Cuánto demora?', 'a' => 'Depende de la disponibilidad para la visita y de la documentación disponible. Confirmamos el plazo por WhatsApp antes de empezar.'],
    ['q' => '¿Qué documentos pide el banco?', 'a' => 'Varía según la entidad y el tipo de crédito. En general se pide titularidad, superficie, linderos y datos de la construcción; te confirmamos la lista exacta cuando nos contás el caso.'],
]);

partial_crosslinks([
    ['href' => '/informes-periciales/', 'eyebrow' => 'Informe', 'title' => 'Informe pericial', 'text' => 'Qué contiene y para qué casos se usa.'],
    ['href' => '/tasaciones/casas/', 'eyebrow' => 'Tasación', 'title' => 'Casas', 'text' => 'Cuando la garantía es una vivienda.'],
]);

partial_cta_final([
    'heading' => 'Contanos para qué entidad necesitás el informe',
    'sub' => 'Te pasamos el presupuesto antes de empezar.',
    'waSrc' => 'hipotecaria-final',
    'waType' => 'hipotecaria',
]);
