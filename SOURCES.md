# Sources and attribution

## Primary works

This MyST edition adapts two openly licensed CNX books by Catherine
Schmidt-Jones:

- *Understanding Basic Music Theory*, CNX collection `col10363`, source commit
  `d748840fe868c82b529005c2b16748fe1471108c`, licensed under the
  [Creative Commons Attribution 2.0 Generic license](https://creativecommons.org/licenses/by/2.0/).
  The versioned source is preserved in
  `schmidt-jones-sources/cnxbook-understanding-basic-music-theory` and is also
  available from the [upstream repository](https://github.com/cnx-user-books/cnxbook-understanding-basic-music-theory).
- *Introduction to Music Theory*, CNX collection `col10208`, source commit
  `eeaa6b14bed96b433599fe95289e5dad3bbc92f4`, licensed under the
  [Creative Commons Attribution 1.0 Generic license](https://creativecommons.org/licenses/by/1.0/).
  The versioned source is preserved in
  `schmidt-jones-sources/cnxbook-introduction-to-music-theory` and is also
  available from the [upstream repository](https://github.com/cnx-user-books/cnxbook-introduction-to-music-theory).

The expanded *Understanding Basic Music Theory* collection supplies the lesson
sequence and the converted text in this edition. The earlier *Introduction to
Music Theory* contains the core pitch, scale, interval, and harmony lessons from
which the expanded collection developed.

## Changes in this edition

QuadriviumPress converted the January 2023 CNX/EPUB snapshot into MyST
Markdown, organized its modules into seven web-book parts, repaired internal
module links, and normalized headings, exercises, examples, and media paths.
The wording of the imported lessons is otherwise retained. The landing page,
navigation, styling, build configuration, PWA support, and import tooling are
new to this edition.

Each generated lesson records its original CNX module identifier and UUID in
its front matter. The reproducible conversion is implemented by
`scripts/import-cnx.py` and `scripts/cnx-to-myst.lua`.

## Figures and listening examples

Files in `images/cnx/` are extracted from the supplied *Understanding Basic
Music Theory* EPUB. They accompany the lesson in which the source edition
placed them and are covered by the source work’s CC BY 2.0 license unless the
original lesson states otherwise. Legacy MIDI and audio files are retained as
downloads so that the musical examples remain available.

## Software and template

The book infrastructure derives from the QuadriviumPress Opinionated MyST
Markdown Book Template and is licensed under the MIT License in `LICENSE`.
Textbook content is licensed separately as described in `LICENSE-CONTENT.md`.

