// build-images.mjs — genera AVIF + WebP en 640/1280/1920 dentro de assets/img
// con nombres de archivo orientados a SEO. Ejecutar: node build-images.mjs
//
// Fuentes de personas (new-img/) son cuadradas: al recortar a formatos anchos se
// usa `top` para no cortar cabezas. Las fotos de inmueble usan `attention`.
import sharp from 'sharp';
import { mkdir, readdir, stat } from 'node:fs/promises';
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
];

await mkdir(OUT, { recursive: true });

for (const job of JOBS) {
  for (const w of WIDTHS) {
    const h = Math.round((w * job.ar[1]) / job.ar[0]);
    const base = sharp(job.src).resize(w, h, { fit: 'cover', position: job.pos });
    await base.clone().avif({ quality: job.q.avif, effort: 6 }).toFile(path.join(OUT, `${job.name}-${w}.avif`));
    await base.clone().webp({ quality: job.q.webp, effort: 6 }).toFile(path.join(OUT, `${job.name}-${w}.webp`));
    console.log(`${job.name}-${w}  ${w}x${h}`);
  }
}

// Social preview: formato universalmente decodificable.
await sharp('new-img/n8.png')
  .resize(1200, 630, { fit: 'cover', position: 'top' })
  .jpeg({ quality: 78, mozjpeg: true })
  .toFile(path.join(OUT, 'og-tasacion-com-py.jpg'));

const files = (await readdir(OUT)).sort();
let total = 0;
for (const f of files) {
  const { size } = await stat(path.join(OUT, f));
  total += size;
  console.log(String(Math.round(size / 1024)).padStart(6) + ' KB  ' + f);
}
console.log(`\nassets/img total: ${Math.round(total / 1024)} KB across ${files.length} files`);
