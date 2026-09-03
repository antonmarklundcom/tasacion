<?php
declare(strict_types=1);

partial_hero([
    'h1' => 'Tasación de campos y estancias',
    'sub' => 'Interior del país, hectáreas, aptitud del suelo, mejoras y mensura. El perito viaja, y el costo se presupuesta con la distancia.',
    'chips' => [['label' => 'Oficial · pago', 'variant' => 'seal']],
    'showPrice' => true,
    'buttons' => [
        ['label' => 'Cotizar tasación de mi campo', 'href' => wa_url('campos-hero', 'campo'), 'variant' => 'primary', 'ev_loc' => 'campos-hero'],
        ['label' => 'Ver informe pericial', 'href' => '/informes-periciales/', 'variant' => 'secondary'],
    ],
    'image' => 'tasador-de-terrenos-gran-asuncion',
    'imageAlt' => 'Persona midiendo un terreno con cinta métrica al aire libre',
]);

partial_selector('tasacion-campos');
?>

<section class="context-section">
  <div class="container">
    <p>Un campo o una estancia se tasa con otra lógica que un lote urbano: hectáreas en vez de metros cuadrados, aptitud del suelo, mejoras como alambrados, aguadas y casco, y el acceso desde la ruta más cercana. El título y la mensura son el punto de partida, porque sin eso no hay superficie sobre la cual trabajar.</p>
    <p>Como el perito viaja al interior, el presupuesto del informe se arma considerando la distancia además del tipo de inmueble y la superficie. Contanos dónde está el campo y te confirmamos el presupuesto antes de coordinar la visita.</p>
  </div>
</section>

<?php
partial_factors('Qué revisamos en un campo', [
    ['title' => 'Aptitud y uso del suelo', 'text' => 'Ganadero, agrícola o mixto, y qué tan apto es el suelo para ese uso, es la base sobre la que se arma el valor.'],
    ['title' => 'Mejoras', 'text' => 'Alambrados, aguadas, casco, galpones y caminos internos suman valor por separado de la tierra.'],
    ['title' => 'Acceso y distancia', 'text' => 'A cuánto está de la ruta asfaltada más cercana y del centro urbano de referencia, porque eso define el costo logístico.'],
    ['title' => 'Agua', 'text' => 'Disponibilidad de agua superficial o de pozo, central para la aptitud ganadera o agrícola del campo.'],
    ['title' => 'Título y mensura', 'text' => 'Documentación que acredite la titularidad y la superficie exacta; sin mensura, el informe empieza por ahí.'],
    ['title' => 'Superficie por hectárea', 'text' => 'El valor se expresa por hectárea y varía según ubicación, aptitud y mejoras, no solo por la extensión total.'],
]);

partial_dual('campos-dual', 'campo');

partial_faq('Preguntas sobre tasación de campos', [
    ['q' => '¿Trabajan en el interior?', 'a' => 'Sí, coordinamos la visita al interior del país según el caso. El costo del viaje entra en el presupuesto del informe.'],
    ['q' => '¿Cómo se cotiza el viaje?', 'a' => 'Se presupuesta junto con el tipo de inmueble y la superficie, según la distancia desde Asunción. Te lo confirmamos antes de empezar.'],
    ['q' => '¿Tasan por hectárea?', 'a' => 'El valor final se expresa por hectárea, pero no es un número único: depende de la aptitud del suelo, el acceso, el agua y las mejoras existentes.'],
]);

partial_crosslinks([
    ['href' => '/tasaciones/terrenos/', 'eyebrow' => 'Tasación', 'title' => 'Terrenos', 'text' => 'Lotes urbanos en Asunción y Gran Asunción.'],
    ['href' => '/tasaciones/corporativa/', 'eyebrow' => 'Tasación', 'title' => 'Corporativa', 'text' => 'Cuando el campo es un activo de una empresa.'],
]);

partial_cta_final([
    'heading' => 'Contanos dónde está tu campo y coordinamos la visita',
    'sub' => 'Te pasamos el presupuesto antes de empezar.',
    'waSrc' => 'campos-final',
    'waType' => 'campo',
]);
