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
- `schmidt-jones-sources/` — versioned upstream CNX books and EPUB/PDF exports
- `scripts/import-cnx.py` — reproducible CNX-to-MyST importer
- `myst.yml` — metadata, navigation, and theme configuration

## Refresh from the source

After updating the source submodules and EPUB export, run:

```bash
npm run import:cnx
```

The importer requires Python 3 and Pandoc. See [SOURCES.md](SOURCES.md) for
attribution, exact source revisions, licenses, and conversion notes.
