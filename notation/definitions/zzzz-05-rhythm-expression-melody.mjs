import { drawStave, note } from '../figure-helpers.mjs';

const red = '#d32f2f';
const blue = '#1565c0';
const green = '#2e7d32';
const pink = '#d81b60';

function arrow(overlay, x, y1, y2, color = red) {
  overlay.line(x, y1, x, y2, { stroke: color, 'stroke-width': 2 });
  overlay.path(`M ${x - 7} ${y2 - 9} L ${x} ${y2} L ${x + 7} ${y2 - 9}`, { fill: 'none', stroke: color, 'stroke-width': 2 });
}

function bracket(overlay, x1, x2, y, label, color = '#111') {
  overlay.path(`M ${x1} ${y + 12} V ${y} H ${x2} V ${y + 12}`, { fill: 'none', stroke: color, 'stroke-width': 2 });
  overlay.text(label, (x1 + x2) / 2, y - 6, { fill: color, 'font-size': 17, 'font-weight': '700', 'text-anchor': 'middle' });
}

function curve(overlay, x1, y1, x2, y2, rise = 24, color = '#111') {
  overlay.path(`M ${x1} ${y1} Q ${(x1 + x2) / 2} ${Math.min(y1, y2) - rise} ${x2} ${y2}`, { fill: 'none', stroke: color, 'stroke-width': 2.2 });
}

function label(overlay, value, x, y, attributes = {}) {
  overlay.text(value, x, y, { 'font-size': 17, ...attributes });
}

function drawCoda(overlay, x, y, size = 13, color = red) {
  overlay.circle(x, y, size, { fill: 'none', stroke: color, 'stroke-width': 2.4 });
  overlay.line(x - size - 7, y, x + size + 7, y, { stroke: color, 'stroke-width': 2.4 });
  overlay.line(x, y - size - 7, x, y + size + 7, { stroke: color, 'stroke-width': 2.4 });
}

function drawSegno(overlay, x, y, color = red) {
  overlay.path(`M ${x - 13} ${y + 11} C ${x + 18} ${y + 1}, ${x + 14} ${y - 19}, ${x - 5} ${y - 16} C ${x - 22} ${y - 13}, ${x - 18} ${y + 8}, ${x + 11} ${y + 17}`, { fill: 'none', stroke: color, 'stroke-width': 2.6 });
  overlay.line(x - 16, y + 20, x + 17, y - 22, { stroke: color, 'stroke-width': 2.1 });
  overlay.circle(x - 18, y - 7, 2.8, { fill: color });
  overlay.circle(x + 18, y + 7, 2.8, { fill: color });
}

function dynamicsAccentNotes(VF) {
  const marks = ['a>', 'a>', 'a^', 'a^', 'a^', null, null];
  return marks.map((code, index) => {
    const staveNote = note(VF, { key: index < 5 ? 'b/4' : 'd/4', duration: index < 5 ? '8' : 'h', dots: index >= 5 ? 1 : 0 });
    if (code) staveNote.addModifier(new VF.Articulation(code).setPosition(VF.Modifier.Position.ABOVE), 0);
    return staveNote;
  });
}

function drawRoadmapStave(VF, context, x, y, notes, width = 520, time = '4/4') {
  return drawStave(VF, context, { x, y, width, time, notes, formatWidth: width - 150, beams: true });
}

export const definitions = [
  {
    id: 'beat-grouping-by-time-signature',
    status: 'vexflow-overlay',
    sources: ['fefd427443e72ac2f4a849fd2250c004da0683d2.png'],
    output: 'beat-grouping-by-time-signature.svg',
    alt: 'The same note values grouped in one-one, two-two, and four-four time, with red arrows marking one, two, or four beat beginnings per measure.',
    width: 900,
    height: 500,
    render({ VF, context, overlay }) {
      const rows = [
        { y: 35, time: '1/1', notes: [{ key: 'b/4', duration: 'w' }, { key: 'b/4', duration: 'h' }, { key: 'b/4', duration: 'h' }, ...Array.from({ length: 4 }, () => ({ key: 'b/4', duration: 'q' })), ...Array.from({ length: 8 }, () => ({ key: 'b/4', duration: '8' }))], arrows: [165, 365, 555] },
        { y: 175, time: '2/2', notes: [{ key: 'b/4', duration: 'w' }, { key: 'b/4', duration: 'h' }, { key: 'b/4', duration: 'h' }, ...Array.from({ length: 4 }, () => ({ key: 'b/4', duration: 'q' })), ...Array.from({ length: 8 }, () => ({ key: 'b/4', duration: '8' }))], arrows: [125, 220, 315, 410, 505, 600, 695] },
        { y: 315, time: '4/4', notes: [{ key: 'b/4', duration: 'w' }, { key: 'b/4', duration: 'h' }, { key: 'b/4', duration: 'h' }, ...Array.from({ length: 4 }, () => ({ key: 'b/4', duration: 'q' })), ...Array.from({ length: 8 }, () => ({ key: 'b/4', duration: '8' }))], arrows: [105, 145, 185, 225, 295, 335, 375, 415, 500, 545, 590, 635] },
      ];
      rows.forEach(({ y, time, notes, arrows }) => {
        drawStave(VF, context, { x: 45, y, width: 810, time, notes, formatWidth: 670, beams: true });
        arrows.forEach((x) => arrow(overlay, x, y - 5, y + 23));
      });
      arrow(overlay, 60, 453, 478);
      label(overlay, '= beginning of a beat', 85, 480, { fill: red, 'font-weight': '700' });
    },
  },
  {
    id: 'equivalent-two-four-rhythms',
    status: 'vexflow-overlay',
    sources: ['e2f8f09813a0e0bff4ecb4cb571a114b3f6163b0.png'],
    output: 'equivalent-two-four-rhythms.svg',
    alt: 'Two rhythmically equivalent melodies in two-four time: the upper at quarter note equals 116 and the lower in doubled note values at half note equals 116.',
    width: 920,
    height: 330,
    render({ VF, context, overlay }) {
      const upper = [{ key: 'd/4', duration: 'q' }, { key: 'd/4', duration: '8' }, { key: 'g/4', duration: '16' }, { key: 'a/4', duration: '16' }, { key: 'a/4', duration: '8' }, { key: 'a/4', duration: 'q' }, { key: 'd/4', duration: '8' }, { key: 'a/4', duration: '16' }, { key: 'b/4', duration: '16' }, note(VF, { key: 'c/5', duration: 'q', dots: 1 }), { key: 'd/4', duration: '8' }, { key: 'd/4', duration: '8' }, { rest: true, duration: 'q' }];
      const lower = [{ key: 'd/4', duration: 'h' }, { key: 'd/4', duration: 'q' }, { key: 'g/4', duration: '8' }, { key: 'a/4', duration: '8' }, { key: 'a/4', duration: 'q' }, { key: 'a/4', duration: 'h' }, { key: 'd/4', duration: 'q' }, { key: 'a/4', duration: '8' }, { key: 'b/4', duration: '8' }, note(VF, { key: 'c/5', duration: 'h', dots: 1 }), { key: 'd/4', duration: 'q' }, { key: 'd/4', duration: 'h' }, { rest: true, duration: 'h' }];
      drawStave(VF, context, { x: 45, y: 45, width: 830, key: 'G', time: '2/4', notes: upper, formatWidth: 670, beams: true });
      drawStave(VF, context, { x: 45, y: 195, width: 830, key: 'G', time: '2/2', notes: lower, formatWidth: 670, beams: true });
      label(overlay, 'Quarter note = 116', 60, 35, { 'font-weight': '700' });
      label(overlay, 'Half note = 116', 60, 185, { 'font-weight': '700' });
    },
  },
  {
    id: 'compound-six-eight-beats',
    status: 'vexflow-overlay',
    sources: ['540d38c5d4317268ef6344e38f6f46e2e352e370.png'],
    output: 'compound-six-eight-beats.svg',
    alt: 'A six-eight rhythm with arrows showing two dotted-quarter beats, each divided into three eighth-note pulses.',
    width: 760,
    height: 250,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 65, width: 670, time: '6/8', notes: [note(VF, { key: 'b/4', duration: 'q', dots: 1 }), { key: 'b/4', duration: '8' }, { key: 'b/4', duration: '8' }, { key: 'b/4', duration: 'q' }, note(VF, { key: 'b/4', duration: 'q', dots: 1 })], formatWidth: 520, beams: true });
      [160, 245, 370, 500, 590].forEach((x) => arrow(overlay, x, 20, 55));
      arrow(overlay, 75, 185, 215);
      label(overlay, '= beginning of a beat', 105, 218, { fill: red, 'font-weight': '700' });
    },
  },
  {
    id: 'common-meter-counting-chart',
    status: 'svg-overlay',
    sources: ['77f33d1d601bfa5087cad774ba9e409e87922dd4.png'],
    output: 'common-meter-counting-chart.svg',
    alt: 'Chart of simple and compound duple, triple, and quadruple meters with count syllables and example time signatures.',
    width: 930,
    height: 390,
    render({ overlay }) {
      const rows = [
        ['Duple simple', '1  &  2  &', '2/4'],
        ['Triple simple', '1  &  2  &  3  &', '3/4'],
        ['Quadruple simple', '1  &  2  &  3  &  4  &', '4/4'],
        ['Duple compound', '1  &  a  2  &  a', '6/8'],
        ['Triple compound', '1  &  a  2  &  a  3  &  a', '9/8'],
        ['Quadruple compound', '1  &  a  2  &  a  3  &  a  4  &  a', '12/8'],
      ];
      label(overlay, 'Meter', 45, 38, { 'font-size': 20, 'font-weight': '700' });
      label(overlay, 'Count', 350, 38, { 'font-size': 20, 'font-weight': '700' });
      label(overlay, 'Example time signature', 735, 38, { 'font-size': 20, 'font-weight': '700' });
      rows.forEach(([meter, count, signature], index) => {
        const y = 84 + index * 49;
        overlay.line(35, y + 15, 890, y + 15, { stroke: '#ef6c5b', 'stroke-width': 1.5 });
        label(overlay, meter, 45, y);
        const syllables = count.split('  ');
        syllables.forEach((syllable, syllableIndex) => {
          const x = 360 + syllableIndex * 42;
          overlay.path(`M ${x - 15} ${y - 25} H ${x + 15} V ${y + 12} H ${x - 15} Z`, { fill: syllable === '&' || syllable === 'a' ? '#ffeb3b' : '#43a047', stroke: 'none' });
          label(overlay, syllable, x, y + 3, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' });
        });
        label(overlay, signature, 810, y, { 'font-size': 19, 'text-anchor': 'middle' });
      });
    },
  },
  {
    id: 'mixed-meter-boris-godunov',
    status: 'vexflow-overlay',
    sources: ['20477f21bfabd1ca700d9d8d578fbbeb218fc823.png'],
    output: 'mixed-meter-boris-godunov.svg',
    alt: 'A melody from Boris Godunov changing from three-four to five-four and back to three-four time.',
    width: 900,
    height: 190,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 35, y: 55, width: 830, key: 'A', time: '3/4', notes: [{ rest: true, duration: 'q' }, { key: 'e/4', duration: '8' }, { key: 'd/4', duration: 'q' }, { key: 'e/4', duration: '8' }, { key: 'e/4', duration: 'q' }, { key: 'a/4', duration: 'q' }, { rest: true, duration: 'q' }, { key: 'g/4', duration: '8' }, { key: 'e/4', duration: 'q' }, { key: 'd/4', duration: '8' }, { key: 'e/4', duration: 'q' }, { key: 'b/3', duration: 'q' }, { rest: true, duration: '8' }, { key: 'd/4', duration: '8' }, { key: 'e/4', duration: 'q' }], formatWidth: 670, beams: true });
      label(overlay, '3/4', 815, 45, { 'font-weight': '700' });
      label(overlay, '5/4', 390, 45, { 'font-weight': '700' });
    },
  },
  {
    id: 'pickup-measure-completion',
    status: 'vexflow-overlay',
    sources: ['8cdcdfc87f3ef226a369d3b33e3e1be142063a0a.png'],
    output: 'pickup-measure-completion.svg',
    alt: 'Two examples in which a short opening pickup measure and shortened final measure together equal one complete measure.',
    width: 900,
    height: 330,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 40, y: 40, width: 820, time: 'C', notes: [{ key: 'c/4', duration: 'q' }, { key: 'd/4', duration: 'q' }, { key: 'e/4', duration: 'q' }, { key: 'f/4', duration: 'q' }, { key: 'g/4', duration: 'q' }, { key: 'a/4', duration: 'h' }, { key: 'g/4', duration: 'w' }], formatWidth: 650 });
      drawStave(VF, context, { x: 40, y: 185, width: 820, time: '3/4', notes: [{ key: 'c/4', duration: '8' }, { key: 'd/4', duration: '8' }, note(VF, { key: 'e/4', duration: 'q', dots: 1 }), { key: 'd/4', duration: '8' }, { key: 'c/4', duration: 'q' }, note(VF, { key: 'b/3', duration: 'q', dots: 1 }), { key: 'c/4', duration: '8' }], formatWidth: 650, beams: true });
      label(overlay, 'pickup', 105, 28, { fill: blue, 'font-weight': '700' });
      label(overlay, 'shortened final measure', 710, 28, { fill: blue, 'font-weight': '700' });
      label(overlay, 'pickup', 105, 173, { fill: blue, 'font-weight': '700' });
      label(overlay, 'shortened final measure', 710, 173, { fill: blue, 'font-weight': '700' });
    },
  },
  {
    id: 'four-phrases-with-pickups',
    status: 'vexflow-overlay',
    sources: ['1064d35194f9c5ffefc3f50c0ca0e338f6426d44.png'],
    output: 'four-phrases-with-pickups.svg',
    alt: 'Four labelled melodic phrases, each beginning with one or two red pickup notes before its downbeat.',
    width: 920,
    height: 360,
    render({ VF, context, overlay }) {
      const phrases = [
        { x: 35, y: 55, title: 'Phrase 1', keys: ['b/4', 'c/5', 'b/4', 'a/4', 'g/4', 'e/4'], pickups: 2 },
        { x: 475, y: 55, title: 'Phrase 2', keys: ['d/4', 'e/4', 'g/4', 'a/4', 'b/4'], pickups: 1 },
        { x: 35, y: 220, title: 'Phrase 3', keys: ['d/5', 'c/5', 'b/4', 'a/4', 'g/4', 'e/4'], pickups: 2 },
        { x: 475, y: 220, title: 'Phrase 4', keys: ['e/4', 'd/4', 'c/4', 'd/4', 'e/4', 'g/4'], pickups: 1 },
      ];
      phrases.forEach(({ x, y, title, keys, pickups }) => {
        drawStave(VF, context, { x, y, width: 405, key: 'G', notes: keys.map((key, index) => ({ key, duration: index === keys.length - 1 ? 'h' : 'q' })), formatWidth: 300 });
        label(overlay, title, x + 200, y - 12, { 'font-weight': '700', 'text-anchor': 'middle' });
        for (let index = 0; index < pickups; index += 1) arrow(overlay, x + 95 + index * 40, y + 108, y + 83);
      });
    },
  },
  {
    id: 'pickup-notes-across-repeat-barline',
    status: 'vexflow-overlay',
    sources: ['8872ae6e6d44368fdf861fbcc6de3343180854cb.png'],
    output: 'pickup-notes-across-repeat-barline.svg',
    alt: 'A melody whose measure is interrupted by a repeat barline so the following pickup notes belong to the repeated section.',
    width: 900,
    height: 190,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 40, y: 55, width: 820, key: 'E', time: '2/4', notes: [{ key: 'e/4', duration: '16' }, { key: 'd/4', duration: '8' }, { key: 'b/3', duration: 'q' }, { key: 'b/3', duration: '8' }, { key: 'c/4', duration: '16' }, { key: 'd/4', duration: '16' }, { key: 'e/4', duration: '8' }, { key: 'e/4', duration: '8' }, { key: 'd/4', duration: 'q' }, { key: 'e/4', duration: '8' }, { key: 'g/4', duration: '16' }, { key: 'a/4', duration: '16' }], formatWidth: 650, beams: true });
      overlay.line(615, 57, 615, 138, { stroke: '#111', 'stroke-width': 5 });
      overlay.circle(605, 93, 3.5, { fill: '#111' });
      overlay.circle(605, 108, 3.5, { fill: '#111' });
      label(overlay, 'repeat barline inside the measure', 615, 175, { fill: blue, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'dotted-duration-practice',
    status: 'svg-overlay',
    sources: ['b38c68f9b7567902f35080c958b602133e1646f3.png'],
    output: 'dotted-duration-practice.svg',
    alt: 'Practice equations asking for a dotted note or rest that equals the note values shown on the left.',
    width: 820,
    height: 480,
    render({ overlay }) {
      const prompts = ['whole = half +', 'whole = quarter + quarter + eighth +', 'whole + quarter + quarter =', 'quarter + eighth =', 'quarter = sixteenth +', 'quarter + half =', 'quarter + half =', 'eighth rest + eighth rest ='];
      prompts.forEach((prompt, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const x = 35 + col * 405;
        const y = 55 + row * 100;
        label(overlay, prompt, x, y, { 'font-size': 18 });
        overlay.path(`M ${x + 250} ${y - 35} H ${x + 360} V ${y + 35} H ${x + 250} Z`, { fill: 'white', stroke: '#555', 'stroke-width': 2 });
      });
    },
  },
  {
    id: 'dotted-duration-practice-solutions',
    status: 'svg-overlay',
    sources: ['aea8aa79be190e40bc0147148906d1647e4b1b83.png'],
    output: 'dotted-duration-practice-solutions.svg',
    alt: 'Completed dotted-duration equations with dotted half, whole, quarter, eighth, and dotted rests shown in red.',
    width: 820,
    height: 480,
    render({ overlay }) {
      const rows = [
        ['whole = half +', 'dotted half'], ['whole = quarter + quarter + eighth +', 'dotted quarter'],
        ['whole + quarter + quarter =', 'dotted whole'], ['quarter + eighth =', 'dotted quarter'],
        ['quarter = sixteenth +', 'dotted eighth'], ['quarter + half =', 'dotted half'],
        ['quarter + half =', 'dotted half'], ['eighth rest + eighth rest =', 'dotted quarter rest'],
      ];
      rows.forEach(([prompt, answer], index) => {
        const x = 35 + (index % 2) * 405;
        const y = 55 + Math.floor(index / 2) * 100;
        label(overlay, prompt, x, y, { 'font-size': 18 });
        overlay.path(`M ${x + 250} ${y - 35} H ${x + 360} V ${y + 35} H ${x + 250} Z`, { fill: 'white', stroke: '#555', 'stroke-width': 2 });
        label(overlay, answer, x + 305, y + 5, { fill: red, 'font-size': 15, 'font-weight': '700', 'text-anchor': 'middle' });
      });
    },
  },
  {
    id: 'borrowed-division-examples',
    status: 'vexflow-overlay',
    sources: ['497bb9fdd651f112aced13e093e724b06bb8b7fb.png'],
    output: 'borrowed-division-examples.svg',
    alt: 'Whole, half, and quarter notes divided into triplets, quintuplets, and septuplets, with brackets and division numbers.',
    width: 720,
    height: 500,
    render({ VF, context, overlay }) {
      const rows = [
        { y: 55, left: 'whole note', count: 3, duration: 'h', number: '3' },
        { y: 185, left: 'half note', count: 3, duration: 'q', number: '3' },
        { y: 315, left: 'quarter note', count: 3, duration: '8', number: '3' },
      ];
      rows.forEach(({ y, left, count, duration, number }, row) => {
        label(overlay, left, 45, y + 35, { 'font-weight': '700' });
        label(overlay, '=', 180, y + 35, { 'font-size': 25 });
        drawStave(VF, context, { x: 215, y, width: 210, clef: null, notes: Array.from({ length: count }, () => ({ key: 'b/4', duration })), formatWidth: 130, beams: true });
        bracket(overlay, 255, 390, y + 5, number);
        label(overlay, '=', 445, y + 35, { 'font-size': 25 });
        const otherCount = row === 0 ? 5 : 7;
        drawStave(VF, context, { x: 480, y, width: 205, clef: null, notes: Array.from({ length: otherCount }, () => ({ key: 'b/4', duration: '8' })), formatWidth: 130, beams: true });
        bracket(overlay, 515, 655, y + 5, String(otherCount));
      });
    },
  },
  {
    id: 'compound-meter-duplet',
    status: 'vexflow-overlay',
    sources: ['4d2420cf5eede85bc5c3f12ef4287b370db94fbb.png'],
    output: 'compound-meter-duplet.svg',
    alt: 'A six-eight measure contrasting a group of three eighth notes with a duplet group of two eighth notes.',
    width: 700,
    height: 210,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 65, width: 610, time: '6/8', notes: [{ key: 'b/4', duration: '8' }, { key: 'b/4', duration: '8' }, { key: 'b/4', duration: '8' }, { key: 'b/4', duration: 'q' }, { key: 'b/4', duration: '8' }, { key: 'b/4', duration: '8' }, { key: 'b/4', duration: '8' }], formatWidth: 450, beams: true });
      bracket(overlay, 390, 495, 45, '2');
      label(overlay, 'ordinary compound beat', 210, 185, { 'text-anchor': 'middle' });
      label(overlay, 'borrowed duplet', 450, 185, { 'text-anchor': 'middle' });
    },
  },
  {
    id: 'swing-rhythm-interpretation',
    status: 'vexflow-overlay',
    sources: ['f60857c8669a175558b409f0c714dcbee4a36513.png'],
    output: 'swing-rhythm-interpretation.svg',
    alt: 'Swing notation showing pairs of written eighth notes or dotted-eighth–sixteenth rhythms interpreted as triplet quarter–eighth patterns.',
    width: 760,
    height: 330,
    render({ VF, context, overlay }) {
      const rows = [
        { y: 55, left: [{ key: 'b/4', duration: '8' }, { key: 'b/4', duration: '8' }, { key: 'b/4', duration: '8' }, { key: 'b/4', duration: '8' }] },
        { y: 200, left: [note(VF, { key: 'b/4', duration: '8', dots: 1 }), { key: 'b/4', duration: '16' }, note(VF, { key: 'b/4', duration: '8', dots: 1 }), { key: 'b/4', duration: '16' }] },
      ];
      rows.forEach(({ y, left }) => {
        label(overlay, '“swing”', 30, y + 45, { 'font-size': 20, 'font-weight': '700' });
        drawStave(VF, context, { x: 125, y, width: 210, clef: null, notes: left, formatWidth: 140, beams: true });
        label(overlay, '=', 370, y + 43, { 'font-size': 28, 'text-anchor': 'middle' });
        drawStave(VF, context, { x: 410, y, width: 290, clef: null, notes: [{ key: 'b/4', duration: 'q' }, { key: 'b/4', duration: '8' }, { key: 'b/4', duration: 'q' }, { key: 'b/4', duration: '8' }], formatWidth: 210, beams: true });
        bracket(overlay, 445, 540, y + 5, '3');
        bracket(overlay, 565, 665, y + 5, '3');
      });
    },
  },
  {
    id: 'syncopation-on-weak-beats',
    status: 'vexflow-overlay',
    sources: ['8df2e82253f904461194dc01196bde306adf3d4b.png'],
    output: 'syncopation-on-weak-beats.svg',
    alt: 'A four-four melody with expected beat positions marked above and long red notes highlighted in unexpected weak-beat positions.',
    width: 920,
    height: 260,
    render({ VF, context, overlay }) {
      const notes = ['c/4', 'd/4', 'e/4', 'f/4', 'g/4', 'a/4', 'b/4', 'a/4', 'g/4', 'f/4', 'e/4', 'd/4', 'c/4'].map((key, index) => ({ key, duration: index === 8 || index === 11 ? 'h' : '8' }));
      drawStave(VF, context, { x: 40, y: 75, width: 840, time: 'C', notes, formatWidth: 680, beams: true });
      label(overlay, 'Expected emphasis on beats 1 and 3', 180, 35, { 'font-size': 16 });
      [170, 285, 400, 515, 630, 745].forEach((x) => arrow(overlay, x, 42, 68, '#666'));
      arrow(overlay, 545, 225, 160);
      arrow(overlay, 720, 225, 160);
      label(overlay, 'Longer notes in unexpected places', 620, 242, { fill: red, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'peacherine-rag-syncopation',
    status: 'vexflow-overlay',
    sources: ['ad427d413191cb046506b502e32446ed538422a5.png'],
    output: 'peacherine-rag-syncopation.svg',
    alt: 'Grand-staff excerpt from Joplin’s Peacherine Rag, with red melody notes highlighting syncopation against a steady accompaniment.',
    width: 900,
    height: 330,
    render({ VF, context, overlay }) {
      const upper = drawStave(VF, context, { x: 55, y: 35, width: 790, key: 'Eb', time: '2/4', notes: [{ keys: ['eb/4', 'g/4'], duration: '8' }, { keys: ['g/4', 'bb/4'], duration: '8' }, { keys: ['f/4', 'ab/4'], duration: '8' }, { keys: ['g/4', 'bb/4'], duration: '8' }, { keys: ['eb/4', 'g/4', 'bb/4'], duration: '8' }, { keys: ['f/4', 'ab/4', 'c/5'], duration: '8' }, { keys: ['g/4', 'bb/4', 'd/5'], duration: '8' }, { key: 'c/5', duration: 'q' }], formatWidth: 620, beams: true });
      const lower = drawStave(VF, context, { x: 55, y: 185, width: 790, clef: 'bass', key: 'Eb', time: '2/4', notes: [{ key: 'eb/3', duration: 'q' }, { keys: ['bb/2', 'eb/3', 'g/3'], duration: 'q' }, { key: 'bb/2', duration: 'q' }, { keys: ['bb/2', 'd/3', 'f/3'], duration: 'q' }, { key: 'eb/3', duration: 'q' }, { keys: ['bb/2', 'eb/3', 'g/3'], duration: 'q' }], formatWidth: 620 });
      new VF.StaveConnector(upper.stave, lower.stave).setType(VF.StaveConnector.type.BRACE).setContext(context).draw();
      [430, 470, 515, 560].forEach((x) => overlay.circle(x, 100, 6, { fill: red }));
      label(overlay, 'syncopated melody', 500, 165, { fill: red, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'syncopation-by-unexpected-accents',
    status: 'vexflow-overlay',
    sources: ['9901bdbeacc244671af7a5173eb91147c1fc2ba7.png'],
    output: 'syncopation-by-unexpected-accents.svg',
    alt: 'Repeated chords in common time with accents shifted from expected strong beats to an unexpected offbeat chord highlighted in red.',
    width: 820,
    height: 220,
    render({ VF, context, overlay }) {
      const notes = Array.from({ length: 12 }, (_, index) => {
        const n = note(VF, { keys: ['c/4', 'e/4', 'g/4'], duration: '8' });
        if ([0, 4, 8].includes(index)) n.addModifier(new VF.Articulation('a>').setPosition(VF.Modifier.Position.ABOVE), 0);
        return n;
      });
      drawStave(VF, context, { x: 45, y: 65, width: 730, time: 'C', notes, formatWidth: 590, beams: true });
      label(overlay, '>', 575, 52, { fill: red, 'font-size': 24, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.path('M 560 92 H 590 V 135 H 560 Z', { fill: 'none', stroke: red, 'stroke-width': 2 });
      label(overlay, 'unexpected accent', 575, 195, { fill: red, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'one-and-two-measure-repeat-symbols',
    status: 'vexflow-overlay',
    sources: ['3d9009feab4fb0b2f7b3e95e4d2a7126b2f71d60.png'],
    output: 'one-and-two-measure-repeat-symbols.svg',
    alt: 'Examples of the slash-and-dot symbols that mean repeat the previous one measure or previous two measures.',
    width: 760,
    height: 400,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 45, width: 670, key: 'G', time: '3/4', notes: [{ key: 'g/4', duration: 'q' }, { keys: ['b/4', 'd/5'], duration: 'q' }, { keys: ['b/4', 'd/5'], duration: 'q' }], formatWidth: 220 });
      label(overlay, '•  ╱  •', 520, 110, { 'font-size': 32, 'font-weight': '700', 'text-anchor': 'middle' });
      arrow(overlay, 520, 185, 135, '#555');
      label(overlay, 'Repeat the previous measure.', 520, 205, { 'font-size': 19, 'text-anchor': 'middle' });
      drawStave(VF, context, { x: 45, y: 240, width: 670, time: '3/4', notes: [{ key: 'g/4', duration: 'q' }, { keys: ['b/4', 'd/5'], duration: 'q' }, { keys: ['a/4', 'c/5'], duration: 'q' }, { key: 'e/4', duration: 'q' }, { keys: ['g/4', 'b/4'], duration: 'q' }], formatWidth: 360 });
      label(overlay, '•  ╱╱  •', 605, 304, { 'font-size': 30, 'font-weight': '700', 'text-anchor': 'middle' });
      label(overlay, 'Repeat the previous two measures.', 520, 382, { 'font-size': 19, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'first-second-and-third-endings',
    status: 'vexflow-overlay',
    sources: ['6a71fe8ef244b0a4385573aff0451eaadabb8201.png'],
    output: 'first-second-and-third-endings.svg',
    alt: 'A repeated passage with first-and-second and third ending brackets, annotated to show which ending is played on each pass.',
    width: 940,
    height: 390,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 135, width: 850, time: 'C', notes: Array.from({ length: 7 }, (_, index) => ({ key: index % 2 ? 'd/5' : 'b/4', duration: 'w' })), formatWidth: 680 });
      bracket(overlay, 390, 625, 105, '1., 2.', red);
      bracket(overlay, 625, 850, 105, '3.', blue);
      label(overlay, 'Numbers identify the ending to take', 360, 42, { fill: red, 'font-weight': '700', 'text-anchor': 'middle' });
      arrow(overlay, 465, 50, 95, red);
      label(overlay, 'A closed bracket means leave after the ending', 710, 42, { fill: blue, 'font-weight': '700', 'text-anchor': 'middle' });
      label(overlay, 'play every time', 225, 255, { 'text-anchor': 'middle' });
      label(overlay, 'repeat on passes 1 and 2', 510, 255, { 'text-anchor': 'middle' });
      label(overlay, 'continue after pass 3', 745, 255, { 'text-anchor': 'middle' });
      curve(overlay, 120, 225, 330, 225, 10);
      curve(overlay, 400, 225, 610, 225, 10);
      curve(overlay, 650, 225, 850, 225, 10);
    },
  },
  {
    id: 'musical-roadmap-signs',
    status: 'svg-overlay',
    sources: ['3790348ad803232771a0a0338773ace6a6da0ebe.png'],
    output: 'musical-roadmap-signs.svg',
    alt: 'Definitions of D.C., D.S., al fine, segno, fine, to-coda, and coda musical road-map signs.',
    width: 900,
    height: 430,
    render({ overlay }) {
      const rows = [
        ['D.C.   or   da capo', '“To the head” — go back to the very beginning'],
        ['D.S.   or   dal segno', '“To the sign” — go back to the segno sign'],
        ['al fine', '“To the end” — on the repeat, stop at fine'],
        ['segno', 'Segno: the sign'],
        ['fine', '“End” — on the final time through, stop here'],
        ['to-coda', 'Go to the coda section'],
        ['coda', 'Coda section'],
      ];
      rows.forEach(([symbol, meaning], index) => {
        const y = 55 + index * 53;
        if (symbol === 'segno') drawSegno(overlay, 72, y - 5);
        else if (symbol === 'coda') drawCoda(overlay, 72, y - 5);
        else if (symbol === 'to-coda') {
          label(overlay, 'to', 60, y, { fill: red, 'font-size': 18, 'font-style': 'italic', 'font-weight': '700' });
          drawCoda(overlay, 113, y - 5, 10);
        } else label(overlay, symbol, 60, y, { fill: red, 'font-size': 18, 'font-style': 'italic', 'font-weight': '700' });
        label(overlay, meaning, 330, y, { 'font-size': 18 });
      });
    },
  },
  {
    id: 'da-capo-and-dal-segno-roadmaps',
    status: 'vexflow-overlay',
    sources: ['6ff2ebbbc07037cf05e7f6a4621e7a5b1574b0cb.png'],
    output: 'da-capo-and-dal-segno-roadmaps.svg',
    alt: 'Short score examples tracing da capo al fine and dal segno al coda routes with fine, segno, and coda markings.',
    width: 940,
    height: 700,
    render({ VF, context, overlay }) {
      label(overlay, 'Example 1: D.C. al fine', 45, 35, { 'font-size': 20, 'font-weight': '700' });
      label(overlay, 'Play to D.C., return to the beginning, then stop at fine.', 45, 63);
      drawRoadmapStave(VF, context, 55, 75, [{ key: 'd/4', duration: 'w' }, { key: 'd/4', duration: 'w' }, { key: 'e/4', duration: 'w' }, { key: 'e/4', duration: 'w' }], 820, '2/4');
      label(overlay, 'fine', 475, 82, { 'font-style': 'italic', 'font-weight': '700' });
      label(overlay, 'D.C. al fine', 760, 82, { 'font-style': 'italic', 'font-weight': '700' });
      label(overlay, 'Example 2: D.S. al coda', 45, 235, { 'font-size': 20, 'font-weight': '700' });
      label(overlay, 'Return to the segno, then jump from “to coda” to the coda section.', 45, 263);
      drawRoadmapStave(VF, context, 55, 275, [{ key: 'd/4', duration: 'w' }, { key: 'g/4', duration: 'w' }, { key: 'e/4', duration: 'w' }, { key: 'a/4', duration: 'w' }], 820, '2/4');
      drawSegno(overlay, 810, 310, '#111');
      label(overlay, '2nd time', 90, 445, { 'font-weight': '700' });
      drawCoda(overlay, 190, 439, 10, '#111');
      drawRoadmapStave(VF, context, 55, 455, [{ key: 'd/4', duration: 'w' }, { key: 'g/4', duration: 'w' }, { key: 'e/4', duration: 'w' }], 600, '2/4');
      label(overlay, 'D.S. al coda', 525, 452, { 'font-style': 'italic', 'font-weight': '700' });
      drawCoda(overlay, 68, 619, 12, '#111');
      drawRoadmapStave(VF, context, 105, 600, [{ key: 'd/4', duration: 'w' }, { key: 'g/4', duration: 'w' }, { key: 'e/4', duration: 'w' }], 550, null);
      overlay.path('M 800 360 C 790 460 685 520 110 610', { fill: 'none', stroke: red, 'stroke-width': 3 });
      arrow(overlay, 110, 590, 615, red);
    },
  },
  {
    id: 'accent-marking-types',
    status: 'vexflow-overlay',
    sources: ['daecca1456c88bc1862974a0fab72ff6b9043f84.png'],
    output: 'accent-marking-types.svg',
    alt: 'A six-eight passage showing ordinary accents, caret accents, sforzando, and fortepiano markings.',
    width: 900,
    height: 230,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 65, width: 810, time: '6/8', notes: dynamicsAccentNotes(VF), formatWidth: 650, beams: true });
      label(overlay, 'sfz', 575, 185, { fill: red, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'middle' });
      label(overlay, '(sforzando)', 575, 210, { 'text-anchor': 'middle' });
      label(overlay, 'fp', 740, 185, { fill: red, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'middle' });
      label(overlay, '(fortepiano)', 740, 210, { 'text-anchor': 'middle' });
    },
  },
  {
    id: 'staccato-written-and-realized',
    status: 'vexflow-overlay',
    sources: ['315403d0f8e3593e35187bcadfa48bfc2cb9e10d.png'],
    output: 'staccato-written-and-realized.svg',
    alt: 'Staccato quarter notes compared with their approximate sound as alternating eighth notes and eighth rests.',
    width: 850,
    height: 420,
    render({ VF, context, overlay }) {
      const pitches = ['b/4', 'b/4', 'b/4', 'd/4', 'd/4', 'd/4', 'b/4', 'b/4', 'b/4'];
      const staccato = pitches.map((key) => note(VF, { key, duration: 'q' }).addModifier(new VF.Articulation('a.').setPosition(VF.Modifier.Position.ABOVE), 0));
      drawStave(VF, context, { x: 45, y: 45, width: 760, time: '3/4', notes: staccato, formatWidth: 600 });
      label(overlay, 'staccato…', 650, 35, { 'font-size': 20, 'font-style': 'italic' });
      label(overlay, 'Staccato notes sound approximately like notes separated by equal rests:', 55, 218, { 'font-size': 18 });
      const realized = pitches.flatMap((key) => [{ key, duration: '8' }, { rest: true, duration: '8' }]);
      drawStave(VF, context, { x: 45, y: 250, width: 760, time: '3/4', notes: realized, formatWidth: 600, beams: true });
    },
  },
  {
    id: 'slur-articulation-groups',
    status: 'vexflow-overlay',
    sources: ['771ffdbcc579a14d7b1c02cfd20985353e61c94c.png'],
    output: 'slur-articulation-groups.svg',
    alt: 'A three-four melody grouped by three slurs, with arrows showing that only each slur’s first note receives a definite articulation.',
    width: 850,
    height: 300,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 65, width: 760, time: '3/4', notes: ['g/4', 'b/4', 'd/5', 'c/5', 'b/4', 'a/4', 'g/4', 'b/4', 'c/5'].map((key) => ({ key, duration: 'q' })), formatWidth: 610 });
      curve(overlay, 145, 93, 280, 75, 28);
      curve(overlay, 340, 75, 500, 97, 28);
      curve(overlay, 570, 103, 690, 89, 25);
      [145, 340, 570].forEach((x) => arrow(overlay, x, 235, 150));
      label(overlay, 'Only the first note under each slur has a definite articulation.', 425, 278, { 'font-size': 18, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'slurs-versus-ties',
    status: 'vexflow-overlay',
    sources: ['03fa0af783198b5c02044abfa9c9d47b3f5dafb9.png'],
    output: 'slurs-versus-ties.svg',
    alt: 'A three-four melody labelling slurs between different pitches in blue and ties between repeated pitches in red.',
    width: 880,
    height: 250,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 80, width: 790, time: '3/4', notes: ['g/4', 'b/4', 'd/5', 'c/5', 'b/4', 'b/4', 'a/4', 'b/4', 'c/5', 'b/4', 'b/4', 'a/4'].map((key) => ({ key, duration: 'q' })), formatWidth: 630 });
      curve(overlay, 160, 105, 275, 88, 25, blue);
      curve(overlay, 335, 105, 410, 105, 22, red);
      curve(overlay, 475, 108, 565, 95, 22, blue);
      curve(overlay, 660, 114, 755, 114, 22, red);
      label(overlay, 'slur', 218, 55, { fill: blue, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'middle' });
      label(overlay, 'tie', 372, 55, { fill: red, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'middle' });
      label(overlay, 'slur', 520, 55, { fill: blue, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'middle' });
      label(overlay, 'tie', 708, 55, { fill: red, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'scoops-and-falloffs',
    status: 'vexflow-overlay',
    sources: ['f14eb48346cf6665021fc041a7a55204dba63610.png'],
    output: 'scoops-and-falloffs.svg',
    alt: 'A common-time melody with curved scoops into notes and descending fall-offs from notes.',
    width: 780,
    height: 210,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 65, width: 690, time: 'C', notes: [{ rest: true, duration: 'q' }, { key: 'b/4', duration: 'q' }, { key: 'c/5', duration: 'q' }, { key: 'd/5', duration: 'q' }, { key: 'g/5', duration: 'q' }, { rest: true, duration: 'q' }, { key: 'a/5', duration: 'q' }, { rest: true, duration: 'q' }], formatWidth: 530 });
      overlay.path('M 185 135 Q 180 103 220 101', { fill: 'none', stroke: '#111', 'stroke-width': 2 });
      overlay.path('M 410 82 Q 435 105 450 130', { fill: 'none', stroke: '#111', 'stroke-width': 2 });
      overlay.path('M 575 78 Q 600 108 610 135', { fill: 'none', stroke: '#111', 'stroke-width': 2 });
      label(overlay, 'scoop', 205, 180, { fill: blue, 'text-anchor': 'middle' });
      label(overlay, 'fall-offs', 525, 180, { fill: blue, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'conjunct-disjunct-and-mixed-motion',
    status: 'vexflow-overlay',
    sources: ['6d2da02e6b304aa7421942d50f230b299f43e498.png'],
    output: 'conjunct-disjunct-and-mixed-motion.svg',
    alt: 'Three labelled melodies illustrating conjunct stepwise motion, disjunct leaps, and a mixture of both types of melodic motion.',
    width: 920,
    height: 500,
    render({ VF, context, overlay }) {
      const rows = [
        ['Conjunct', 40, null, ['b/4', 'a/4', 'b/4', 'c/5', 'd/5', 'c/5', 'b/4', 'a/4', 'b/4', 'a/4', 'g/4', 'f/4']],
        ['Disjunct', 195, 'A', ['a/3', 'd/4', 'a/3', 'e/4', 'b/3', 'f/4', 'c/4', 'g/4']],
        ['Mixed', 350, 'Eb', ['c/4', 'd/4', 'e/4', 'c/4', 'd/4', 'b/4', 'c/4', 'd/4', 'g/4', 'e/4']],
      ];
      rows.forEach(([title, y, key, keys]) => {
        label(overlay, title, 35, y - 8, { 'font-size': 20, 'font-weight': '700' });
        drawStave(VF, context, { x: 45, y, width: 830, key, time: title === 'Conjunct' ? '4/4' : title === 'Disjunct' ? 'C' : '3/4', notes: keys.map((pitch, index) => ({ key: pitch, duration: index % 4 === 3 ? 'h' : 'q' })), formatWidth: 660, beams: title === 'Mixed' });
      });
    },
  },
  {
    id: 'riddle-song-four-phrases',
    status: 'vexflow-overlay',
    sources: ['862a42a57ea9a762784f2ccd2d2068e021741fbb.png'],
    output: 'riddle-song-four-phrases.svg',
    alt: 'Four color-coded phrases of The Riddle Song, with each melodic phrase aligned to one sentence of lyrics.',
    width: 920,
    height: 600,
    render({ VF, context, overlay }) {
      const rows = [
        { y: 40, color: red, words: 'I gave my love a cherry that has no stone.' },
        { y: 180, color: '#29a9d6', words: 'I gave my love a chicken that has no bone.' },
        { y: 320, color: green, words: 'I gave my love a ring that has no end.' },
        { y: 460, color: pink, words: 'I gave my love a baby with no crying.' },
      ];
      const keys = ['g/4', 'g/4', 'g/4', 'g/4', 'a/4', 'c/5', 'd/5', 'c/5', 'b/4', 'a/4', 'g/4'];
      rows.forEach(({ y, color, words }) => {
        drawStave(VF, context, { x: 45, y, width: 830, key: 'G', time: '4/4', notes: keys.map((pitch, index) => ({ key: pitch, duration: index > 8 ? 'h' : 'q' })), formatWidth: 660 });
        label(overlay, words, 460, y + 125, { fill: color, 'font-size': 18, 'text-anchor': 'middle' });
      });
    },
  },
  {
    id: 'auld-lang-syne-antecedent-consequent',
    status: 'vexflow-overlay',
    sources: ['2ce337631ea22e3e00c8bf33981c83c0374e0759.png'],
    output: 'auld-lang-syne-antecedent-consequent.svg',
    alt: 'Antecedent and consequent phrases of Auld Lang Syne, showing parallel rhythm but different melody and chord endings.',
    width: 940,
    height: 400,
    render({ VF, context, overlay }) {
      const rhythm = ['g/4', 'c/5', 'c/5', 'e/5', 'd/5', 'c/5', 'd/5', 'e/5', 'c/5', 'a/4'];
      label(overlay, 'Antecedent phrase', 45, 35, { fill: red, 'font-size': 20, 'font-weight': '700' });
      label(overlay, 'Chords: D                 A7                 D                 G', 135, 62, { 'font-weight': '700' });
      drawStave(VF, context, { x: 45, y: 70, width: 850, key: 'D', time: '4/4', notes: rhythm.map((key, index) => ({ key, duration: index % 3 === 0 ? 'q' : '8' })), formatWidth: 680, beams: true });
      label(overlay, 'Consequent phrase', 45, 225, { fill: blue, 'font-size': 20, 'font-weight': '700' });
      label(overlay, 'Chords: D                 A7             Bm    Em7   A7       D', 135, 252, { 'font-weight': '700' });
      drawStave(VF, context, { x: 45, y: 260, width: 850, key: 'D', time: '4/4', notes: rhythm.map((key, index) => ({ key: index > 6 ? ['b/3', 'a/3', 'd/4'][index - 7] : key, duration: index % 3 === 0 ? 'q' : '8' })), formatWidth: 680, beams: true });
    },
  },
  {
    id: 'beethoven-fate-motif',
    status: 'vexflow-overlay',
    sources: ['61a817eace09793f5c3a9d046d4c08d0d04813fd.png'],
    output: 'beethoven-fate-motif.svg',
    alt: 'Beethoven’s four-note fate motif: three repeated short notes followed by a long lower note under a fermata.',
    width: 650,
    height: 240,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 65, width: 560, key: 'Eb', time: '2/4', notes: [{ rest: true, duration: '8' }, { key: 'g/4', duration: '8' }, { key: 'g/4', duration: '8' }, { key: 'g/4', duration: '8' }, { key: 'eb/4', duration: 'h' }], formatWidth: 390, beams: true });
      label(overlay, '𝄐', 500, 42, { 'font-size': 34, 'text-anchor': 'middle' });
      label(overlay, 'short – short – short – long', 325, 215, { 'font-size': 19, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'siegfried-leitmotif-phrase',
    status: 'vexflow-overlay',
    sources: ['f3e6ac40f066daf1d2f6aef9c8e8ac3afd0debec.png'],
    output: 'siegfried-leitmotif-phrase.svg',
    alt: 'Two bass-clef phrases based on Wagner’s Siegfried leitmotif, using dotted rhythms, leaps, flats, and slurs.',
    width: 880,
    height: 380,
    render({ VF, context, overlay }) {
      const top = [note(VF, { key: 'd/3', duration: 'q', dots: 1 }), note(VF, { key: 'g/3', duration: 'q', dots: 1 }), { key: 'g/3', duration: '8' }, { key: 'g/3', duration: 'q' }, note(VF, { key: 'bb/3', duration: 'q', dots: 1, accidental: 'b' }), { key: 'g/3', duration: 'q' }, { key: 'g/3', duration: '8' }, note(VF, { key: 'db/4', duration: 'h', dots: 1, accidental: 'b' })];
      const bottom = [note(VF, { key: 'd/3', duration: 'q', dots: 1 }), { key: 'db/3', duration: 'q', accidental: 'b' }, { key: 'c/3', duration: '8' }, note(VF, { key: 'g/3', duration: 'q', dots: 1 }), { key: 'g/3', duration: 'q' }, { key: 'g/3', duration: '8' }, note(VF, { key: 'a/3', duration: 'q', dots: 1 }), { key: 'a/3', duration: 'q' }, { key: 'ab/3', duration: 'q', accidental: 'b' }, { key: 'a/3', duration: 'q' }, note(VF, { key: 'd/4', duration: 'h', dots: 1 })];
      drawStave(VF, context, { x: 45, y: 45, width: 790, clef: 'bass', key: 'G', time: '6/8', notes: top, formatWidth: 620, beams: true });
      drawStave(VF, context, { x: 45, y: 220, width: 790, clef: 'bass', key: 'G', notes: bottom, formatWidth: 620, beams: true });
      curve(overlay, 220, 85, 330, 70, 20);
      curve(overlay, 260, 260, 350, 250, 20);
      curve(overlay, 430, 260, 515, 250, 20);
    },
  },
  {
    id: 'beethoven-ode-to-joy-theme',
    status: 'vexflow-overlay',
    sources: ['04f1d4ac48717164428426cac4f806a7c27c9e16.png'],
    output: 'beethoven-ode-to-joy-theme.svg',
    alt: 'The four phrases of Beethoven’s Ode to Joy theme, including its repeated opening phrases and varied concluding phrase.',
    width: 940,
    height: 620,
    render({ VF, context, overlay }) {
      const base = ['b/4', 'b/4', 'c/5', 'd/5', 'd/5', 'c/5', 'b/4', 'a/4', 'g/4', 'g/4', 'a/4', 'b/4'];
      const rows = [base, base, ['a/4', 'a/4', 'b/4', 'g/4', 'a/4', 'b/4', 'c/5', 'b/4', 'g/4', 'a/4', 'd/4'], base];
      rows.forEach((keys, index) => {
        drawStave(VF, context, { x: 45, y: 35 + index * 145, width: 850, time: index === 0 ? '4/4' : undefined, notes: keys.map((key, noteIndex) => ({ key, duration: noteIndex > keys.length - 3 ? 'h' : noteIndex % 5 === 4 ? '8' : 'q' })), formatWidth: 680, beams: true });
        label(overlay, `Phrase ${index + 1}`, 70, 30 + index * 145, { fill: blue, 'font-weight': '700' });
      });
    },
  },
];
