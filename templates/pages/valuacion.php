<?php
declare(strict_types=1);

partial_hero([
    'h1' => 'Valoración para vender, sin costo',
    'sub' => 'Un asesor inmobiliario te dice a qué precio publicar y cómo venderla. No es un informe pericial ni tiene validez legal.',
    'chips' => [['label' => 'Sin costo', 'variant' => 'free']],
    'showPrice' => false,
    'buttons' => [
        ['label' => 'Pedir mi valoración sin costo', 'href' => '#form', 'variant' => 'primary', 'scroll' => 'form'],
        ['label' => '¿Necesitás un informe con validez legal?', 'href' => '/informes-periciales/', 'variant' => 'secondary'],
    ],
    'image' => 'tasador-midiendo-propiedad-asuncion',
    'imageAlt' => 'Persona midiendo el frente de una propiedad con cinta métrica',
]);
?>

<section class="context-section">
  <div class="container">
    <p class="eyebrow">Qué recibís</p>
    <div class="factors">
      <div class="factor-card">
        <span class="factor-num">01</span>
        <h3>Rango de precio de venta</h3>
        <p>Un mínimo y un máximo, con la explicación de qué lo sube y qué lo baja, para que sepas en qué números te estás moviendo antes de publicar.</p>
      </div>
      <div class="factor-card">
        <span class="factor-num">02</span>
        <h3>Comparables publicados en tu zona</h3>
        <p>Propiedades parecidas que están hoy en el mercado, con la aclaración de que lo publicado es lo que se pide, no siempre lo que se paga.</p>
      </div>
      <div class="factor-card">
        <span class="factor-num">03</span>
        <h3>Plan de comercialización</h3>
        <p>Cómo conviene publicarla, en qué portales y con qué material, para vender en un plazo razonable sin regalar precio.</p>
      </div>
    </div>
  </div>
</section>

<section class="context-section">
  <div class="container">
    <p class="eyebrow">Para quién es</p>
    <h2>Para propietarios que van a poner en venta en Gran Asunción</h2>
    <p>Esta valoración es para vos si tenés una propiedad en Asunción o el Gran Asunción y estás por publicarla o evaluando hacerlo. No sirve como documento para sucesiones, bancos ni juicios: si necesitás un valor que quede por escrito con validez legal, es el <a href="/informes-periciales/">informe pericial</a>.</p>
  </div>
</section>

<?php partial_lead_form_valuacion(); ?>

<?php partial_dual('valuacion-dual', 'general', 'swapped'); ?>

<?php
partial_faq('Preguntas sobre la valoración para vender', [
    ['q' => '¿Es gratis de verdad?', 'a' => 'Sí. No pedimos pago, tarjeta ni datos de facturación por la valoración. El equipo inmobiliario la ofrece porque parte de quienes consultan después necesitan un informe formal o deciden vender con exclusividad, y ese trabajo sí se cobra aparte.'],
    ['q' => '¿Tiene validez legal?', 'a' => 'No. Es una referencia de precio de venta, no un documento firmado por un tasador habilitado. Para sucesiones, bancos, juicios o empresas hace falta el informe pericial.'],
    ['q' => '¿Estoy obligado a vender con ustedes?', 'a' => 'No. Recibís la valoración y decidís qué hacer con eso. Trabajamos con exclusividad cuando las dos partes lo eligen, nunca como condición para darte el rango.'],
]);

partial_cta_final([
    'heading' => '¿Lo que necesitás es un documento con validez legal?',
    'sub' => 'El informe pericial lo firma un tasador habilitado, para bancos, sucesiones, juicios y empresas.',
    'altHref' => '/informes-periciales/',
    'altLabel' => 'Ver informe pericial',
]);
