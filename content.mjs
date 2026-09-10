// content.mjs — contenido de las 13 páginas, copiado del sitio anterior
// (tasacion.com.py, versión Next.js, dado de baja). Ver docs/legacy-sitemap.md
// para la fuente. Generado por build-site.mjs — no editar los .html a mano.

export const WA_NUMBER = '595995628862';
export const SITE = 'https://tasacion.com.py';

export const TASADOR = 'Fernando Capurro';
export const PRECIO = { min: 800000, max: 1500000 };
export const fmtGs = (n) => 'Gs. ' + n.toLocaleString('es-PY').replace(/ /g, '.');
const rango = (r) => (r.max ? `${fmtGs(r.min)} a ${fmtGs(r.max)}` : `desde ${fmtGs(r.min)}`);

// -------------------------------------------------- v3 -- credenciales reales
// prompts/v3-credenciales-y-finalidades.md §1. Cadenas canonicas: el copy las
// interpola, nunca las reescribe. verify.mjs comprueba que se usen textuales.
export const CRED_CSJ = 'Perito Tasador matriculado ante la Corte Suprema de Justicia, matrícula N.º 4.168';
export const CRED_CSJ_CORTA = 'Perito Tasador CSJ · Mat. 4.168';
export const CRED_ARQ = 'Arquitecto, matrícula profesional N.º 3.738';
export const CRED_SELLO_CORTA = 'Fernando Capurro · CSJ Mat. 4.168 · Arq. Mat. 3.738';
export const CRED_BCP_FIRMA = 'el informe lo firma un tasador inscripto en el registro del BCP';
export const CRED_BCP_BANCOS = 'Trabajamos con todos los bancos y cooperativas: al gestionar tu carpeta coordinamos la firma que tu entidad requiere.';
export const PLAZO_TXT = '3 a 5 días hábiles después de la visita';
export const IVA_TXT = '+ IVA'; // D1 (Anton, 2026-09-10)
export const FACTURA_TXT = 'Emitimos factura legal';
export const PRECIOS = { compraventa: { min: 800000, max: 1500000 }, judicial: { min: 1800000, max: 2500000 }, credito: { min: 1500000, max: null } };
export const PRECIO_TXT = rango(PRECIOS.compraventa); // compat: "Gs. 800.000 a Gs. 1.500.000" (sin IVA_TXT; se agrega al renderizar)
export const PRECIO_JUDICIAL_TXT = rango(PRECIOS.judicial);
export const PRECIO_CREDITO_TXT = rango(PRECIOS.credito);
export const PRECIO_NOTA = 'según tipo y tamaño del inmueble; te confirmamos el monto exacto por WhatsApp antes de agendar la visita';
export const FRANJA_COTIZA = 'Presupuesto por proyecto, según la cantidad de lotes y edificaciones dentro de la franja.';
export const VISITA_TXT = null; // Q7, pendiente de confirmar
export const EJEMPLO = { valor: 400000000, error: 0.05 };

export const FINALIDADES = [
  { id: 'compraventa', label: 'Compra o venta', precio: PRECIOS.compraventa, firma: 'csj',
    corto: 'Sabé el valor real antes de firmar una oferta o una escritura.' },
  { id: 'credito', label: 'Crédito bancario', precio: PRECIOS.credito, firma: 'bcp',
    corto: 'Hipotecario o fiduciario: el informe que tu banco o cooperativa te pide para la carpeta, con la firma que exige el BCP.' },
  { id: 'judicial', label: 'Sucesiones y juicios', precio: PRECIOS.judicial, firma: 'csj',
    corto: 'Herencias, remates judiciales, liquidaciones: un informe pericial firmado por perito de la CSJ, que se sostiene ante el juzgado.' },
  { id: 'vender', label: 'Vender con corredor', precio: PRECIOS.compraventa, firma: 'csj',
    corto: 'Mismo informe; si firmás exclusividad con un corredor asociado, el costo se descuenta de la comisión.' },
];

export const WA_MENU = {
  options: [
    { id: 'informe', label: 'Necesito el informe oficial para comprar o vender', sub: 'Firmado por perito tasador',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y necesito un informe oficial de tasación para una compra o venta. El inmueble está en: ______` },
    { id: 'credito', label: 'Necesito una tasación para un crédito', sub: 'Banco o cooperativa · hipotecario o fiduciario',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y necesito una tasación para presentar en un crédito bancario o de cooperativa. El inmueble está en: ______` },
    { id: 'judicial', label: 'Necesito una tasación para una sucesión o un juicio', sub: 'Herencias, remates, liquidaciones',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y necesito una tasación pericial para una sucesión o un proceso judicial. El inmueble está en: ______` },
    { id: 'valoracion', label: 'Quiero una tasación para vender con un corredor', sub: 'El costo se descuenta de la comisión',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y quiero una tasación para vender mi propiedad con un corredor asociado. El inmueble está en: ______` },
    { id: 'consulta', label: 'Tengo otra consulta', sub: 'Empresas, franja de dominio, otros casos',
      text: (ctx) => `Hola, vengo de la página de ${ctx} y tengo una consulta.` },
  ],
  fallback: (ctx) => `Hola, vengo de tasacion.com.py (${ctx}) y quiero información sobre una tasación.`,
};

const porQueElegirnos = {
  type: 'grid3',
  heading: 'Por qué elegirnos',
  items: [
    { title: 'Datos Reales de Mercado', body: 'No usamos promedios genéricos. Analizamos ventas reales y tendencias actuales del mercado paraguayo.' },
    { title: 'Rapidez por WhatsApp', body: 'Recibí atención rápida y personalizada según tu necesidad: venta o trámite oficial.' },
    { title: 'Perito matriculado', body: `${CRED_CSJ} y ${CRED_ARQ}: el mismo profesional que visita el inmueble firma el informe.` },
  ],
};

const otrasTasaciones = (heading, items) => ({ type: 'links', heading: heading || 'Otras tasaciones', items });

// §5.3 (v3): las tres preguntas de FAQ comunes a las 7 verticales.
const verticalFaqCore = (item) => [
  { q: `¿Cuánto cuesta el informe de ${item}?`, a: `Compra o venta: ${PRECIO_TXT} ${IVA_TXT}. Sucesiones y juicios: ${PRECIO_JUDICIAL_TXT} ${IVA_TXT}. Crédito bancario: ${PRECIO_CREDITO_TXT} ${IVA_TXT}.` },
  { q: '¿Cuánto tarda?', a: `Una vez hecha la visita, el informe firmado está listo en ${PLAZO_TXT}.` },
  { q: '¿Sirve para mi banco o cooperativa?', a: `Sí: para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}` },
];

const INCLUYE_INFORME = [`Firma de ${CRED_CSJ}`, 'Visita técnica al inmueble', 'Análisis de comparables reales', 'Documentación fotográfica', 'Metodología de tasación explicada', 'Vigencia legal para bancos y juzgados', `Entrega en ${PLAZO_TXT}`];

const freeAsideVender = () => ({
  type: 'freeAside',
  heading: 'Tasación para vender, cubierta por tu corredor',
  body: 'Si tu objetivo es vender, hacemos la tasación al mismo costo que el informe oficial. Si firmás un contrato de exclusividad con uno de nuestros corredores asociados, ese costo se descuenta de la comisión al cerrar la venta. No es un informe oficial ni tiene validez legal ni bancaria.',
  cta: { label: 'Ver cómo funciona', href: '/valuacion-para-vender/' },
});

// §5.3 (v3): panel navy con la tabla por finalidad (ya no "desde/hasta por
// tamaño"). Cifra grande = rango compraventa; filas = las tres finalidades.
const priceBlockFinalidades = (heading) => ({
  type: 'priceBlock',
  heading,
  eyebrow: 'Precio por finalidad',
  includes: INCLUYE_INFORME,
  figure: PRECIO_TXT,
  rows: [
    ['Compra o venta', `${PRECIO_TXT} ${IVA_TXT}`],
    ['Sucesiones y juicios', `${PRECIO_JUDICIAL_TXT} ${IVA_TXT}`],
    ['Crédito bancario', `${PRECIO_CREDITO_TXT} ${IVA_TXT}`],
  ],
  pie: FACTURA_TXT,
});

const ctaBand = (heading, body, opts = {}) => ({
  type: 'ctaBand',
  eyebrow: 'Informe oficial · firmado por perito tasador',
  heading,
  body: body.includes(PLAZO_TXT) ? body : `${body} Listo en ${PLAZO_TXT}.`,
  primary: opts.primary || { label: 'Solicitar informe oficial', waOption: 'informe' },
  secondaryLink: opts.secondaryLink || { label: 'o pedir una tasación para vender con un corredor', waOption: 'valoracion' },
});

// §5.15 — copy fijado por Fable, verbatim. Sonnet lo interpola, no lo reescribe.
const VALUE_ITEMS = [
  { title: 'Define cuánto te presta el banco', body: 'El banco o la cooperativa calcula el monto del crédito como un porcentaje del valor que fija la tasación. Sin informe no hay garantía; con un informe bien hecho, la garantía vale lo que tiene que valer.' },
  { title: 'Evita el error más caro de una compraventa', body: `Ejemplo: en una casa de ${fmtGs(EJEMPLO.valor)}, un 5 % de error de precio son ${fmtGs(EJEMPLO.valor * EJEMPLO.error)} — más de 10 veces lo que cuesta el informe. Comprar caro o vender barato sale mucho más caro que tasar.` },
  { title: 'Fija tu parte en una herencia', body: 'En una sucesión, el valor que establece el informe pericial es el que se reparte entre los herederos y sobre el que se calculan los honorarios. Un perito matriculado ante la Corte Suprema de Justicia es lo que el juzgado acepta.' },
  { title: 'Respalda a tu empresa', body: 'Garantías para crédito comercial, revaluación de activos para balances, valores de reposición para seguros y compraventa de activos.' },
  { title: 'Con validez, con plazo y con factura', body: `${VISITA_TXT ? `${VISITA_TXT}; informe en ${PLAZO_TXT}` : `Firmado por perito matriculado, entregado en ${PLAZO_TXT}`}, con factura legal. Precio anclado por finalidad antes de la visita, sin sorpresas.` },
];
const VALUE_LEDE = 'Nadie tasa por curiosidad. Se tasa porque un banco, un juzgado, una escribanía o una contraparte lo exige — o porque hay mucha plata en juego en ponerle el precio equivocado a un inmueble.';
const valueBlockFull = () => ({ type: 'valueBlock', heading: 'El informe no es un gasto: es lo que destraba la operación', lede: VALUE_LEDE, items: VALUE_ITEMS });
const valueBlockShort = () => ({ type: 'valueBlock', heading: 'El informe no es un gasto: es lo que destraba la operación', short: true, items: VALUE_ITEMS });

export const NAV = [
  { label: 'Inicio', href: '/' },
  {
    label: 'Tasaciones', href: '/tasaciones/',
    children: [
      { label: 'Casas', href: '/tasaciones/casas/' },
      { label: 'Departamentos', href: '/tasaciones/departamentos/' },
      { label: 'Terrenos', href: '/tasaciones/terrenos/' },
      { label: 'Corporativa', href: '/tasaciones/corporativa/' },
      { label: 'Hipotecaria', href: '/tasaciones/hipotecaria/' },
      { label: 'Locales Comerciales', href: '/tasaciones/locales-comerciales/' },
      { label: 'Campos y Estancias', href: '/tasaciones/campos/' },
      { label: 'Franja de Dominio', href: '/tasaciones/franja-de-dominio/' },
    ],
  },
  { label: 'Informe oficial', href: '/informes-periciales/' },
  { label: 'Vender', href: '/valuacion-para-vender/' },
  { label: 'Nosotros', href: '/nosotros/' },
  { label: 'FAQ', href: '/preguntas-frecuentes/' },
  { label: 'Contacto', href: '/contacto/' },
];

export const SERVICIOS = [
  { title: 'Tasación de Casas', body: 'Valoración de mercado para residencias urbanas y barrios cerrados.', href: '/tasaciones/casas/' },
  { title: 'Tasación de Departamentos', body: 'Análisis por zona, edificio y unidades en propiedad horizontal.', href: '/tasaciones/departamentos/' },
  { title: 'Tasación de Terrenos', body: 'Tasación técnica de lotes, fracciones y potencial de desarrollo.', href: '/tasaciones/terrenos/' },
  { title: 'Tasación Corporativa', body: 'Informes oficiales para oficinas, depósitos y plantas industriales.', href: '/tasaciones/corporativa/' },
  { title: 'Tasación Hipotecaria', body: 'Documentación certificada para la aprobación de carpetas bancarias.', href: '/tasaciones/hipotecaria/' },
  { title: 'Tasación de Locales Comerciales', body: 'Valuación de activos comerciales por rentabilidad y ubicación.', href: '/tasaciones/locales-comerciales/' },
  { title: 'Tasación de Campos y Estancias', body: 'Valuación técnica de activos rurales y establecimientos ganaderos.', href: '/tasaciones/campos/' },
  { title: 'Franja de Dominio', body: 'Relevamiento y avaluación edilicia para proyectos viales.', href: '/tasaciones/franja-de-dominio/' },
];

export const PAGES = [
  // ---------------------------------------------------------------- HOME
  {
    slug: '/',
    waContext: 'Inicio',
    kind: 'home',
    eyebrow: 'Perito Tasador CSJ · Asunción y Gran Asunción',
    showPriceChip: false,
    chipNote: `firmado en ${PLAZO_TXT}`,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver para qué lo necesitás', href: '#finalidades' }, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasacion-de-inmuebles-asuncion', alt: 'Tasador de Tasación.com.py señalando un terreno en el Gran Asunción' },
    title: 'Tasación de inmuebles en Asunción | Tasación.com.py',
    description: 'Informe oficial de tasación firmado por el Tasador Fernando Capurro, con validez legal y bancaria, para crédito, sucesión o venta. Precio anclado por finalidad, antes de la visita.',
    h1: 'Tasación con validez legal y bancaria, para tu crédito, tu sucesión o tu venta',
    subcopy: `Informe técnico firmado por el Tasador ${TASADOR}, listo para presentar en tu banco, cooperativa, juzgado o escribanía. Si tu objetivo es vender, el costo se descuenta de la comisión de tu corredor asociado.`,
    sections: [
      {
        type: 'useCases', id: 'finalidades',
        heading: '¿Para qué necesitás la tasación?',
        items: [
          { icon: 'compraventa', eyebrow: 'Lo más pedido', title: FINALIDADES[0].label, body: FINALIDADES[0].corto, href: '/informes-periciales/#compraventa', label: 'Ver informe oficial' },
          { icon: 'credito', eyebrow: 'Hipotecario o fiduciario', title: FINALIDADES[1].label, body: FINALIDADES[1].corto, href: '/tasaciones/hipotecaria/', label: 'Ver tasación para crédito' },
          { icon: 'judicial', eyebrow: 'Informe pericial', title: FINALIDADES[2].label, body: FINALIDADES[2].corto, href: '/informes-periciales/#judicial', label: 'Ver informe pericial' },
          { icon: 'franja', eyebrow: 'Para empresas', title: '¿Sos empresa o consorcio vial?', body: 'Relevamiento y avaluación edilicia en franja de dominio para proyectos viales.', href: '/tasaciones/franja-de-dominio/', label: 'Ver franja de dominio', muted: true },
        ],
      },
      valueBlockFull(),
      {
        type: 'services', id: 'tasaciones',
        heading: 'Especialistas en cada tipo de inmueble',
        items: SERVICIOS,
      },
      {
        type: 'credentials',
        heading: 'Quién firma tu informe',
        tasador: [CRED_CSJ, CRED_ARQ],
        credito: `Para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}`,
        plazo: PLAZO_TXT,
      },
      {
        type: 'steps',
        heading: 'Tu tasación en 3 pasos simples',
        items: [
          { title: 'Elegí para qué la necesitás', body: 'Compra o venta, crédito, sucesión o juicio: decinos tu caso por WhatsApp.' },
          { title: 'Hablá con el tasador por WhatsApp', body: 'Coordinamos la visita y confirmamos el alcance de tu caso.' },
          { title: 'Recibís el informe firmado', body: `El informe firmado llega en ${PLAZO_TXT}, o la tasación para vender con el costo cubierto por tu corredor.` },
        ],
      },
      freeAsideVender(),
      {
        type: 'faqPreview',
        heading: 'Preguntas frecuentes',
        items: [
          '¿Cuánto cuesta según la finalidad?',
          '¿Sirve para un crédito en mi banco o cooperativa?',
          '¿Sirve para una sucesión?',
        ],
        href: '/preguntas-frecuentes/',
      },
      ctaBand('Pedí tu informe oficial de tasación', 'Documento firmado por el Tasador Fernando Capurro, con validez para bancos, juzgados y escribanías.'),
    ],
  },

  // -------------------------------------------------------- TASACIONES (hub)
  {
    slug: '/tasaciones/',
    waContext: 'Tasaciones',
    kind: 'vertical',
    eyebrow: 'Tasaciones · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver los 8 tipos de inmueble', href: '#servicios' }, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasacion-de-inmuebles-asuncion', alt: 'Tasador de Tasación.com.py señalando un terreno en el Gran Asunción' },
    title: 'Tasaciones de inmuebles en Paraguay | Tasación.com.py',
    description: 'Elegí el tipo de inmueble que querés tasar: casas, departamentos, terrenos, corporativa, hipotecaria, locales comerciales, campos y estancias o franja de dominio.',
    h1: 'Tasaciones de inmuebles, para cada tipo de propiedad',
    subcopy: 'Cada tipo de inmueble tiene su propia lógica de valuación. Elegí el que corresponde a tu caso para ver qué incluye el informe y el precio según tu finalidad.',
    sections: [
      {
        type: 'services', id: 'servicios',
        heading: 'Especialistas en cada tipo de inmueble',
        items: SERVICIOS,
      },
      {
        type: 'useCases',
        heading: '¿Para qué necesitás la tasación?',
        items: [
          { icon: 'compraventa', eyebrow: 'Lo más pedido', title: FINALIDADES[0].label, body: FINALIDADES[0].corto, href: '/informes-periciales/#compraventa', label: 'Ver informe oficial' },
          { icon: 'credito', eyebrow: 'Hipotecario o fiduciario', title: FINALIDADES[1].label, body: FINALIDADES[1].corto, href: '/tasaciones/hipotecaria/', label: 'Ver tasación para crédito' },
          { icon: 'judicial', eyebrow: 'Informe pericial', title: FINALIDADES[2].label, body: FINALIDADES[2].corto, href: '/informes-periciales/#judicial', label: 'Ver informe pericial' },
          { icon: 'franja', eyebrow: 'Para empresas', title: '¿Sos empresa o consorcio vial?', body: 'Relevamiento y avaluación edilicia en franja de dominio para proyectos viales.', href: '/tasaciones/franja-de-dominio/', label: 'Ver franja de dominio', muted: true },
        ],
      },
      freeAsideVender(),
      {
        type: 'faqPreview',
        heading: 'Preguntas frecuentes',
        items: [
          '¿Cuánto cuesta según la finalidad?',
          '¿Sirve para un crédito en mi banco o cooperativa?',
          '¿Sirve para una sucesión?',
        ],
        href: '/preguntas-frecuentes/',
      },
      ctaBand('Pedí tu informe oficial de tasación', 'Documento firmado por el Tasador Fernando Capurro, con validez para bancos, juzgados y escribanías.'),
    ],
  },

  // ------------------------------------------------------------ CASAS
  {
    slug: '/tasaciones/casas/',
    waContext: 'Tasación de Casas',
    kind: 'vertical',
    eyebrow: 'Tasación de casas · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasacion-casas-departamentos-asuncion', alt: 'Casa residencial en un barrio de Asunción' },
    title: 'Tasación de casas en Asunción | Tasación.com.py',
    description: 'Valuación de mercado para residencias urbanas y barrios cerrados, hecha por peritos que conocen tu zona. Costo cubierto por tu corredor si querés vender; certificada si es para un trámite.',
    h1: 'Tasación de casas en Asunción: conocé el valor real de tu vivienda',
    subcopy: 'Valuación de mercado para residencias urbanas y barrios cerrados, hecha por peritos que conocen tu zona. Costo cubierto por tu corredor si querés vender; certificada si es para un trámite.',
    sections: [
      {
        type: 'lead',
        heading: 'Poner mal el precio de tu casa te cuesta caro',
        body: 'En el mercado inmobiliario paraguayo, fijar el precio correcto desde el primer día es fundamental. Poner un precio por encima del valor real espanta a los compradores potenciales y hace que tu propiedad quede estancada por meses, perdiendo interés. Por otro lado, pedir de menos es regalar tu patrimonio.\n\nNuestro equipo de peritos analiza ventas reales recientes en tu barrio, el estado de conservación de tu vivienda y las tendencias actuales para darte un valor exacto. No usamos promedios genéricos; usamos datos reales de campo.',
      },
      {
        type: 'grid3',
        heading: 'Qué miramos para tasar tu casa',
        items: [
          { title: 'Ubicación y Barrio', body: 'Analizamos el entorno, accesos y la demanda específica de tu zona.' },
          { title: 'Metros de Terreno y Construcción', body: 'Medición precisa de superficies cubiertas y libres.' },
          { title: 'Antigüedad y Estado', body: 'Evaluamos el mantenimiento y la vida útil remanente.' },
          { title: 'Terminaciones y Refacciones', body: 'La calidad de los materiales y mejoras recientes suman valor.' },
          { title: 'Plusvalía de la Zona', body: 'Proyecciones de crecimiento y obras públicas cercanas.' },
          { title: 'Comparables Reales', body: 'Ventas cerradas recientemente, no solo precios de lista.' },
        ],
      },
      priceBlockFinalidades('Qué incluye el informe de tasación de tu casa'),
      valueBlockShort(),
      freeAsideVender(),
      {
        type: 'zonas',
        heading: 'Zonas de cobertura',
        items: ['Villa Morra', 'Carmelitas', 'Las Mercedes', 'Mburucuyá', 'Recoleta', 'Lambaré', 'San Lorenzo', 'Luque', 'Fernando de la Mora'],
      },
      {
        type: 'faq',
        items: [
          ...verticalFaqCore('una casa'),
          { q: '¿La visita tiene costo?', a: 'La visita está incluida en el precio del informe, para cualquier finalidad.' },
        ],
      },
      otrasTasaciones(null, [
        { title: 'Departamentos', href: '/tasaciones/departamentos/' },
        { title: 'Terrenos', href: '/tasaciones/terrenos/' },
      ]),
      ctaBand('Informe oficial de tasación de tu casa', 'Documento firmado por el Tasador Fernando Capurro, listo para bancos, juzgados y trámites oficiales.'),
    ],
  },

  // ------------------------------------------------------ DEPARTAMENTOS
  {
    slug: '/tasaciones/departamentos/',
    waContext: 'Tasación de Departamentos',
    kind: 'vertical',
    eyebrow: 'Tasación de departamentos · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasacion-de-departamentos-asuncion', alt: 'Edificio de departamentos residencial en un barrio de Asunción' },
    title: 'Tasación de departamentos en Asunción | Tasación.com.py',
    description: 'Valuación precisa por zona, edificio y unidad. Analizamos m², amenities y ubicación en altura para darte el valor real de mercado.',
    h1: 'Tasación de departamentos en Asunción, edificio por edificio',
    subcopy: 'Valuación precisa por zona, edificio y unidad. Analizamos m², amenities y ubicación en altura para darte el valor real de mercado.',
    sections: [
      {
        type: 'lead',
        heading: 'El valor de un departamento es multifactorial',
        body: 'A diferencia de una casa, un departamento depende críticamente del edificio donde se encuentra. La calidad de los amenities, el costo de las expensas, la antigüedad de la torre y la reputación de la constructora son factores que nuestros peritos evalúan minuciosamente.\n\nEn Asunción, el mercado de departamentos ha crecido exponencialmente. Contamos con una base de datos actualizada de cierres reales en las principales torres de Villa Morra, Santa Teresa y el Eje Corporativo.',
      },
      {
        type: 'grid3',
        heading: 'Qué analizamos en un departamento',
        items: [
          { title: 'Zona y Entorno', body: 'Cercanía a servicios, colegios y polos corporativos.' },
          { title: 'Edificio y Amenities', body: 'Calidad de áreas comunes, seguridad y servicios del edificio.' },
          { title: 'Piso y Orientación', body: 'Factor clave para la iluminación, vista y confort térmico.' },
          { title: 'Superficie Propia y Común', body: 'Desglose exacto de m² propios, balcones y bauleras.' },
          { title: 'Costo de Expensas', body: 'Relación costo-beneficio de los servicios del consorcio.' },
          { title: 'Cierres en el mismo Edificio', body: 'Datos reales de ventas recientes en la misma torre.' },
        ],
      },
      priceBlockFinalidades('Qué incluye el informe de tasación de tu departamento'),
      valueBlockShort(),
      freeAsideVender(),
      {
        type: 'faq',
        items: [
          ...verticalFaqCore('un departamento'),
          { q: '¿El piso y la orientación cambian el valor?', a: 'Sí, son parte de los factores que evaluamos junto con vista, luz natural y confort térmico.' },
          { q: '¿Tasan en propiedad horizontal y pozo?', a: 'Sí, tasamos unidades terminadas en propiedad horizontal y también preventas en pozo. Contanos tu caso por WhatsApp.' },
        ],
      },
      otrasTasaciones(null, [
        { title: 'Casas', href: '/tasaciones/casas/' },
        { title: 'Locales Comerciales', href: '/tasaciones/locales-comerciales/' },
      ]),
      ctaBand('Informe oficial de tasación de tu departamento', 'Documento firmado por el Tasador Fernando Capurro, con validez legal y bancaria.'),
    ],
  },

  // ------------------------------------------------------------- TERRENOS
  {
    slug: '/tasaciones/terrenos/',
    waContext: 'Tasación de Terrenos',
    kind: 'vertical',
    eyebrow: 'Tasación de terrenos · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasacion-terrenos-paraguay', alt: 'Terreno en Paraguay listo para tasar' },
    title: 'Tasación de terrenos en Paraguay | Tasación.com.py',
    description: 'Tasación técnica basada en ubicación, zonificación y capacidad constructiva. No dejes que tu tierra se venda por debajo de su potencial.',
    h1: 'Tasación de terrenos: lotes, fracciones y potencial real de desarrollo',
    subcopy: 'Tasación técnica basada en ubicación, zonificación y capacidad constructiva. No dejes que tu tierra se venda por debajo de su potencial.',
    sections: [
      {
        type: 'lead',
        heading: 'Un terreno mal valuado es una oportunidad perdida',
        body: 'El valor de la tierra no es estático. Depende de lo que se pueda construir encima. Un lote en una esquina comercial tiene un valor radicalmente distinto a uno en una calle interna, incluso en la misma manzana.\n\nNuestros peritos analizan el Plan Regulador de Asunción y las ordenanzas de Gran Asunción para determinar indicadores como el F.O.S., F.O.T. y alturas permitidas, dándote una visión clara del valor para desarrolladores.',
      },
      {
        type: 'grid3',
        heading: 'Qué analizamos en un terreno',
        items: [
          { title: 'Ubicación y Acceso', body: 'Calidad de calles, frentes y visibilidad.' },
          { title: 'Superficie y Forma', body: 'Dimensiones reales y aprovechamiento del lote.' },
          { title: 'Zonificación y Uso', body: 'Qué permite construir la municipalidad en ese lugar.' },
          { title: 'Servicios Disponibles', body: 'Agua, energía, cloacas y conectividad.' },
          { title: 'Topografía', body: 'Nivelación, necesidad de rellenos o excavaciones.' },
          { title: 'Potencial de Desarrollo', body: 'Análisis de capacidad constructiva máxima.' },
        ],
      },
      priceBlockFinalidades('Qué incluye el informe de tasación de tu terreno'),
      valueBlockShort(),
      freeAsideVender(),
      {
        type: 'faq',
        items: [
          ...verticalFaqCore('un terreno'),
          { q: '¿Tasan fracciones grandes y loteamientos?', a: 'Sí, tasamos desde lotes individuales hasta fracciones grandes con potencial de loteamiento.' },
          { q: '¿Consideran el potencial de desarrollo?', a: 'Sí, es parte central del análisis: zonificación, F.O.S., F.O.T. y alturas permitidas.' },
        ],
      },
      otrasTasaciones(null, [
        { title: 'Casas', href: '/tasaciones/casas/' },
        { title: 'Corporativa', href: '/tasaciones/corporativa/' },
        { title: 'Franja de Dominio', href: '/tasaciones/franja-de-dominio/' },
      ]),
      ctaBand('Informe oficial de tasación de tu terreno', 'Documento técnico firmado por el Tasador Fernando Capurro, con validez legal y bancaria.'),
    ],
  },

  // ----------------------------------------------------------- CORPORATIVA
  {
    slug: '/tasaciones/corporativa/',
    waContext: 'Tasación Corporativa',
    kind: 'vertical',
    eyebrow: 'Tasación corporativa · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Solicitar informe corporativo', waOption: 'consulta' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    waConsultaText: 'Hola, vengo de la página de Tasación Corporativa y necesito una tasación para mi empresa. El activo es: ______',
    heroImage: { base: 'tasacion-corporativa-oficinas-asuncion', alt: 'Edificio de oficinas corporativo en Asunción listo para tasar' },
    title: 'Tasación corporativa en Paraguay | Tasación.com.py',
    description: 'Soluciones de valuación para activos corporativos, industriales y logísticos. Precisión técnica para decisiones empresariales, garantías y estados contables.',
    h1: 'Tasación corporativa: informes oficiales para tu empresa',
    subcopy: 'Soluciones de valuación para activos corporativos, industriales y logísticos. Precisión técnica para decisiones empresariales, garantías y estados contables.',
    heroCta: 'Contactar Especialista B2B',
    sections: [
      {
        type: 'grid2',
        heading: 'Valuación estratégica de activos',
        items: [
          { title: 'Estados Contables', body: 'Revaluación técnica de activos fijos para balances.' },
          { title: 'Garantías', body: 'Informes certificados para líneas de crédito corporativas.' },
          { title: 'Seguros', body: 'Determinación de valores de reposición para pólizas.' },
          { title: 'Compra-Venta', body: 'Asesoramiento en adquisiciones y desinversiones.' },
          { title: 'Franja de Dominio', body: 'Relevamiento y avaluación edilicia para proyectos viales.', href: '/tasaciones/franja-de-dominio/', label: 'Ver franja de dominio' },
        ],
      },
      {
        type: 'grid2',
        heading: 'Qué tasamos en el sector corporativo',
        items: [
          { title: 'Oficinas y Edificios', body: 'Plantas libres, edificios corporativos y locales administrativos en ejes comerciales.' },
          { title: 'Logística y Depósitos', body: 'Centros de distribución, depósitos industriales y parques logísticos.' },
          { title: 'Industria', body: 'Plantas de producción, fábricas y complejos agroindustriales.' },
          { title: 'Retail', body: 'Centros comerciales, galerías y grandes superficies de venta.' },
        ],
      },
      priceBlockFinalidades('Qué incluye el informe corporativo'),
      valueBlockShort(),
      freeAsideVender(),
      porQueElegirnos,
      {
        type: 'faq',
        items: [
          ...verticalFaqCore('un activo corporativo'),
          { q: '¿Emiten informes para estados contables y auditoría?', a: 'Sí, emitimos informes técnicos aptos para revaluación de activos fijos en balances.' },
          { q: '¿Tasan plantas industriales completas?', a: 'Sí, tasamos plantas de producción, depósitos y complejos agroindustriales completos.' },
        ],
      },
      otrasTasaciones('Servicios relacionados', [
        { title: 'Locales Comerciales', href: '/tasaciones/locales-comerciales/' },
        { title: 'Informes Periciales', href: '/informes-periciales/' },
        { title: 'Franja de Dominio', href: '/tasaciones/franja-de-dominio/' },
      ]),
      ctaBand('Informe oficial para tu empresa', 'Documentación técnica firmada por el Tasador Fernando Capurro, apta para balances, garantías y auditoría.', {
        primary: { label: 'Solicitar informe corporativo', waOption: 'consulta' },
        secondaryLink: { label: 'o pedir un informe para compra o venta', waOption: 'informe' },
      }),
    ],
  },

  // ------------------------------------------------------------ HIPOTECARIA
  {
    slug: '/tasaciones/hipotecaria/',
    waContext: 'Tasación Hipotecaria',
    kind: 'vertical',
    eyebrow: 'Tasación para crédito · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi tasación para crédito', waOption: 'credito' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: null },
    heroImage: { base: 'tasacion-hipotecaria-documentacion-paraguay', alt: 'Documentación de tasación hipotecaria sobre un escritorio junto a llaves de una vivienda' },
    title: 'Tasación hipotecaria en Paraguay | Tasación.com.py',
    description: `Tasación para crédito hipotecario o fiduciario. Para crédito, ${CRED_BCP_FIRMA}. Visita y relevamiento a cargo del Tasador Fernando Capurro, ${CRED_CSJ}.`,
    h1: 'Tasación para crédito hipotecario o fiduciario',
    subcopy: `Tu banco o cooperativa te pide una tasación para aprobar la carpeta. Para crédito, ${CRED_BCP_FIRMA}; la visita y el relevamiento los hace el Tasador Fernando Capurro, ${CRED_CSJ}. ${CRED_BCP_BANCOS}`,
    sections: [
      {
        type: 'lead',
        heading: 'Por qué el banco te pide una tasación',
        body: 'El banco necesita asegurarse de que el inmueble que queda como garantía tiene un valor real suficiente para cubrir el préstamo. Un informe pericial independiente es la garantía de transparencia para ambas partes.\n\nTambién sirve para remates bancarios por ejecución de hipoteca.',
      },
      {
        type: 'grid3',
        heading: 'Qué revisa el banco en el informe',
        items: [
          { title: 'Documentación Técnica', body: 'Copia de título, planos y cuenta corriente catastral.' },
          { title: 'Análisis de Mercado', body: 'Comparación con propiedades similares en la zona.' },
          { title: 'Registro Fotográfico', body: 'Fotos detalladas de interiores, exteriores y entorno.' },
          { title: 'Firma para crédito', body: `${CRED_BCP_FIRMA}.` },
          { title: 'Valor de Liquidación', body: 'Estimación del valor ante una venta rápida.' },
          { title: 'Plazo', body: `Informe firmado en ${PLAZO_TXT}.` },
        ],
      },
      {
        type: 'priceBlock',
        id: 'incluye',
        heading: 'Qué incluye el informe hipotecario',
        eyebrow: 'Tasación para crédito',
        ctaLabel: 'Pedir mi tasación para crédito',
        waOption: 'credito',
        figure: PRECIO_CREDITO_TXT,
        note: 'incluye la firma del tasador inscripto en el BCP; te confirmamos el monto exacto por WhatsApp antes de la visita',
        includes: INCLUYE_INFORME,
        rows: [
          ['Crédito bancario', `${PRECIO_CREDITO_TXT} ${IVA_TXT}`],
          ['Compra o venta', `${PRECIO_TXT} ${IVA_TXT}`],
          ['Sucesiones y juicios', `${PRECIO_JUDICIAL_TXT} ${IVA_TXT}`],
        ],
        pie: FACTURA_TXT,
      },
      valueBlockShort(),
      {
        type: 'faq',
        items: [
          { q: '¿Sirve para cualquier banco?', a: `Para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS} Decinos por WhatsApp en qué banco o cooperativa estás gestionando.` },
          { q: '¿Cuánto tarda?', a: `El informe firmado está listo en ${PLAZO_TXT}.` },
          { q: '¿Por qué cuesta más que el informe para compra o venta?', a: 'Porque lleva la firma de un tasador inscripto en el registro del BCP, que es lo que tu banco exige.' },
        ],
      },
      otrasTasaciones('Servicios relacionados', [
        { title: 'Casas', href: '/tasaciones/casas/' },
        { title: 'Informes Periciales', href: '/informes-periciales/' },
      ]),
      ctaBand('Informe oficial para tu carpeta bancaria', 'Documento firmado por un tasador inscripto en el registro del BCP, listo para presentar al banco.', {
        primary: { label: 'Pedir mi tasación para crédito', waOption: 'credito' },
        secondaryLink: { label: 'o pedir un informe para compra o venta', waOption: 'informe' },
      }),
    ],
  },

  // ------------------------------------------------------ LOCALES COMERCIALES
  {
    slug: '/tasaciones/locales-comerciales/',
    waContext: 'Tasación de Locales Comerciales',
    kind: 'vertical',
    eyebrow: 'Tasación de locales comerciales · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasacion-locales-comerciales-asuncion', alt: 'Local comercial en Asunción' },
    title: 'Tasación de locales comerciales | Tasación.com.py',
    description: 'Análisis técnico para locales a pie de calle, en galerías o shoppings. Evaluamos el flujo, la visibilidad y el potencial de renta.',
    h1: 'Tasación de locales comerciales: valor por rentabilidad y ubicación',
    subcopy: 'Análisis técnico para locales a pie de calle, en galerías o shoppings. Evaluamos el flujo, la visibilidad y el potencial de renta.',
    sections: [
      {
        type: 'lead',
        heading: 'Un local comercial se valúa distinto a una vivienda',
        body: 'En el sector comercial, el valor está intrínsecamente ligado a la capacidad de generar ingresos. Un local con buena visibilidad en una avenida de alto tránsito tiene una plusvalía que va más allá de sus m² construidos.',
      },
      {
        type: 'grid3',
        heading: 'Qué analizamos en un local',
        items: [
          { title: 'Ubicación y Tránsito', body: 'Flujo vehicular y peatonal, visibilidad de fachada.' },
          { title: 'Rentabilidad de Mercado', body: 'Estimación de renta mensual según rubro y zona.' },
          { title: 'Superficie y Layout', body: 'Distribución interna, depósitos y áreas de carga.' },
          { title: 'Zonificación Comercial', body: 'Permisos municipales para diferentes rubros.' },
          { title: 'Estado de Conservación', body: 'Instalaciones eléctricas, aire y mantenimiento.' },
          { title: 'Comparables de Renta', body: 'Valores de alquiler reales en el mismo corredor.' },
        ],
      },
      priceBlockFinalidades('Qué incluye el informe de tasación de tu local'),
      valueBlockShort(),
      freeAsideVender(),
      {
        type: 'faq',
        items: [
          ...verticalFaqCore('un local comercial'),
          { q: '¿Valúan por rentabilidad o por m²?', a: 'Usamos ambos criterios: rentabilidad estimada y comparables de m² del mismo corredor comercial.' },
          { q: '¿Tasan locales en shopping?', a: 'Sí, tasamos locales a pie de calle, en galerías y en shoppings.' },
        ],
      },
      otrasTasaciones(null, [
        { title: 'Corporativa', href: '/tasaciones/corporativa/' },
        { title: 'Departamentos', href: '/tasaciones/departamentos/' },
      ]),
      ctaBand('Informe oficial de tasación de tu local', 'Documento firmado por el Tasador Fernando Capurro, con validez legal y bancaria.'),
    ],
  },

  // ------------------------------------------------------------------ CAMPOS
  {
    slug: '/tasaciones/campos/',
    waContext: 'Tasación de Campos y Estancias',
    kind: 'vertical',
    eyebrow: 'Tasación de campos y estancias · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasador-de-terrenos-gran-asuncion', alt: 'Tasador recorriendo un campo en el Gran Asunción' },
    title: 'Tasación de campos y estancias en Paraguay | Tasación.com.py',
    description: 'Valuación técnica de activos rurales, establecimientos ganaderos y tierras agrícolas con criterio profesional y conocimiento del terreno.',
    h1: 'Tasación de Campos y Estancias en Paraguay',
    subcopy: 'Valuación técnica de activos rurales, establecimientos ganaderos y tierras agrícolas con criterio profesional y conocimiento del terreno.',
    sections: [
      {
        type: 'lead',
        heading: 'Análisis profundo del valor rural',
        body: 'Tasar un campo no es solo mirar el precio por hectárea. En Paraguay, la diferencia de valor está en los detalles técnicos: la calidad del suelo, el régimen de lluvias, la infraestructura instalada y el potencial de desarrollo productivo.',
      },
      {
        type: 'grid2',
        heading: 'Qué evaluamos',
        items: [
          { title: 'Aptitud Productiva', body: 'Evaluamos si el suelo es apto para agricultura intensiva, ganadería de cría o invernada, o proyectos forestales.' },
          { title: 'Infraestructura', body: 'Analizamos alambrados, corrales, tajamares, pasturas implantadas y viviendas para el personal.' },
          { title: 'Ubicación y Logística', body: 'La cercanía a rutas, centros de acopio y puertos es clave en la determinación del valor final.' },
          { title: 'Situación Legal', body: 'Verificamos títulos, planos y cumplimiento de normativas ambientales (reservas forestales).' },
        ],
      },
      priceBlockFinalidades('Qué incluye el informe de tasación de tu campo'),
      valueBlockShort(),
      freeAsideVender(),
      porQueElegirnos,
      {
        type: 'faq',
        items: [
          ...verticalFaqCore('un campo'),
          { q: '¿Tasan en todo el territorio nacional?', a: 'Sí, cubrimos campos y estancias en todo el territorio paraguayo.' },
          { q: '¿Qué tipo de análisis técnico realizan?', a: 'Aptitud del suelo, infraestructura instalada, logística y situación legal del inmueble.' },
          { q: '¿El informe sirve para garantías bancarias?', a: 'Sí, el informe pericial puede usarse como respaldo para garantías reales.' },
        ],
      },
      otrasTasaciones('Otras Tasaciones', [
        { title: 'Tasación de Terrenos', body: 'Tasación técnica de lotes y fracciones urbanas', href: '/tasaciones/terrenos/' },
        { title: 'Tasación Corporativa', body: 'Informes para oficinas y plantas industriales', href: '/tasaciones/corporativa/' },
      ]),
      ctaBand('Informe oficial de tasación de tu campo', 'Documento técnico firmado por el Tasador Fernando Capurro, con validez legal y bancaria.'),
    ],
  },

  // ------------------------------------------------------- FRANJA DE DOMINIO
  // v3 T9 (§5.14): ruta nueva. Copy provisional en PR-1 (solo H1/lede/CTA);
  // completa en PR-2. kind 'vertical-b2b': sin panel de precio, sin freeAside.
  {
    slug: '/tasaciones/franja-de-dominio/',
    waContext: 'Franja de Dominio',
    kind: 'vertical-b2b',
    eyebrow: 'Para empresas, consorcios y constructoras',
    showPriceChip: false,
    waConsultaText: 'Hola, vengo de la página de Franja de Dominio y necesito relevamiento y avaluación edilicia para un proyecto vial. Cantidad aproximada de lotes: ______',
    hero: { primary: { label: 'Pedir presupuesto por proyecto', waOption: 'consulta' }, secondary: null, freeLink: null },
    heroImage: { base: 'tasacion-terrenos-paraguay', alt: 'Terreno en Paraguay listo para tasar' },
    title: 'Franja de dominio: relevamiento edilicio | Tasación.com.py',
    description: 'Relevamiento y avaluación edilicia en franja de dominio para proyectos viales: mediciones, cómputo y valor de mercado por lote.',
    h1: 'Relevamiento y avaluación edilicia en franja de dominio de proyectos viales',
    subcopy: `La franja de dominio es la faja que ocupa la ruta y que hay que liberar antes de construirla; suele afectar muchos lotes a la vez. Relevamos y medimos todas las edificaciones y terrenos dentro de la franja, los computamos y les asignamos valor de mercado, y entregamos el informe que el consorcio adjudicatario presenta para que el Estado indemnice a las familias afectadas. Firmado por el Tasador Fernando Capurro, ${CRED_CSJ} y ${CRED_ARQ}.`,
    sections: [
      {
        type: 'grid3',
        heading: 'Qué incluye',
        items: [
          { title: 'Relevamiento', body: 'Medición de cada edificación y terreno dentro de la franja.' },
          { title: 'Cómputo', body: 'Cómputo técnico de todo lo relevado.' },
          { title: 'Valor de mercado', body: 'Valor de mercado asignado por lote.' },
          { title: 'Registro fotográfico', body: 'Documentación fotográfica de cada lote relevado.' },
          { title: 'Informe técnico', body: 'Informe técnico firmado, listo para presentar al consorcio adjudicatario.' },
          { title: 'Base para indemnización', body: 'Base para la indemnización del Estado a las familias afectadas.' },
        ],
      },
      {
        type: 'lead',
        heading: 'Cómo se cotiza',
        body: `${FRANJA_COTIZA} ${FACTURA_TXT}.`,
      },
      {
        type: 'credentials',
        heading: 'Quién firma',
        tasador: [CRED_CSJ, CRED_ARQ],
        credito: `Para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}`,
        plazo: PLAZO_TXT,
      },
      {
        type: 'faq',
        items: [
          { q: '¿Quién contrata este servicio?', a: 'Empresas, consorcios viales y constructoras a cargo de un proyecto que afecta una franja de dominio.' },
          { q: '¿Firman como perito?', a: `Sí, firmado por el Tasador Fernando Capurro, ${CRED_CSJ} y ${CRED_ARQ}.` },
          { q: '¿Cuánto tarda?', a: 'Depende de la cantidad de lotes; lo definimos en el presupuesto por proyecto.' },
        ],
      },
      otrasTasaciones('Otras tasaciones', [
        { title: 'Corporativa', href: '/tasaciones/corporativa/' },
        { title: 'Terrenos', href: '/tasaciones/terrenos/' },
      ]),
      ctaBand('Pedí tu presupuesto para franja de dominio', 'Relevamiento y avaluación edilicia firmados por el Tasador Fernando Capurro.', {
        primary: { label: 'Pedir presupuesto por proyecto', waOption: 'consulta' },
        secondaryLink: { label: 'o pedir un informe para compra o venta', waOption: 'informe' },
      }),
    ],
  },

  // ----------------------------------------------------- VALUACION PARA VENDER
  {
    slug: '/valuacion-para-vender/',
    waContext: 'Tasación para Vender',
    kind: 'secondary-free',
    eyebrow: 'Tasación para vender · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Quiero mi tasación para vender', waOption: 'valoracion' }, secondary: null, freeLink: { label: '¿Necesitás validez legal o bancaria? Pedí el informe oficial →', href: '/informes-periciales/' } },
    heroImage: { base: 'propiedad-lista-para-la-venta-asuncion', alt: 'Fachada de una casa en Asunción preparada para la venta' },
    title: 'Tasación para vender tu propiedad | Tasación.com.py',
    description: `Hacemos la tasación de tu propiedad para definir el precio de venta (${PRECIO_TXT} ${IVA_TXT}). Si firmás exclusividad con uno de nuestros corredores asociados, ese costo se descuenta de la comisión al cerrar la venta.`,
    h1: 'Tasación para vender tu propiedad, con el costo cubierto por tu corredor',
    subcopy: 'No adivines el precio. Hacemos un análisis profesional de mercado y, si vendés con uno de nuestros corredores asociados, ese costo se descuenta de su comisión al cerrar la venta.',
    heroCta: 'Quiero mi tasación para vender',
    sections: [
      {
        type: 'lead',
        heading: 'El costo se cubre si vendés con nosotros',
        body: `La tasación para vender tiene el mismo costo que el informe oficial (${PRECIO_TXT} ${IVA_TXT}). Si después de recibirla firmás un contrato de exclusividad con uno de nuestros corredores inmobiliarios asociados, ese costo se descuenta de su comisión al momento de cerrar la venta — no pagás dos veces. Si preferís vender por tu cuenta o con otro corredor, la tasación queda igual pagada, sin descuento. ${FACTURA_TXT}.`,
      },
      {
        type: 'grid2',
        heading: 'Mucho más que un precio: Vendemos tu propiedad',
        body: 'Una vez que conocemos el valor, activamos nuestra maquinaria de marketing para encontrar al comprador ideal en tiempo récord.',
        items: [
          { title: 'Marketing Digital y Redes', body: 'Creamos campañas segmentadas en Facebook, Instagram y Google para que tu propiedad llegue a compradores reales, no solo curiosos.' },
          { title: 'Producción de Video y Contenido', body: 'Grabamos recorridos cinematográficos y fotos de alta calidad que resaltan los mejores ángulos de tu inmueble.' },
          { title: 'Búsqueda de Inversores Extranjeros', body: 'Conectamos tu propiedad con nuestra red de inversores regionales e internacionales buscando oportunidades en Paraguay.' },
          { title: 'Presentación Profesional', body: 'Damos un "upgrade" a la presentación de tu propiedad (Home Staging) para aumentar su valor percibido inmediatamente.' },
        ],
      },
      {
        type: 'lead',
        heading: '¿Buscás inversores extranjeros?',
        body: 'Paraguay es el foco de la región. Tenemos acceso directo a inversores de Argentina, Uruguay y Brasil que buscan refugio de valor en nuestro mercado.',
        cta: { label: 'Consultar Plan de Venta', wa: true },
      },
      {
        type: 'compare',
        heading: 'Diferencia entre Tasación para Vender y Peritaje',
        colA: 'Tasación para Vender',
        colB: 'Informe Pericial Oficial',
        rows: [
          [`${PRECIO_TXT} ${IVA_TXT} (se descuenta de la comisión si vendés con un corredor asociado)`, `${PRECIO_TXT} ${IVA_TXT}`],
          ['Enfoque comercial de mercado', 'Validez legal y bancaria'],
          ['Incluye plan de marketing', `Firmado por ${CRED_CSJ}`],
        ],
      },
      {
        type: 'faq',
        items: [
          { q: '¿Cuánto cuesta la tasación para vender?', a: `Tiene el mismo costo que el informe oficial (${PRECIO_TXT} ${IVA_TXT}); confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
          { q: '¿Cómo se cubre ese costo?', a: 'Si después de la tasación firmás un contrato de exclusividad con uno de nuestros corredores inmobiliarios asociados, el costo se descuenta de su comisión al cerrar la venta.' },
          { q: '¿Estoy obligado a vender con ustedes?', a: 'No. Podés usar la tasación de forma independiente; el descuento del costo solo aplica si firmás exclusividad con uno de nuestros corredores asociados.' },
          { q: '¿Cuánto tarda?', a: `El informe firmado está listo en ${PLAZO_TXT}.` },
        ],
      },
      ctaBand('¿Necesitás validez legal o bancaria?', 'Pedí el informe oficial de tasación, firmado por el Tasador Fernando Capurro.'),
    ],
  },

  // ------------------------------------------------------ INFORMES PERICIALES
  {
    slug: '/informes-periciales/',
    waContext: 'Informes Periciales',
    kind: 'primary-report',
    eyebrow: 'Tasador Fernando Capurro · Informes periciales',
    showPriceChip: true,
    priceChip: { strong: `Informe oficial: desde ${fmtGs(PRECIOS.compraventa.min)} ${IVA_TXT}`, note: 'según finalidad; te confirmamos el monto antes de la visita' },
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'informe-de-tasacion-linderos-paraguay', alt: 'Documentación técnica de un informe pericial en Paraguay' },
    title: 'Informes periciales con validez legal | Tasación.com.py',
    description: 'Informe oficial de tasación por finalidad: compra o venta, crédito bancario, sucesiones y juicios. Firmado por perito matriculado.',
    h1: 'Informes periciales con validez jurídica y bancaria',
    subcopy: 'Documentación técnica firmada por el Tasador Fernando Capurro, para procesos legales, bancarios y notariales en todo el Paraguay.',
    sections: [
      {
        type: 'useCases',
        heading: 'Casos donde necesitás un informe oficial',
        items: [
          { icon: 'compraventa', eyebrow: 'Lo más pedido', title: FINALIDADES[0].label, body: FINALIDADES[0].corto, href: '#compraventa', label: 'Ver este caso' },
          { icon: 'credito', eyebrow: 'Hipotecario o fiduciario', title: FINALIDADES[1].label, body: FINALIDADES[1].corto, href: '#credito', label: 'Ver este caso' },
          { icon: 'judicial', eyebrow: 'Informe pericial', title: FINALIDADES[2].label, body: FINALIDADES[2].corto, href: '#judicial', label: 'Ver este caso' },
          { icon: 'vender', eyebrow: 'Con corredor asociado', title: FINALIDADES[3].label, body: FINALIDADES[3].corto, href: '/valuacion-para-vender/', label: 'Ver cómo funciona' },
        ],
      },
      {
        type: 'lead', id: 'judicial',
        heading: 'Tasación pericial para sucesiones y juicios',
        body: `Herencias, remates judiciales y liquidaciones: lo piden abogados y jueces, y sirve de base para el cálculo de honorarios. Firmada por el Tasador Fernando Capurro, ${CRED_CSJ}.\n\nTodo lo judicial, sucesiones incluidas: ${PRECIO_JUDICIAL_TXT} ${IVA_TXT}. Es un informe más detallado, y suele ser la base sobre la que abogados y jueces calculan sus honorarios.`,
      },
      {
        type: 'lead', id: 'credito',
        heading: 'Tasación para crédito',
        body: `Para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}\n\n${PRECIO_CREDITO_TXT} ${IVA_TXT}. Ver la página completa de tasación hipotecaria.`,
        cta: { label: 'Ver tasación para crédito', href: '/tasaciones/hipotecaria/' },
      },
      {
        type: 'pricingTiers', id: 'compraventa',
        heading: 'Tres informes, un precio claro para cada uno',
        lede: 'El costo depende de para qué lo necesitás, no del tamaño de tu casa. Elegí tu caso y hablamos por WhatsApp.',
        tiers: [
          {
            highlight: true,
            eyebrow: 'Lo más pedido',
            title: 'Compra o venta',
            corto: FINALIDADES[0].corto,
            price: PRECIO_TXT,
            nota: 'según tipo y tamaño del inmueble',
            firma: CRED_CSJ_CORTA,
            plazo: PLAZO_TXT,
            incluye: ['Visita técnica al inmueble', 'Comparables reales de mercado, no promedios', 'Registro fotográfico', 'Informe firmado, con la metodología explicada'],
            cta: 'Pedir informe para comprar o vender',
            waOption: 'informe',
          },
          {
            eyebrow: 'Hipotecario o fiduciario',
            title: 'Crédito bancario',
            corto: FINALIDADES[1].corto,
            price: PRECIO_CREDITO_TXT,
            nota: 'incluye la firma que tu banco o cooperativa exige',
            firma: 'Tasador inscripto en el registro del BCP',
            plazo: PLAZO_TXT,
            incluye: ['Visita técnica al inmueble', 'Comparables reales de mercado, no promedios', 'Registro fotográfico', 'Formato para carpeta bancaria'],
            cta: 'Pedir tasación para crédito',
            waOption: 'credito',
          },
          {
            eyebrow: 'Informe pericial',
            title: 'Sucesiones y juicios',
            corto: FINALIDADES[2].corto,
            price: PRECIO_JUDICIAL_TXT,
            nota: 'informe más detallado, para presentar en el juzgado',
            firma: CRED_CSJ_CORTA,
            plazo: PLAZO_TXT,
            incluye: ['Visita técnica al inmueble', 'Comparables reales de mercado, no promedios', 'Registro fotográfico', 'Informe detallado, para presentar en el juzgado'],
            cta: 'Pedir tasación pericial',
            waOption: 'judicial',
          },
        ],
        pie: [FACTURA_TXT, PRECIO_NOTA.charAt(0).toUpperCase() + PRECIO_NOTA.slice(1), 'Si vendés con un corredor asociado, el costo se descuenta de la comisión al cerrar la venta.'],
      },
      valueBlockFull(),
      {
        type: 'credentials',
        heading: 'Quién firma tu informe',
        tasador: [CRED_CSJ, CRED_ARQ],
        credito: `Para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}`,
        plazo: PLAZO_TXT,
      },
      {
        type: 'faq',
        items: [
          { q: '¿Tiene validez en el juzgado?', a: 'Sí, es un documento técnico-legal con validez probatoria ante terceros.' },
          { q: '¿Sirve para sucesión?', a: 'Sí, lo usamos para partición de herencias y determinación de valores fiscales.' },
          { q: '¿Quién firma?', a: `El Tasador Fernando Capurro, ${CRED_CSJ} y ${CRED_ARQ}. Para crédito, ${CRED_BCP_FIRMA}.` },
          { q: '¿Cuánto tarda?', a: `El informe firmado está listo en ${PLAZO_TXT}.` },
        ],
      },
      otrasTasaciones('Informes por tipo de inmueble', SERVICIOS.map((s) => ({ title: s.title, href: s.href }))),
      ctaBand('Pedí tu informe oficial de tasación', 'Firmado por el Tasador Fernando Capurro, con validez para bancos, juzgados y escribanías.'),
    ],
  },

  // ------------------------------------------------------------------ NOSOTROS
  {
    slug: '/nosotros/',
    waContext: 'Nosotros',
    kind: 'info',
    eyebrow: 'Tasador Fernando Capurro',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: null, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'oficina-de-tasaciones-asuncion', alt: 'Escritorio de trabajo con planos y documentación de tasación en una oficina de Asunción' },
    title: 'Tasador Fernando Capurro, Perito Tasador | Tasación.com.py',
    description: 'El Tasador Fernando Capurro y el equipo de Tasación.com.py combinan experiencia técnica con datos reales del mercado inmobiliario paraguayo.',
    h1: 'Tasador Fernando Capurro y el equipo de Tasación.com.py',
    subcopy: 'Combinamos la experiencia técnica del tasador responsable con datos reales del mercado inmobiliario paraguayo para darte una valuación en la que podés confiar.',
    sections: [
      {
        type: 'lead',
        heading: 'Quién firma tus informes',
        body: `El Tasador Fernando Capurro, ${CRED_CSJ} y ${CRED_ARQ}, visita el inmueble y firma cada informe oficial. Para tasaciones de crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}`,
      },
      {
        type: 'credentials',
        heading: 'Credenciales',
        tasador: [CRED_CSJ, CRED_ARQ],
        credito: `Para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}`,
        plazo: PLAZO_TXT,
      },
      {
        type: 'lead',
        heading: 'Quiénes somos',
        body: 'Somos un equipo multidisciplinario de peritos tasadores y agentes inmobiliarios con trayectoria en Asunción y Gran Asunción. Entendemos que una tasación no es solo un número, es la base para una decisión de vida o un proceso legal crítico.\n\nNuestra misión es profesionalizar la valuación inmobiliaria en Paraguay, eliminando las suposiciones y basándonos en criterios técnicos sólidos y comparables reales de mercado.',
      },
      {
        type: 'grid3',
        heading: 'Nuestros pilares',
        items: [
          { title: 'Precisión Técnica', body: 'Usamos metodologías estandarizadas y análisis de plusvalía real.' },
          { title: 'Transparencia', body: 'Explicamos el porqué de cada valor basándonos en datos comprobables.' },
          { title: 'Rapidez', body: `Informe firmado en ${PLAZO_TXT}.` },
        ],
      },
      ctaBand('Pedí tu informe oficial de tasación', 'Firmado por el Tasador Fernando Capurro.'),
    ],
  },

  // ------------------------------------------------------------------ FAQ
  {
    slug: '/preguntas-frecuentes/',
    waContext: 'Preguntas Frecuentes',
    kind: 'info',
    eyebrow: 'Preguntas frecuentes',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: null, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    title: 'Preguntas frecuentes sobre tasación | Tasación.com.py',
    description: 'Resolvé tus dudas sobre costos, validez legal y procesos de valuación en Paraguay.',
    h1: 'Preguntas frecuentes sobre tasación de inmuebles',
    subcopy: 'Resolvé tus dudas sobre costos, validez legal y procesos de valuación en Paraguay.',
    sections: [
      {
        type: 'faqGroups',
        groups: [
          {
            title: 'Informe Oficial',
            items: [
              { q: '¿Cuánto cuesta según la finalidad?', a: `Compra o venta: ${PRECIO_TXT} ${IVA_TXT}. Sucesiones y juicios: ${PRECIO_JUDICIAL_TXT} ${IVA_TXT}. Crédito bancario: ${PRECIO_CREDITO_TXT} ${IVA_TXT}. ${PRECIO_NOTA.charAt(0).toUpperCase() + PRECIO_NOTA.slice(1)}. ${FACTURA_TXT}.` },
              { q: '¿Cuánto tarda?', a: `El informe firmado está listo en ${PLAZO_TXT}.` },
              { q: '¿Quién firma el informe?', a: `El Tasador Fernando Capurro, ${CRED_CSJ} y ${CRED_ARQ}. Para crédito, ${CRED_BCP_FIRMA}.` },
              { q: '¿La visita tiene costo?', a: 'La visita está incluida en el precio del informe, para cualquier finalidad.' },
            ],
          },
          {
            title: 'Crédito Bancario',
            items: [
              { q: '¿Sirve para mi banco o cooperativa?', a: `Sí: para crédito, ${CRED_BCP_FIRMA}. ${CRED_BCP_BANCOS}` },
              { q: '¿Sirve para hipotecario y fiduciario?', a: 'Sí, cubrimos ambos: el informe se ajusta al formato que tu entidad exige.' },
              { q: '¿Sirve para un remate bancario?', a: 'Sí, también hacemos tasaciones para remates bancarios por ejecución de hipoteca.' },
            ],
          },
          {
            title: 'Sucesiones y Juicios',
            items: [
              { q: '¿Sirve para una sucesión?', a: `Sí, para herencias y particiones: el informe lo firma ${CRED_CSJ}.` },
              { q: '¿Sirve para un remate judicial?', a: 'Sí, también hacemos tasaciones periciales para remates judiciales y liquidaciones.' },
              { q: '¿Por qué cuesta más que el informe para compra o venta?', a: 'Porque requiere un informe más detallado y suele ser la base de honorarios de abogados y jueces.' },
            ],
          },
          {
            title: 'Para Vender',
            items: [
              { q: '¿Cuánto cuesta la tasación para vender?', a: `Tiene el mismo costo que el informe oficial (${PRECIO_TXT} ${IVA_TXT}). Si firmás un contrato de exclusividad con uno de nuestros corredores asociados, ese costo se descuenta de la comisión al cerrar la venta.` },
              { q: '¿Estoy obligado a vender con ustedes?', a: 'No. Podés usar la tasación de forma independiente; el descuento del costo solo aplica si firmás exclusividad con uno de nuestros corredores asociados.' },
            ],
          },
          {
            title: 'General',
            items: [
              { q: '¿Qué es un perito tasador y cuándo lo necesito?', a: 'Es un profesional habilitado para determinar el valor técnico de un inmueble. Lo necesitás para vender con el precio correcto, o para trámites bancarios, legales y sucesorios.' },
              { q: '¿Cómo solicito una tasación?', a: 'Escribinos por WhatsApp con el tipo de inmueble y la zona. Coordinamos la visita.' },
              { q: '¿Atienden toda Asunción y Gran Asunción?', a: 'Sí, cubrimos Asunción y el Gran Asunción; consultanos por otras zonas del interior.' },
            ],
          },
        ],
      },
      ctaBand('Pedí tu informe oficial de tasación', 'Firmado por el Tasador Fernando Capurro, con validez para bancos, juzgados y escribanías.'),
    ],
  },

  // ------------------------------------------------------------------ CONTACTO
  {
    slug: '/contacto/',
    waContext: 'Contacto',
    kind: 'contact',
    eyebrow: 'Contacto',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: null, freeLink: { label: '¿Solo querés vender? El costo se cubre si vendés con nosotros →', href: '/valuacion-para-vender/' } },
    title: 'Contacto — tasaciones en Asunción | Tasación.com.py',
    description: 'Pedí tu informe oficial de tasación por WhatsApp, firmado por el Tasador Fernando Capurro, o dejanos tus datos.',
    h1: 'Pedí tu tasación por WhatsApp o dejanos tus datos',
    subcopy: 'Escribinos por WhatsApp para el informe oficial firmado por el Tasador Fernando Capurro, o dejanos tus datos y te contactamos nosotros.',
    sections: [
      {
        type: 'channels',
        heading: 'Nuestros canales',
        items: [
          { label: 'WhatsApp', value: '+595 995 628862', note: 'Respuesta inmediata en horario comercial.' },
          { label: 'Horario de Atención', value: 'Lunes a Viernes 08:00–18:00, Sábados 08:00–12:00' },
        ],
      },
      {
        type: 'contactForm',
        heading: '¿Preferís que te escribamos?',
        body: 'Dejanos tus datos y te contactamos nosotros.',
        mensajeOptions: WA_MENU.options.map((o, idx) => ({ value: o.label, label: o.label, default: idx === 0 })),
      },
      ctaBand('Pedí tu informe oficial de tasación', 'Firmado por el Tasador Fernando Capurro, con validez para bancos, juzgados y escribanías.'),
    ],
  },
];

// Páginas extra fuera del sitemap (noindex): heredan header/footer/menú WA
// del mismo renderizador que las 13 rutas core.
export const EXTRAS = [
  {
    slug: '404.html',
    waContext: 'Página no encontrada',
    kind: 'info',
    eyebrow: null,
    noindex: true,
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: null, freeLink: null },
    title: 'Página no encontrada | Tasación.com.py',
    description: 'La página que buscás no existe o fue movida. Encontrá servicios de tasación y contacto desde acá.',
    h1: 'Esta página no existe',
    subcopy: 'Puede que el enlace esté viejo o que hayamos movido la página. Desde acá podés seguir a cualquier parte del sitio.',
    sections: [
      {
        type: 'services',
        heading: 'Elegí por dónde seguir',
        items: SERVICIOS,
      },
    ],
  },
  {
    slug: 'gracias.html',
    waContext: 'Gracias',
    kind: 'info',
    eyebrow: null,
    noindex: true,
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: null, freeLink: null },
    title: 'Gracias — te respondemos por WhatsApp | Tasación.com.py',
    description: 'Recibimos tu consulta de tasación. Te respondemos por WhatsApp al número que dejaste.',
    h1: 'Gracias, ya recibimos tus datos',
    subcopy: 'El Tasador Fernando Capurro te escribe por WhatsApp al número que dejaste. Si preferís adelantar la consulta, escribinos ahora mismo.',
    sections: [],
  },
];
