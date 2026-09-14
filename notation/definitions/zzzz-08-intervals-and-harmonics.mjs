import { drawStave, note } from '../figure-helpers.mjs';

const ink = '#111';
const blue = '#1769aa';
const red = '#c62828';

function title(overlay, value, x, y, attributes = {}) {
  overlay.text(value, x, y, {
    'font-size': 17,
    'font-weight': '700',
    'text-anchor': 'middle',
    ...attributes,
  });
}

function intervalChord(VF, low, high, accidentals = []) {
  return note(VF, { keys: [low, high], duration: 'w', accidentals });
}

function pairRow(VF, context, overlay, pairs, options = {}) {
  const { y = 35, labels = [], width = 980, x = 25, clef = 'treble', labelY = y + 145 } = options;
  const cellWidth = (width - x * 2) / pairs.length;
  pairs.forEach((pair, index) => {
    const cellX = x + index * cellWidth;
    drawStave(VF, context, {
      x: cellX,
      y,
      width: cellWidth + 1,
      clef: index === 0 ? clef : null,
      notes: [intervalChord(VF, pair[0], pair[1], pair[2] ?? [])],
      formatWidth: Math.max(45, cellWidth - 45),
    });
    if (labels[index]) title(overlay, labels[index], cellX + cellWidth / 2, labelY, { 'font-size': 15, 'font-weight': '400', 'data-line-height': 18 });
  });
}

function promptRow(VF, context, overlay, prompts, options = {}) {
  const { y = 35, width = 980, x = 25, clef = 'treble', solution = false } = options;
  const cellWidth = (width - x * 2) / prompts.length;
  prompts.forEach((item, index) => {
    const cellX = x + index * cellWidth;
    const notes = solution
      ? [intervalChord(VF, item.low, item.high, item.accidentals ?? [])]
      : [note(VF, { key: item.low, duration: 'w', accidental: item.accidentals?.[0] })];
    drawStave(VF, context, { x: cellX, y, width: cellWidth + 1, clef: index === 0 ? clef : null, notes, formatWidth: Math.max(45, cellWidth - 45) });
    if (!solution) overlay.line(cellX + cellWidth * 0.62, y + 70, cellX + cellWidth * 0.82, y + 70, { stroke: '#777', 'stroke-width': 1.5, 'stroke-dasharray': '5 4' });
    title(overlay, item.label, cellX + cellWidth / 2, y + 145, { 'font-size': 14, 'font-weight': '400', 'data-line-height': 17 });
  });
}

function harmonicKeys(transpose = 0) {
  const chromatic = ['c/3', 'c/4', 'g/4', 'c/5', 'e/5', 'g/5', 'bb/5', 'c/6', 'd/6', 'e/6', 'f#/6', 'g/6', 'a/6', 'bb/6', 'b/6', 'c/7'];
  const order = ['c', 'c#', 'd', 'eb', 'e', 'f', 'f#', 'g', 'ab', 'a', 'bb', 'b'];
  if (!transpose) return chromatic;
  return chromatic.map((key) => {
    const [pitch, octaveText] = key.split('/');
    const normalized = pitch === 'bb' ? 'bb' : pitch;
    let index = order.indexOf(normalized);
    if (index < 0) index = order.indexOf(pitch[0]);
    const shifted = index + transpose;
    return `${order[(shifted + 120) % 12]}/${Number(octaveText) + Math.floor(shifted / 12)}`;
  });
}

function notesForKeys(keys, duration = 'q') {
  return keys.map((key) => {
    const pitch = key.split('/')[0];
    const accidental = pitch.length > 1 ? (pitch.slice(1) === 'b' ? 'b' : '#') : undefined;
    return { key, duration, accidental };
  });
}

function drawHarmonicSeries(VF, context, overlay, options = {}) {
  const { x = 35, y = 35, width = 1000, transpose = 0, heading, numbers = false } = options;
  const keys = harmonicKeys(transpose);
  if (heading) overlay.text(heading, x, y - 7, { 'font-size': 15, 'font-weight': '700' });
  drawStave(VF, context, { x, y, width, clef: 'treble', notes: notesForKeys(keys, 'q'), formatWidth: width - 125 });
  if (numbers) keys.forEach((_, index) => overlay.text(String(index + 1), x + 105 + index * ((width - 155) / 15), y + 135, { 'font-size': 12, 'text-anchor': 'middle' }));
}

export const definitions = [
  {
    id: 'counting-written-intervals',
    status: 'vexflow-overlay',
    sources: ['8ecdfe8f4dbf66d814697cc5b8817d42ed89f3c5.png'],
    output: 'counting-written-intervals.svg',
    alt: 'Treble-clef B to D is counted across three staff positions; bass-clef A to F is counted across six.',
    width: 760,
    height: 360,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 70, y: 25, width: 620, notes: [intervalChord(VF, 'b/4', 'd/5')], formatWidth: 210 });
      ['1', '2', '3'].forEach((n, i) => overlay.text(n, 300 + i * 38, 175, { 'font-size': 15, 'text-anchor': 'middle' }));
      overlay.text('Count:', 245, 175, { 'font-size': 15 });
      drawStave(VF, context, { x: 70, y: 185, width: 620, clef: 'bass', notes: [intervalChord(VF, 'a/2', 'f/3')], formatWidth: 210 });
      ['1', '2', '3', '4', '5', '6'].forEach((n, i) => overlay.text(n, 292 + i * 34, 335, { 'font-size': 15, 'text-anchor': 'middle' }));
      overlay.text('Count:', 230, 335, { 'font-size': 15 });
    },
  },
  {
    id: 'simple-intervals-prime-through-octave',
    status: 'vexflow-overlay',
    sources: ['7e50de433d0a7c1b59dacfe13036ded4a3f0adf8.png'],
    output: 'simple-intervals-prime-through-octave.svg',
    alt: 'Eight written intervals above C, labelled prime, second, third, fourth, fifth, sixth, seventh, and octave.',
    width: 1120,
    height: 235,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay,
        [['c/4', 'c/4'], ['c/4', 'd/4'], ['c/4', 'e/4'], ['c/4', 'f/4'], ['c/4', 'g/4'], ['c/4', 'a/4'], ['c/4', 'b/4'], ['c/4', 'c/5']],
        { width: 1120, labels: ['Prime', 'Second', 'Third', 'Fourth', 'Fifth', 'Sixth', 'Seventh', 'Octave'], labelY: 195 });
    },
  },
  {
    id: 'compound-intervals-ninth-and-beyond',
    status: 'vexflow-overlay',
    sources: ['0bf05d9e775798258180a99a2ffd159ebd3e4e85.png'],
    output: 'compound-intervals-ninth-and-beyond.svg',
    alt: 'Compound intervals above C labelled ninth, tenth, eleventh, and twelfth, continuing beyond the octave.',
    width: 850,
    height: 230,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay, [['c/4', 'd/5'], ['c/4', 'e/5'], ['c/4', 'f/5'], ['c/4', 'g/5']], { width: 850, labels: ['Ninth', 'Tenth', 'Eleventh', 'Twelfth, and so on…'], labelY: 192 });
    },
  },
  {
    id: 'interval-number-practice',
    status: 'vexflow-overlay',
    sources: ['9111533eb14a4014b873e66548bccebb32e35bc3.png'],
    output: 'interval-number-practice.svg',
    alt: 'Six unlabelled written intervals on a treble staff for interval-number practice.',
    width: 960,
    height: 190,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay, [['c/4', 'd/4'], ['c/4', 'c/5'], ['c/4', 'g/4'], ['e/4', 'g/4'], ['c/4', 'a/4'], ['d/4', 'g/4']], { width: 960 });
    },
  },
  {
    id: 'interval-size-by-half-steps',
    status: 'vexflow-overlay',
    sources: ['76aa06be5447ea944743e35c9d5967c60607a74a.png'],
    output: 'interval-size-by-half-steps.svg',
    alt: 'Four thirds and fifths demonstrate that intervals with the same staff distance can contain different numbers of half steps.',
    width: 920,
    height: 300,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay, [
        ['a/4', 'c/5'], ['a/4', 'c#/5', [null, '#']], ['a/4', 'e/5'], ['a/4', 'eb/5', [null, 'b']],
      ], { width: 920, labels: ['Three half steps = a third', 'Four half steps = a different third', 'Seven half steps = a fifth', 'Six half steps = a different fifth'], labelY: 208 });
    },
  },
  {
    id: 'perfect-interval-examples',
    status: 'vexflow-overlay',
    sources: ['2a5a43eedddcfae83e15f9507150c98a9f0597d0.png', 'd194cd10d38499052d417650f1eb6085d4e3170f.png'],
    output: 'perfect-interval-examples.svg',
    alt: 'Examples of a perfect unison, octave, fourth, and fifth written above C.',
    width: 850,
    height: 220,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay, [['c/4', 'c/4'], ['c/4', 'c/5'], ['c/4', 'f/4'], ['c/4', 'g/4']], { width: 850, labels: ['Unison', 'Octave', 'Perfect Fourth', 'Perfect Fifth'], labelY: 190 });
    },
  },
  {
    id: 'thirds-and-fifths-with-accidentals',
    status: 'vexflow-overlay',
    sources: ['02df34c31ca1f7c64cc2059d3a8fcfc91afed439.png'],
    output: 'thirds-and-fifths-with-accidentals.svg',
    alt: 'A–C and A–C-sharp are both thirds; A–E and A–E-flat are both fifths but differ in half-step size.',
    width: 900,
    height: 245,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay, [['a/4', 'c/5'], ['a/4', 'c#/5', [null, '#']], ['a/4', 'e/5'], ['a/4', 'eb/5', [null, 'b']]], { width: 900, labels: ['A to C: third', 'A to C♯: third', 'A to E: fifth', 'A to E♭: fifth'], labelY: 200 });
    },
  },
  {
    id: 'major-and-minor-interval-examples',
    status: 'vexflow-overlay',
    sources: ['8efa51e8939876415c455e3c0b390e66fa04da32.png'],
    output: 'major-and-minor-interval-examples.svg',
    alt: 'Minor and major seconds, thirds, sixths, and sevenths compared above C.',
    width: 1060,
    height: 365,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay, [['c/4', 'db/4', [null, 'b']], ['c/4', 'd/4'], ['c/4', 'eb/4', [null, 'b']], ['c/4', 'e/4']], { width: 1060, labels: ['Minor Second', 'Major Second', 'Minor Third', 'Major Third'], labelY: 180 });
      pairRow(VF, context, overlay, [['c/4', 'ab/4', [null, 'b']], ['c/4', 'a/4'], ['c/4', 'bb/4', [null, 'b']], ['c/4', 'b/4']], { width: 1060, y: 190, labels: ['Minor Sixth', 'Major Sixth', 'Minor Seventh', 'Major Seventh'], labelY: 350 });
    },
  },
  {
    id: 'classify-major-minor-intervals-practice',
    status: 'vexflow-overlay',
    sources: ['353ee2d79e1b6c84699e438f7286e307474a23e6.png'],
    output: 'classify-major-minor-intervals-practice.svg',
    alt: 'Eight unlabelled treble- and bass-clef intervals for complete interval-name practice.',
    width: 1060,
    height: 330,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay, [['c/4', 'd/4'], ['c/4', 'eb/4', [null, 'b']], ['d/4', 'a/4'], ['e/4', 'c/5']], { width: 1060 });
      pairRow(VF, context, overlay, [['c/3', 'a/3'], ['d/3', 'c/4'], ['e/3', 'g/3'], ['f/3', 'eb/4', [null, 'b']]], { width: 1060, y: 175, clef: 'bass' });
    },
  },
  {
    id: 'classify-major-minor-intervals-solutions',
    status: 'vexflow-overlay',
    sources: ['2a98cbbce6f7ff1fa2cfe1808a9be2b7997d16df.png'],
    output: 'classify-major-minor-intervals-solutions.svg',
    alt: 'Eight interval examples labelled major second, minor third, perfect fifth, perfect fourth, perfect octave, minor sixth, perfect unison, and major seventh.',
    width: 1060,
    height: 390,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay, [['c/4', 'd/4'], ['c/4', 'eb/4', [null, 'b']], ['d/4', 'a/4'], ['e/4', 'a/4']], { width: 1060, labels: ['Major Second', 'Minor Third', 'Perfect Fifth', 'Perfect Fourth'], labelY: 180 });
      pairRow(VF, context, overlay, [['c/3', 'c/4'], ['c/3', 'ab/3', [null, 'b']], ['g/3', 'g/3'], ['c/3', 'b/3']], { width: 1060, y: 205, clef: 'bass', labels: ['Perfect Octave', 'Minor Sixth', 'Unison\n(Perfect prime)', 'Major Seventh'], labelY: 365 });
    },
  },
  {
    id: 'complete-intervals-practice',
    status: 'vexflow-overlay',
    sources: ['ce803b3272dee1a6280f68545024860164005f22.png'],
    output: 'complete-intervals-practice.svg',
    alt: 'Twelve given notes with named upward or downward intervals and blanks for writing the second note.',
    width: 1080,
    height: 545,
    render({ VF, context, overlay }) {
      const rows = [
        [{ low: 'c/4', high: 'g/4', label: 'P5 higher' }, { low: 'g/4', high: 'c/4', label: 'P4 lower' }, { low: 'e/4', high: 'd#/4', label: 'm2 lower' }, { low: 'c/4', high: 'c/4', label: 'Prime' }],
        [{ low: 'c/4', high: 'e/4', label: 'M3 higher' }, { low: 'a/4', high: 'b/3', label: 'm7 lower' }, { low: 'c/4', high: 'c/5', label: 'P8 higher' }, { low: 'c/4', high: 'ab/4', label: 'm6 higher' }],
        [{ low: 'c/3', high: 'eb/2', label: 'm6 lower' }, { low: 'c/3', high: 'd/3', label: 'M2 higher' }, { low: 'c/3', high: 'f/2', label: 'P5 lower' }, { low: 'c/3', high: 'eb/3', label: 'm3 higher' }],
      ];
      promptRow(VF, context, overlay, rows[0], { width: 1080, y: 20 });
      promptRow(VF, context, overlay, rows[1], { width: 1080, y: 190 });
      promptRow(VF, context, overlay, rows[2], { width: 1080, y: 360, clef: 'bass' });
    },
  },
  {
    id: 'complete-intervals-solutions',
    status: 'vexflow-overlay',
    sources: ['9812d93de8f0b4b7ae1aea556a84993acf3c1aa5.png'],
    output: 'complete-intervals-solutions.svg',
    alt: 'Completed answers for twelve named upward and downward intervals in treble and bass clefs.',
    width: 1080,
    height: 545,
    render({ VF, context, overlay }) {
      const rows = [
        [{ low: 'c/4', high: 'g/4', label: 'P5 higher' }, { low: 'g/4', high: 'c/4', label: 'P4 lower' }, { low: 'e/4', high: 'd#/4', label: 'm2 lower', accidentals: [null, '#'] }, { low: 'c/4', high: 'c/4', label: 'Prime' }],
        [{ low: 'c/4', high: 'e/4', label: 'M3 higher' }, { low: 'a/4', high: 'b/3', label: 'm7 lower' }, { low: 'c/4', high: 'c/5', label: 'P8 higher' }, { low: 'c/4', high: 'ab/4', label: 'm6 higher', accidentals: [null, 'b'] }],
        [{ low: 'c/3', high: 'eb/2', label: 'm6 lower', accidentals: [null, 'b'] }, { low: 'c/3', high: 'd/3', label: 'M2 higher' }, { low: 'c/3', high: 'f/2', label: 'P5 lower' }, { low: 'c/3', high: 'eb/3', label: 'm3 higher', accidentals: [null, 'b'] }],
      ];
      promptRow(VF, context, overlay, rows[0], { width: 1080, y: 20, solution: true });
      promptRow(VF, context, overlay, rows[1], { width: 1080, y: 190, solution: true });
      promptRow(VF, context, overlay, rows[2], { width: 1080, y: 360, clef: 'bass', solution: true });
    },
  },
  {
    id: 'augmented-diminished-interval-practice',
    status: 'vexflow-overlay',
    sources: ['fb26939cb57d2a82f63dd722d29db73845b9e3ad.png'],
    output: 'augmented-diminished-interval-practice.svg',
    alt: 'Eight given notes with named augmented or diminished intervals and blanks for writing the second note.',
    width: 1080,
    height: 385,
    render({ VF, context, overlay }) {
      promptRow(VF, context, overlay, [
        { low: 'c/4', high: 'c#/5', label: 'Augmented Octave\nHigher' }, { low: 'a/4', high: 'c#/4', label: 'Diminished Sixth\nLower' }, { low: 'c/4', high: 'f#/4', label: 'Augmented Fourth\nHigher' }, { low: 'e/4', high: 'd#/4', label: 'Diminished Second\nLower' },
      ], { width: 1080, y: 20 });
      promptRow(VF, context, overlay, [
        { low: 'c/3', high: 'c#/4', label: 'Augmented Prime\nHigher' }, { low: 'b/3', high: 'd/3', label: 'Diminished Seventh\nLower' }, { low: 'c/3', high: 'e#/3', label: 'Augmented Third\nHigher' }, { low: 'a/3', high: 'db/3', label: 'Diminished Fifth\nLower' },
      ], { width: 1080, y: 205, clef: 'bass' });
    },
  },
  {
    id: 'augmented-diminished-interval-solutions',
    status: 'vexflow-overlay',
    sources: ['563ec9e172273ad08e28a9f222aec657339cbf73.png'],
    output: 'augmented-diminished-interval-solutions.svg',
    alt: 'Completed answers for eight named augmented and diminished intervals in treble and bass clefs.',
    width: 1080,
    height: 385,
    render({ VF, context, overlay }) {
      promptRow(VF, context, overlay, [
        { low: 'c/4', high: 'c#/5', label: 'Augmented Octave\nHigher', accidentals: [null, '#'] }, { low: 'a/4', high: 'c#/4', label: 'Diminished Sixth\nLower', accidentals: [null, '#'] }, { low: 'c/4', high: 'f#/4', label: 'Augmented Fourth\nHigher', accidentals: [null, '#'] }, { low: 'e/4', high: 'd#/4', label: 'Diminished Second\nLower', accidentals: [null, '#'] },
      ], { width: 1080, y: 20, solution: true });
      promptRow(VF, context, overlay, [
        { low: 'c/3', high: 'c#/3', label: 'Augmented Prime\nHigher', accidentals: [null, '#'] }, { low: 'b/3', high: 'd/3', label: 'Diminished Seventh\nLower' }, { low: 'c/3', high: 'e#/3', label: 'Augmented Third\nHigher', accidentals: [null, '#'] }, { low: 'a/3', high: 'db/3', label: 'Diminished Fifth\nLower', accidentals: [null, 'b'] },
      ], { width: 1080, y: 205, clef: 'bass', solution: true });
    },
  },
  {
    id: 'interval-inversion-motion',
    status: 'vexflow-overlay',
    sources: ['57c3afee0d3d8890000a64ea020ceeb925b9cb44.png'],
    output: 'interval-inversion-motion.svg',
    alt: 'Arrows show a C–F perfect fourth inverted to a perfect fifth and a B–D minor third inverted to a major sixth.',
    width: 960,
    height: 260,
    render({ VF, context, overlay }) {
      pairRow(VF, context, overlay, [['c/4', 'f/4'], ['c/4', 'f/4'], ['b/3', 'd/4'], ['b/3', 'd/4']], { width: 960 });
      overlay.path('M 115 125 Q 175 65 235 105', { fill: 'none', stroke: blue, 'stroke-width': 3, 'marker-end': 'none' });
      overlay.path('M 350 105 Q 410 65 470 125', { fill: 'none', stroke: red, 'stroke-width': 3 });
      overlay.path('M 590 125 Q 650 65 710 105', { fill: 'none', stroke: blue, 'stroke-width': 3 });
      overlay.path('M 825 105 Q 870 65 925 125', { fill: 'none', stroke: red, 'stroke-width': 3 });
      title(overlay, 'Down to C:\nPerfect Fourth', 165, 205, { fill: blue, 'font-size': 14, 'data-line-height': 18 });
      title(overlay, 'Up to C:\nPerfect Fifth', 395, 205, { fill: red, 'font-size': 14, 'data-line-height': 18 });
      title(overlay, 'Down to D:\nMajor Sixth', 635, 205, { fill: blue, 'font-size': 14, 'data-line-height': 18 });
      title(overlay, 'Up to D:\nMinor Third', 865, 205, { fill: red, 'font-size': 14, 'data-line-height': 18 });
    },
  },
  {
    id: 'interval-inversion-examples',
    status: 'vexflow-overlay',
    sources: ['d04e2c7f45f72dbbf040f2b7409342189f0ee877.png'],
    output: 'interval-inversion-examples.svg',
    alt: 'A minor seventh inverts to a major second, and a minor third inverts to a major sixth; interval numbers sum to nine.',
    width: 940,
    height: 245,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 35, y: 35, width: 310, notes: [intervalChord(VF, 'c/4', 'bb/4', [null, 'b'])], formatWidth: 120 });
      title(overlay, 'Minor Seventh', 185, 190, { 'font-size': 15, 'font-weight': '400' });
      overlay.text('9 − 7 = 2\nMinor inverts to major', 470, 105, { 'font-size': 16, 'text-anchor': 'middle', 'data-line-height': 24 });
      drawStave(VF, context, { x: 595, y: 35, width: 310, notes: [intervalChord(VF, 'bb/3', 'c/4', ['b', null])], formatWidth: 120 });
      title(overlay, 'Inversion is a Major Second', 750, 190, { 'font-size': 15, 'font-weight': '400' });
    },
  },
  {
    id: 'harmonic-series-one-through-sixteen',
    status: 'vexflow-overlay',
    sources: ['d7d88dada170cabb40a5168da677a7d94fdcb92d.png'],
    output: 'harmonic-series-one-through-sixteen.svg',
    alt: 'The first sixteen harmonics ascend from low C through closely spaced upper partials, numbered one through sixteen.',
    width: 1120,
    height: 230,
    render({ VF, context, overlay }) { drawHarmonicSeries(VF, context, overlay, { width: 1050, numbers: true }); },
  },
  {
    id: 'bugle-calls-from-harmonic-series',
    status: 'vexflow-overlay',
    sources: ['b486203049c855e0c049ef8dbd7b63b77c827f07.png'],
    output: 'bugle-calls-from-harmonic-series.svg',
    alt: 'Short notated excerpts of the bugle calls Assembly and Taps, using only notes of one harmonic series.',
    width: 1080,
    height: 430,
    render({ VF, context, overlay }) {
      overlay.text('Assembly', 35, 28, { 'font-size': 17, 'font-weight': '700' });
      drawStave(VF, context, { x: 35, y: 35, width: 1010, time: '2/4', notes: notesForKeys(['g/4', 'c/5', 'e/5', 'g/5', 'e/5', 'c/5', 'g/4', 'c/5', 'g/5', 'e/5', 'c/5', 'g/4'], '8'), formatWidth: 830, beams: true });
      overlay.text('Taps', 35, 228, { 'font-size': 17, 'font-weight': '700' });
      drawStave(VF, context, { x: 35, y: 235, width: 1010, time: '4/4', notes: [
        { key: 'g/4', duration: 'q' }, note(VF, { key: 'c/5', duration: 'h', dots: 1 }), { key: 'g/4', duration: 'q' }, { key: 'c/5', duration: 'q' }, note(VF, { key: 'e/5', duration: 'h', dots: 1 }), { key: 'c/5', duration: 'q' }, { key: 'e/5', duration: 'q' }, { key: 'g/5', duration: 'h' },
      ], formatWidth: 810 });
    },
  },
  {
    id: 'brass-valve-harmonic-series',
    status: 'vexflow-overlay',
    sources: ['72da008accbc59a9f87e758ae9df1cca1fec2cf4.png'],
    output: 'brass-valve-harmonic-series.svg',
    alt: 'Four harmonic series compare no valves, second valve a half step lower, first valve a whole step lower, and their available middle-register notes.',
    width: 1120,
    height: 620,
    render({ VF, context, overlay }) {
      drawHarmonicSeries(VF, context, overlay, { y: 35, width: 1040, heading: 'No valves' });
      drawHarmonicSeries(VF, context, overlay, { y: 175, width: 1040, transpose: -1, heading: 'Second valve: harmonic series one half step lower' });
      drawHarmonicSeries(VF, context, overlay, { y: 315, width: 1040, transpose: -2, heading: 'First valve: harmonic series one whole step lower' });
      title(overlay, 'Middle-register notes available using no valve, second valve, or first valve alone', 560, 470, { 'font-size': 15 });
      drawStave(VF, context, { x: 160, y: 475, width: 800, notes: notesForKeys(['g/4', 'ab/4', 'a/4', 'bb/4', 'b/4', 'c/5', 'c#/5', 'd/5', 'eb/5', 'e/5', 'f/5', 'f#/5', 'g/5'], 'q'), formatWidth: 650 });
    },
  },
  {
    id: 'combined-valves-harmonic-series',
    status: 'vexflow-overlay',
    sources: ['74be71ab69d9e91436d322a2526bb0cfe55ddf04.png'],
    output: 'combined-valves-harmonic-series.svg',
    alt: 'Opening the first and second valves produces a harmonic series one and a half steps lower and fills the remaining middle-register pitches.',
    width: 1080,
    height: 360,
    render({ VF, context, overlay }) {
      drawHarmonicSeries(VF, context, overlay, { y: 35, width: 1010, transpose: -3, heading: 'First and second valves: harmonic series one and a half steps lower' });
      drawStave(VF, context, { x: 140, y: 195, width: 800, notes: notesForKeys(['g/4', 'ab/4', 'a/4', 'bb/4', 'b/4', 'c/5', 'c#/5', 'd/5', 'eb/5', 'e/5', 'f/5', 'f#/5', 'g/5'], 'q'), formatWidth: 650 });
      overlay.text('The combined valve positions complete the chromatic notes in the middle register.', 540, 345, { 'font-size': 16, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'string-harmonics-nodes',
    status: 'svg-overlay',
    sources: ['48fcee2683006bd15bb81c5f8806c034e40f7993.png'],
    output: 'string-harmonics-nodes.svg',
    alt: 'Standing-wave diagrams show an open string vibrating in several modes and a lightly touched string vibrating only in modes that have a node at the touch point.',
    width: 1080,
    height: 510,
    render({ overlay }) {
      const wave = (x, y, length, lobes, color, dashed = false) => {
        let d = `M ${x} ${y}`;
        const step = length / lobes;
        for (let i = 0; i < lobes; i += 1) {
          const direction = i % 2 ? -1 : 1;
          d += ` C ${x + step * (i + 0.25)} ${y - 45 * direction}, ${x + step * (i + 0.75)} ${y - 45 * direction}, ${x + step * (i + 1)} ${y}`;
        }
        overlay.path(d, { fill: 'none', stroke: color, 'stroke-width': 2.5, ...(dashed ? { 'stroke-dasharray': '7 6' } : {}) });
      };
      title(overlay, 'Open-string standing-wave modes', 300, 32);
      overlay.line(55, 62, 545, 62, { stroke: ink, 'stroke-width': 2 });
      [1, 2, 3, 4, 5].forEach((lobes, i) => wave(55, 95 + i * 62, 490, lobes, i % 2 ? blue : red));
      overlay.text('Nodes are fixed points where the string does not move.', 585, 150, { 'font-size': 14, 'data-line-height': 20 });
      title(overlay, 'Light touch at the marked point', 795, 32);
      overlay.line(615, 62, 1030, 62, { stroke: ink, 'stroke-width': 2 });
      overlay.line(823, 50, 823, 430, { stroke: '#666', 'stroke-width': 2, 'stroke-dasharray': '6 5' });
      overlay.circle(823, 62, 6, { fill: ink });
      wave(615, 125, 415, 2, red);
      wave(615, 220, 415, 4, blue);
      wave(615, 315, 415, 3, '#aaa', true);
      overlay.path('M 978 285 L 1032 340 M 1032 285 L 978 340', { stroke: red, 'stroke-width': 4 });
      overlay.text('Only modes with a node at the touch point continue to vibrate.\nIncompatible modes are silenced.', 820, 455, { 'font-size': 14, 'text-anchor': 'middle', 'data-line-height': 20 });
    },
  },
];
