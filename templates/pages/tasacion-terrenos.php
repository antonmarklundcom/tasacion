<?php
declare(strict_types=1);

partial_hero([
    'h1' => 'Tasación de terrenos en Asunción y Gran Asunción',
    'sub' => 'Dos lotes de la misma superficie pueden valer muy distinto. Lo que los separa es el frente, la forma, el nivel respecto a la calle y qué se puede construir ahí legalmente.',
    'chips' => [['label' => 'Oficial · pago', 'variant' => 'seal']],
    'showPrice' => true,
    'buttons' => [
        ['label' => 'Cotizar tasación de mi terreno', 'href' => wa_url('terrenos-hero', 'terreno'), 'variant' => 'primary', 'ev_loc' => 'terrenos-hero'],
        ['label' => 'Ver informe pericial', 'href' => '/informes-periciales/', 'variant' => 'secondary'],
    ],
    'image' => 'tasacion-terrenos-paraguay',
    'imageAlt' => 'Terreno baldío en el Gran Asunción visto desde la calle',
]);

partial_selector('tasacion-terrenos');
?>

<section class="context-section">
  <div class="container">
    <p>Un lote no vale por lo que mide, vale por lo que se puede levantar encima. Un terreno de 12 metros de frente por 30 de fondo vale más que uno de 8 por 45 con la misma superficie, porque lo que se puede construir al frente es lo que se ve y lo que se aprovecha.</p>
    <p>En el Gran Asunción, además, pesan los servicios: agua, luz, si la calle está asfaltada o es de tierra, y a cuánto está el colectivo más cercano. Eso define si el lote es habitable ya o dentro de unos años, y el informe lo documenta con esa distinción.</p>
  </div>
</section>

<?php
partial_factors('Los factores del lote', [
    ['title' => 'Frente y forma', 'text' => 'El frente sobre la calle es el factor más subestimado. Un rectángulo regular se aprovecha entero; un lote irregular pierde metros construibles que igual se pagan.'],
    ['title' => 'Zonificación y altura permitida', 'text' => 'Qué se puede construir legalmente ahí cambia el mercado comprador: de una familia a alguien que hace números de metros vendibles.'],
    ['title' => 'Servicios (asfalto, cloaca, agua)', 'text' => 'Si la calle está asfaltada, si hay cloaca y agua corriente, y a cuánto está el colectivo más cercano.'],
    ['title' => 'Topografía y zona inundable', 'text' => 'Un terreno bajo respecto a la calle arrastra costo de relleno y riesgo de agua, y el comprador lo descuenta antes de negociar.'],
    ['title' => 'Linderos y mensura', 'text' => 'La documentación que acredita superficie y linderos exactos es central para el informe formal; sin mensura, el trabajo empieza por ahí.'],
    ['title' => 'Uso potencial', 'text' => 'Un terreno donde se puede construir en altura vale por lo que se puede levantar, no por lo que hay hoy encima.'],
]);

partial_dual('terrenos-dual', 'terreno');

partial_faq('Preguntas sobre tasación de terrenos', [
    ['q' => '¿Se tasa por m²?', 'a' => 'No hay un precio por metro cuadrado que sirva para todo un barrio. El frente, la forma, el nivel respecto a la calle y el uso permitido cambian el número, incluso entre lotes vecinos.'],
    ['q' => '¿Qué pasa si no hay mensura?', 'a' => 'El informe formal necesita documentación que acredite superficie y linderos. Si no hay mensura, contanos en qué situación está el trámite y vemos cómo seguir.'],
    ['q' => '¿Terreno con mejoras precarias?', 'a' => 'Sí se tasa. Alambrados, casillas o construcciones sin regularizar se documentan como lo que son, sin sumarlas como si fueran construcción formal.'],
]);

partial_crosslinks([
    ['href' => '/tasaciones/campos/', 'eyebrow' => 'Tasación', 'title' => 'Campos y estancias', 'text' => 'Interior del país, hectáreas y mejoras.'],
    ['href' => '/tasaciones/casas/', 'eyebrow' => 'Tasación', 'title' => 'Casas', 'text' => 'Cuando ya hay una construcción sobre el lote.'],
]);

partial_cta_final([
    'heading' => 'Contanos dónde está tu terreno y arrancamos desde ahí',
    'sub' => 'Te pasamos el presupuesto antes de empezar.',
    'waSrc' => 'terrenos-final',
    'waType' => 'terreno',
]);
