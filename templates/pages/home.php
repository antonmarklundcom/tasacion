<?php
declare(strict_types=1);
$cfg = site_config();

partial_hero([
    'h1' => 'Tasación de inmuebles en Asunción con validez legal',
    'sub' => 'Informe pericial firmado por tasador habilitado, para bancos, sucesiones, juicios y empresas. Y valoración comercial sin costo si vas a vender.',
    'chips' => [
        ['label' => 'Oficial · pago', 'variant' => 'seal'],
        ['label' => 'Sin costo', 'variant' => 'free'],
    ],
    'showPrice' => true,
    'buttons' => [
        ['label' => 'Cotizar informe pericial por WhatsApp', 'href' => wa_url('home-hero', 'general'), 'variant' => 'primary', 'ev_loc' => 'home-hero'],
        ['label' => 'Valoración gratuita para vender', 'href' => '/valuacion-para-vender/', 'variant' => 'secondary'],
    ],
    'image' => 'tasacion-de-inmuebles-asuncion',
    'imageAlt' => 'Cuaderno de relevamiento con cinta métrica y planos sobre una mesa de trabajo',
]);

add_jsonld([
    '@context'   => 'https://schema.org',
    '@type'      => 'ProfessionalService',
    'name'       => $cfg['site_name'],
    'url'        => $cfg['base_url'],
    'areaServed' => $cfg['coverage'],
    'telephone'  => '+' . $cfg['wa_number'],
]);

partial_dual('home-dual', 'general');
?>

<section class="services-grid-section">
  <div class="container">
    <p class="eyebrow">Informe pericial</p>
    <h2>Tasamos casas, departamentos, terrenos, locales, empresas, garantías y campos</h2>
    <div class="services-grid">
      <a class="service-card" href="/tasaciones/casas/"><h3>Casas</h3><p>Terreno y construcción medidos por separado, con el estado real de las instalaciones.</p></a>
      <a class="service-card" href="/tasaciones/departamentos/"><h3>Departamentos</h3><p>Piso, orientación, expensas y comparables del mismo edificio.</p></a>
      <a class="service-card" href="/tasaciones/terrenos/"><h3>Terrenos</h3><p>Frente, forma del lote, servicios y zonificación.</p></a>
      <a class="service-card" href="/tasaciones/locales-comerciales/"><h3>Locales comerciales</h3><p>Tránsito, frente y habilitación de uso.</p></a>
      <a class="service-card" href="/tasaciones/corporativa/"><h3>Corporativa</h3><p>Balances, revalúo de activos y sociedades que se separan.</p></a>
      <a class="service-card" href="/tasaciones/hipotecaria/"><h3>Hipotecaria</h3><p>Informe para presentar como garantía ante bancos y financieras.</p></a>
      <a class="service-card" href="/tasaciones/campos/"><h3>Campos y estancias</h3><p>Interior del país, aptitud del suelo, mejoras y mensura.</p></a>
    </div>
  </div>
</section>

<?php
partial_ledger('Qué incluye el informe pericial', [
    'Identificación del inmueble: ubicación, superficie de terreno y de construcción, y datos de la documentación.',
    'Relevamiento: qué se midió y qué se observó el día de la visita.',
    'Metodología aplicada, explicada para que se pueda seguir el razonamiento.',
    'Comparables considerados, con los ajustes que se les aplicaron.',
    'Registro fotográfico del frente, el interior y las instalaciones.',
    'Conclusión de valor, con firma del tasador habilitado.',
]);
?>

<section class="budget-section">
  <div class="container">
    <p class="eyebrow">Presupuesto</p>
    <h2>Cómo se calcula el presupuesto</h2>
    <ul class="budget-list">
      <li><strong>Tipo de inmueble.</strong> No es lo mismo una casa que un galpón o un campo.</li>
      <li><strong>Superficie.</strong> Más metros es más relevamiento y más tiempo de visita.</li>
      <li><strong>Uso del informe.</strong> Define el nivel de detalle y de documentación que tiene que llevar.</li>
    </ul>
    <?php partial_price_block(); ?>
  </div>
</section>

<?php
partial_factors('Qué define el valor de tu inmueble', [
    ['title' => 'Ubicación y barrio', 'text' => 'Dos casas iguales en zonas distintas no valen lo mismo, y la diferencia no es un porcentaje fijo. Pesa el barrio, pero también la cuadra: si la calle está asfaltada, si es zona inundable, si tenés avenida o colectivo cerca.'],
    ['title' => 'Superficie de terreno y de construcción', 'text' => 'Se miden por separado porque se valoran distinto. El terreno responde a la zona y al frente; la construcción, a cuántos metros cubiertos hay y de qué calidad son.'],
    ['title' => 'Antigüedad y estado', 'text' => 'La antigüedad sola dice poco: una propiedad de treinta años bien mantenida puede estar mejor posicionada que una de diez descuidada.'],
    ['title' => 'Comparables de la zona', 'text' => 'Buscamos propiedades parecidas en la misma zona. Lo publicado en los portales es lo que se pide, no lo que se paga, y esa diferencia se ajusta.'],
    ['title' => 'Uso y zonificación', 'text' => 'Qué se puede hacer legalmente en ese lote cambia el valor. Una propiedad habilitada para uso comercial no vale lo mismo que la misma casa en zona residencial.'],
]);

partial_faq('Preguntas frecuentes', [
    ['q' => '¿Cuánto cuesta una tasación?', 'a' => 'El informe pericial cuesta entre ' . gs($cfg['price_min']) . ' y ' . gs($cfg['price_max']) . ', según tipo de inmueble y superficie. Te pasamos el presupuesto exacto antes de empezar. La valoración comercial para vender no tiene costo.'],
    ['q' => '¿Cuánto demora?', 'a' => 'Depende del tipo de inmueble y de la disponibilidad para la visita. Te confirmamos el plazo por WhatsApp antes de empezar, así no dependés de una estimación genérica.'],
    ['q' => '¿Sirve para el banco?', 'a' => 'El informe pericial se prepara con el formato que exigen bancos, cooperativas y financieras. Confirmá con tu entidad si acepta tasadores externos antes de pedirlo.'],
    ['q' => '¿La valoración gratis es una tasación?', 'a' => 'No. Es una referencia de precio de venta que arma el equipo inmobiliario, sin validez legal. Si necesitás un documento firmado por un tasador habilitado, es el informe pericial.'],
    ['q' => '¿Trabajan fuera de Asunción?', 'a' => 'Trabajamos en Asunción y todo el Gran Asunción. Para campos y estancias en el interior del país coordinamos según el caso: escribinos y te confirmamos si podemos llegar.'],
]);

partial_cta_final([
    'heading' => '¿Necesitás un informe con validez legal?',
    'sub' => 'Contanos qué inmueble es y para qué necesitás el informe, y te pasamos el presupuesto antes de empezar.',
    'waSrc' => 'home-final',
    'waType' => 'general',
]);
