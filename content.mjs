// content.mjs — contenido de las 13 páginas, copiado del sitio anterior
// (tasacion.com.py, versión Next.js, dado de baja). Ver docs/legacy-sitemap.md
// para la fuente. Generado por build-site.mjs — no editar los .html a mano.

export const WA_NUMBER = '595995628862';
export const SITE = 'https://tasacion.com.py';

export const TASADOR = 'Fernando Capurro';
export const PRECIO = { min: 800000, max: 1500000 };
export const fmtGs = (n) => 'Gs. ' + n.toLocaleString('es-PY').replace(/ /g, '.');
export const PRECIO_TXT = `${fmtGs(PRECIO.min)} a ${fmtGs(PRECIO.max)}`;
export const PRECIO_NOTA = 'según tipo y tamaño del inmueble; te confirmamos el monto exacto por WhatsApp antes de agendar la visita';

export const WA_MENU = {
  options: [
    { id: 'informe', label: 'Quiero un informe oficial de tasación', sub: 'Pago · con firma del tasador', text: (ctx) => `Hola, vengo de la página de ${ctx} y quiero un informe oficial de tasación.` },
    { id: 'valoracion', label: 'Quiero una valoración gratis para vender', sub: 'Rango de mercado, sin costo', text: (ctx) => `Hola, vengo de la página de ${ctx} y quiero una valoración gratis para vender.` },
    { id: 'consulta', label: 'Tengo otra consulta', sub: 'Escribinos lo que necesites', text: (ctx) => `Hola, vengo de la página de ${ctx} y tengo una consulta.` },
  ],
  fallback: (ctx) => `Hola, vengo de tasacion.com.py (${ctx}) y quiero información sobre una tasación.`,
};

const porQueElegirnos = {
  type: 'grid3',
  heading: 'Por qué elegirnos',
  items: [
    { title: 'Datos Reales de Mercado', body: 'No usamos promedios genéricos. Analizamos ventas reales y tendencias actuales del mercado paraguayo.' },
    { title: 'Rapidez por WhatsApp', body: 'Recibí atención rápida y personalizada según tu necesidad: venta o trámite oficial.' },
    { title: 'Peritos Tasadores', body: 'Cada tasación es supervisada por peritos matriculados con trayectoria en Asunción y Gran Asunción.' },
  ],
};

const otrasTasaciones = (heading, items) => ({ type: 'links', heading: heading || 'Otras tasaciones', items });

const INCLUYE_INFORME = ['Firma del Tasador Fernando Capurro', 'Visita técnica al inmueble', 'Análisis de comparables reales', 'Documentación fotográfica', 'Metodología de tasación explicada', 'Vigencia legal para bancos y juzgados'];

const freeAsideVender = () => ({
  type: 'freeAside',
  heading: 'Valoración gratis para vender',
  body: 'Si tu objetivo es vender, te damos un rango de valor de mercado sin costo. No es un informe oficial ni tiene validez legal ni bancaria.',
  cta: { label: 'Valoración gratis para vender', href: '/valuacion-para-vender/' },
});

// labelMin/labelMax: categoría al extremo inferior/superior del rango
// confirmado (§3.9 — nunca cifras intermedias inventadas).
const priceBlockVertical = (heading, labelMin, labelMax) => ({
  type: 'priceBlock',
  heading,
  includes: INCLUYE_INFORME,
  rows: [
    [labelMin, `desde ${fmtGs(PRECIO.min)}`],
    [labelMax, `hasta ${fmtGs(PRECIO.max)}`],
  ],
});

const ctaBand = (heading, body) => ({
  type: 'ctaBand',
  eyebrow: 'Informe oficial · firmado por tasador',
  heading,
  body,
  primary: { label: 'Solicitar informe oficial', waOption: 'informe' },
  secondaryLink: { label: 'o pedir una valoración gratis para vender', waOption: 'valoracion' },
});

export const NAV = [
  { label: 'Inicio', href: '/' },
  { label: 'Tasaciones', href: '/#tasaciones' },
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
];

export const PAGES = [
  // ---------------------------------------------------------------- HOME
  {
    slug: '/',
    waContext: 'Inicio',
    kind: 'home',
    eyebrow: 'Tasador Fernando Capurro · Asunción y Gran Asunción',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver todos los servicios', href: '#tasaciones' }, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasacion-de-inmuebles-asuncion', alt: 'Tasador de Tasación.com.py señalando un terreno en el Gran Asunción' },
    title: 'Tasación de inmuebles en Asunción y Gran Asunción | Tasación.com.py',
    description: 'Informe oficial de tasación firmado por el Tasador Fernando Capurro, con validez legal y bancaria. También disponible: valoración gratis si tu objetivo es vender.',
    h1: 'Informe oficial de tasación, firmado por un tasador',
    subcopy: 'Un documento técnico firmado por el Tasador Fernando Capurro, con validez para bancos, juzgados y escribanías. Si tu objetivo es vender, también tenés una valoración gratuita.',
    sections: [
      {
        type: 'services', id: 'tasaciones',
        heading: 'Especialistas en cada tipo de inmueble',
        items: SERVICIOS,
      },
      {
        type: 'grid2',
        heading: 'Elegí qué necesitás',
        items: [
          { title: 'Informe oficial de tasación', body: 'Documento firmado por el Tasador Fernando Capurro, con validez para bancos, juzgados y escribanías.', href: '/informes-periciales/', label: 'Ver informe oficial', accent: true },
          { title: 'Valoración gratis para vender', body: 'Un rango de valor de mercado sin costo, si tu objetivo es vender.', href: '/valuacion-para-vender/', label: 'Ver valoración gratis', muted: true },
        ],
      },
      {
        type: 'steps',
        heading: 'Tu tasación en 3 pasos simples',
        items: [
          { title: 'Elegí el tipo y la zona', body: 'Decinos qué querés tasar y dónde está, en segundos.' },
          { title: 'Hablá con el tasador por WhatsApp', body: 'Coordinamos la visita y confirmamos el alcance de tu caso.' },
          { title: 'Recibís tu informe o tu valoración', body: 'Un informe oficial de tasación firmado, o una valoración gratuita si tu objetivo es vender.' },
        ],
      },
      porQueElegirnos,
      {
        type: 'freeAside',
        heading: 'Valoración gratis para vender',
        body: 'Si tu objetivo es vender, te damos un rango de valor de mercado sin costo. No es un informe oficial ni tiene validez legal ni bancaria.',
        cta: { label: 'Valoración gratis para vender', href: '/valuacion-para-vender/' },
      },
      {
        type: 'faqPreview',
        heading: 'Preguntas frecuentes',
        items: [
          '¿Cuánto cuesta el informe oficial de tasación?',
          '¿La valoración para vender es realmente gratuita?',
          '¿Sus informes son válidos para créditos hipotecarios?',
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
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasacion-casas-departamentos-asuncion', alt: 'Casa residencial en un barrio de Asunción' },
    title: 'Tasación de casas en Asunción | Tasación.com.py',
    description: 'Valuación de mercado para residencias urbanas y barrios cerrados, hecha por peritos que conocen tu zona. Gratis si querés vender; certificada si es para un trámite.',
    h1: 'Tasación de casas en Asunción: conocé el valor real de tu vivienda',
    subcopy: 'Valuación de mercado para residencias urbanas y barrios cerrados, hecha por peritos que conocen tu zona. Gratis si querés vender; certificada si es para un trámite.',
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
      priceBlockVertical('Qué incluye el informe de tasación de tu casa', 'Casa estándar en barrio urbano', 'Casas grandes o en barrio cerrado'),
      freeAsideVender(),
      {
        type: 'zonas',
        heading: 'Zonas de cobertura',
        items: ['Villa Morra', 'Carmelitas', 'Las Mercedes', 'Mburucuyá', 'Recoleta', 'Lambaré', 'San Lorenzo', 'Luque', 'Fernando de la Mora'],
      },
      {
        type: 'faq',
        items: [
          { q: '¿Cuánto cuesta el informe de una casa?', a: `El informe oficial cuesta entre ${PRECIO_TXT}, según el tipo y tamaño de la casa; confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
          { q: '¿Cuánto tarda la tasación de una casa?', a: 'Coordinamos la visita según tu disponibilidad y te confirmamos el plazo exacto por WhatsApp antes de empezar.' },
          { q: '¿La visita tiene costo?', a: 'Si tu objetivo es vender, la valoración es gratis. Para el informe oficial, el costo es el rango de arriba.' },
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
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
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
      priceBlockVertical('Qué incluye el informe de tasación de tu departamento', 'Unidad estándar', 'Unidades grandes, dúplex o pozo'),
      freeAsideVender(),
      {
        type: 'faq',
        items: [
          { q: '¿Cuánto cuesta el informe de un departamento?', a: `El informe oficial cuesta entre ${PRECIO_TXT}, según el tipo y tamaño de la unidad; confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
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
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
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
      priceBlockVertical('Qué incluye el informe de tasación de tu terreno', 'Lote urbano estándar', 'Fracciones grandes o loteamientos'),
      freeAsideVender(),
      {
        type: 'faq',
        items: [
          { q: '¿Cuánto cuesta el informe de un terreno?', a: `El informe oficial cuesta entre ${PRECIO_TXT}, según la superficie y el tipo de terreno; confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
          { q: '¿Tasan fracciones grandes y loteamientos?', a: 'Sí, tasamos desde lotes individuales hasta fracciones grandes con potencial de loteamiento.' },
          { q: '¿Consideran el potencial de desarrollo?', a: 'Sí, es parte central del análisis: zonificación, F.O.S., F.O.T. y alturas permitidas.' },
        ],
      },
      otrasTasaciones(null, [
        { title: 'Casas', href: '/tasaciones/casas/' },
        { title: 'Corporativa', href: '/tasaciones/corporativa/' },
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
    hero: { primary: { label: 'Solicitar informe corporativo', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
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
      priceBlockVertical('Qué incluye el informe corporativo', 'Oficinas y locales administrativos', 'Plantas, depósitos y complejos'),
      freeAsideVender(),
      porQueElegirnos,
      {
        type: 'faq',
        items: [
          { q: '¿Cuánto cuesta el informe corporativo?', a: `El informe oficial cuesta entre ${PRECIO_TXT}, según el tipo y tamaño del activo; confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
          { q: '¿Emiten informes para estados contables y auditoría?', a: 'Sí, emitimos informes técnicos aptos para revaluación de activos fijos en balances.' },
          { q: '¿Tasan plantas industriales completas?', a: 'Sí, tasamos plantas de producción, depósitos y complejos agroindustriales completos.' },
        ],
      },
      otrasTasaciones('Servicios relacionados', [
        { title: 'Locales Comerciales', href: '/tasaciones/locales-comerciales/' },
        { title: 'Informes Periciales', href: '/informes-periciales/' },
      ]),
      ctaBand('Informe oficial para tu empresa', 'Documentación técnica firmada por el Tasador Fernando Capurro, apta para balances, garantías y auditoría.'),
    ],
  },

  // ------------------------------------------------------------ HIPOTECARIA
  {
    slug: '/tasaciones/hipotecaria/',
    waContext: 'Tasación Hipotecaria',
    kind: 'vertical',
    eyebrow: 'Tasación hipotecaria · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: null },
    heroImage: { base: 'tasacion-hipotecaria-documentacion-paraguay', alt: 'Documentación de tasación hipotecaria sobre un escritorio junto a llaves de una vivienda' },
    title: 'Tasación hipotecaria en Paraguay | Tasación.com.py',
    description: 'Informes periciales firmados por peritos matriculados que cumplen con los requisitos bancarios para créditos de vivienda y comerciales.',
    h1: 'Tasación hipotecaria: certificá tu carpeta para el banco',
    subcopy: 'Informes periciales firmados por peritos matriculados que cumplen con los requisitos bancarios para créditos de vivienda y comerciales.',
    sections: [
      {
        type: 'lead',
        heading: 'Por qué el banco te pide una tasación',
        body: 'El banco necesita asegurarse de que el inmueble que queda como garantía tiene un valor real suficiente para cubrir el préstamo. Un informe pericial independiente es la garantía de transparencia para ambas partes.',
      },
      {
        type: 'grid3',
        heading: 'Qué incluye el informe hipotecario',
        items: [
          { title: 'Documentación Técnica', body: 'Copia de título, planos y cuenta corriente catastral.' },
          { title: 'Análisis de Mercado', body: 'Comparación con propiedades similares en la zona.' },
          { title: 'Registro Fotográfico', body: 'Fotos detalladas de interiores, exteriores y entorno.' },
          { title: 'Firma de Perito', body: 'Aval de un profesional matriculado habilitado.' },
          { title: 'Valor de Liquidación', body: 'Estimación del valor ante una venta rápida.' },
          { title: 'Cumplimiento Normativo', body: 'Ajustado a los estándares bancarios del Paraguay.' },
        ],
      },
      priceBlockVertical('Qué incluye el informe hipotecario', 'Vivienda', 'Inmuebles comerciales o grandes'),
      {
        type: 'faq',
        items: [
          { q: '¿Cuánto cuesta el informe hipotecario?', a: `El informe oficial cuesta entre ${PRECIO_TXT}, según el tipo de inmueble; confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
          { q: '¿Sirve para cualquier banco?', a: 'Trabajamos con el formato y los requisitos estándar del mercado paraguayo; confirmanos el banco puntual por WhatsApp.' },
          { q: '¿Cuánto tarda el informe?', a: 'Te confirmamos el plazo exacto por WhatsApp una vez que sabemos el tipo de inmueble y su ubicación.' },
        ],
      },
      otrasTasaciones('Servicios relacionados', [
        { title: 'Casas', href: '/tasaciones/casas/' },
        { title: 'Informes Periciales', href: '/informes-periciales/' },
      ]),
      ctaBand('Informe oficial para tu carpeta bancaria', 'Documento firmado por el Tasador Fernando Capurro, listo para presentar al banco.'),
    ],
  },

  // ------------------------------------------------------ LOCALES COMERCIALES
  {
    slug: '/tasaciones/locales-comerciales/',
    waContext: 'Tasación de Locales Comerciales',
    kind: 'vertical',
    eyebrow: 'Tasación de locales comerciales · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'tasacion-locales-comerciales-asuncion', alt: 'Local comercial en Asunción' },
    title: 'Tasación de locales comerciales en Asunción | Tasación.com.py',
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
      priceBlockVertical('Qué incluye el informe de tasación de tu local', 'Local a pie de calle', 'Locales grandes, galerías o shopping'),
      freeAsideVender(),
      {
        type: 'faq',
        items: [
          { q: '¿Cuánto cuesta el informe de un local comercial?', a: `El informe oficial cuesta entre ${PRECIO_TXT}, según el tipo y tamaño del local; confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
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
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye el informe', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
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
      priceBlockVertical('Qué incluye el informe de tasación de tu campo', 'Campos chicos', 'Estancias y establecimientos grandes'),
      freeAsideVender(),
      porQueElegirnos,
      {
        type: 'faq',
        items: [
          { q: '¿Cuánto cuesta el informe de un campo?', a: `El informe oficial cuesta entre ${PRECIO_TXT}, según la extensión y el tipo de establecimiento; confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
          { q: '¿Tasan en todo el territorio nacional?', a: 'Sí, cubrimos campos y estancias en todo el territorio paraguayo.' },
          { q: '¿Qué tipo de análisis técnico realizan?', a: 'Aptitud del suelo, infraestructura instalada, logística y situación legal del inmueble.' },
          { q: '¿El informe sirve para garantías bancarias?', a: 'Sí, el informe pericial puede usarse como respaldo para garantías reales.' },
          { q: '¿Cuánto tiempo demora el peritaje?', a: 'Depende de la extensión y ubicación del campo; te confirmamos el plazo por WhatsApp antes de empezar.' },
        ],
      },
      otrasTasaciones('Otras Tasaciones', [
        { title: 'Tasación de Terrenos', body: 'Tasación técnica de lotes y fracciones urbanas', href: '/tasaciones/terrenos/' },
        { title: 'Tasación Corporativa', body: 'Informes para oficinas y plantas industriales', href: '/tasaciones/corporativa/' },
      ]),
      ctaBand('Informe oficial de tasación de tu campo', 'Documento técnico firmado por el Tasador Fernando Capurro, con validez legal y bancaria.'),
    ],
  },

  // ----------------------------------------------------- VALUACION PARA VENDER
  {
    slug: '/valuacion-para-vender/',
    waContext: 'Valoración para Vender',
    kind: 'secondary-free',
    eyebrow: 'Valoración para vender · Paraguay',
    showPriceChip: false,
    hero: { primary: { label: 'Quiero mi valoración gratis', waOption: 'valoracion' }, secondary: null, freeLink: { label: '¿Necesitás validez legal o bancaria? Pedí el informe oficial →', href: '/informes-periciales/' } },
    heroImage: { base: 'propiedad-lista-para-la-venta-asuncion', alt: 'Fachada de una casa en Asunción preparada para la venta' },
    title: 'Valoración gratis para vender tu propiedad | Tasación.com.py',
    description: 'Recibí un análisis profesional de mercado sin costo y descubrí cómo nuestra red puede acelerar tu venta.',
    h1: 'Valoración comercial gratis para vender tu propiedad',
    subcopy: 'No adivines el precio. Recibí un análisis profesional de mercado sin costo y descubrí cómo nuestra red puede acelerar tu venta.',
    heroCta: 'Quiero mi valoración gratis',
    sections: [
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
        heading: 'Diferencia entre Valoración y Peritaje',
        colA: 'Valoración para Vender',
        colB: 'Informe Pericial Oficial',
        rows: [
          ['Sin costo (Gratis)', `Con costo profesional (${PRECIO_TXT})`],
          ['Enfoque comercial de mercado', 'Validez legal y bancaria'],
          ['Incluye plan de marketing', 'Firmado por el Tasador Fernando Capurro'],
        ],
      },
      {
        type: 'faq',
        items: [
          { q: '¿Es realmente gratis la valoración?', a: 'Sí, el análisis comercial de mercado para vender no tiene costo.' },
          { q: '¿Qué recibo en el análisis gratuito?', a: 'Un rango de valor de mercado y una propuesta de plan de marketing para tu propiedad.' },
          { q: '¿Estoy obligado a vender con ustedes?', a: 'No, la valoración es sin compromiso. Decidís si avanzar con la venta.' },
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
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: { label: 'Ver qué incluye', href: '#incluye' }, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'informe-de-tasacion-linderos-paraguay', alt: 'Documentación técnica de un informe pericial en Paraguay' },
    title: 'Informes periciales con validez jurídica y bancaria | Tasación.com.py',
    description: 'Documentación técnica certificada para procesos legales, bancarios y notariales en todo el Paraguay.',
    h1: 'Informes periciales con validez jurídica y bancaria',
    subcopy: 'Documentación técnica firmada por el Tasador Fernando Capurro, para procesos legales, bancarios y notariales en todo el Paraguay.',
    sections: [
      {
        type: 'grid2',
        heading: 'Casos donde necesitás un informe oficial',
        items: [
          { title: 'Créditos Hipotecarios', body: 'Aprobación de carpetas bancarias para compra o construcción.', accent: true },
          { title: 'Juicios de Sucesión', body: 'Partición de herencias y determinación de valores fiscales.', accent: true },
          { title: 'Disolución Conyugal', body: 'Valuación justa de bienes en procesos de divorcio.', accent: true },
          { title: 'Garantías Reales', body: 'Respaldo de deudas y avales para empresas y particulares.', accent: true },
        ],
      },
      {
        type: 'priceBlock',
        heading: 'Qué incluye el informe pericial',
        includes: ['Firma del Tasador Fernando Capurro', 'Documentación técnica respaldatoria', 'Metodología de tasación explicada', 'Vigencia legal para trámites oficiales', 'Análisis de mercado comparativo', 'Registro fotográfico del inmueble'],
        rows: [['Informes simples', `desde ${fmtGs(PRECIO.min)}`], ['Informes complejos o de mayor superficie', `hasta ${fmtGs(PRECIO.max)}`]],
      },
      porQueElegirnos,
      {
        type: 'faq',
        items: [
          { q: '¿Tiene validez en el juzgado?', a: 'Sí, es un documento técnico-legal con validez probatoria ante terceros.' },
          { q: '¿Sirve para sucesión?', a: 'Sí, lo usamos para partición de herencias y determinación de valores fiscales.' },
          { q: '¿Cuánto cuesta el informe?', a: `El informe oficial cuesta entre ${PRECIO_TXT}, según tipo y tamaño del inmueble; confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
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
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: null, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
    heroImage: { base: 'oficina-de-tasaciones-asuncion', alt: 'Escritorio de trabajo con planos y documentación de tasación en una oficina de Asunción' },
    title: 'Nosotros | Tasación.com.py',
    description: 'El Tasador Fernando Capurro y el equipo de Tasación.com.py combinan experiencia técnica con datos reales del mercado inmobiliario paraguayo.',
    h1: 'Tasador Fernando Capurro y el equipo de Tasación.com.py',
    subcopy: 'Combinamos la experiencia técnica del tasador responsable con datos reales del mercado inmobiliario paraguayo para darte una valuación en la que podés confiar.',
    sections: [
      {
        type: 'lead',
        heading: 'Quién firma tus informes',
        body: `El Tasador ${TASADOR} es el tasador responsable de cada informe oficial de Tasación.com.py: es su firma la que le da validez legal y bancaria al documento.`,
      },
      {
        type: 'lead',
        heading: 'Quiénes somos',
        body: 'Somos un equipo multidisciplinario de peritos tasadores y agentes inmobiliarios con años de trayectoria en Asunción y Gran Asunción. Entendemos que una tasación no es solo un número, es la base para una decisión de vida o un proceso legal crítico.\n\nNuestra misión es profesionalizar la valuación inmobiliaria en Paraguay, eliminando las suposiciones y basándonos en criterios técnicos sólidos y comparables reales de mercado.',
      },
      {
        type: 'grid3',
        heading: 'Nuestros pilares',
        items: [
          { title: 'Precisión Técnica', body: 'Usamos metodologías estandarizadas y análisis de plusvalía real.' },
          { title: 'Transparencia', body: 'Explicamos el porqué de cada valor basándonos en datos comprobables.' },
          { title: 'Rapidez', body: 'Atención personalizada por WhatsApp para agilizar tus trámites.' },
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
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: null, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
    title: 'Preguntas frecuentes sobre tasación de inmuebles | Tasación.com.py',
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
              { q: '¿Cuánto cuesta un informe oficial para un banco o juzgado?', a: `El informe oficial cuesta entre ${PRECIO_TXT}, según tipo y tamaño del inmueble; confirmamos el monto exacto por WhatsApp antes de agendar la visita.` },
              { q: '¿Quién firma el informe?', a: `El Tasador ${TASADOR}, tasador responsable de Tasación.com.py.` },
              { q: '¿Sus informes son válidos para créditos hipotecarios?', a: 'Sí, están firmados por perito matriculado y cumplen los requisitos estándar del mercado paraguayo.' },
              { q: '¿Cuánto tarda el informe certificado?', a: 'Te confirmamos el plazo exacto por WhatsApp antes de empezar, según el tipo de inmueble.' },
            ],
          },
          {
            title: 'Para Vender (Gratis)',
            items: [
              { q: '¿La tasación para vender es realmente gratuita?', a: 'Sí, el análisis comercial de mercado para vender no tiene costo.' },
              { q: '¿Estoy obligado a vender con ustedes?', a: 'No, es un servicio sin compromiso. Vos decidís cómo seguir.' },
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
    hero: { primary: { label: 'Pedir mi informe oficial', waOption: 'informe' }, secondary: null, freeLink: { label: '¿Solo querés vender? Pedí tu valoración gratis →', href: '/valuacion-para-vender/' } },
    title: 'Contacto | Tasación.com.py',
    description: 'Pedí tu informe oficial de tasación por WhatsApp, firmado por el Tasador Fernando Capurro, o dejanos tus datos.',
    h1: 'Pedí tu informe oficial de tasación',
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
        body: 'Dejanos tus datos y un perito se pondrá en contacto con vos.',
        mensajeOptions: [
          { value: 'Informe oficial de tasación', label: 'Informe oficial de tasación', default: true },
          { value: 'Valoración gratis para vender', label: 'Valoración gratis para vender' },
          { value: 'Otra consulta', label: 'Otra consulta' },
        ],
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
    subcopy: 'Un perito de Tasación.com.py te escribe por WhatsApp al número que dejaste. Si preferís adelantar la consulta, escribinos ahora mismo.',
    sections: [],
  },
];
