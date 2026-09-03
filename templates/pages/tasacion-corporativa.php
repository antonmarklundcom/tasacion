<?php
declare(strict_types=1);

partial_hero([
    'h1' => 'Tasación corporativa de inmuebles',
    'sub' => 'Informe pericial para empresas: balances, aportes de capital, fusiones, revalúo de activos, auditoría y sociedades que se separan.',
    'chips' => [['label' => 'Oficial · pago', 'variant' => 'seal']],
    'showPrice' => true,
    'buttons' => [
        ['label' => 'Cotizar tasación corporativa', 'href' => wa_url('corporativa-hero', 'corporativa'), 'variant' => 'primary', 'ev_loc' => 'corporativa-hero'],
        ['label' => 'Ver informe pericial', 'href' => '/informes-periciales/', 'variant' => 'secondary'],
    ],
    'image' => 'tasacion-locales-comerciales-asuncion',
    'imageAlt' => 'Nave industrial y galpón durante una visita de relevamiento',
]);

partial_selector('tasacion-corporativa');
?>

<section class="context-section">
  <div class="container">
    <p>Cuando el inmueble es un activo de una empresa, el informe tiene que responder a otra lógica: no es solo cuánto vale para venderlo, sino cómo entra en un balance, en un aporte de capital, en una fusión o en la separación de socios. El valor tiene que quedar documentado de forma que resista una auditoría o una discusión entre partes.</p>
    <p>Trabajamos con una o varias propiedades de la misma sociedad, considerando instalaciones especiales cuando corresponde —galpones, plantas, oficinas— y contratos de alquiler vigentes cuando el inmueble ya está generando renta.</p>
  </div>
</section>

<?php
partial_factors('Qué pesa en una tasación corporativa', [
    ['title' => 'Uso del informe (contable/legal)', 'text' => 'El nivel de detalle y la fundamentación del informe se ajustan a si va a un balance, a un trámite legal o a una negociación entre socios.'],
    ['title' => 'Inmuebles múltiples', 'text' => 'Cuando la sociedad tiene varios inmuebles, se pueden tasar en conjunto con un mismo criterio y una sola visita programada.'],
    ['title' => 'Valor de uso vs valor de mercado', 'text' => 'Un activo operativo (una planta en producción) no siempre se valora igual que si se vendiera vacío en el mercado abierto.'],
    ['title' => 'Instalaciones especiales', 'text' => 'Galpones, plantas y otras instalaciones específicas requieren un relevamiento distinto al de una vivienda estándar.'],
    ['title' => 'Contratos de alquiler vigentes', 'text' => 'Si el inmueble ya está alquilado, el contrato y la renta al día entran en la valoración del activo.'],
    ['title' => 'Plazos', 'text' => 'Los plazos de auditoría o de balance suelen tener fecha fija; coordinamos la visita y la entrega en función de eso.'],
]);

partial_dual('corporativa-dual', 'corporativa', 'informe-only');

partial_faq('Preguntas sobre tasación corporativa', [
    ['q' => '¿Sirve para revalúo contable?', 'a' => 'El informe documenta metodología, comparables y conclusión de valor, con el nivel de detalle que definas según para qué lo vas a usar.'],
    ['q' => '¿Tasan varios inmuebles juntos?', 'a' => 'Sí. Cuando una misma sociedad tiene varios inmuebles, se pueden coordinar en un solo proceso.'],
    ['q' => '¿Emiten factura?', 'a' => 'Consultá las condiciones de facturación al pedir presupuesto.'],
]);

partial_crosslinks([
    ['href' => '/tasaciones/locales-comerciales/', 'eyebrow' => 'Tasación', 'title' => 'Locales comerciales', 'text' => 'Tránsito, frente y habilitación de uso.'],
    ['href' => '/tasaciones/hipotecaria/', 'eyebrow' => 'Tasación', 'title' => 'Hipotecaria', 'text' => 'Informe para presentar como garantía bancaria.'],
]);

partial_cta_final([
    'heading' => 'Contanos el caso de tu empresa y armamos el presupuesto',
    'sub' => 'Confirmamos plazos y alcance antes de empezar.',
    'waSrc' => 'corporativa-final',
    'waType' => 'corporativa',
]);
