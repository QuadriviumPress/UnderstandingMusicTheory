# Understanding Music Theory

A web-native MyST edition of Catherine Schmidt-Jones’s openly licensed CNX
music-theory books. The site combines 47 source modules, hundreds of notation
figures and listening examples, responsive book styling, GitHub Pages
deployment, and offline support.

## Develop locally

```bash
npm install
npm run start
```

Run `npm run verify` to validate the project structure and local links,
`npm test` for a strict MyST render, and `npm run build` to write the production
site to `_build/html`.

## Project layout

- `chapters/` and `front/` — generated, editable MyST lessons
- `images/cnx/` — figures and listening files used by the lessons
- `notation/` — VexFlow 5 figure definitions and migration manifest
- `schmidt-jones-sources/` — versioned upstream CNX books and EPUB/PDF exports
- `scripts/import-cnx.py` — reproducible CNX-to-MyST importer
- `scripts/render-notation.mjs` — static SVG renderer for notation figures
- `myst.yml` — metadata, navigation, and theme configuration

## Notation SVGs

`npm run notation:audit` inventories each CNX raster figure in
`notation/manifest.json`. Add a definition for every notation-bearing figure,
then run `npm run notation:render` to generate its self-contained SVG in
`images/notation/`. `npm run notation:check` validates the migration data and
generated assets before the book build.

## Refresh from the source

After updating the source submodules and EPUB export, run:

```bash
npm run import:cnx
```

The importer requires Python 3 and Pandoc. See [SOURCES.md](SOURCES.md) for
attribution, exact source revisions, licenses, and conversion notes.
