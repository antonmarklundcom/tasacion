<?php
declare(strict_types=1);

partial_hero([
    'h1' => 'Tasación de casas en Asunción',
    'sub' => 'Una casa no se tasa por metros cuadrados. Se tasa por dónde está parada, cuánto tiene de terreno, cuánto de construcción, y en qué estado real está eso que está construido.',
    'chips' => [['label' => 'Oficial · pago', 'variant' => 'seal']],
    'showPrice' => true,
    'buttons' => [
        ['label' => 'Cotizar tasación de mi casa', 'href' => wa_url('casas-hero', 'casa'), 'variant' => 'primary', 'ev_loc' => 'casas-hero'],
        ['label' => 'Ver informe pericial', 'href' => '/informes-periciales/', 'variant' => 'secondary'],
    ],
    'image' => 'tasacion-casas-departamentos-asuncion',
    'imageAlt' => 'Fachada de una vivienda en Asunción durante una visita de relevamiento',
]);

partial_selector('tasacion-casas');
?>

<section class="context-section">
  <div class="container">
    <p>En Asunción, dos casas iguales en cuadras distintas no valen lo mismo, y la diferencia no es un porcentaje fijo que se pueda aplicar de memoria. Pesa el barrio, pero también la cuadra: si la calle está asfaltada, si hay avenida o colectivo cerca, si es zona inundable y qué se está construyendo alrededor.</p>
    <p>Por eso el informe mide terreno y construcción por separado y describe el estado real de cada parte: instalación eléctrica, cañerías, techo, humedad y aberturas. Nada de eso se ve en una foto, y todo eso el comprador lo descuenta del precio en la primera visita.</p>
  </div>
</section>

<?php
partial_factors('Qué revisamos en una casa', [
    ['title' => 'Ubicación y cuadra', 'text' => 'No solo el barrio: la cuadra. Si la calle está asfaltada, si hay avenida o colectivo cerca y qué se está construyendo alrededor.'],
    ['title' => 'Terreno vs construcción', 'text' => 'Se valoran distinto y por eso se miden distinto. El terreno responde a la zona y al frente; la construcción, a los metros cubiertos y su calidad.'],
    ['title' => 'Antigüedad y estado', 'text' => 'Una casa de treinta años bien mantenida puede estar mejor posicionada que una de diez descuidada. Pesa cuándo fue la última refacción de fondo.'],
    ['title' => 'Ampliaciones sin planos', 'text' => 'Quinchos, un piso más, un departamento en el fondo. No impide tasar, pero esos metros no valen lo mismo que los regularizados y el informe lo deja explícito.'],
    ['title' => 'Comparables reales vs publicados', 'text' => 'Lo publicado en los portales es lo que se pide, no lo que se paga. El informe ajusta esa diferencia con comparables verificados.'],
    ['title' => 'Zonificación', 'text' => 'Qué se puede hacer legalmente en ese lote según la normativa municipal cambia el valor, incluso con la misma construcción encima.'],
]);

partial_dual('casas-dual', 'casa');

partial_faq('Preguntas sobre tasación de casas', [
    ['q' => '¿Qué documentos necesito?', 'a' => 'En términos generales: algo que acredite la titularidad, algo que acredite la superficie y los linderos, y algo que muestre qué está construido sobre el terreno. La lista exacta te la pasamos cuando nos contás el caso.'],
    ['q' => '¿Tasan casas alquiladas?', 'a' => 'Sí. Que esté alquilada es un dato que entra en la tasación, no un obstáculo. Para la visita hay que coordinar el acceso con el inquilino.'],
    ['q' => '¿Qué pasa con construcción sin declarar?', 'a' => 'No es raro y no impide tasar. Lo señalamos en el informe en lugar de disimularlo: el comprador lo va a descubrir igual, y preferimos que ese dato lo tengas vos antes que él.'],
]);

partial_crosslinks([
    ['href' => '/tasaciones/departamentos/', 'eyebrow' => 'Tasación', 'title' => 'Departamentos', 'text' => 'Piso, orientación, expensas y comparables del edificio.'],
    ['href' => '/tasaciones/terrenos/', 'eyebrow' => 'Tasación', 'title' => 'Terrenos', 'text' => 'Frente, forma del lote y zonificación.'],
]);

partial_cta_final([
    'heading' => 'Contanos de tu casa y arrancamos desde ahí',
    'sub' => 'Te pasamos el presupuesto antes de empezar.',
    'waSrc' => 'casas-final',
    'waType' => 'casa',
]);
