import { drawStave, labelUnder, note } from '../figure-helpers.mjs';

function drawSymbolNote(overlay, x, y, value = 'quarter') {
  const hollow = value === 'whole' || value === 'half';
  overlay.ellipse(x, y, 10, 7, { fill: hollow ? 'white' : '#111', stroke: '#111', 'stroke-width': 2, transform: `rotate(-18 ${x} ${y})` });
  if (value !== 'whole') overlay.line(x + 9, y, x + 9, y - 48, { stroke: '#111', 'stroke-width': 3 });
  if (value === 'eighth') overlay.path(`M ${x + 9} ${y - 48} Q ${x + 34} ${y - 35} ${x + 18} ${y - 15}`, { fill: 'none', stroke: '#111', 'stroke-width': 3 });
}

export const definitions = [
  {
    id: 'enharmonic-note-solutions',
    sources: ['fc80686dbb2a3da98305b51c5fbe0be7fe0df65f.png'],
    output: 'enharmonic-note-solutions.svg',
    alt: 'Four pairs of enharmonic notes: C-sharp and D-flat, F-sharp and G-flat, G-sharp and A-flat, and A-sharp and B-flat.',
    width: 900,
    height: 250,
    render({ VF, context, overlay }) {
      const pairs = [
        [{ key: 'c/4', accidental: '#' }, { key: 'd/4', accidental: 'b' }, 'C♯ = D♭'],
        [{ key: 'f/4', accidental: '#' }, { key: 'g/4', accidental: 'b' }, 'F♯ = G♭'],
        [{ key: 'g/4', accidental: '#' }, { key: 'a/4', accidental: 'b' }, 'G♯ = A♭'],
        [{ key: 'a/4', accidental: '#' }, { key: 'b/4', accidental: 'b' }, 'A♯ = B♭'],
      ];
      drawStave(VF, context, { x: 40, y: 50, width: 820, notes: pairs.flatMap(([a, b]) => [{ ...a, duration: 'w' }, { ...b, duration: 'w' }]), formatWidth: 650 });
      labelUnder(overlay, pairs.map((pair) => pair[2]), 185, 185, 220, { fill: '#c62828' });
    },
  },
  {
    id: 'double-sharp-and-double-flat',
    sources: ['474e94deea43979f36c549e417e20be46265bcff.png'],
    output: 'double-sharp-and-double-flat.svg',
    alt: 'F-double-sharp and F-double-flat shown with their accidental symbols on a treble staff.',
    width: 760,
    height: 300,
    render({ VF, context, overlay }) {
      overlay.text('Double Sharp', 225, 35, { 'font-size': 20, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text('×', 225, 73, { 'font-size': 34, 'text-anchor': 'middle' });
      overlay.text('Double Flat', 535, 35, { 'font-size': 20, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text('♭♭', 535, 73, { 'font-size': 34, 'text-anchor': 'middle' });
      drawStave(VF, context, { x: 60, y: 95, width: 640, notes: [{ key: 'f/4', duration: 'w', accidental: '##' }, { key: 'f/4', duration: 'w', accidental: 'bb' }], formatWidth: 380 });
      overlay.text('“F double sharp”', 245, 260, { 'font-size': 18, 'text-anchor': 'middle' });
      overlay.text('“F double flat”', 520, 260, { 'font-size': 18, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'enharmonic-major-scales',
    sources: ['78771163de17e6e1143aee5b2ceac299a8b11e63.png'],
    output: 'enharmonic-major-scales.svg',
    alt: 'E-flat-major and D-sharp-major scales written with different spellings but sounding the same on a piano.',
    width: 920,
    height: 390,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 45, width: 830, notes: [
        { key: 'e/4', accidental: 'b' }, { key: 'f/4' }, { key: 'g/4' }, { key: 'a/4', accidental: 'b' },
        { key: 'b/4', accidental: 'b' }, { key: 'c/5' }, { key: 'd/5' }, { key: 'e/5', accidental: 'b' },
      ].map((item) => ({ duration: 'q', ...item })), formatWidth: 670 });
      overlay.text('E♭ major', 460, 185, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' });
      drawStave(VF, context, { x: 45, y: 220, width: 830, notes: [
        { key: 'd/4', accidental: '#' }, { key: 'e/4', accidental: '#' }, { key: 'f/4', accidental: '##' }, { key: 'g/4', accidental: '#' },
        { key: 'a/4', accidental: '#' }, { key: 'b/4', accidental: '#' }, { key: 'c/5', accidental: '##' }, { key: 'd/5', accidental: '#' },
      ].map((item) => ({ duration: 'q', ...item })), formatWidth: 670 });
      overlay.text('D♯ major', 460, 360, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'enharmonic-key-signature-solutions',
    sources: ['1a40746eda2587a243368245b5d05212ff77bb72.png'],
    output: 'enharmonic-key-signature-solutions.svg',
    alt: 'Key signatures for B major and its enharmonic C-flat major, and B-flat minor and its enharmonic A-sharp minor.',
    width: 900,
    height: 390,
    render({ VF, context, overlay }) {
      [[45, 45, 'B', 'B major'], [475, 45, 'Cb', 'C♭ major'], [45, 220, 'Bbm', 'B♭ minor'], [475, 220, 'A#m', 'A♯ minor']].forEach(([x, y, key, label]) => {
        drawStave(VF, context, { x, y, width: 380, key });
        overlay.text(label, x + 190, y + 130, { 'font-size': 18, 'text-anchor': 'middle' });
      });
    },
  },
  {
    id: 'note-anatomy',
    sources: ['1c0318c0e18cbf5f0a591a3d5d6fceb2bf48a3ac.png'],
    output: 'note-anatomy.svg',
    alt: 'Hollow and filled noteheads with arrows labelling the head, stem, flag, and augmentation dot.',
    width: 800,
    height: 300,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 250, y: 70, width: 180, clef: null, notes: [note(VF, { key: 'b/4', duration: 'h', dots: 1 })], formatWidth: 65 });
      drawStave(VF, context, { x: 500, y: 70, width: 180, clef: null, notes: [note(VF, { key: 'b/4', duration: '8' })], formatWidth: 65 });
      overlay.text('head\n(not filled in)', 40, 145, { 'font-size': 17, 'data-line-height': 22 });
      overlay.line(175, 130, 292, 123, { stroke: '#111', 'stroke-width': 1.7 });
      overlay.text('dot', 350, 40, { fill: '#1769aa', 'font-size': 18, 'text-anchor': 'middle' });
      overlay.line(350, 48, 350, 96, { stroke: '#1769aa', 'stroke-width': 1.7 });
      overlay.text('stem', 465, 225, { fill: '#d32f2f', 'font-size': 18, 'text-anchor': 'middle' });
      overlay.line(415, 205, 345, 145, { stroke: '#d32f2f', 'stroke-width': 1.7 });
      overlay.line(515, 205, 555, 145, { stroke: '#d32f2f', 'stroke-width': 1.7 });
      overlay.text('flag', 715, 82, { 'font-size': 17 });
      overlay.line(705, 88, 625, 115, { stroke: '#111', 'stroke-width': 1.7 });
      overlay.text('head (filled in)', 650, 240, { 'font-size': 17 });
      overlay.line(640, 220, 590, 150, { stroke: '#111', 'stroke-width': 1.7 });
    },
  },
  {
    id: 'headless-and-slash-notes',
    sources: ['2277ff861fd1e5c40c62d2f7350ff845bd5c59c7.png'],
    output: 'headless-and-slash-notes.svg',
    alt: 'Headless rhythm stems and slash-note chord shorthand, contrasted with fully written chord notation.',
    width: 960,
    height: 340,
    render({ VF, context, overlay }) {
      overlay.line(30, 145, 260, 145, { stroke: '#777', 'stroke-width': 2 });
      [75, 130, 185, 240].forEach((x, index) => {
        overlay.line(x, 145, x, 80 + (index % 2) * 25, { stroke: '#111', 'stroke-width': 2 });
        overlay.line(x - 6, 139, x + 6, 151, { stroke: '#111', 'stroke-width': 2 });
        overlay.line(x - 6, 151, x + 6, 139, { stroke: '#111', 'stroke-width': 2 });
      });
      overlay.text('Headless notes show rhythm but no definite pitch.', 145, 230, { 'font-size': 16, 'text-anchor': 'middle', 'data-line-height': 21 });
      drawStave(VF, context, { x: 315, y: 65, width: 255, notes: Array.from({ length: 4 }, () => ({ keys: ['g/4', 'b/4', 'd/5'], duration: '16' })), formatWidth: 140, beams: true });
      overlay.text('Gm', 445, 45, { 'font-size': 19, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text('Slash notation can represent an entire chord.', 445, 230, { 'font-size': 16, 'text-anchor': 'middle', 'data-line-height': 21 });
      overlay.text('=', 615, 130, { 'font-size': 30, 'font-weight': '700', 'text-anchor': 'middle' });
      drawStave(VF, context, { x: 665, y: 65, width: 255, notes: Array.from({ length: 4 }, () => ({ keys: ['g/3', 'b/3', 'd/4', 'g/4'], duration: '16' })), formatWidth: 140, beams: true });
    },
  },
  {
    id: 'fractional-note-values',
    sources: ['02b3dcafe15c45a0dd5bc1c2261ba0498de65c9f.png'],
    output: 'fractional-note-values.svg',
    alt: 'One whole note equated with two half notes, four quarter notes, eight eighth notes, and continued subdivisions.',
    width: 1080,
    height: 300,
    render({ VF, context, overlay }) {
      const groups = [
        [{ key: 'c/5', duration: 'w' }],
        Array.from({ length: 2 }, () => ({ key: 'c/5', duration: 'h' })),
        Array.from({ length: 4 }, () => ({ key: 'c/5', duration: 'q' })),
        Array.from({ length: 8 }, () => ({ key: 'c/5', duration: '8' })),
      ];
      const xs = [35, 250, 465, 700];
      groups.forEach((notes, index) => drawStave(VF, context, { x: xs[index], y: 55, width: index === 3 ? 330 : 200, clef: index === 0 ? 'treble' : null, time: index === 0 ? '4/4' : undefined, notes, formatWidth: index === 3 ? 235 : 105, beams: true }));
      ['One\nwhole note', 'Two\nhalf notes', 'Four\nquarter notes', 'Eight\neighth notes'].forEach((label, index) => overlay.text(label, xs[index] + (index === 3 ? 165 : 100), 220, { 'font-size': 16, 'text-anchor': 'middle', 'data-line-height': 21 }));
      [235, 450, 685].forEach((x) => overlay.text('=', x, 130, { 'font-size': 26, 'text-anchor': 'middle' }));
      overlay.text('and so on …', 1010, 135, { 'font-size': 18, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'flags-and-beams-equivalence',
    sources: ['e62d54293b2496a82a5aa78702e98cc70a128ea2.png'],
    output: 'flags-and-beams-equivalence.svg',
    alt: 'Flagged eighth and sixteenth notes shown equivalent to the same notes grouped with beams.',
    width: 900,
    height: 390,
    render({ VF, context, overlay }) {
      [45, 220].forEach((y, row) => {
        const duration = row ? '16' : '8';
        drawStave(VF, context, { x: 35, y, width: 355, notes: Array.from({ length: 8 }, () => ({ key: 'b/4', duration })), formatWidth: 245 });
        overlay.text('=', 450, y + 73, { 'font-size': 28, 'font-weight': '700', 'text-anchor': 'middle' });
        drawStave(VF, context, { x: 510, y, width: 355, notes: Array.from({ length: 8 }, () => ({ key: 'b/4', duration })), formatWidth: 245, beams: true });
      });
      overlay.text('Flags may be replaced by beams without changing duration.', 450, 380, { 'font-size': 18, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'note-value-equations',
    sources: ['a4e3c4299b4df0cbc42338cbce821ba91aa2dea2.png'],
    output: 'note-value-equations.svg',
    alt: 'Three duration equations: one whole equals two halves, a half plus two quarters equals a whole, and four eighths equal a half.',
    width: 780,
    height: 430,
    render({ overlay }) {
      const rows = [
        { y: 85, left: [['whole', 155]], right: [['half', 430], ['half', 515]], text: '1 whole note = 2 half notes' },
        { y: 210, left: [['half', 125], ['quarter', 210], ['quarter', 270]], right: [['whole', 485]], text: '1 half note + 2 quarter notes = 1 whole note' },
        { y: 335, left: [['eighth', 95], ['eighth', 155], ['eighth', 215], ['eighth', 275]], right: [['half', 485]], text: '4 eighth notes = 1 half note' },
      ];
      rows.forEach(({ y, left, right, text }) => {
        left.forEach(([value, x]) => drawSymbolNote(overlay, x, y, value));
        overlay.text('=', 365, y + 7, { 'font-size': 27, 'text-anchor': 'middle' });
        right.forEach(([value, x]) => drawSymbolNote(overlay, x, y, value));
        overlay.text(text, 610, y + 7, { 'font-size': 16, 'text-anchor': 'middle' });
      });
    },
  },
];
