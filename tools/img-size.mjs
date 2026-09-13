// node tools/img-size.mjs <file>  -> prints width, format, bytes
import sharp from 'sharp';
import { statSync } from 'node:fs';
const f = process.argv[2];
const m = await sharp(f).metadata();
console.log(m.width, m.format, statSync(f).size);
