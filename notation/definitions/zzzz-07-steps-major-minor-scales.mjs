import { drawKeyboard, drawStave, labelUnder, note } from '../figure-helpers.mjs';

const RED = '#d32f2f';
const BLUE = '#1565c0';

function pitch(key, accidental) {
  return accidental ? { key, duration: 'w', accidental } : { key, duration: 'w' };
}

function scale(keys, accidentals = {}) {
  return keys.map((key, index) => pitch(key, accidentals[index]));
}

function annotationArc(overlay, x1, x2, y, label, color = RED) {
  overlay.path(`M ${x1} ${y} Q ${(x1 + x2) / 2} ${y + 18} ${x2} ${y}`, {
    fill: 'none', stroke: color, 'stroke-width': 2,
  });
  if (label) overlay.text(label, (x1 + x2) / 2, y + 34, {
    fill: color, 'font-size': 14, 'text-anchor': 'middle',
  });
}

function drawPatternScale(VF, context, overlay, { y, clef = 'treble', notes, labels }) {
  drawStave(VF, context, { x: 30, y, width: 790, clef, notes, formatWidth: 650 });
  labelUnder(overlay, labels, 170, 82, y + 125, { 'font-size': 14, 'data-line-height': 17 });
  for (let i = 0; i < 7; i += 1) annotationArc(overlay, 139 + i * 82, 177 + i * 82, y + 83, '');
}

function drawScaleRow(VF, context, overlay, { y, title, clef = 'treble', notes, width = 720 }) {
  if (title) overlay.text(title, 22, y + 2, { 'font-size': 16 });
  drawStave(VF, context, { x: 65, y: y + 6, width, clef, notes, formatWidth: width - 125 });
}

function drawScaleWorksheet(VF, context, overlay, rows) {
  rows.forEach((row, index) => drawScaleRow(VF, context, overlay, { y: 22 + index * 126, ...row }));
}

function drawStartingNotes(VF, context, overlay, rows, columns = 4) {
  const cellWidth = 190;
  rows.forEach((row, index) => {
    const column = index % columns;
    const line = Math.floor(index / columns);
    const x = 25 + column * cellWidth;
    const y = 28 + line * 155;
    overlay.text(`${index + 1}.`, x, y + 5, { 'font-size': 16 });
    drawStave(VF, context, {
      x: x + 25, y: y + 8, width: 135, clef: row.clef ?? 'treble', notes: [row.note], formatWidth: 45,
    });
  });
}

function drawIntervalMeasures(VF, context, overlay, rows, showAnswers) {
  const labels = [
    ['3 half steps', '(1\u00bd steps)'], ['4 half steps', '(2 whole steps)'], ['8 half steps', '(4 whole steps)'], ['7 half steps', '(3\u00bd steps)'],
    ['5 half steps', '(2\u00bd steps)'], ['6 half steps', '(3 whole steps)'], ['7 half steps', '(3\u00bd whole steps)'], ['9 half steps', '(4\u00bd steps)'],
  ];
  rows.forEach((measures, rowIndex) => {
    const y = 30 + rowIndex * 210;
    measures.forEach((notes, measureIndex) => drawStave(VF, context, {
      x: 28 + measureIndex * 220, y, width: 220,
      clef: measureIndex === 0 ? (rowIndex === 0 ? 'treble' : 'bass') : null,
      time: measureIndex === 0 ? '4/4' : undefined,
      notes, formatWidth: measureIndex === 0 ? 95 : 130,
    }));
    if (showAnswers) measures.forEach((_, measureIndex) => {
      const answer = labels[rowIndex * 4 + measureIndex];
      overlay.text(`${answer[0]}\n${answer[1]}`, 138 + measureIndex * 220, y + 128, {
        'font-size': 15, 'text-anchor': 'middle', 'data-line-height': 19,
      });
    });
  });
}

function drawIntervalCompletion(VF, context, overlay, answers) {
  const rows = [
    { clef: 'treble', starts: [pitch('c/4'), pitch('c/5'), pitch('e/4'), pitch('b/4')], ends: [pitch('f/4'), pitch('b/4', 'b'), pitch('c/4'), pitch('d/4')] },
    { clef: 'treble', starts: [pitch('b/3', 'b'), pitch('c/5'), pitch('c/4'), pitch('b/4')], ends: [pitch('c/4', 'b'), pitch('b/4', 'b'), pitch('d/4', '#'), pitch('c/4')] },
    { clef: 'bass', starts: [pitch('d/3'), pitch('c/4'), pitch('e/3', 'b'), pitch('c/4')], ends: [pitch('a/3', '#'), pitch('a/3'), pitch('e/3'), pitch('d/3')] },
  ];
  const captions = [
    ['5 half steps higher', '1 whole step lower', '2 whole steps lower', '9 half steps lower'],
    ['1 whole step higher', '1 half step lower', '2 whole steps higher', '11 half steps lower'],
    ['3 whole steps higher', '3 half steps lower', '1 half step higher', '7 half steps lower'],
  ];
  rows.forEach((row, rowIndex) => {
    const y = 22 + rowIndex * 185;
    row.starts.forEach((start, measureIndex) => drawStave(VF, context, {
      x: 22 + measureIndex * 235, y, width: 235,
      clef: measureIndex === 0 ? row.clef : null,
      time: measureIndex === 0 ? '4/4' : undefined,
      notes: answers ? [start, row.ends[measureIndex]] : [start],
      formatWidth: measureIndex === 0 ? 110 : 145,
    }));
    labelUnder(overlay, captions[rowIndex], 140, 235, y + 125, { 'font-size': 14 });
  });
}

function drawMinorPatternDiagram(overlay) {
  overlay.text('Minor Scale Pattern:', 35, 40, { 'font-size': 19 });
  labelUnder(overlay, ['W', 'H', 'W', 'W', 'H', 'W', 'W'], 290, 66, 40, { 'font-size': 19 });
  overlay.text('Major Scale Pattern:', 35, 98, { 'font-size': 19 });
  labelUnder(overlay, ['W', 'W', 'H', 'W', 'W', 'W', 'H'], 356, 66, 98, { 'font-size': 19 });
  annotationArc(overlay, 273, 326, 48, '');
  annotationArc(overlay, 735, 788, 106, '');
  overlay.path('M 270 87 Q 245 115 295 124 Q 515 168 735 112', {
    fill: 'none', stroke: RED, 'stroke-width': 2, 'marker-end': 'url(#arrow)',
  });
  overlay.text('W = Whole\nStep', 85, 164, { 'font-size': 17, 'text-anchor': 'middle', 'data-line-height': 19 });
  overlay.text('H = Half\nStep', 210, 164, { 'font-size': 17, 'text-anchor': 'middle', 'data-line-height': 19 });
}

function drawTune(VF, context, overlay, { key, lines }) {
  lines.forEach((notes, index) => {
    const y = 30 + index * 175;
    const result = drawStave(VF, context, {
      x: 30, y, width: 920, clef: 'treble', key, time: index === 0 ? '6/8' : undefined,
      notes, formatWidth: 755, beams: true,
    });
    [1, 2, 3, 4].forEach((number, measure) => overlay.text(String(number), 190 + measure * 205, y - 2, {
      'font-size': 16, 'font-weight': '700', 'text-anchor': 'middle',
    }));
    return result;
  });
}

const majorWorksheetRows = [
  { title: '1. C major', notes: scale(['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5']) },
  { title: '2. G major', notes: scale(['g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5'], { 6: '#' }) },
  { title: '3. B flat major', notes: scale(['b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4'], { 0: 'b', 3: 'b', 7: 'b' }) },
  { title: '4. C sharp major', notes: scale(['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'], { 0: '#', 1: '#', 2: '#', 3: '#', 4: '#', 5: '#', 6: '#', 7: '#' }) },
  { title: '5. F sharp major', notes: scale(['f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5'], { 0: '#', 1: '#', 2: '#', 4: '#', 5: '#', 6: '#', 7: '#' }) },
  { title: '6. G flat major', notes: scale(['g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5'], { 0: 'b', 1: 'b', 2: 'b', 3: 'b', 4: 'b', 5: 'b', 7: 'b' }) },
  { title: '7. D major', clef: 'bass', notes: scale(['d/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3'], { 2: '#', 6: '#' }) },
  { title: '8. D flat major', clef: 'bass', notes: scale(['d/2', 'e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3'], { 0: 'b', 1: 'b', 3: 'b', 4: 'b', 5: 'b', 7: 'b' }) },
];

const naturalMinorRows = [
  { title: '1. A minor', notes: scale(['a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5']) },
  { title: '2. G minor', notes: scale(['g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5'], { 2: 'b', 5: 'b' }) },
  { title: '3. B flat minor', notes: scale(['b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4'], { 0: 'b', 2: 'b', 3: 'b', 5: 'b', 6: 'b', 7: 'b' }) },
  { title: '4. E minor', notes: scale(['e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5'], { 1: '#' }) },
  { title: '5. F minor', clef: 'bass', notes: scale(['f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3'], { 2: 'b', 3: 'b', 5: 'b', 6: 'b' }) },
  { title: '6. F sharp minor', clef: 'bass', notes: scale(['f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3'], { 0: '#', 1: '#', 4: '#', 7: '#' }) },
];

const harmonicMinorRows = [
  { ...naturalMinorRows[0], title: '1. A harmonic minor', notes: scale(['a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5'], { 6: '#' }) },
  { ...naturalMinorRows[1], title: '2. G harmonic minor', notes: scale(['g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5'], { 2: 'b', 5: 'b', 6: '#' }) },
  { ...naturalMinorRows[2], title: '3. B flat harmonic minor', notes: scale(['b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4'], { 0: 'b', 2: 'b', 3: 'b', 5: 'b', 7: 'b' }) },
  { ...naturalMinorRows[3], title: '4. E harmonic minor', notes: scale(['e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5'], { 1: '#', 6: '#' }) },
  { ...naturalMinorRows[4], title: '5. F harmonic minor', notes: scale(['f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3'], { 2: 'b', 3: 'b', 5: 'b', 7: 'b' }) },
  { ...naturalMinorRows[5], title: '6. F sharp harmonic minor', notes: scale(['f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3'], { 0: '#', 1: '#', 4: '#', 6: '#', 7: '#' }) },
];

function melodicMinorRow(title, clef, ascending, descending, upAccidentals, downAccidentals) {
  return { title, clef, notes: [...scale(ascending, upAccidentals), ...scale(descending, downAccidentals)] };
}

const melodicMinorRows = [
  melodicMinorRow('1. A melodic minor', 'treble', ['a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5'], ['g/5', 'f/5', 'e/5', 'd/5', 'c/5', 'b/4', 'a/4'], { 5: '#', 6: '#' }, { 0: 'n', 1: 'n' }),
  melodicMinorRow('2. G melodic minor', 'treble', ['g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5'], ['f/5', 'e/5', 'd/5', 'c/5', 'b/4', 'a/4', 'g/4'], { 2: 'b', 6: '#' }, { 0: 'n', 1: 'b', 4: 'b' }),
  melodicMinorRow('3. B flat melodic minor', 'treble', ['b/3', 'c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4'], ['a/4', 'g/4', 'f/4', 'e/4', 'd/4', 'c/4', 'b/3'], { 0: 'b', 2: 'b', 3: 'b', 7: 'b' }, { 0: 'b', 1: 'b', 3: 'b', 4: 'b', 6: 'b' }),
  melodicMinorRow('4. E melodic minor', 'treble', ['e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5'], ['d/5', 'c/5', 'b/4', 'a/4', 'g/4', 'f/4', 'e/4'], { 1: '#', 5: '#', 6: '#' }, { 0: 'n', 1: 'n', 5: '#' }),
  melodicMinorRow('5. F melodic minor', 'bass', ['f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3'], ['e/3', 'd/3', 'c/3', 'b/2', 'a/2', 'g/2', 'f/2'], { 2: 'b', 3: 'b', 7: 'b' }, { 0: 'b', 1: 'b', 3: 'b', 4: 'b' }),
  melodicMinorRow('6. F sharp melodic minor', 'bass', ['f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3', 'f/3'], ['e/3', 'd/3', 'c/3', 'b/2', 'a/2', 'g/2', 'f/2'], { 0: '#', 1: '#', 4: '#', 5: '#', 6: '#', 7: '#' }, { 0: 'n', 1: 'n', 2: '#', 4: '#', 5: '#', 6: '#' }),
];

export const definitions = [
  {
    id: 'keyboard-half-step-examples',
    sources: ['d82a33357abdd647d475688799c560541ab4b976.png'],
    output: 'keyboard-half-step-examples.svg',
    status: 'svg-overlay',
    alt: 'Piano keyboard showing the half steps C to C sharp, E to F, and G sharp to A.',
    width: 620, height: 330,
    render({ overlay }) {
      drawKeyboard(overlay, { x: 50, y: 35, whiteWidth: 72, whiteHeight: 250, whiteKeys: 7, labels: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] });
      overlay.text('C\u266f / D\u266d', 122, 137, { fill: 'white', 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text('G\u266f / A\u266d', 410, 137, { fill: 'white', 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle' });
      annotationArc(overlay, 82, 122, 245, 'half step');
      annotationArc(overlay, 250, 300, 245, 'half step');
      annotationArc(overlay, 410, 442, 245, 'half step');
    },
  },
  {
    id: 'staff-half-step-examples',
    sources: ['907a8fec9ebfdb3172252721a649c0f828e8dc95.png'],
    output: 'staff-half-step-examples.svg', status: 'vexflow-overlay',
    alt: 'Three notated half-step intervals: C to C sharp, E to F, and G sharp to A.',
    width: 900, height: 210,
    render({ VF, context, overlay }) {
      const pairs = [[pitch('c/4'), pitch('c/4', '#')], [pitch('e/4'), pitch('f/4')], [pitch('g/4', '#'), pitch('a/4')]];
      pairs.forEach((notes, index) => drawStave(VF, context, { x: 30 + index * 285, y: 35, width: 285, clef: index ? null : 'treble', time: index ? undefined : '4/4', notes, formatWidth: index ? 175 : 125 }));
      labelUnder(overlay, ['C\u2013C\u266f', 'E\u2013F', 'G\u266f\u2013A'], 165, 285, 175, { 'font-size': 16 });
    },
  },
  {
    id: 'ascending-chromatic-scale',
    sources: ['5fc8361206735d496da5e05f44513098a36d8b3f.png'],
    output: 'ascending-chromatic-scale.svg', status: 'vexflow-overlay',
    alt: 'Ascending chromatic scale from C to C, with every interval a half step.',
    width: 980, height: 210,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 35, y: 32, width: 910, notes: scale(['c/4', 'c/4', 'd/4', 'd/4', 'e/4', 'f/4', 'f/4', 'g/4', 'g/4', 'a/4', 'a/4', 'b/4', 'c/5'], { 1: '#', 3: '#', 6: '#', 8: '#', 10: '#' }), formatWidth: 760 });
      overlay.text('Every adjacent pair is one half step apart.', 490, 180, { 'font-size': 16, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'keyboard-whole-step-examples',
    sources: ['c052d75a73aff6b5e19b0f59781c5dfc6a342b8a.png'],
    output: 'keyboard-whole-step-examples.svg', status: 'svg-overlay',
    alt: 'Piano keyboard showing the whole steps C to D, E to F sharp, and G sharp to A sharp.',
    width: 620, height: 330,
    render({ overlay }) {
      drawKeyboard(overlay, { x: 50, y: 35, whiteWidth: 72, whiteHeight: 250, whiteKeys: 7, labels: ['C', 'D', 'E', 'F', 'G', 'A', 'B'] });
      overlay.text('F\u266f / G\u266d', 338, 137, { fill: 'white', 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text('G\u266f / A\u266d', 410, 137, { fill: 'white', 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text('A\u266f / B\u266d', 482, 137, { fill: 'white', 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle' });
      annotationArc(overlay, 82, 154, 245, 'whole step');
      annotationArc(overlay, 250, 338, 245, 'whole step');
      annotationArc(overlay, 410, 482, 245, 'whole step');
    },
  },
  {
    id: 'staff-whole-step-examples',
    sources: ['67efd497927b2a2a0fb20a89f8078e2d7465faf9.png'],
    output: 'staff-whole-step-examples.svg', status: 'vexflow-overlay',
    alt: 'Three notated whole-step intervals: C to D, E to F sharp, and G sharp to A sharp.',
    width: 900, height: 210,
    render({ VF, context, overlay }) {
      const pairs = [[pitch('c/4'), pitch('d/4')], [pitch('e/4'), pitch('f/4', '#')], [pitch('g/4', '#'), pitch('a/4', '#')]];
      pairs.forEach((notes, index) => drawStave(VF, context, { x: 30 + index * 285, y: 35, width: 285, clef: index ? null : 'treble', time: index ? undefined : '4/4', notes, formatWidth: index ? 175 : 125 }));
      labelUnder(overlay, ['C\u2013D', 'E\u2013F\u266f', 'G\u266f\u2013A\u266f'], 165, 285, 175, { 'font-size': 16 });
    },
  },
  {
    id: 'ascending-whole-tone-scale',
    sources: ['f5abaf8d7b97faf6bf1cdfc22af3397be9807f33.png'],
    output: 'ascending-whole-tone-scale.svg', status: 'vexflow-overlay',
    alt: 'Ascending whole-tone scale from C to C using only whole steps.',
    width: 800, height: 210,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 35, y: 32, width: 730, notes: scale(['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'c/5'], { 3: '#', 4: '#', 5: '#' }), formatWidth: 590 });
      overlay.text('W        W        W        W        W        W', 435, 175, { 'font-size': 16, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'five-half-steps-c-to-f',
    sources: ['a377eac1f99e6e98dbe1d2c0947a7626c7386da0.png'],
    output: 'five-half-steps-c-to-f.svg', status: 'vexflow-overlay',
    alt: 'Chromatic notes from C to F divided into five numbered half steps.',
    width: 780, height: 240,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 35, y: 30, width: 710, notes: scale(['c/4', 'c/4', 'd/4', 'd/4', 'e/4', 'f/4'], { 1: '#', 3: '#' }), formatWidth: 530 });
      for (let i = 0; i < 5; i += 1) annotationArc(overlay, 177 + i * 83, 218 + i * 83, 125, String(i + 1));
    },
  },
  {
    id: 'identify-intervals-in-steps-practice',
    sources: ['accff92080af0b6693ce2be1cd6200a6dfcb4c3e.png'],
    output: 'identify-intervals-in-steps-practice.svg', status: 'vexflow-overlay',
    alt: 'Eight pairs of whole notes in treble and bass clefs for identifying intervals in half and whole steps.',
    width: 940, height: 395,
    render({ VF, context, overlay }) {
      const rows = [
        [[pitch('c/4'), pitch('e/4')], [pitch('c/5'), pitch('g/4')], [pitch('e/4'), pitch('c/4', '#')], [pitch('e/5', 'b'), pitch('a/4', 'b')]],
        [[pitch('c/3'), pitch('e/3', 'b')], [pitch('c/4'), pitch('g/3')], [pitch('e/3'), pitch('f/3', '#')], [pitch('c/4'), pitch('f/3')]],
      ];
      drawIntervalMeasures(VF, context, overlay, rows, false);
    },
  },
  {
    id: 'identify-intervals-in-steps-solutions',
    sources: ['00f13232da90fddc8e6cd6c5bf22411c54ba182f.png'],
    output: 'identify-intervals-in-steps-solutions.svg', status: 'vexflow-overlay',
    alt: 'Solutions identifying eight intervals by their numbers of half steps and equivalent whole steps.',
    width: 940, height: 455,
    render({ VF, context, overlay }) {
      const rows = [
        [[pitch('c/4'), pitch('e/4')], [pitch('c/5'), pitch('g/4')], [pitch('e/4'), pitch('c/4', '#')], [pitch('e/5', 'b'), pitch('a/4', 'b')]],
        [[pitch('c/3'), pitch('e/3', 'b')], [pitch('c/4'), pitch('g/3')], [pitch('e/3'), pitch('f/3', '#')], [pitch('c/4'), pitch('f/3')]],
      ];
      drawIntervalMeasures(VF, context, overlay, rows, true);
    },
  },
  {
    id: 'complete-intervals-in-steps-practice',
    sources: ['ed35597f1a11d4911bcffeb59b94b7aa1357cfd1.png'],
    output: 'complete-intervals-in-steps-practice.svg', status: 'vexflow-overlay',
    alt: 'Twelve one-note interval exercises asking for a second note a specified number of half or whole steps higher or lower.',
    width: 980, height: 590,
    render({ VF, context, overlay }) { drawIntervalCompletion(VF, context, overlay, false); },
  },
  {
    id: 'complete-intervals-in-steps-solutions',
    sources: ['e1166e2deee2765a28a25c97f18b7751aa6c4174.png'],
    output: 'complete-intervals-in-steps-solutions.svg', status: 'vexflow-overlay',
    alt: 'Completed set of twelve intervals raised or lowered by specified numbers of half and whole steps.',
    width: 980, height: 590,
    render({ VF, context, overlay }) { drawIntervalCompletion(VF, context, overlay, true); },
  },
  {
    id: 'major-scale-step-pattern-examples',
    sources: ['31c995861b2dffd208346e79492b348278fc3c21.png'],
    output: 'major-scale-step-pattern-examples.svg', status: 'vexflow-overlay',
    alt: 'C major, D major, and E flat major scales illustrating the whole-whole-half-whole-whole-whole-half pattern.',
    width: 850, height: 520,
    render({ VF, context, overlay }) {
      const labels = ['Whole\nStep', 'Whole\nStep', 'Half\nStep', 'Whole\nStep', 'Whole\nStep', 'Whole\nStep', 'Half\nStep'];
      drawPatternScale(VF, context, overlay, { y: 15, notes: scale(['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5']), labels });
      drawPatternScale(VF, context, overlay, { y: 180, notes: scale(['d/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5'], { 2: '#', 6: '#' }), labels: ['W', 'W', 'H', 'W', 'W', 'W', 'H'] });
      drawPatternScale(VF, context, overlay, { y: 345, clef: 'bass', notes: scale(['e/2', 'f/2', 'g/2', 'a/2', 'b/2', 'c/3', 'd/3', 'e/3'], { 0: 'b', 3: 'b', 4: 'b', 7: 'b' }), labels: [] });
    },
  },
  {
    id: 'major-scale-starting-notes-practice',
    sources: ['5fe66d86c6389d14990425c15ae7fb3b3a57697a.png'],
    output: 'major-scale-starting-notes-practice.svg', status: 'vexflow-overlay',
    alt: 'Eight starting notes for writing C, G, B flat, C sharp, F sharp, G flat, D, and D flat major scales.',
    width: 790, height: 330,
    render({ VF, context, overlay }) {
      drawStartingNotes(VF, context, overlay, [
        { note: pitch('c/4') }, { note: pitch('g/4') }, { note: pitch('b/3', 'b') }, { note: pitch('c/4', '#') },
        { note: pitch('f/4', '#') }, { note: pitch('g/4', 'b') }, { clef: 'bass', note: pitch('d/2') }, { clef: 'bass', note: pitch('d/2', 'b') },
      ]);
    },
  },
  {
    id: 'major-scale-writing-solutions',
    sources: ['33960a69fd3a1c138c9f46079f7a2c93120c758b.png'],
    output: 'major-scale-writing-solutions.svg', status: 'vexflow-overlay',
    alt: 'Ascending C, G, B flat, C sharp, F sharp, G flat, D, and D flat major scales with accidentals.',
    width: 850, height: 1040,
    render({ VF, context, overlay }) { drawScaleWorksheet(VF, context, overlay, majorWorksheetRows); },
  },
  {
    id: 'enharmonic-f-sharp-g-flat-major-keyboard',
    sources: ['f01bba67e1e7c2db689d526b14cff7a4a3ff2731.png'],
    output: 'enharmonic-f-sharp-g-flat-major-keyboard.svg', status: 'svg-overlay',
    alt: 'Piano keyboard labeling the same keys with the enharmonic spellings of F sharp major and G flat major.',
    width: 760, height: 390,
    render({ overlay }) {
      drawKeyboard(overlay, { x: 40, y: 30, whiteWidth: 62, whiteHeight: 300, whiteKeys: 11, labels: [] });
      const positions = [75, 102, 164, 226, 253, 315, 377, 404, 466, 528, 555, 617];
      const sharpNames = ['F\u266f', 'G\u266f', 'A\u266f', 'B', 'C\u266f', 'D\u266f', 'E\u266f', 'F\u266f', 'G\u266f'];
      const flatNames = ['G\u266d', 'A\u266d', 'B\u266d', 'C\u266d', 'D\u266d', 'E\u266d', 'F', 'G\u266d'];
      sharpNames.forEach((name, index) => overlay.text(name, positions[index], 145 + (index % 2) * 25, { fill: RED, 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle' }));
      flatNames.forEach((name, index) => overlay.text(name, positions[index + 1], 205 + (index % 2) * 25, { fill: BLUE, 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle' }));
      overlay.text('red: F\u266f major spellings    blue: G\u266d major spellings', 380, 370, { 'font-size': 16, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'row-row-row-your-boat-g-major',
    sources: ['69649de4d01e03b1a54bb17cfdf8d9c209999c25.png'],
    output: 'row-row-row-your-boat-g-major.svg', status: 'vexflow-overlay',
    alt: 'Row, Row, Row Your Boat notated in G major on two six-eight staves.',
    width: 980, height: 365,
    render({ VF, context, overlay }) {
      drawTune(VF, context, overlay, { key: 'G', lines: [
        [note(VF, { key: 'g/4', dots: 1 }), note(VF, { key: 'g/4', dots: 1 }), { key: 'g/4' }, { key: 'a/4', duration: '8' }, note(VF, { key: 'b/4', dots: 1 }), { key: 'b/4' }, { key: 'a/4', duration: '8' }, { key: 'b/4' }, { key: 'c/5', duration: '8' }, note(VF, { key: 'd/5', duration: 'h', dots: 1 })],
        [...Array.from({ length: 3 }, () => ({ key: 'g/5', duration: '8' })), ...Array.from({ length: 3 }, () => ({ key: 'd/5', duration: '8' })), ...Array.from({ length: 3 }, () => ({ key: 'b/4', duration: '8' })), ...Array.from({ length: 3 }, () => ({ key: 'g/4', duration: '8' })), { key: 'd/5' }, { key: 'c/5', duration: '8' }, note(VF, { key: 'b/4', dots: 1 })],
      ] });
    },
  },
  {
    id: 'row-row-row-your-boat-d-major',
    sources: ['a94f0c85403290b9f224235520bb523cac694b58.png'],
    output: 'row-row-row-your-boat-d-major.svg', status: 'vexflow-overlay',
    alt: 'Row, Row, Row Your Boat transposed to D major on two six-eight staves.',
    width: 980, height: 365,
    render({ VF, context, overlay }) {
      drawTune(VF, context, overlay, { key: 'D', lines: [
        [note(VF, { key: 'd/4', dots: 1 }), note(VF, { key: 'd/4', dots: 1 }), { key: 'd/4' }, { key: 'e/4', duration: '8' }, note(VF, { key: 'f/4', dots: 1 }), { key: 'f/4' }, { key: 'e/4', duration: '8' }, { key: 'f/4' }, { key: 'g/4', duration: '8' }, note(VF, { key: 'a/4', duration: 'h', dots: 1 })],
        [...Array.from({ length: 3 }, () => ({ key: 'd/5', duration: '8' })), ...Array.from({ length: 3 }, () => ({ key: 'a/4', duration: '8' })), ...Array.from({ length: 3 }, () => ({ key: 'f/4', duration: '8' })), ...Array.from({ length: 3 }, () => ({ key: 'd/4', duration: '8' })), { key: 'a/4' }, { key: 'g/4', duration: '8' }, note(VF, { key: 'f/4', dots: 1 })],
      ] });
    },
  },
  {
    id: 'natural-minor-scale-step-pattern-examples',
    sources: ['2777c8f46803b9ecab65f8d81f77ad2050678285.png'],
    output: 'natural-minor-scale-step-pattern-examples.svg', status: 'vexflow-overlay',
    alt: 'C minor, G minor, and B minor scales illustrating the whole-half-whole-whole-half-whole-whole pattern.',
    width: 850, height: 520,
    render({ VF, context, overlay }) {
      const labels = ['Whole\nStep', 'Half\nStep', 'Whole\nStep', 'Whole\nStep', 'Half\nStep', 'Whole\nStep', 'Whole\nStep'];
      drawPatternScale(VF, context, overlay, { y: 15, notes: scale(['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'], { 2: 'b', 5: 'b', 6: 'b' }), labels });
      drawPatternScale(VF, context, overlay, { y: 180, notes: scale(['g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5'], { 2: 'b', 5: 'b' }), labels: ['W', 'H', 'W', 'W', 'H', 'W', 'W'] });
      drawPatternScale(VF, context, overlay, { y: 345, clef: 'bass', notes: scale(['b/2', 'c/3', 'd/3', 'e/3', 'f/3', 'g/3', 'a/3', 'b/3'], { 1: '#', 4: '#' }), labels: [] });
    },
  },
  {
    id: 'natural-minor-starting-notes-practice',
    sources: ['ba0dba3f6286193381242d9b0711ead164b86d22.png'],
    output: 'natural-minor-starting-notes-practice.svg', status: 'vexflow-overlay',
    alt: 'Six starting notes for writing A, G, B flat, E, F, and F sharp natural minor scales.',
    width: 620, height: 420,
    render({ VF, context, overlay }) {
      drawStartingNotes(VF, context, overlay, [
        { note: pitch('a/4') }, { note: pitch('g/4') }, { note: pitch('b/3', 'b') },
        { note: pitch('e/4') }, { clef: 'bass', note: pitch('f/2') }, { clef: 'bass', note: pitch('f/2', '#') },
      ], 3);
    },
  },
  {
    id: 'natural-minor-scale-writing-solutions',
    sources: ['e97ebaee5739acf24c4d7dc6feccc27dc370c60f.png'],
    output: 'natural-minor-scale-writing-solutions.svg', status: 'vexflow-overlay',
    alt: 'Ascending A, G, B flat, E, F, and F sharp natural minor scales with accidentals.',
    width: 850, height: 790,
    render({ VF, context, overlay }) { drawScaleWorksheet(VF, context, overlay, naturalMinorRows); },
  },
  {
    id: 'relative-major-minor-patterns',
    sources: ['a8776d89f6a51e624c2db48e9c48bc0764ae48c7.png'],
    output: 'relative-major-minor-patterns.svg', status: 'svg-overlay',
    alt: 'Minor and major scale interval patterns aligned to show that relative keys use the same repeating sequence.',
    width: 830, height: 230,
    render({ overlay }) { drawMinorPatternDiagram(overlay); },
  },
  {
    id: 'c-major-c-minor-e-flat-major-comparison',
    sources: ['b0cd8d8b9bbd822479fb9d5033b13dec772f8974.png'],
    output: 'c-major-c-minor-e-flat-major-comparison.svg', status: 'vexflow-overlay',
    alt: 'C major with no sharps or flats, C minor with three flats, and E flat major with the same three-flat key signature.',
    width: 900, height: 500,
    render({ VF, context, overlay }) {
      drawScaleRow(VF, context, overlay, { y: 10, title: 'C major: no flats or sharps', notes: scale(['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5']), width: 790 });
      drawScaleRow(VF, context, overlay, { y: 165, title: 'C minor: three flats', notes: scale(['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5'], { 2: 'b', 5: 'b', 6: 'b' }), width: 790 });
      drawScaleRow(VF, context, overlay, { y: 320, title: 'E flat major: three flats', notes: scale(['e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5', 'e/5'], { 0: 'b', 3: 'b', 4: 'b', 7: 'b' }), width: 790 });
    },
  },
  {
    id: 'a-natural-harmonic-melodic-minor-comparison',
    sources: ['a1f2ff78adb5c4959eb1646d233b415623c18b62.png'],
    output: 'a-natural-harmonic-melodic-minor-comparison.svg', status: 'vexflow-overlay',
    alt: 'Ascending and descending A natural, harmonic, and melodic minor scales showing their differing sixth and seventh degrees.',
    width: 980, height: 530,
    render({ VF, context, overlay }) {
      const up = ['a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5'];
      const down = ['g/5', 'f/5', 'e/5', 'd/5', 'c/5', 'b/4', 'a/4'];
      drawScaleRow(VF, context, overlay, { y: 10, title: 'A Natural Minor', notes: [...scale(up), ...scale(down)], width: 860 });
      drawScaleRow(VF, context, overlay, { y: 175, title: 'A Harmonic Minor', notes: [...scale(up, { 6: '#' }), ...scale(down, { 0: '#' })], width: 860 });
      drawScaleRow(VF, context, overlay, { y: 340, title: 'A Melodic Minor', notes: [...scale(up, { 5: '#', 6: '#' }), ...scale(down, { 0: 'n', 1: 'n' })], width: 860 });
    },
  },
  {
    id: 'harmonic-minor-scale-writing-solutions',
    sources: ['e1b491fc3b7d78fbc33815435de84ee7f561d5a6.png'],
    output: 'harmonic-minor-scale-writing-solutions.svg', status: 'vexflow-overlay',
    alt: 'Ascending A, G, B flat, E, F, and F sharp harmonic minor scales with raised seventh degrees.',
    width: 850, height: 790,
    render({ VF, context, overlay }) { drawScaleWorksheet(VF, context, overlay, harmonicMinorRows); },
  },
  {
    id: 'melodic-minor-scale-writing-solutions',
    sources: ['f51253382ce0d354c87f28eccca901df1572a59d.png'],
    output: 'melodic-minor-scale-writing-solutions.svg', status: 'vexflow-overlay',
    alt: 'Ascending and descending A, G, B flat, E, F, and F sharp melodic minor scales with altered sixth and seventh degrees.',
    width: 1120, height: 790,
    render({ VF, context, overlay }) { drawScaleWorksheet(VF, context, overlay, melodicMinorRows.map((row) => ({ ...row, width: 990 }))); },
  },
  {
    id: 'dorian-minor-step-pattern',
    sources: ['6ea761be1de458aa09f079da4fad0c8242e99384.png'],
    output: 'dorian-minor-step-pattern.svg', status: 'vexflow-overlay',
    alt: 'Ascending D Dorian scale on the natural notes, labeled whole-half-whole-whole-whole-half-whole.',
    width: 820, height: 230,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 35, y: 25, width: 750, notes: scale(['d/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5']), formatWidth: 610 });
      labelUnder(overlay, ['W', 'H', 'W', 'W', 'W', 'H', 'W'], 180, 75, 180, { 'font-size': 16 });
    },
  },
  {
    id: 'natural-minor-dorian-comparison',
    sources: ['cd98d77f2674afd1193634b92473e350a5a9c78e.png'],
    output: 'natural-minor-dorian-comparison.svg', status: 'vexflow-overlay',
    alt: 'D natural minor and D Dorian scales compared, differing only at the sixth degree: B flat versus B natural.',
    width: 900, height: 330,
    render({ VF, context, overlay }) {
      drawScaleRow(VF, context, overlay, { y: 10, title: 'Natural', notes: scale(['d/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5'], { 5: 'b' }), width: 770 });
      drawScaleRow(VF, context, overlay, { y: 165, title: 'Dorian', notes: scale(['d/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'c/5', 'd/5']), width: 770 });
    },
  },
  {
    id: 'a-minor-types-with-dorian-comparison',
    sources: ['a9d8197d91fd07725f686061378aee0f88ed1d8f.png'],
    output: 'a-minor-types-with-dorian-comparison.svg', status: 'vexflow-overlay',
    alt: 'A natural, harmonic, melodic, and Dorian minor scales compared in ascending and descending form.',
    width: 980, height: 690,
    render({ VF, context, overlay }) {
      const up = ['a/4', 'b/4', 'c/5', 'd/5', 'e/5', 'f/5', 'g/5', 'a/5'];
      const down = ['g/5', 'f/5', 'e/5', 'd/5', 'c/5', 'b/4', 'a/4'];
      drawScaleRow(VF, context, overlay, { y: 5, title: 'A Natural Minor', notes: [...scale(up), ...scale(down)], width: 860 });
      drawScaleRow(VF, context, overlay, { y: 165, title: 'A Harmonic Minor', notes: [...scale(up, { 6: '#' }), ...scale(down, { 0: '#' })], width: 860 });
      drawScaleRow(VF, context, overlay, { y: 325, title: 'A Melodic Minor', notes: [...scale(up, { 5: '#', 6: '#' }), ...scale(down, { 0: 'n', 1: 'n' })], width: 860 });
      drawScaleRow(VF, context, overlay, { y: 485, title: 'A Dorian Minor', notes: [...scale(up, { 5: '#' }), ...scale(down, { 1: '#' })], width: 860 });
    },
  },
];
