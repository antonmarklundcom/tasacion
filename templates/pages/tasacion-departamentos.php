<?php
declare(strict_types=1);

partial_hero([
    'h1' => 'Tasación de departamentos en Asunción',
    'sub' => 'En un departamento no hay terreno propio que valorar, así que el peso se corre entero a la construcción, al piso y al edificio.',
    'chips' => [['label' => 'Oficial · pago', 'variant' => 'seal']],
    'showPrice' => true,
    'buttons' => [
        ['label' => 'Cotizar tasación de mi departamento', 'href' => wa_url('departamentos-hero', 'departamento'), 'variant' => 'primary', 'ev_loc' => 'departamentos-hero'],
        ['label' => 'Ver informe pericial', 'href' => '/informes-periciales/', 'variant' => 'secondary'],
    ],
    'image' => 'tasacion-casas-departamentos-asuncion',
    'imageAlt' => 'Interior de un departamento durante una visita de relevamiento',
]);

partial_selector('tasacion-departamentos');
?>

<section class="context-section">
  <div class="container">
    <p>En un edificio de Asunción, el piso importa, la orientación importa y la vista importa, en ese orden y con diferencias que se notan en el precio final. Pero también pesa lo que no es tuyo y se paga igual: la expensa mensual, el estado del ascensor, si hay generador, y qué amenities tiene el edificio y cuáles están efectivamente funcionando.</p>
    <p>Un factor que en Asunción pesa cada vez más es cuántas unidades iguales a la tuya hay en venta en el mismo edificio. Por eso el informe compara contra el edificio y la zona, no solo contra el promedio del barrio.</p>
  </div>
</section>

<?php
partial_factors('Qué revisamos en un departamento', [
    ['title' => 'Piso y orientación', 'text' => 'A igual metraje, un piso más alto con buena orientación se posiciona distinto que uno bajo con vista a un pozo de aire y luz.'],
    ['title' => 'Expensas y estado del edificio', 'text' => 'La expensa mensual, el estado del ascensor y si los amenities están efectivamente funcionando entran en la tasación.'],
    ['title' => 'Cochera y baulera', 'text' => 'Cochera propia, compartida o inexistente, y si hay baulera, cambian el valor de forma directa, no marginal.'],
    ['title' => 'Superficie propia vs común', 'text' => 'El informe separa la superficie exclusiva de la parte proporcional en espacios comunes, porque se valoran distinto.'],
    ['title' => 'Antigüedad del edificio', 'text' => 'No solo del departamento: cuándo se hizo la última refacción de fondo del edificio, del techo y de las instalaciones comunes.'],
    ['title' => 'Comparables en el mismo edificio y zona', 'text' => 'Cuántas unidades parecidas hay en venta en el mismo edificio hoy, y a qué se están vendiendo realmente en la zona.'],
]);

partial_dual('departamentos-dual', 'departamento');

partial_faq('Preguntas sobre tasación de departamentos', [
    ['q' => '¿Vale más un piso alto?', 'a' => 'En general sí, pero depende de la orientación y la vista. Un piso alto con vista a otro edificio no siempre supera a un piso medio con buena luz.'],
    ['q' => '¿Influyen las expensas?', 'a' => 'Sí. Una expensa alta sin servicios que la justifiquen resta valor para un comprador que hace números mensuales, no solo el precio de compra.'],
    ['q' => '¿Necesito el reglamento de copropiedad?', 'a' => 'Para el informe formal, sí ayuda tenerlo disponible. Si no lo tenés a mano, contanos y vemos cómo conseguirlo.'],
]);

partial_crosslinks([
    ['href' => '/tasaciones/casas/', 'eyebrow' => 'Tasación', 'title' => 'Casas', 'text' => 'Terreno y construcción medidos por separado.'],
    ['href' => '/tasaciones/hipotecaria/', 'eyebrow' => 'Tasación', 'title' => 'Hipotecaria', 'text' => 'Informe para presentar como garantía bancaria.'],
]);

partial_cta_final([
    'heading' => 'Contanos de tu departamento y arrancamos desde ahí',
    'sub' => 'Te pasamos el presupuesto antes de empezar.',
    'waSrc' => 'departamentos-final',
    'waType' => 'departamento',
]);
