<?php
declare(strict_types=1);
$cfg = site_config();

$groups = [
    'Precio y plazos' => [
        ['q' => '¿Cuánto cuesta una tasación?', 'a' => 'El informe pericial cuesta entre ' . gs($cfg['price_min']) . ' y ' . gs($cfg['price_max']) . ', según tipo de inmueble y superficie. Te pasamos el presupuesto exacto antes de empezar y no hay nada que pagar hasta que lo aceptás. La valoración comercial para vender no tiene costo.'],
        ['q' => '¿Cuánto demora el informe pericial?', 'a' => 'Depende del tipo de inmueble, de la disponibilidad para la visita y de la documentación disponible. Te confirmamos el plazo por WhatsApp antes de empezar, así no dependés de una estimación genérica.'],
        ['q' => '¿La valoración para vender es gratis de verdad?', 'a' => 'Sí. No pedimos pago, tarjeta ni datos de facturación. Lo hacemos porque una parte de quienes consultan después necesitan un informe formal o deciden vender con exclusividad, y ese trabajo sí se cobra.'],
        ['q' => '¿Hay que pagar algo antes de empezar el informe?', 'a' => 'No. Te pasamos el presupuesto primero y no hay nada que pagar hasta que lo aceptás.'],
    ],
    'Informe pericial' => [
        ['q' => '¿Qué validez legal tiene el informe pericial?', 'a' => 'Es un documento firmado por un tasador habilitado, con metodología, comparables y registro fotográfico. Sirve para bancos, sucesiones, juicios y empresas.'],
        ['q' => '¿Sirve para el banco?', 'a' => 'El informe se prepara con el formato que exigen bancos, cooperativas y financieras. Confirmá con tu entidad si acepta tasadores externos antes de encargarlo.'],
        ['q' => '¿Qué documentos necesito para el informe?', 'a' => 'En general: algo que acredite la titularidad, algo que acredite la superficie y los linderos, y algo que muestre qué está construido sobre el terreno. La lista exacta depende del caso.'],
        ['q' => '¿Qué pasa si hay construcción sin declarar?', 'a' => 'No impide tasar. Lo señalamos en el informe en lugar de disimularlo, porque el comprador o la entidad lo van a descubrir igual.'],
    ],
    'Valoración para vender' => [
        ['q' => '¿Qué diferencia hay con el informe pericial?', 'a' => 'La valoración para vender es una referencia de precio de venta armada por un equipo inmobiliario, sin validez legal. El informe pericial lo firma un tasador habilitado y sí tiene validez legal.'],
        ['q' => '¿Estoy obligado a vender con ustedes?', 'a' => 'No. Recibís la valoración y decidís qué hacer con eso. Trabajamos con exclusividad cuando las dos partes lo eligen.'],
    ],
    'Datos y privacidad' => [
        ['q' => '¿Guardan o comparten mis datos?', 'a' => 'Usamos tus datos solo para responder tu consulta o gestionar la valoración. No los vendemos a terceros. Más detalle en la <a href="/politica-de-privacidad/">política de privacidad</a>.'],
        ['q' => '¿Qué cookies usa esta página?', 'a' => 'Una cookie funcional de preferencia y, solo si activás las estadísticas, las de la herramienta de analítica. Más detalle en la <a href="/politica-de-cookies/">política de cookies</a>.'],
    ],
];

$allItems = array_merge(...array_values($groups));
add_jsonld([
    '@context' => 'https://schema.org',
    '@type'    => 'FAQPage',
    'mainEntity' => array_map(static fn($it) => [
        '@type' => 'Question',
        'name' => strip_tags($it['q']),
        'acceptedAnswer' => ['@type' => 'Answer', 'text' => strip_tags($it['a'])],
    ], $allItems),
]);
?>

<section class="hero hero-simple">
  <div class="container hero-inner">
    <div class="hero-text">
      <h1>Preguntas frecuentes sobre tasación</h1>
      <p class="hero-sub">Precio y plazos, informe pericial, valoración para vender, y qué hacemos con tus datos.</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="<?= h(wa_url('faq-hero', 'general')) ?>" data-ev="wa_click" data-ev-loc="faq-hero">Escribinos por WhatsApp</a>
        <a class="btn btn-secondary" href="/contacto/">Ir a contacto</a>
      </div>
    </div>
  </div>
</section>

<?php foreach ($groups as $title => $items): ?>
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
<?php endforeach; ?>

<?php
partial_cta_final([
    'heading' => '¿Tu pregunta no está acá?',
    'sub' => 'Escribinos y te respondemos, aunque no termines pidiendo nada.',
    'waSrc' => 'faq-final',
    'waType' => 'general',
]);
