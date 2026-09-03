// build-images.mjs — genera AVIF + WebP en 640/1280/1920 dentro de assets/img
// con nombres de archivo orientados a SEO. Ejecutar: node build-images.mjs
//
// Fuentes de personas (new-img/) son cuadradas: al recortar a formatos anchos se
// usa `top` para no cortar cabezas. Las fotos de inmueble usan `attention`.
import sharp from 'sharp';
import { mkdir, readdir, readFile, stat, writeFile, access } from 'node:fs/promises';
import path from 'node:path';

const OUT = 'assets/img';
const WIDTHS = [640, 1280, 1920];

const JOBS = [
  // ---- personas (nuevas) -------------------------------------------------
  { src: 'new-img/n2.png', name: 'tasacion-de-inmuebles-asuncion',      ar: [3, 2],  pos: 'top',       q: { avif: 46, webp: 68 } },
  { src: 'new-img/n8.png', name: 'tasador-de-terrenos-gran-asuncion',   ar: [21, 9], pos: 'top',       q: { avif: 44, webp: 66 } },
  { src: 'new-img/n7.png', name: 'informe-de-tasacion-linderos-paraguay', ar: [4, 3], pos: 'top',      q: { avif: 46, webp: 70 } },
  { src: 'new-img/n1.png', name: 'tasador-midiendo-propiedad-asuncion',   ar: [21, 9], pos: 'top',      q: { avif: 44, webp: 66 } },
  // ---- inmuebles (originales) --------------------------------------------
  { src: 'src-img/03.png', name: 'tasacion-casas-departamentos-asuncion', ar: [4, 3], pos: 'attention', q: { avif: 46, webp: 70 } },
  { src: 'src-img/04.png', name: 'tasacion-terrenos-paraguay',            ar: [4, 3], pos: 'attention', q: { avif: 46, webp: 70 } },
  { src: 'src-img/05.png', name: 'tasacion-locales-comerciales-asuncion', ar: [4, 3], pos: 'attention', q: { avif: 46, webp: 70 } },
  // ---- section-break por zona (PLACEHOLDERS §10.10) -----------------------
  // Generadas 2026-08-22 con Higgsfield (seedream_v5_pro, 21:9, 2K), mismo
  // estilo documental que el resto: luz difusa, paleta cálida apagada, sin
  // personas, sin carteles legibles. Ninguna es un trabajo propio.
  { src: 'zone-img/luque.png',                name: 'tasacion-de-inmuebles-luque',                ar: [21, 9], pos: 'attention', q: { avif: 44, webp: 66 } },
  { src: 'zone-img/san-lorenzo.png',          name: 'tasacion-de-inmuebles-san-lorenzo',          ar: [21, 9], pos: 'attention', q: { avif: 44, webp: 66 } },
  { src: 'zone-img/fernando-de-la-mora.png',  name: 'tasacion-de-inmuebles-fernando-de-la-mora',  ar: [21, 9], pos: 'attention', q: { avif: 44, webp: 66 } },
];

// Las carpetas de fuentes (`src-img/`, `new-img/`, `zone-img/`) están fuera de
// git. Un job sin fuente se saltea en vez de romper el build: así se puede
// re-generar un solo motivo sin tener todos los PNG originales al lado.
const exists = async (f) => access(f).then(() => true, () => false);

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  if (!(await exists(job.src))) {
    console.log(`skip  ${job.name}  (falta ${job.src})`);
    continue;
  }
  for (const w of WIDTHS) {
    const h = Math.round((w * job.ar[1]) / job.ar[0]);
    const base = sharp(job.src).resize(w, h, { fit: 'cover', position: job.pos });
    await base.clone().avif({ quality: job.q.avif, effort: 6 }).toFile(path.join(OUT, `${job.name}-${w}.avif`));
    await base.clone().webp({ quality: job.q.webp, effort: 6 }).toFile(path.join(OUT, `${job.name}-${w}.webp`));
    console.log(`${job.name}-${w}  ${w}x${h}`);
  }
}

// Social preview: formato universalmente decodificable.
if (await exists('new-img/n8.png')) {
  await sharp('new-img/n8.png')
    .resize(1200, 630, { fit: 'cover', position: 'top' })
    .jpeg({ quality: 78, mozjpeg: true })
    .toFile(path.join(OUT, 'og-tasacion-com-py.jpg'));
} else {
  console.log('skip  og-tasacion-com-py.jpg  (falta new-img/n8.png)');
}

// ---- cableado de las tres paginas de zona (PLACEHOLDERS §10.10) ----------
// Hasta que existan los motivos propios de cada zona, esas tres paginas
// reutilizan imagenes genericas de terrenos/casas/locales. Cuando el job de
// arriba genero el asset de la zona, este paso reapunta el `<picture>` y
// corrige el `alt` para que describa lo que realmente se ve. Es idempotente:
// si ya esta cableado no encuentra nada que reemplazar.
const WIRING = [
  {
    page: 'zonas/luque/index.html',
    from: 'tasador-de-terrenos-gran-asuncion',
    to:   'tasacion-de-inmuebles-luque',
    altFrom: 'Terreno en un loteamiento del Gran Asunción, con la calle sin asfaltar al frente',
    altTo:   'Terreno sin construir en un loteamiento de Luque, con la calle de tierra al frente',
  },
  {
    page: 'zonas/san-lorenzo/index.html',
    from: 'tasacion-casas-departamentos-asuncion',
    to:   'tasacion-de-inmuebles-san-lorenzo',
    altFrom: 'Vivienda familiar en una calle residencial de San Lorenzo',
    altTo:   'Casas familiares de una planta en una calle residencial de San Lorenzo',
  },
  {
    page: 'zonas/fernando-de-la-mora/index.html',
    from: 'tasacion-locales-comerciales-asuncion',
    to:   'tasacion-de-inmuebles-fernando-de-la-mora',
    altFrom: 'Local comercial sobre una avenida de Fernando de la Mora',
    altTo:   'Local comercial en planta baja sobre una avenida de Fernando de la Mora',
  },
];

for (const w of WIRING) {
  const ready = (await Promise.all(
    WIDTHS.flatMap((px) => [`${w.to}-${px}.avif`, `${w.to}-${px}.webp`])
      .map((f) => exists(path.join(OUT, f)))
  )).every(Boolean);
  if (!ready) { console.log(`wire  ${w.page}  pendiente (falta ${w.to})`); continue; }

  const html = await readFile(w.page, 'utf8');
  const next = html
    .replaceAll(`/assets/img/${w.from}-`, `/assets/img/${w.to}-`)
    .replace(w.altFrom, w.altTo);
  if (next === html) { console.log(`wire  ${w.page}  ya cableado`); continue; }
  await writeFile(w.page, next);
  console.log(`wire  ${w.page}  -> ${w.to}`);
}

const files = (await readdir(OUT)).sort();
let total = 0;
for (const f of files) {
  const { size } = await stat(path.join(OUT, f));
  total += size;
  console.log(String(Math.round(size / 1024)).padStart(6) + ' KB  ' + f);
}
console.log(`\nassets/img total: ${Math.round(total / 1024)} KB across ${files.length} files`);
