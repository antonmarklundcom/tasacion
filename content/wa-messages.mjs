// WhatsApp: el número y todos los mensajes pre-escritos del sitio, en un solo lugar.
// Reglas (docs/IMPROVE-PLAN.md §4.2, chequeadas por tools/check-contact.mjs):
// - voseo paraguayo, primera persona, en la voz del cliente
// - sin montos ni monedas; cada mensaje es único y nombra el tema de la página
// - termina con un espacio "___" que el cliente completa
// Para cambiar el número: solo acá. Nada más en el repo lo tiene escrito.

export const WA_NUMBER = '595992279599';
export const WA_DISPLAY = '+595 992 279 599';
export const TEL_HREF = 'tel:+' + WA_NUMBER;

// Finalidades (§4.1). `label` va en el menú, en el select del formulario y en leads.
export const PURPOSES = {
  compraventa: { label: 'Informe oficial para comprar o vender', sub: 'Firmado por perito tasador matriculado' },
  hipotecaria: { label: 'Tasación para crédito hipotecario', sub: 'Firma un tasador inscripto en el BCP' },
  credito: { label: 'Tasación para otro crédito', sub: 'Fiduciario, cooperativa, prendario de inmueble' },
  sucesion: { label: 'Tasación para sucesión o juicio', sub: 'Herencias, divisiones, procesos judiciales' },
  venta: { label: 'Tasación para vender con un corredor', sub: 'Con exclusividad, el costo se descuenta de la comisión' },
  empresa: { label: 'Tasación para mi empresa', sub: 'Activos, balances, garantías corporativas' },
  franja: { label: 'Relevamiento en franja de dominio', sub: 'Proyectos viales, presupuesto por proyecto' },
  consulta: { label: 'Otra consulta', sub: 'Cualquier otro caso' },
};

// Filas del menú: las 6 de siempre; en corporativa y franja la finalidad propia reemplaza a "consulta".
export const MENU_BASE = ['compraventa', 'hipotecaria', 'credito', 'sucesion', 'venta', 'consulta'];
export const MENU_ROWS = {
  '/tasaciones/corporativa/': ['compraventa', 'hipotecaria', 'credito', 'sucesion', 'venta', 'empresa'],
  '/tasaciones/franja-de-dominio/': ['compraventa', 'hipotecaria', 'credito', 'sucesion', 'venta', 'franja'],
};
export const menuRows = (slug) => MENU_ROWS[slug] || MENU_BASE;

// Finalidad por defecto de cada página (botón principal, FAB, pill del header sin JS).
export const DEFAULT_PURPOSE = {
  '/tasaciones/hipotecaria/': 'hipotecaria',
  '/tasaciones/corporativa/': 'empresa',
  '/tasaciones/franja-de-dominio/': 'franja',
  '/valuacion-para-vender/': 'venta',
};
export const defaultPurpose = (slug) => DEFAULT_PURPOSE[slug] || 'compraventa';

export const MESSAGES = {
  '/': {
    compraventa: 'Hola, vengo de la página principal de Tasación.com.py. Necesito el informe oficial de tasación de un inmueble para una compra o venta. El inmueble es (casa, depto, terreno) y queda en: ___',
    hipotecaria: 'Hola, estoy en la página principal. El banco me pide una tasación para un crédito hipotecario. El inmueble queda en: ___ y el banco es: ___',
    credito: 'Hola, entré a Tasación.com.py porque necesito tasar un inmueble para un crédito que no es hipotecario (fiduciario o de cooperativa). La entidad es: ___',
    sucesion: 'Hola, vengo de la página principal. Necesito tasar un inmueble para una sucesión o un juicio. El inmueble queda en: ___',
    venta: 'Hola, vi en la página principal la tasación para vender. Quiero vender mi inmueble con un corredor, con exclusividad. Queda en: ___',
    consulta: 'Hola, estoy en la página principal de Tasación.com.py y tengo una consulta sobre tasaciones: ___',
    footer: 'Hola, les escribo desde el sitio Tasación.com.py. Quiero consultar por una tasación de: ___',
  },
  '/tasaciones/': {
    compraventa: 'Hola, estoy viendo los tipos de tasación. Necesito el informe oficial para comprar o vender un inmueble. El tipo de inmueble es: ___',
    hipotecaria: 'Hola, revisé el listado de tasaciones y necesito una para mi crédito hipotecario. Tipo de inmueble y zona: ___',
    credito: 'Hola, en la página de tipos de tasación no encontré mi caso: es para un crédito fiduciario o de cooperativa. Tipo de inmueble: ___',
    sucesion: 'Hola, vengo del listado de tasaciones. Necesito tasar uno o varios inmuebles de una sucesión. Cuántos son y dónde quedan: ___',
    venta: 'Hola, vi los tipos de tasación y quiero tasar para vender con un corredor de ustedes, con exclusividad. Tipo de inmueble: ___',
    consulta: 'Hola, estoy en la página de tipos de tasación y no sé cuál me corresponde. Mi caso es: ___',
    footer: 'Hola, vengo del listado de tasaciones del sitio. Quiero saber qué tasación necesito para: ___',
  },
  '/tasaciones/casas/': {
    compraventa: 'Hola, estoy en la página de tasación de casas. Necesito el informe oficial de una casa para una compra o venta. Queda en (barrio y ciudad): ___',
    hipotecaria: 'Hola, vi la página de tasación de casas. El banco me pide la tasación de una casa para un crédito hipotecario. Queda en: ___ y el banco es: ___',
    credito: 'Hola, vengo de la página de casas. Necesito tasar una casa como garantía de un crédito de cooperativa o fiduciario. Queda en: ___',
    sucesion: 'Hola, vengo de la página de casas. Necesito tasar una casa que forma parte de una sucesión. Queda en: ___',
    venta: 'Hola, quiero vender mi casa con un corredor y me interesa la tasación con exclusividad. Queda en: ___',
    consulta: 'Hola, leí la página de tasación de casas y tengo una duda sobre mi casa: ___',
    footer: 'Hola, les escribo desde la página de casas. Quiero consultar por la tasación de una casa en: ___',
  },
  '/tasaciones/departamentos/': {
    compraventa: 'Hola, estoy en la página de departamentos. Necesito el informe oficial de un departamento para una compra o venta. Edificio y barrio: ___',
    hipotecaria: 'Hola, vi la página de tasación de departamentos. Mi banco pide tasar un departamento para el crédito hipotecario. Edificio y barrio: ___',
    credito: 'Hola, vengo de la página de departamentos. Necesito tasar un departamento para un crédito de cooperativa o fiduciario. Queda en: ___',
    sucesion: 'Hola, vengo de la página de departamentos. Hay un departamento en una sucesión y necesito tasarlo. Queda en: ___',
    venta: 'Hola, quiero vender mi departamento con un corredor de ustedes, con exclusividad, y tasarlo primero. Edificio y barrio: ___',
    consulta: 'Hola, leí la página de tasación de departamentos y tengo una consulta: ___',
    footer: 'Hola, les escribo desde la página de departamentos. Quiero consultar por la tasación de un departamento en: ___',
  },
  '/tasaciones/terrenos/': {
    compraventa: 'Hola, estoy viendo la página de terrenos. Necesito el informe oficial de un terreno para comprar o vender. Está en: ___ y mide aprox.: ___',
    hipotecaria: 'Hola, necesito la tasación de un terreno para presentar en un crédito hipotecario. El terreno está en: ___',
    credito: 'Hola, vengo de la página de terrenos. Quiero tasar un lote para usarlo como garantía de un crédito de cooperativa o fiduciario. Está en: ___',
    sucesion: 'Hola, vengo de la página de terrenos. Tenemos un terreno en una sucesión y necesitamos la tasación. Está en: ___',
    venta: 'Hola, quiero vender un terreno con un corredor, con exclusividad, y saber cuánto vale. Está en: ___',
    consulta: 'Hola, estoy en la página de tasación de terrenos y tengo una pregunta sobre mi lote: ___',
    footer: 'Hola, les escribo desde la página de terrenos. Quiero consultar por la tasación de un terreno en: ___',
  },
  '/tasaciones/corporativa/': {
    compraventa: 'Hola, vengo de la página de tasación corporativa. Mi empresa necesita el informe oficial de un inmueble para comprarlo o venderlo. El inmueble es: ___',
    hipotecaria: 'Hola, vi la página corporativa. La empresa necesita tasar un inmueble para un crédito hipotecario. El inmueble y el banco: ___',
    credito: 'Hola, vengo de la página corporativa. La empresa necesita tasar un inmueble como garantía de un crédito que no es hipotecario. El inmueble es: ___',
    sucesion: 'Hola, vengo de la página corporativa. Necesitamos tasar un inmueble de la empresa para un proceso judicial o una sucesión. El caso es: ___',
    venta: 'Hola, desde la página corporativa: la empresa quiere vender un inmueble con un corredor, con exclusividad. El inmueble es: ___',
    empresa: 'Hola, vengo de la página de tasación corporativa y necesito tasar activos inmobiliarios de mi empresa. Los activos son: ___',
    footer: 'Hola, les escribo desde la página corporativa. Mi empresa quiere consultar por una tasación de: ___',
  },
  '/tasaciones/hipotecaria/': {
    compraventa: 'Hola, estoy en la página de tasación hipotecaria, pero lo que necesito es el informe oficial para una compra o venta. El inmueble queda en: ___',
    hipotecaria: 'Hola, vengo de la página de tasación hipotecaria. Estoy tramitando un crédito hipotecario y necesito la tasación. El banco es: ___ y el inmueble queda en: ___',
    credito: 'Hola, vi la página de tasación hipotecaria. Mi crédito es fiduciario o de cooperativa, no hipotecario. La entidad es: ___',
    sucesion: 'Hola, vengo de la página hipotecaria. Necesito tasar un inmueble de una sucesión que tiene una hipoteca. Queda en: ___',
    venta: 'Hola, vi la página hipotecaria. Quiero vender un inmueble que todavía tiene hipoteca, con un corredor y exclusividad. Queda en: ___',
    consulta: 'Hola, leí la página de tasación hipotecaria y tengo una duda sobre el trámite con el banco: ___',
    footer: 'Hola, les escribo desde la página hipotecaria. Quiero consultar por una tasación para el banco: ___',
  },
  '/tasaciones/locales-comerciales/': {
    compraventa: 'Hola, estoy en la página de locales comerciales. Necesito el informe oficial de un local para una compra o venta. Queda en: ___',
    hipotecaria: 'Hola, vi la página de locales comerciales. El banco me pide tasar un local para un crédito hipotecario. Queda en: ___',
    credito: 'Hola, vengo de la página de locales. Necesito tasar un local comercial para un crédito de cooperativa o fiduciario. Queda en: ___',
    sucesion: 'Hola, vengo de la página de locales comerciales. Hay un local en una sucesión y necesitamos su tasación. Queda en: ___',
    venta: 'Hola, quiero vender un local comercial con un corredor, con exclusividad, y tasarlo antes. Queda en: ___',
    consulta: 'Hola, leí la página de tasación de locales comerciales y tengo una consulta: ___',
    footer: 'Hola, les escribo desde la página de locales. Quiero consultar por la tasación de un local en: ___',
  },
  '/tasaciones/campos/': {
    compraventa: 'Hola, estoy en la página de campos. Necesito el informe oficial de un campo o estancia para comprar o vender. Departamento y superficie aprox.: ___',
    hipotecaria: 'Hola, vi la página de campos. Necesito tasar un inmueble rural para un crédito hipotecario. Departamento y banco: ___',
    credito: 'Hola, vengo de la página de campos. Necesito tasar un campo como garantía de un crédito agrícola, de cooperativa o fiduciario. Queda en: ___',
    sucesion: 'Hola, vengo de la página de campos. Tenemos un campo en una sucesión y necesitamos la tasación. Queda en el departamento de: ___',
    venta: 'Hola, quiero vender un campo con un corredor, con exclusividad, y saber cuánto vale. Departamento: ___',
    consulta: 'Hola, leí la página de tasación de campos y tengo una pregunta sobre mi inmueble rural: ___',
    footer: 'Hola, les escribo desde la página de campos. Quiero consultar por la tasación de un campo en: ___',
  },
  '/tasaciones/franja-de-dominio/': {
    compraventa: 'Hola, vi la página de franja de dominio, pero necesito el informe oficial de un inmueble para una compra o venta. Queda en: ___',
    hipotecaria: 'Hola, vengo de la página de franja de dominio. Necesito tasar para un crédito hipotecario un inmueble cercano a una ruta. Queda en: ___',
    credito: 'Hola, vengo de la página de franja de dominio. Necesito tasar un inmueble para un crédito que no es hipotecario. Queda en: ___',
    sucesion: 'Hola, vengo de la página de franja de dominio. Hay un inmueble afectado por una obra vial dentro de una sucesión. Queda en: ___',
    venta: 'Hola, vi la página de franja de dominio. Quiero vender con un corredor, con exclusividad, un inmueble sobre una ruta. Queda en: ___',
    franja: 'Hola, vengo de la página de franja de dominio. Necesitamos relevamiento y avaluación para un proyecto vial. Cantidad aproximada de lotes afectados: ___ y zona: ___',
    footer: 'Hola, les escribo desde la página de franja de dominio. Quiero consultar por un relevamiento en la zona de: ___',
  },
  '/valuacion-para-vender/': {
    compraventa: 'Hola, estoy en la página de tasación para vender, pero necesito el informe oficial con firma para una compra o venta. El inmueble queda en: ___',
    hipotecaria: 'Hola, vi la página para vender. El comprador va a pedir un crédito hipotecario y necesita la tasación para el banco. El inmueble queda en: ___',
    credito: 'Hola, vengo de la página para vender. Necesito tasar mi inmueble para un crédito de cooperativa o fiduciario. Queda en: ___',
    sucesion: 'Hola, vengo de la página para vender. Queremos vender un inmueble de una sucesión y primero hay que tasarlo. Queda en: ___',
    venta: 'Hola, vengo de la página de tasación para vender. Quiero vender mi inmueble con un corredor de ustedes, con exclusividad, y saber cuánto vale. Tipo de inmueble y zona: ___',
    consulta: 'Hola, leí cómo funciona la tasación para vender y tengo una duda sobre la exclusividad: ___',
    footer: 'Hola, les escribo desde la página para vender. Quiero saber cuánto vale mi inmueble en: ___',
  },
  '/informes-periciales/': {
    compraventa: 'Hola, estoy en la página de informes periciales. Necesito un informe oficial firmado para una compra o venta. El inmueble es (tipo y zona): ___',
    hipotecaria: 'Hola, vi la página de informes periciales. Necesito el informe para el banco por un crédito hipotecario. Banco y zona del inmueble: ___',
    credito: 'Hola, vengo de informes periciales. Necesito un informe para un crédito de cooperativa o fiduciario. La entidad es: ___',
    sucesion: 'Hola, vengo de la página de informes periciales. Necesito un informe pericial para una sucesión o un juicio. Juzgado o etapa del proceso: ___',
    venta: 'Hola, leí sobre los informes periciales, pero solo quiero vender con un corredor, con exclusividad. El inmueble queda en: ___',
    consulta: 'Hola, estoy en la página de informes periciales y quiero saber qué incluye el informe para mi caso: ___',
    footer: 'Hola, les escribo desde la página de informes periciales. Necesito un informe firmado para: ___',
  },
  '/nosotros/': {
    compraventa: 'Hola, leí sobre el tasador en la página Nosotros. Necesito su informe oficial para una compra o venta. El inmueble queda en: ___',
    hipotecaria: 'Hola, vengo de la página Nosotros. Necesito una tasación para un crédito hipotecario. El banco es: ___',
    credito: 'Hola, vengo de la página Nosotros. Necesito una tasación para un crédito de cooperativa o fiduciario. La entidad es: ___',
    sucesion: 'Hola, vi en Nosotros que el tasador es perito matriculado ante la Corte. Necesito una tasación para una sucesión o un juicio: ___',
    venta: 'Hola, vengo de la página Nosotros. Quiero vender un inmueble con un corredor de ustedes, con exclusividad. Queda en: ___',
    consulta: 'Hola, leí la página Nosotros y quiero consultar algo sobre el trabajo del tasador: ___',
    footer: 'Hola, les escribo después de leer la página Nosotros. Quiero consultar por una tasación de: ___',
  },
  '/preguntas-frecuentes/': {
    compraventa: 'Hola, leí las preguntas frecuentes y ya sé que necesito el informe oficial para una compra o venta. El inmueble queda en: ___',
    hipotecaria: 'Hola, vengo de las preguntas frecuentes. Necesito una tasación para mi crédito hipotecario. El banco es: ___',
    credito: 'Hola, en las preguntas frecuentes no encontré mi caso: necesito tasar para un crédito de cooperativa o fiduciario. La entidad es: ___',
    sucesion: 'Hola, vengo de las preguntas frecuentes. Necesito una tasación para una sucesión o un juicio. El inmueble queda en: ___',
    venta: 'Hola, leí en las preguntas frecuentes cómo funciona la tasación con exclusividad y quiero vender mi inmueble. Queda en: ___',
    consulta: 'Hola, leí las preguntas frecuentes y me quedó una duda: ___',
    footer: 'Hola, les escribo desde las preguntas frecuentes. Mi pregunta es: ___',
  },
  '/contacto/': {
    compraventa: 'Hola, estoy en la página de contacto. Prefiero escribir por acá: necesito el informe oficial para una compra o venta. El inmueble queda en: ___',
    hipotecaria: 'Hola, vengo de la página de contacto. Necesito una tasación para un crédito hipotecario. Banco y zona del inmueble: ___',
    credito: 'Hola, vengo de la página de contacto. Necesito una tasación para un crédito de cooperativa o fiduciario. La entidad es: ___',
    sucesion: 'Hola, vengo de la página de contacto. Necesito una tasación para una sucesión o un juicio. El inmueble queda en: ___',
    venta: 'Hola, vengo de la página de contacto. Quiero vender con un corredor de ustedes, con exclusividad, y tasar antes. Queda en: ___',
    consulta: 'Hola, estoy en la página de contacto y prefiero consultar por WhatsApp. Mi consulta es: ___',
    footer: 'Hola, les escribo desde el pie de la página de contacto. Quiero hablar con alguien sobre: ___',
    error: 'Hola, intenté enviar el formulario de contacto y no funcionó. Quiero pedir una tasación para: ___',
  },
  '/privacidad/': {
    compraventa: 'Hola, estaba leyendo el aviso de privacidad. Necesito el informe oficial para una compra o venta. El inmueble queda en: ___',
    hipotecaria: 'Hola, vengo del aviso de privacidad. Necesito una tasación para un crédito hipotecario. El banco es: ___',
    credito: 'Hola, vengo del aviso de privacidad. Necesito una tasación para un crédito de cooperativa o fiduciario: ___',
    sucesion: 'Hola, vengo del aviso de privacidad. Necesito una tasación para una sucesión o un juicio: ___',
    venta: 'Hola, vengo del aviso de privacidad. Quiero vender con un corredor, con exclusividad: ___',
    consulta: 'Hola, leí el aviso de privacidad y tengo una pregunta sobre mis datos: ___',
    datos: 'Hola, quiero pedir que eliminen los datos que envié por el formulario. Mi nombre y el número desde el que escribí: ___',
    footer: 'Hola, les escribo desde el aviso de privacidad. Quiero consultar: ___',
  },
  '404.html': {
    compraventa: 'Hola, llegué a una página que no existe en su sitio. Busco el informe oficial para una compra o venta. El inmueble queda en: ___',
    hipotecaria: 'Hola, no encontré la página que buscaba. Necesito una tasación para un crédito hipotecario. El banco es: ___',
    credito: 'Hola, una página del sitio no cargó. Busco una tasación para un crédito de cooperativa o fiduciario: ___',
    sucesion: 'Hola, no encontré la página que buscaba. Necesito una tasación para una sucesión o un juicio: ___',
    venta: 'Hola, no encontré la página que buscaba. Quiero vender un inmueble con un corredor, con exclusividad: ___',
    consulta: 'Hola, llegué a una página que no existe en Tasación.com.py. Estaba buscando: ___',
    footer: 'Hola, les escribo desde una página que no se encontró. Busco información sobre: ___',
  },
  // gracias.html: el cliente ya mandó el formulario; estos mensajes lo adelantan por WhatsApp.
  // Cubre las 8 finalidades porque gracias.html?p=<finalidad> muestra la que eligió.
  'gracias.html': {
    compraventa: 'Hola, recién envié el formulario pidiendo el informe oficial para una compra o venta. Quiero adelantarlo por acá. Mi nombre: ___',
    hipotecaria: 'Hola, acabo de mandar el formulario por la tasación para mi crédito hipotecario. Les adelanto el banco: ___',
    credito: 'Hola, envié el formulario por una tasación para un crédito de cooperativa o fiduciario. Les adelanto la entidad: ___',
    sucesion: 'Hola, recién completé el formulario por la tasación para una sucesión o un juicio. Les adelanto el caso: ___',
    venta: 'Hola, envié el formulario porque quiero vender con un corredor, con exclusividad. Les adelanto la zona: ___',
    empresa: 'Hola, completé el formulario por la tasación de activos de mi empresa. Les adelanto qué activos son: ___',
    franja: 'Hola, envié el formulario por un relevamiento en franja de dominio. Les adelanto el proyecto: ___',
    consulta: 'Hola, acabo de enviar una consulta por el formulario y quiero seguir por WhatsApp. Mi nombre: ___',
    footer: 'Hola, ya envié el formulario del sitio y les escribo para confirmar que llegó. Mi nombre: ___',
  },
};

export const waHref = (text) => `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;

// Mensaje de una página para una finalidad. Falla en el build si falta: nada de links vacíos.
export function waText(slug, key) {
  const t = MESSAGES[slug] && MESSAGES[slug][key];
  if (!t) throw new Error(`wa-messages: falta MESSAGES['${slug}'].${key}`);
  return t;
}
export const waLink = (slug, key) => waHref(waText(slug, key));
