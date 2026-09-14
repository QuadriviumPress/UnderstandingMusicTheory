import { drawStave, labelUnder } from '../figure-helpers.mjs';

const exercisePitches = ['b/3', 'd/4', 'e/4', 'a/4', 'g/4', 'e/4', 'f/4', 'c/4', 'b/3', 'a/3', 'f/5', 'd/4'];

export const definitions = [
  {
    id: 'orchestral-score-layout',
    sources: ['579422782a5ef1c8596ec806f11e71503cd314d1.png'],
    output: 'orchestral-score-layout.svg',
    alt: 'An orchestral score with labelled woodwind, brass, percussion, and string staves aligned in a system.',
    width: 920,
    height: 1020,
    render({ VF, context, overlay }) {
      const parts = [
        ['Flutes', 'treble'], ['Oboes', 'treble'], ['Clarinets in B♭', 'treble'], ['Bassoons', 'bass'],
        ['Horns in F', 'treble'], ['Trumpets in C', 'treble'], ['Timpani in G', 'bass'],
        ['Violin I', 'treble'], ['Violin II', 'treble'], ['Viola', 'alto'], ['Violoncello', 'bass'], ['Contrabass', 'bass'],
      ];
      parts.forEach(([label, clef], index) => {
        const y = 22 + index * 80;
        const hasPhrase = [2, 7, 8, 9, 10, 11].includes(index);
        drawStave(VF, context, {
          x: 180, y, width: 700, clef, key: 'D', time: index === 0 ? '3/4' : undefined,
          notes: hasPhrase
            ? ['d/4', 'e/4', 'f/4', 'a/4', 'g/4', 'e/4'].map((key) => ({ key, duration: 'q' }))
            : [{ rest: true, duration: 'w' }, { rest: true, duration: 'w' }, { rest: true, duration: 'w' }],
          formatWidth: 540,
        });
        overlay.text(label, 155, y + 52, { 'font-size': 15, 'font-weight': '700', 'text-anchor': 'end' });
      });
      overlay.line(174, 62, 174, 962, { stroke: '#111', 'stroke-width': 3 });
      overlay.text('All staves are read together from left to right', 520, 1000, { 'font-size': 17, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'treble-clef-mnemonics',
    sources: ['b9295f79fda01598db4bcb7cc6b5fa206bb65c1a.png'],
    output: 'treble-clef-mnemonics.svg',
    alt: 'Treble-clef line names E G B D F and space names F A C E with common mnemonic phrases.',
    width: 820,
    height: 440,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 55, y: 50, width: 700 });
      [['E', 190, 154], ['G', 295, 134], ['B', 400, 114], ['D', 505, 94], ['F', 610, 74]].forEach(([v, x, y]) => overlay.text(v, x, y, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' }));
      overlay.text('Treble-clef lines: “Every Good Boy Does Fine”', 410, 200, { fill: '#1769aa', 'font-size': 18, 'text-anchor': 'middle' });
      overlay.text('or “Every Good Boy Deserves Fudge”', 410, 228, { fill: '#1769aa', 'font-size': 17, 'text-anchor': 'middle' });
      drawStave(VF, context, { x: 55, y: 270, width: 700 });
      [['F', 235, 364], ['A', 350, 344], ['C', 465, 324], ['E', 580, 304]].forEach(([v, x, y]) => overlay.text(v, x, y, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' }));
      overlay.text('Treble-clef spaces spell “FACE”', 410, 425, { fill: '#1769aa', 'font-size': 18, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'bass-clef-mnemonics',
    sources: ['d0df5580a52bd5ff1c22982ff89e7ce408a5750a.png'],
    output: 'bass-clef-mnemonics.svg',
    alt: 'Bass-clef line names G B D F A and space names A C E G with common mnemonic phrases.',
    width: 820,
    height: 440,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 55, y: 50, width: 700, clef: 'bass' });
      [['G', 190, 154], ['B', 295, 134], ['D', 400, 114], ['F', 505, 94], ['A', 610, 74]].forEach(([v, x, y]) => overlay.text(v, x, y, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' }));
      overlay.text('Bass-clef lines: “Good Boys Do Fine Always”', 410, 200, { fill: '#1769aa', 'font-size': 18, 'text-anchor': 'middle' });
      overlay.text('or “Good Boys Deserve Fudge Always”', 410, 228, { fill: '#1769aa', 'font-size': 17, 'text-anchor': 'middle' });
      drawStave(VF, context, { x: 55, y: 270, width: 700, clef: 'bass' });
      [['A', 235, 364], ['C', 350, 344], ['E', 465, 324], ['G', 580, 304]].forEach(([v, x, y]) => overlay.text(v, x, y, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' }));
      overlay.text('Bass-clef spaces: “All Cows Eat Grass”', 410, 425, { fill: '#1769aa', 'font-size': 18, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'movable-g-and-f-clefs',
    sources: ['6a559902470af8de8f7a3e2b8ad222cecdcc9fa7.png'],
    output: 'movable-g-and-f-clefs.svg',
    alt: 'Historical G and F clefs placed on nonstandard staff lines with ascending pitch names.',
    width: 860,
    height: 390,
    render({ VF, context, overlay }) {
      drawStave(VF, context, { x: 45, y: 45, width: 770, clef: 'french' });
      labelUnder(overlay, ['G', 'A', 'B', 'C', 'D'], 210, 95, 150, { 'font-weight': '700' });
      overlay.text('etc.', 745, 67, { 'font-size': 16 });
      drawStave(VF, context, { x: 45, y: 220, width: 770, clef: 'baritone-f' });
      labelUnder(overlay, ['F', 'G', 'A', 'B', 'C'], 210, 95, 325, { 'font-weight': '700' });
      overlay.text('etc.', 745, 242, { 'font-size': 16 });
      overlay.text('The G and F clefs were once movable.', 430, 382, { 'font-size': 18, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'same-melody-treble-and-bass',
    sources: ['a69c707986504c5a27ee1c94ddbbb00d1101f4b7.png'],
    output: 'same-melody-treble-and-bass.svg',
    alt: 'The same melody written in treble and bass clefs, illustrating excessive ledger lines in each clef.',
    width: 980,
    height: 400,
    render({ VF, context, overlay }) {
      const pitches = ['c/5', 'e/5', 'g/5', 'a/5', 'g/5', 'e/5', 'c/5', 'd/5', 'e/5', 'g/5', 'f/5', 'e/5', 'd/5', 'c/5'];
      drawStave(VF, context, { x: 45, y: 45, width: 890, clef: 'treble', time: 'C', notes: pitches.map((key) => ({ key, duration: '8' })), formatWidth: 720, beams: true });
      drawStave(VF, context, { x: 45, y: 225, width: 890, clef: 'bass', time: 'C', notes: pitches.map((key) => ({ key, duration: '8' })), formatWidth: 720, beams: true });
      overlay.text('Treble clef', 80, 30, { 'font-size': 17, 'font-weight': '700' });
      overlay.text('Bass clef—the same sounding pitches require many ledger lines', 80, 210, { 'font-size': 17, 'font-weight': '700' });
    },
  },
  {
    id: 'middle-c-in-three-clefs',
    sources: ['e2897b454b02e02a65a9b8cd989a5187cbda5093.png'],
    output: 'middle-c-in-three-clefs.svg',
    alt: 'Middle C written in treble, bass, and alto clefs.',
    width: 820,
    height: 430,
    render({ VF, context, overlay }) {
      [['treble', 30, 'Treble: middle C is below the staff'], ['bass', 165, 'Bass: middle C is above the staff'], ['alto', 300, 'Alto: middle C is on the center line']].forEach(([clef, y, label]) => {
        drawStave(VF, context, { x: 65, y, width: 690, clef, notes: [{ key: 'c/4', duration: 'w' }], formatWidth: 250 });
        overlay.text(label, 420, y + 115, { 'font-size': 17, 'text-anchor': 'middle' });
      });
    },
  },
  {
    id: 'clef-note-name-practice',
    sources: ['17e780a24ae09def5583b27898930f3dd936bfa3.png'],
    output: 'clef-note-name-practice.svg',
    alt: 'Treble, bass, and alto staves containing notes to identify by letter name.',
    width: 980,
    height: 500,
    render({ VF, context, overlay }) {
      [['treble', 35], ['bass', 185], ['alto', 335]].forEach(([clef, y]) => {
        drawStave(VF, context, { x: 40, y, width: 900, clef, notes: exercisePitches.map((key) => ({ key, duration: 'w' })), formatWidth: 740 });
      });
      overlay.text('Write the letter name of each note.', 490, 25, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'clef-note-name-answers',
    sources: ['3087ad9e3af32de3f3c0f6278eca1ce3558cff12.png'],
    output: 'clef-note-name-answers.svg',
    alt: 'Treble, bass, and alto note-identification exercises with letter-name answers.',
    width: 980,
    height: 560,
    render({ VF, context, overlay }) {
      const answers = {
        treble: ['B', 'D', 'E', 'A', 'G', 'E', 'F', 'C', 'B', 'A', 'F', 'D'],
        bass: ['D', 'F', 'G', 'C', 'B', 'G', 'A', 'E', 'D', 'C', 'A', 'F'],
        alto: ['F', 'A', 'B', 'F', 'E', 'B', 'C', 'G', 'F', 'E', 'C', 'A'],
      };
      [['treble', 35], ['bass', 205], ['alto', 375]].forEach(([clef, y]) => {
        drawStave(VF, context, { x: 40, y, width: 900, clef, notes: exercisePitches.map((key) => ({ key, duration: 'w' })), formatWidth: 740 });
        labelUnder(overlay, answers[clef], 190, 61, y + 145, { fill: '#c62828', 'font-weight': '700' });
      });
    },
  },
  {
    id: 'ledger-note-practice',
    sources: ['9c39c637224c0bba225d33a4a11dfd0c9c0583bb.png'],
    output: 'ledger-note-practice.svg',
    alt: 'A clef-selection exercise with notes on ledger lines above and below a blank staff.',
    width: 980,
    height: 300,
    render({ VF, context, overlay }) {
      const pitches = ['b/3', 'g/3', 'a/3', 'f/3', 'c/4', 'd/4', 'g/3', 'c/6', 'e/6', 'b/5', 'f/6', 'd/6', 'g/6', 'a/5'];
      drawStave(VF, context, { x: 40, y: 85, width: 900, clef: null, notes: pitches.map((key) => ({ key, duration: 'w' })), formatWidth: 800 });
      overlay.text('Choose a clef, then name each ledger-line note.', 490, 40, { 'font-size': 19, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'ledger-note-practice-answers',
    sources: ['25011ac162a03037c0aaa44f2843334c4564072e.png'],
    output: 'ledger-note-practice-answers.svg',
    alt: 'Ledger-line note exercise answered in treble and bass clefs.',
    width: 980,
    height: 500,
    render({ VF, context, overlay }) {
      const pitches = ['b/3', 'g/3', 'a/3', 'f/3', 'c/4', 'd/4', 'g/3', 'c/6', 'e/6', 'b/5', 'f/6', 'd/6', 'g/6', 'a/5'];
      [['treble', 55, ['B', 'G', 'A', 'F', 'C', 'D', 'G', 'C', 'E', 'B', 'F', 'D', 'G', 'A']], ['bass', 270, ['D', 'A', 'B', 'F', 'C', 'E', 'G', 'E', 'G', 'D', 'A', 'F', 'B', 'C']]].forEach(([clef, y, labels]) => {
        drawStave(VF, context, { x: 40, y, width: 900, clef, notes: pitches.map((key) => ({ key, duration: 'w' })), formatWidth: 750 });
        labelUnder(overlay, labels, 170, 55, y + 160, { fill: '#c62828', 'font-weight': '700' });
      });
    },
  },
];
