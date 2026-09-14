import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const cnxDirectory = path.join(root, 'images', 'cnx');
const manifestPath = path.join(root, 'notation', 'manifest.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const raster = fs.readdirSync(cnxDirectory).filter((file) => /\.(?:png|jpe?g)$/i.test(file)).sort();
const existing = manifest.figures ?? {};
const figures = Object.fromEntries(raster.map((file) => [file, existing[file] ?? { status: 'unclassified' }]));
for (const file of Object.keys(existing)) if (!raster.includes(file)) throw new Error(`Manifest references a missing raster: ${file}`);
const report = { ...manifest, generatedAt: null, figures };
if (process.argv.includes('--write')) fs.writeFileSync(manifestPath, `${JSON.stringify(report, null, 2)}\n`);
const counts = Object.values(figures).reduce((all, figure) => {
  all[figure.status] = (all[figure.status] ?? 0) + 1;
  return all;
}, {});
console.log(`Audited ${raster.length} raster figures: ${Object.entries(counts).map(([status, count]) => `${status}=${count}`).join(', ')}`);
