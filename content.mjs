// content.mjs — contenido de las 13 páginas, copiado del sitio anterior
// (tasacion.com.py, versión Next.js, dado de baja). Ver docs/legacy-sitemap.md
// para la fuente. Generado por build-site.mjs — no editar los .html a mano.

export const WA_NUMBER = '595995628862';
export const SITE = 'https://tasacion.com.py';

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

const ctaWA = (text, label) => ({ type: 'ctaFinal', text, label });

export const NAV = [
  { label: 'Inicio', href: '/' },
  { label: 'Tasaciones', href: '/#tasaciones' },
  { label: 'Vender', href: '/valuacion-para-vender/' },
  { label: 'Informes', href: '/informes-periciales/' },
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
    title: 'Tasación de inmuebles en Asunción y Gran Asunción | Tasación.com.py',
    description: 'Conocé el valor real de tu inmueble por WhatsApp. Valoración gratuita para vender o informe pericial oficial con validez legal y bancaria.',
    h1: 'Conocé el valor real de tu inmueble, certificado por expertos locales',
    subcopy: 'Obtené una valuación precisa basada en el mercado paraguayo actual. Empezá por la ubicación de tu propiedad y hablá directo con un perito por WhatsApp.',
    heroCta: 'Solicitá tu Valuación por WhatsApp',
    trustBar: ['Peritos matriculados', 'Datos reales de mercado', 'Respuesta rápida'],
    sections: [
      {
        type: 'services', id: 'tasaciones',
        heading: 'Especialistas en cada tipo de inmueble',
        items: SERVICIOS,
      },
      porQueElegirnos,
      {
        type: 'lead',
        heading: 'Expertos con conocimiento de campo',
        body: 'En Paraguay cada propiedad es única. Nuestros expertos analizan terminaciones, ubicación estratégica y plusvalía real para entregarte un valor exacto que un sistema genérico no puede ver.',
      },
      {
        type: 'steps',
        heading: 'Tu tasación en 3 pasos simples',
        items: [
          { title: 'Elegí el tipo y la zona', body: 'Decinos qué querés tasar y dónde está, en segundos.' },
          { title: 'Hablá con un perito por WhatsApp', body: 'Te asignamos un especialista de tu zona que analiza tu caso.' },
          { title: 'Recibís tu valor', body: 'Una valoración gratuita para vender, o un informe oficial certificado para trámites legales y bancarios.' },
        ],
      },
      {
        type: 'grid2',
        heading: 'Vendemos tu propiedad al mejor precio de mercado',
        body: 'No solo te decimos cuánto vale. Activamos un plan de marketing profesional para encontrar compradores e inversores extranjeros.',
        items: [
          { title: 'Video Profesional', body: 'Recorridos cinematográficos que enamoran.' },
          { title: 'Inversores', body: 'Acceso a red regional de compradores.' },
          { title: 'Marketing Digital', body: 'Publicidad en redes y buscadores.' },
          { title: 'Plusvalía', body: 'Estrategias para subir el valor percibido.' },
        ],
        cta: { label: 'Ver Plan de Venta', href: '/valuacion-para-vender/' },
      },
      {
        type: 'lead',
        heading: 'Para Vendedores',
        body: 'Valoración comercial gratis para vendedores. Si tu objetivo es vender, un agente experto de nuestra red hace un análisis de mercado sin costo. Recibí asesoramiento profesional para fijar el precio correcto y vender con éxito.',
        cta: { label: 'Quiero vender mi propiedad', href: '/valuacion-para-vender/' },
      },
      {
        type: 'lead',
        heading: 'Informes Oficiales',
        body: 'Informes periciales con validez jurídica. Documentación técnica para créditos hipotecarios, juicios de sucesión, disolución conyugal y garantías reales. Informes firmados por un perito tasador que cumplen los estándares de los principales bancos.',
        cta: { label: 'Ver servicios legales', href: '/informes-periciales/' },
      },
      {
        type: 'faqPreview',
        heading: 'Preguntas frecuentes',
        items: [
          '¿Qué es un perito tasador y cuándo lo necesito?',
          '¿La tasación para vender mi casa es gratuita?',
          '¿Sus informes son válidos para créditos hipotecarios?',
        ],
        href: '/preguntas-frecuentes/',
      },
      ctaWA('Conocé hoy el valor real de tu inmueble — Hablanos por WhatsApp y te respondemos al toque.', 'Solicitá tu Valuación por WhatsApp'),
    ],
  },

  // ------------------------------------------------------------ CASAS
  {
    slug: '/tasaciones/casas/',
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
      {
        type: 'grid2',
        heading: 'Para vender (gratis) vs Informe oficial certificado',
        items: [
          { title: 'Para vender (gratis)', body: 'Recibí un análisis comercial de mercado sin costo si tu objetivo es vender con nuestra red de agentes.', href: '/valuacion-para-vender/', label: 'Saber más' },
          { title: 'Informe oficial certificado', body: 'Documento firmado por perito matriculado con validez para bancos, juzgados y trámites oficiales.', href: '/informes-periciales/', label: 'Ver servicios legales' },
        ],
      },
      {
        type: 'zonas',
        heading: 'Zonas de cobertura',
        items: ['Villa Morra', 'Carmelitas', 'Las Mercedes', 'Mburucuyá', 'Recoleta', 'Lambaré', 'San Lorenzo', 'Luque', 'Fernando de la Mora'],
      },
      {
        type: 'faq',
        items: [
          { q: '¿Cuánto tarda la tasación de una casa?', a: 'Coordinamos la visita según tu disponibilidad y te confirmamos el plazo exacto por WhatsApp antes de empezar.' },
          { q: '¿La visita a la casa tiene costo?', a: 'Si tu objetivo es vender, el análisis comercial es sin costo. Para un informe oficial certificado, te cotizamos antes de agendar la visita.' },
        ],
      },
      otrasTasaciones(null, [
        { title: 'Departamentos', href: '/tasaciones/departamentos/' },
        { title: 'Terrenos', href: '/tasaciones/terrenos/' },
      ]),
      ctaWA('¿Querés saber cuánto vale tu casa hoy?', 'Consultar por WhatsApp'),
    ],
  },

  // ------------------------------------------------------ DEPARTAMENTOS
  {
    slug: '/tasaciones/departamentos/',
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
      {
        type: 'faq',
        items: [
          { q: '¿El piso y la orientación cambian el valor?', a: 'Sí, son parte de los factores que evaluamos junto con vista, luz natural y confort térmico.' },
          { q: '¿Tasan en propiedad horizontal y pozo?', a: 'Sí, tasamos unidades terminadas en propiedad horizontal y también preventas en pozo. Contanos tu caso por WhatsApp.' },
        ],
      },
      otrasTasaciones(null, [
        { title: 'Casas', href: '/tasaciones/casas/' },
        { title: 'Locales Comerciales', href: '/tasaciones/locales-comerciales/' },
      ]),
      ctaWA('¿Querés saber el valor real de tu departamento?', 'Consultar por WhatsApp'),
    ],
  },

  // ------------------------------------------------------------- TERRENOS
  {
    slug: '/tasaciones/terrenos/',
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
      {
        type: 'faq',
        items: [
          { q: '¿Tasan fracciones grandes y loteamientos?', a: 'Sí, tasamos desde lotes individuales hasta fracciones grandes con potencial de loteamiento.' },
          { q: '¿Consideran el potencial de desarrollo?', a: 'Sí, es parte central del análisis: zonificación, F.O.S., F.O.T. y alturas permitidas.' },
        ],
      },
      otrasTasaciones(null, [
        { title: 'Casas', href: '/tasaciones/casas/' },
        { title: 'Corporativa', href: '/tasaciones/corporativa/' },
      ]),
      ctaWA('¿Querés conocer el potencial de tu tierra?', 'Consultar por WhatsApp'),
    ],
  },

  // ----------------------------------------------------------- CORPORATIVA
  {
    slug: '/tasaciones/corporativa/',
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
      porQueElegirnos,
      {
        type: 'faq',
        items: [
          { q: '¿Emiten informes para estados contables y auditoría?', a: 'Sí, emitimos informes técnicos aptos para revaluación de activos fijos en balances.' },
          { q: '¿Tasan plantas industriales completas?', a: 'Sí, tasamos plantas de producción, depósitos y complejos agroindustriales completos.' },
        ],
      },
      otrasTasaciones('Servicios relacionados', [
        { title: 'Locales Comerciales', href: '/tasaciones/locales-comerciales/' },
        { title: 'Informes Periciales', href: '/informes-periciales/' },
      ]),
      ctaWA('¿Necesitás una tasación para tu empresa?', 'Contactar Especialista B2B'),
    ],
  },

  // ------------------------------------------------------------ HIPOTECARIA
  {
    slug: '/tasaciones/hipotecaria/',
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
      {
        type: 'faq',
        items: [
          { q: '¿Sirve para cualquier banco?', a: 'Trabajamos con el formato y los requisitos estándar del mercado paraguayo; confirmanos el banco puntual por WhatsApp.' },
          { q: '¿Cuánto tarda el informe?', a: 'Te confirmamos el plazo exacto por WhatsApp una vez que sabemos el tipo de inmueble y su ubicación.' },
        ],
      },
      otrasTasaciones('Servicios relacionados', [
        { title: 'Casas', href: '/tasaciones/casas/' },
        { title: 'Informes Periciales', href: '/informes-periciales/' },
      ]),
      ctaWA('¿Listo para presentar tu carpeta al banco?', 'Solicitar Informe Hipotecario'),
    ],
  },

  // ------------------------------------------------------ LOCALES COMERCIALES
  {
    slug: '/tasaciones/locales-comerciales/',
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
      {
        type: 'faq',
        items: [
          { q: '¿Valúan por rentabilidad o por m²?', a: 'Usamos ambos criterios: rentabilidad estimada y comparables de m² del mismo corredor comercial.' },
          { q: '¿Tasan locales en shopping?', a: 'Sí, tasamos locales a pie de calle, en galerías y en shoppings.' },
        ],
      },
      otrasTasaciones(null, [
        { title: 'Corporativa', href: '/tasaciones/corporativa/' },
        { title: 'Departamentos', href: '/tasaciones/departamentos/' },
      ]),
      ctaWA('¿Querés saber cuánto vale tu local hoy?', 'Consultar por WhatsApp'),
    ],
  },

  // ------------------------------------------------------------------ CAMPOS
  {
    slug: '/tasaciones/campos/',
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
      porQueElegirnos,
      {
        type: 'faq',
        items: [
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
      ctaWA('¿Necesitás tasar un campo? Hablá directo con un perito especialista en agro.', 'Consultar por WhatsApp'),
    ],
  },

  // ----------------------------------------------------- VALUACION PARA VENDER
  {
    slug: '/valuacion-para-vender/',
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
          ['Sin costo (Gratis)', 'Con costo profesional'],
          ['Enfoque comercial de mercado', 'Validez legal y bancaria'],
          ['Incluye plan de marketing', 'Firmado por perito matriculado'],
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
      ctaWA('Empezá a vender hoy mismo — Solicitá tu valoración gratuita y plan de marketing por WhatsApp.', 'Hablar con un Especialista'),
    ],
  },

  // ------------------------------------------------------ INFORMES PERICIALES
  {
    slug: '/informes-periciales/',
    title: 'Informes periciales con validez jurídica y bancaria | Tasación.com.py',
    description: 'Documentación técnica certificada para procesos legales, bancarios y notariales en todo el Paraguay.',
    h1: 'Informes periciales con validez jurídica y bancaria',
    subcopy: 'Documentación técnica certificada para procesos legales, bancarios y notariales en todo el Paraguay.',
    heroCta: 'Solicitar Peritaje Oficial',
    sections: [
      {
        type: 'grid2',
        heading: 'Casos donde necesitás un informe oficial',
        items: [
          { title: 'Créditos Hipotecarios', body: 'Aprobación de carpetas bancarias para compra o construcción.' },
          { title: 'Juicios de Sucesión', body: 'Partición de herencias y determinación de valores fiscales.' },
          { title: 'Disolución Conyugal', body: 'Valuación justa de bienes en procesos de divorcio.' },
          { title: 'Garantías Reales', body: 'Respaldo de deudas y avales para empresas y particulares.' },
        ],
      },
      {
        type: 'leadList',
        heading: '¿Qué es un informe pericial?',
        body: 'Es un documento técnico-legal firmado por un perito tasador matriculado. A diferencia de una tasación comercial, este informe tiene validez probatoria ante terceros: bancos, jueces, escribanos y la SET.',
        items: ['Firma de perito matriculado', 'Documentación técnica respaldatoria', 'Metodología de tasación explicada', 'Vigencia legal para trámites oficiales'],
      },
      porQueElegirnos,
      {
        type: 'faq',
        items: [
          { q: '¿Tiene validez en el juzgado?', a: 'Sí, es un documento técnico-legal con validez probatoria ante terceros.' },
          { q: '¿Sirve para sucesión?', a: 'Sí, lo usamos para partición de herencias y determinación de valores fiscales.' },
          { q: '¿Cuánto cuesta el informe?', a: 'El monto depende del tipo de inmueble, la superficie y el uso del informe. Te cotizamos por WhatsApp.' },
        ],
      },
      ctaWA('¿Necesitás un peritaje con validez legal? Escribinos y te cotizamos el informe en el acto.', 'Consultar por WhatsApp'),
    ],
  },

  // ------------------------------------------------------------------ NOSOTROS
  {
    slug: '/nosotros/',
    title: 'Nosotros | Tasación.com.py',
    description: 'En Tasación.com.py combinamos la experiencia técnica de peritos matriculados con datos reales del mercado inmobiliario paraguayo.',
    h1: 'Peritos tasadores con conocimiento de campo',
    subcopy: 'En Tasación.com.py combinamos la experiencia técnica de peritos matriculados con datos reales del mercado inmobiliario paraguayo para darte una valuación en la que podés confiar.',
    sections: [
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
      ctaWA('Trabajá con profesionales — Solicitá tu tasación hoy y recibí asesoramiento experto.', 'Hablar por WhatsApp'),
    ],
  },

  // ------------------------------------------------------------------ FAQ
  {
    slug: '/preguntas-frecuentes/',
    title: 'Preguntas frecuentes sobre tasación de inmuebles | Tasación.com.py',
    description: 'Resolvé tus dudas sobre costos, validez legal y procesos de valuación en Paraguay.',
    h1: 'Preguntas frecuentes sobre tasación de inmuebles',
    subcopy: 'Resolvé tus dudas sobre costos, validez legal y procesos de valuación en Paraguay.',
    sections: [
      {
        type: 'faqGroups',
        groups: [
          {
            title: 'General',
            items: [
              { q: '¿Qué es un perito tasador y cuándo lo necesito?', a: 'Es un profesional habilitado para determinar el valor técnico de un inmueble. Lo necesitás para vender con el precio correcto, o para trámites bancarios, legales y sucesorios.' },
              { q: '¿Cómo solicito una tasación?', a: 'Escribinos por WhatsApp con el tipo de inmueble y la zona. Te asignamos un perito y coordinamos la visita.' },
              { q: '¿Atienden toda Asunción y Gran Asunción?', a: 'Sí, cubrimos Asunción y el Gran Asunción; consultanos por otras zonas del interior.' },
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
            title: 'Informe Oficial',
            items: [
              { q: '¿Cuánto cuesta un informe oficial para un banco o juzgado?', a: 'El monto depende del tipo de inmueble, la superficie y el uso del informe. Te cotizamos por WhatsApp.' },
              { q: '¿Sus informes son válidos para créditos hipotecarios?', a: 'Sí, están firmados por perito matriculado y cumplen los requisitos estándar del mercado paraguayo.' },
              { q: '¿Cuánto tarda el informe certificado?', a: 'Te confirmamos el plazo exacto por WhatsApp antes de empezar, según el tipo de inmueble.' },
            ],
          },
        ],
      },
      ctaWA('¿Tenés otra duda? Hablanos por WhatsApp y te respondemos en minutos.', 'Consultar por WhatsApp'),
    ],
  },

  // ------------------------------------------------------------------ CONTACTO
  {
    slug: '/contacto/',
    title: 'Contacto | Tasación.com.py',
    description: 'Contactá a Tasación.com.py por WhatsApp o dejanos tus datos. Tasación de inmuebles en Asunción y el Gran Asunción.',
    h1: 'Hablanos y conocé el valor de tu inmueble',
    subcopy: 'No necesitás llenar formularios largos. Escribinos directo por WhatsApp y te atendemos al toque.',
    heroCta: 'Hablar por WhatsApp',
    sections: [
      {
        type: 'channels',
        heading: 'Nuestros canales',
        items: [
          { label: 'WhatsApp', value: '+595 995 628862', note: 'Respuesta inmediata en horario comercial.' },
          { label: 'Horario de Atención', value: 'Lunes a Viernes 08:00–18:00, Sábados 08:00–12:00' },
        ],
      },
      { type: 'contactForm', heading: '¿Preferís que te escribamos?', body: 'Dejanos tus datos y un perito se pondrá en contacto con vos.' },
    ],
  },
];
