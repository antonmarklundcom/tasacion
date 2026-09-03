<?php
declare(strict_types=1);
$cfg = site_config();

partial_hero([
    'h1' => 'Informe pericial de tasación con validez legal',
    'sub' => 'Cuando el valor tiene que quedar por escrito, un tasador habilitado firma el informe: metodología, comparables y fotos del relevamiento.',
    'chips' => [['label' => 'Oficial · pago', 'variant' => 'seal']],
    'showPrice' => true,
    'buttons' => [
        ['label' => 'Cotizar el informe por WhatsApp', 'href' => wa_url('informes-hero', 'informe'), 'variant' => 'primary', 'ev_loc' => 'informes-hero'],
        ['label' => 'Ver preguntas frecuentes', 'href' => '/preguntas-frecuentes/', 'variant' => 'secondary'],
    ],
    'image' => 'informe-de-tasacion-linderos-paraguay',
    'imageAlt' => 'Carpeta con documentación de un inmueble, planos y linderos',
]);
?>

<section class="context-section">
  <div class="container">
    <p class="eyebrow">Cuándo hace falta</p>
    <h2>Cuándo hace falta un informe pericial</h2>
    <div class="services-grid">
      <div class="service-card service-card-static"><h3>Sucesiones</h3><p>Cuando hay que repartir bienes entre herederos y el inmueble tiene que entrar a la cuenta con un valor que todos puedan mirar.</p></div>
      <div class="service-card service-card-static"><h3>División de bienes</h3><p>Separaciones donde una parte se queda con el inmueble y compensa a la otra. El número tiene que resistir la discusión.</p></div>
      <div class="service-card service-card-static"><h3>Juicios</h3><p>Cuando el expediente pide un valor documentado del inmueble, no una estimación conversada.</p></div>
      <div class="service-card service-card-static"><h3>Garantía bancaria</h3><p>Para presentar el inmueble como garantía ante bancos, cooperativas y financieras, con el formato que exigen.</p></div>
      <div class="service-card service-card-static"><h3>Empresas y balances</h3><p>Revalúo de activos, aportes de capital, fusiones y auditorías contables.</p></div>
      <div class="service-card service-card-static"><h3>Negociaciones entre partes</h3><p>Socios que se separan, familias que compran entre sí, ventas donde las dos partes quieren un tercero que ponga el número.</p></div>
    </div>
  </div>
</section>

<?php
partial_ledger('Qué contiene el informe', [
    'Identificación del inmueble: ubicación, superficie de terreno y de construcción, y datos de la documentación que nos hayas pasado.',
    'Descripción del relevamiento: qué se midió y qué se observó en la visita.',
    'Metodología aplicada, explicada para que se pueda seguir el criterio usado.',
    'Comparables considerados, con los ajustes que se les aplicaron.',
    'Registro fotográfico del frente, el interior, las instalaciones y cualquier detalle que afecte el valor.',
    'Conclusión de valor, expresada con la fundamentación que la sostiene.',
    'Firma del tasador habilitado.',
]);
?>

<section class="budget-section">
  <div class="container">
    <p class="eyebrow">Presupuesto</p>
    <h2>Cómo se calcula el presupuesto</h2>
    <?php partial_price_block(); ?>
    <ul class="budget-list">
      <li><strong>Tipo de inmueble.</strong> No es lo mismo un departamento que un galpón o un campo.</li>
      <li><strong>Superficie.</strong> Más metros es más relevamiento y más tiempo de visita.</li>
      <li><strong>Uso del informe.</strong> Define el nivel de detalle y de documentación que tiene que llevar.</li>
    </ul>
    <p>Sin nada que pagar hasta que acepta el presupuesto.</p>
  </div>
</section>

<section class="context-section">
  <div class="container">
    <p class="eyebrow">Antes de empezar</p>
    <h2>Qué te vamos a pedir</h2>
    <p>Documentación de la propiedad y acceso al inmueble para la visita. En términos generales, lo que se pide gira alrededor de tres cosas: algo que acredite la titularidad, algo que acredite la superficie y los linderos, y algo que muestre qué está construido sobre el terreno.</p>
    <p>No publicamos una lista cerrada porque cambia según el caso: contanos qué tipo de inmueble es y para qué necesitás el informe, y te decimos exactamente qué conseguir. Si algo falta, te lo decimos al principio y no a mitad del trabajo.</p>
  </div>
</section>

<?php
partial_faq('Preguntas sobre el informe pericial', [
    ['q' => '¿Cuánto cuesta el informe?', 'a' => 'Entre ' . gs($cfg['price_min']) . ' y ' . gs($cfg['price_max']) . ', según tipo de inmueble y superficie. Te pasamos el presupuesto exacto antes de empezar.'],
    ['q' => '¿Cuánto demora?', 'a' => 'Depende del tipo de inmueble, de la disponibilidad para la visita y de la documentación disponible. Te confirmamos el plazo por WhatsApp antes de empezar.'],
    ['q' => '¿Qué documentos necesito?', 'a' => 'En general: algo que acredite la titularidad, algo que acredite la superficie y los linderos, y algo que muestre qué está construido sobre el terreno. La lista exacta te la pasamos según tu caso.'],
    ['q' => '¿Qué pasa si falta un documento?', 'a' => 'Casi siempre hay una forma de resolverlo. Lo importante es detectarlo al principio: por eso la primera conversación es sobre documentación y no sobre precio.'],
]);

partial_crosslinks([
    ['href' => '/tasaciones/hipotecaria/', 'eyebrow' => 'Tasación', 'title' => 'Hipotecaria', 'text' => 'Informe para presentar como garantía bancaria.'],
    ['href' => '/tasaciones/corporativa/', 'eyebrow' => 'Tasación', 'title' => 'Corporativa', 'text' => 'Cuando el inmueble es un activo de una empresa.'],
]);

partial_cta_final([
    'heading' => 'Contanos tu caso y te pasamos el presupuesto',
    'sub' => 'No hay nada que pagar hasta que lo aceptás.',
    'waSrc' => 'informes-final',
    'waType' => 'informe',
]);
