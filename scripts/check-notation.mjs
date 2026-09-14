import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'notation', 'manifest.json'), 'utf8'));
const errors = [];
const bookText = fs.readdirSync(path.join(root, 'chapters'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => fs.readFileSync(path.join(root, 'chapters', file), 'utf8'))
  .join('\n');
for (const [source, figure] of Object.entries(manifest.figures)) {
  if (figure.status === 'unclassified') continue;
  if (!['vexflow', 'vexflow-overlay', 'svg-overlay', 'retain', 'already-vector'].includes(figure.status)) errors.push(`${source}: invalid status ${figure.status}`);
  if (['vexflow', 'vexflow-overlay', 'svg-overlay'].includes(figure.status)) {
    if (!figure.definition || !figure.output) errors.push(`${source}: VexFlow figure needs definition and output`);
    else {
      if (!fs.existsSync(path.join(root, figure.output))) errors.push(`${source}: generated SVG is missing`);
      if (bookText.includes(`images/cnx/${source}`)) errors.push(`${source}: chapter still references the raster source`);
      if (!bookText.includes(figure.output.replace(/^images\//, 'images/'))) errors.push(`${source}: chapter does not reference ${figure.output}`);
    }
  }
}
for (const file of fs.readdirSync(path.join(root, 'images', 'notation'), { withFileTypes: true }).filter((entry) => entry.isFile() && entry.name.endsWith('.svg'))) {
  const svg = fs.readFileSync(path.join(root, 'images', 'notation', file.name), 'utf8');
  if (!/<svg\b/.test(svg) || !/viewBox=/.test(svg)) errors.push(`${file.name}: SVG needs an svg root and viewBox`);
  if (!/<svg\b[^>]*xmlns="http:\/\/www\.w3\.org\/2000\/svg"/.test(svg)) errors.push(`${file.name}: SVG needs the SVG XML namespace`);
  if (/<image\b|(?:href|src)=["']https?:\/\//.test(svg)) errors.push(`${file.name}: SVG must not embed raster or external content`);
  if (!/@font-face\{font-family:Bravura;src:url\(data:font\/woff2/.test(svg)) errors.push(`${file.name}: SVG must embed the notation font`);
}
if (errors.length) throw new Error(errors.join('\n'));
console.log(`Notation assets are valid; ${Object.keys(manifest.figures).length} raster figures are tracked.`);
