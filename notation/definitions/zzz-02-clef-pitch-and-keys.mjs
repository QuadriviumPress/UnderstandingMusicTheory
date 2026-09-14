import { drawKeyboard, drawStave, labelUnder } from '../figure-helpers.mjs';

function renderClefWorksheet({ VF, context, overlay }, answerClef) {
  overlay.text('Clef Practice', 490, 36, { 'font-size': 23, 'font-weight': '700', 'text-anchor': 'middle' });
  overlay.text('Practice writing a clef, naming lines and spaces, and identifying ledger-line notes.', 490, 68, { 'font-size': 16, 'text-anchor': 'middle' });
  for (let index = 0; index < 7; index += 1) drawStave(VF, context, { x: 45 + index * 128, y: 80, width: 115, clef: answerClef ?? null });
  drawStave(VF, context, { x: 55, y: 225, width: 390, clef: null });
  drawStave(VF, context, { x: 535, y: 225, width: 390, clef: null });
  overlay.text('Name the five lines', 250, 215, { 'font-size': 16, 'text-anchor': 'middle' });
  overlay.text('Name the four spaces', 730, 215, { 'font-size': 16, 'text-anchor': 'middle' });
  drawStave(VF, context, { x: 80, y: 390, width: 800, clef: answerClef ?? null, notes: ['c/4', 'e/4', 'g/4', 'b/4', 'd/5', 'f/5', 'a/5'].map((key) => ({ key, duration: 'w' })), formatWidth: 650 });
  overlay.text('Name these notes', 490, 375, { 'font-size': 16, 'text-anchor': 'middle' });
  drawStave(VF, context, { x: 80, y: 555, width: 800, clef: answerClef ?? null, notes: ['b/3', 'd/4', 'f/4', 'a/4', 'c/5', 'e/5', 'g/5'].map((key) => ({ key, duration: 'w' })), formatWidth: 650 });
  overlay.text('Write a note in the named space or line', 490, 540, { 'font-size': 16, 'text-anchor': 'middle' });
  labelUnder(overlay, ['C', 'G', 'F', 'D', 'E', 'A', 'B'], 180, 100, 690, { 'font-weight': '700' });
  if (answerClef) {
    const lineNames = answerClef === 'treble' ? ['E', 'G', 'B', 'D', 'F'] : ['G', 'B', 'D', 'F', 'A'];
    const spaceNames = answerClef === 'treble' ? ['F', 'A', 'C', 'E'] : ['A', 'C', 'E', 'G'];
    labelUnder(overlay, lineNames, 105, 72, 350, { fill: '#c62828', 'font-weight': '700' });
    labelUnder(overlay, spaceNames, 585, 90, 350, { fill: '#c62828', 'font-weight': '700' });
    overlay.text(`${answerClef === 'treble' ? 'Treble' : 'Bass'}-clef answers`, 490, 730, { fill: '#c62828', 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' });
  }
}

export const definitions = [
  {
    id: 'clef-practice-worksheet',
    sources: ['6e59466f91e61d128e62b1b0d8447df01788fb69.png'],
    output: 'clef-practice-worksheet.svg',
    alt: 'A clef worksheet with blank staves for writing clefs, naming lines and spaces, and identifying notes.',
    width: 980,
    height: 760,
    render(args) { renderClefWorksheet(args); },
  },
  {
    id: 'treble-clef-practice-answers',
    sources: ['f24f3bff15f4753276f6263917a6eb58c3924ed2.png'],
    output: 'treble-clef-practice-answers.svg',
    alt: 'Completed clef worksheet showing treble-clef symbols and pitch-name answers.',
    width: 980,
    height: 760,
    render(args) { renderClefWorksheet(args, 'treble'); },
  },
  {
    id: 'bass-clef-practice-answers',
    sources: ['cb8a1669129bb78cc53eb4d1435d1a704d569e88.png'],
    output: 'bass-clef-practice-answers.svg',
    alt: 'Completed clef worksheet showing bass-clef symbols and pitch-name answers.',
    width: 980,
    height: 760,
    render(args) { renderClefWorksheet(args, 'bass'); },
  },
  {
    id: 'piano-natural-notes',
    sources: ['d9bb1aa306154dd4ae19d956f60214da91569c09.png'],
    output: 'piano-natural-notes.svg',
    alt: 'Two octaves of piano keys with the natural notes C D E F G A B labelled on the white keys.',
    width: 760,
    height: 300,
    render({ overlay }) {
      drawKeyboard(overlay, { x: 55, y: 35, whiteWidth: 46, whiteHeight: 220, whiteKeys: 14, labels: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'] });
      overlay.text('Natural notes are the white keys', 380, 288, { 'font-size': 19, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'half-and-whole-steps-keyboard',
    sources: ['45208895ad6be8fb4640e26efd4788b7b8e78f9a.png'],
    output: 'half-and-whole-steps-keyboard.svg',
    alt: 'A piano keyboard showing that E to F is a half step and G to A is a whole step with G-sharp or A-flat between.',
    width: 760,
    height: 390,
    render({ overlay }) {
      drawKeyboard(overlay, { x: 170, y: 25, whiteWidth: 52, whiteHeight: 235, whiteKeys: 7, labels: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], blackLabels: { 4: 'G♯\nA♭' } });
      overlay.line(300, 275, 300, 320, { stroke: '#111', 'stroke-width': 2 });
      overlay.line(352, 275, 352, 320, { stroke: '#111', 'stroke-width': 2 });
      overlay.text('E and F are one half step apart; there is no note between them.', 235, 350, { 'font-size': 16, 'text-anchor': 'middle', 'data-line-height': 20 });
      overlay.line(404, 275, 430, 320, { stroke: '#111', 'stroke-width': 2 });
      overlay.line(456, 275, 482, 320, { stroke: '#111', 'stroke-width': 2 });
      overlay.text('G and A are one whole step apart; G♯ or A♭ lies between.', 540, 350, { 'font-size': 16, 'text-anchor': 'middle', 'data-line-height': 20 });
    },
  },
  {
    id: 'enharmonic-black-key-example',
    sources: ['1cb4dee12c597c2cdb3d2c11db504a01d045ac37.png'],
    output: 'enharmonic-black-key-example.svg',
    alt: 'G-sharp and A-flat, and E-sharp and F-natural, shown as enharmonic notes on a staff and piano keyboard.',
    width: 900,
    height: 510,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 35, width: 810, time: '4/4', notes: [
        { key: 'g/4', duration: 'w', accidental: '#' }, { key: 'a/4', duration: 'w', accidental: 'b' },
        { key: 'e/4', duration: 'w', accidental: '#' }, { key: 'f/4', duration: 'w', accidental: 'n' },
      ], formatWidth: 620 });
      labelUnder(overlay, ['G sharp', '=', 'A flat', 'E sharp', '=', 'F natural'], 190, 105, 185, { fill: '#c62828' });
      drawKeyboard(overlay, { x: 255, y: 235, whiteWidth: 55, whiteHeight: 230, whiteKeys: 7, labels: ['C', 'D', 'E', 'F', 'G', 'A', 'B'], blackLabels: { 4: 'G♯\nA♭' } });
    },
  },
  {
    id: 'double-accidental-equivalence',
    sources: ['fc98d4be7671f4ac93df2eafee35a17db51d68bb.png'],
    output: 'double-accidental-equivalence.svg',
    alt: 'G-double-sharp equals A-natural, and C-double-flat equals B-flat, shown on staff and keyboard.',
    width: 920,
    height: 500,
    render({ VF, context, overlay }) {
      overlay.text('Double Sharp Symbol', 230, 30, { 'font-size': 19, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text('×', 230, 65, { 'font-size': 34, 'text-anchor': 'middle' });
      overlay.text('Double Flat Symbol', 690, 30, { 'font-size': 19, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text('♭♭', 690, 65, { 'font-size': 34, 'text-anchor': 'middle' });
      drawStave(VF, context, { x: 45, y: 75, width: 830, time: '4/4', notes: [
        { key: 'g/4', duration: 'w', accidental: '##' }, { key: 'a/4', duration: 'w', accidental: 'n' },
        { key: 'c/5', duration: 'w', accidental: 'bb' }, { key: 'b/4', duration: 'w', accidental: 'b' },
      ], formatWidth: 630 });
      overlay.text('G double sharp and A natural sound the same', 250, 225, { 'font-size': 16, 'text-anchor': 'middle' });
      overlay.text('C double flat and B flat sound the same', 680, 225, { 'font-size': 16, 'text-anchor': 'middle' });
      drawKeyboard(overlay, { x: 270, y: 270, whiteWidth: 52, whiteHeight: 195, whiteKeys: 7, labels: ['F', 'G', 'A', 'B', 'C', 'D', 'E'], blackLabels: { 1: 'G♯', 3: 'C♭' } });
    },
  },
  {
    id: 'key-signature-naming-rules',
    sources: ['20d859609bbee3a5785ae335555a3c2f7054744b.png'],
    output: 'key-signature-naming-rules.svg',
    alt: 'Treble and bass examples explaining how the final sharp or second-to-last flat identifies a major key.',
    width: 900,
    height: 520,
    render({ VF, context, overlay }) {
      [['treble', 80], ['bass', 300]].forEach(([clef, y]) => {
        drawStave(VF, context, { x: 50, y, width: 370, clef, key: 'D' });
        drawStave(VF, context, { x: 480, y, width: 370, clef, key: 'Ab' });
        overlay.text('Last sharp is C♯; the key is D major', 235, y - 22, { 'font-size': 16, 'text-anchor': 'middle', 'data-line-height': 20 });
        overlay.text('Second-to-last flat is A♭; the key is A♭ major', 665, y - 22, { 'font-size': 16, 'text-anchor': 'middle', 'data-line-height': 20 });
        overlay.line(240, y + 4, 235, y + 45, { stroke: '#111', 'stroke-width': 1.5 });
        overlay.line(675, y + 4, 665, y + 45, { stroke: '#111', 'stroke-width': 1.5 });
      });
    },
  },
  {
    id: 'key-signature-writing-practice',
    sources: ['d64908821c909af8dd493167ab6281e4ae6aa542.png'],
    output: 'key-signature-writing-practice.svg',
    alt: 'Blank treble-clef measures labelled for writing three, four, and five flats and five and seven sharps.',
    width: 980,
    height: 250,
    render({ VF, context, overlay }) {
      ['3 flats', '4 sharps', '5 flats', '5 sharps', '7 sharps'].forEach((label, index) => {
        const x = 25 + index * 190;
        drawStave(VF, context, { x, y: 50, width: 175, clef: index === 0 ? 'treble' : null });
        overlay.text(label, x + 88, 205, { 'font-size': 17, 'text-anchor': 'middle' });
      });
    },
  },
  {
    id: 'piano-sharp-flat-note-names',
    sources: ['74beea27ad30018569811de3fdca3702b5f1328a.png'],
    output: 'piano-sharp-flat-note-names.svg',
    alt: 'A piano octave labelling white keys with natural notes and black keys with both sharp and flat names.',
    width: 850,
    height: 360,
    render({ overlay }) {
      drawKeyboard(overlay, { x: 230, y: 45, whiteWidth: 62, whiteHeight: 260, whiteKeys: 7, labels: ['C♮', 'D♮', 'E♮', 'F♮', 'G♮', 'A♮', 'B♮'], blackLabels: { 0: 'C♯\nD♭', 1: 'D♯\nE♭', 3: 'F♯\nG♭', 4: 'G♯\nA♭', 5: 'A♯\nB♭' } });
      overlay.text('Black keys:\nsharp or flat names', 40, 80, { fill: '#c62828', 'font-size': 17, 'data-line-height': 23 });
      overlay.text('White keys:\nnatural-note names', 40, 275, { 'font-size': 17, 'data-line-height': 23 });
    },
  },
];
