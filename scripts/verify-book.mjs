import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import YAML from 'yaml';

const root = process.cwd();
const required = ['myst.yml', 'index.md', '.github/workflows/ci.yml', '.github/workflows/deploy.yml', 'pwa/service-worker.js'];
const missing = required.filter((file) => !fs.existsSync(path.join(root, file)));
if (missing.length) throw new Error(`Missing required files: ${missing.join(', ')}`);

const config = YAML.parse(fs.readFileSync(path.join(root, 'myst.yml'), 'utf8'));
const errors = [];
if (!config.project?.title) errors.push('project.title is required');
if (!config.project?.short_title) errors.push('project.short_title is required');
if (config.project?.open_access !== true) errors.push('project.open_access must be true');
if (!config.project?.github) errors.push('project.github is required');
if (!Array.isArray(config.project?.toc) || !config.project.toc.length) errors.push('project.toc must contain at least one page');

function tocFiles(entries = []) {
  return entries.flatMap((entry) => [entry.file, ...tocFiles(entry.children)].filter(Boolean));
}

const pages = tocFiles(config.project?.toc);
for (const file of pages) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Table-of-contents page does not exist: ${file}`);
}

const importedPages = pages.filter((file) => file.startsWith('chapters/') || file === 'front/introduction.md');
if (importedPages.length !== 47) errors.push(`Expected 47 imported CNX pages; found ${importedPages.length}`);

const sourceModules = new Set();
for (const file of importedPages) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  const source = content.match(/\/modules\/(m\d+)\/index\.cnxml"$/m)?.[1];
  if (!source) errors.push(`Missing CNX source module metadata: ${file}`);
  else if (sourceModules.has(source)) errors.push(`Duplicate CNX source module ${source}: ${file}`);
  else sourceModules.add(source);
  if (!/^license: CC-BY-2\.0$/m.test(content)) errors.push(`Missing content license metadata: ${file}`);
  if (/\.xhtml(?:[#)\s]|$)|(?:\(|["'])resources\//.test(content)) {
    errors.push(`Unconverted EPUB link remains in ${file}`);
  }
  if (/\[missing_resource:/.test(content)) errors.push(`Unresolved CNX media placeholder remains in ${file}`);
  if (/^\[\]\{#[^}]+\}$/m.test(content)) errors.push(`Visible empty anchor remains in ${file}`);
  if (/<img\b/i.test(content)) errors.push(`Raw HTML image remains in ${file}`);
}

for (const file of [...pages, 'README.md', 'SOURCES.md']) {
  const absolute = path.join(root, file);
  const content = fs.readFileSync(absolute, 'utf8');
  const targets = [
    ...content.matchAll(/\]\(([^)]+)\)/g),
    ...content.matchAll(/(?:href|src)="([^"]+)"/g),
  ].map((match) => match[1].replace(/^<|>$/g, '').split(/[?#]/, 1)[0]);
  for (const target of targets) {
    if (!target || /^(?:https?:|mailto:|data:|\/)/.test(target)) continue;
    let decoded = target;
    try { decoded = decodeURIComponent(target); } catch { /* Report the original path below. */ }
    const destination = path.resolve(path.dirname(absolute), decoded);
    if (!fs.existsSync(destination)) errors.push(`Broken local link in ${file}: ${target}`);
  }
}

const collectionFile = path.join(root, 'schmidt-jones-sources', 'cnxbook-understanding-basic-music-theory', 'collections', 'understanding-basic-music-theory.collection.xml');
if (fs.existsSync(collectionFile)) {
  const sourceCollection = fs.readFileSync(collectionFile, 'utf8');
  const expectedModules = [...sourceCollection.matchAll(/<col:module document="(m\d+)"\s*\/>/g)].map((match) => match[1]);
  for (const module of expectedModules) {
    if (!sourceModules.has(module)) errors.push(`CNX collection module is absent from the book: ${module}`);
  }
}

for (const file of ['SOURCES.md', 'LICENSE-CONTENT.md', 'images/logo.svg', 'images/logo-dark.svg', 'images/favicon.svg']) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing book asset: ${file}`);
}

for (const file of ['myst.yml', 'index.md', 'README.md', 'SOURCES.md']) {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  if (/Your Book Title|YOUR-ACCOUNT|Replace this page/.test(content)) errors.push(`Template placeholder remains in ${file}`);
}

if (errors.length) throw new Error(errors.join('\n'));

console.log(`Book structure is valid: ${pages.length} pages and ${sourceModules.size} attributed CNX modules.`);
