function staveNote(VF, keys, duration = 'w', accidentals = []) {
  const note = new VF.StaveNote({ keys: Array.isArray(keys) ? keys : [keys], duration });
  accidentals.forEach((accidental, index) => {
    if (accidental) note.addModifier(new VF.Accidental(accidental), index);
  });
  return note;
}

function drawVoice(VF, context, stave, notes, formatWidth) {
  const voice = new VF.Voice({ num_beats: notes.length * 4, beat_value: 4 })
    .setStrict(false)
    .addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], formatWidth);
  voice.setStave(stave).draw(context, stave);
  return notes;
}

function drawInterval(VF, context, { x, y, width = 185, clef = 'treble', keys, accidentals = [] }) {
  const stave = new VF.Stave(x, y, width).addClef(clef);
  stave.setContext(context).draw();
  drawVoice(VF, context, stave, keys.map((key, index) => staveNote(VF, key, 'w', [accidentals[index]])), width - 95);
}

export const definitions = [
  {
    id: 'bass-pitch-names',
    sources: ['d602c16ca85ac9a1dec4202c752714bcb05c3124.png'],
    output: 'bass-pitch-names.svg',
    alt: 'A bass clef staff labelled with ascending note names from E below the staff through C above it.',
    width: 760,
    height: 220,
    render({ VF, context, overlay }) {
      new VF.Stave(55, 65, 650).addClef('bass').setContext(context).draw();
      overlay.text('Bass Clef\nSymbol', 50, 20, { 'text-anchor': 'middle', 'font-size': 17 });
      const names = ['E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B', 'C'];
      names.forEach((name, index) => overlay.text(name, 142 + index * 41, 174 - index * 13, {
        'font-size': 18,
        'font-weight': '700',
        'text-anchor': 'middle',
      }));
      overlay.line(128, 168, 156, 168, { stroke: '#111', 'stroke-width': 1.5 });
      overlay.line(620, 12, 648, 12, { stroke: '#111', 'stroke-width': 1.5 });
      overlay.text('etc.', 30, 196, { 'font-size': 16 });
      overlay.text('etc.', 685, 27, { 'font-size': 16 });
    },
  },
  {
    id: 'legato-example',
    sources: ['146dfa0726ec0516d4e0257c74b5778ccba89008.png'],
    output: 'legato-example.svg',
    alt: 'A three-four melody contrasting separated notes with a smoothly connected legato phrase.',
    width: 860,
    height: 225,
    render({ VF, context, overlay }) {
      const stave = new VF.Stave(40, 68, 780).addClef('treble').addTimeSignature('3/4');
      stave.setContext(context).draw();
      const pitches = ['d/5', 'd/5', 'd/5', 'g/4', 'a/4', 'g/4', 'c/5', 'b/4', 'c/5'];
      const notes = pitches.map((pitch, index) => {
        const note = staveNote(VF, pitch, 'q');
        if (index < 6) note.addModifier(new VF.Articulation('a-').setPosition(VF.Modifier.Position.ABOVE), 0);
        return note;
      });
      drawVoice(VF, context, stave, notes, 625);
      overlay.line(333, 68, 333, 148, { stroke: '#111', 'stroke-width': 1.5 });
      overlay.line(567, 68, 567, 148, { stroke: '#111', 'stroke-width': 1.5 });
      overlay.path('M 600 91 C 650 61 735 61 786 91', { fill: 'none', stroke: '#111', 'stroke-width': 2 });
      overlay.text('legato', 692, 47, { 'font-size': 18, 'font-style': 'italic', 'text-anchor': 'middle' });
      overlay.text('slight separation', 225, 201, { 'font-size': 16, 'text-anchor': 'middle' });
      overlay.text('smoothly connected', 692, 201, { 'font-size': 16, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'enharmonic-key-signature-practice',
    sources: ['2d5aa7cd858822a99a24ca70fa009235bc626daa.png'],
    output: 'enharmonic-key-signature-practice.svg',
    alt: 'B-major and B-flat-minor key signatures beside blank staves for writing their enharmonic equivalents.',
    width: 820,
    height: 330,
    render({ VF, context, overlay }) {
      const rows = [
        { y: 45, key: 'B', label: 'B major' },
        { y: 185, key: 'Bbm', label: 'B♭ minor' },
      ];
      rows.forEach(({ y, key, label }) => {
        new VF.Stave(45, y, 330).addClef('treble').addKeySignature(key).setContext(context).draw();
        new VF.Stave(445, y, 330).addClef('treble').setContext(context).draw();
        overlay.text(label, 175, y + 108, { 'font-size': 18, 'text-anchor': 'middle' });
        overlay.text('Enharmonic key:', 540, y + 108, { 'font-size': 17, 'text-anchor': 'middle' });
      });
    },
  },
  {
    id: 'five-key-signatures',
    sources: ['67b0b986ffc1cbcda11f6d128a847ab6c2455b65.png'],
    output: 'five-key-signatures.svg',
    alt: 'Treble-clef key signatures for E-flat major, E major, D-flat major, B major, and C-sharp major.',
    width: 980,
    height: 220,
    render({ VF, context, overlay }) {
      [
        ['Eb', 'E♭ major'],
        ['E', 'E major'],
        ['Db', 'D♭ major'],
        ['B', 'B major'],
        ['C#', 'C♯ major'],
      ].forEach(([key, label], index) => {
        const x = 25 + index * 190;
        new VF.Stave(x, 55, 175).addClef('treble').addKeySignature(key).setContext(context).draw();
        overlay.text(label, x + 88, 188, { 'font-size': 17, 'text-anchor': 'middle' });
      });
    },
  },
  {
    id: 'octave-naming-systems',
    sources: ['7dc996aef1a319a54ddbb2ad45e04dfb293c039e.png'],
    output: 'octave-naming-systems.svg',
    alt: 'Six octaves of C labelled with common, Helmholtz, and scientific octave names.',
    width: 980,
    height: 360,
    render({ VF, context, overlay }) {
      const bass = new VF.Stave(55, 55, 405).addClef('bass');
      const treble = new VF.Stave(460, 55, 465).addClef('treble');
      bass.setContext(context).draw();
      treble.setContext(context).draw();
      const low = ['c/1', 'c/2', 'c/3'].map((key) => staveNote(VF, key));
      const high = ['c/4', 'c/5', 'c/6'].map((key) => staveNote(VF, key));
      drawVoice(VF, context, bass, low, 260);
      drawVoice(VF, context, treble, high, 320);
      const xs = [170, 285, 400, 575, 710, 845];
      const rows = [
        ['Say:', ['“Contra”', '“Great”', '“Small”', '“One-line”', '“Two-line”', '“Three-line”']],
        ['Helmholtz:', ['CC', 'C', 'c', 'c¹', 'c²', 'c³']],
        ['Scientific:', ['C₁', 'C₂', 'C₃', 'C₄', 'C₅', 'C₆']],
      ];
      rows.forEach(([heading, values], row) => {
        const y = 245 + row * 46;
        overlay.text(heading, 25, y, { 'font-size': 17, 'font-weight': '700' });
        values.forEach((value, index) => overlay.text(value, xs[index], y, { 'font-size': 17, 'text-anchor': 'middle' }));
      });
    },
  },
  {
    id: 'enharmonic-interval-pairs',
    sources: ['99d68c0293627fcea7ee6bed18af4d5b5eeda47e.png', '41cd0fba81c5164971645814179ff8ee1586a587.png'],
    output: 'enharmonic-interval-pairs.svg',
    alt: 'A major third compared with a diminished fourth, and a minor second compared with an augmented prime.',
    width: 920,
    height: 410,
    render({ VF, context, overlay }) {
      const examples = [
        { x: 30, y: 45, keys: ['c/4', 'e/4'], label: 'Major third' },
        { x: 620, y: 45, keys: ['c/4', 'f/4'], accidentals: [null, 'b'], label: 'Diminished fourth' },
        { x: 30, y: 225, keys: ['c/4', 'd/4'], accidentals: [null, 'b'], label: 'Minor second' },
        { x: 620, y: 225, keys: ['c/4', 'c/4'], accidentals: [null, '#'], label: 'Augmented prime' },
      ];
      examples.forEach((example) => {
        drawInterval(VF, context, example);
        overlay.text(example.label, example.x + 92, example.y + 132, { 'font-size': 17, 'text-anchor': 'middle' });
      });
      overlay.text('sounds the same as', 460, 125, { 'font-size': 18, 'text-anchor': 'middle' });
      overlay.text('sounds the same as', 460, 305, { 'font-size': 18, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'augmented-and-diminished-intervals',
    sources: ['4db15424aa05d5a4b5a3841d69ffeffbbc34f162.png'],
    output: 'augmented-and-diminished-intervals.svg',
    alt: 'Examples of augmented and diminished primes, seconds, thirds, fourths, fifths, sixths, sevenths, and octaves.',
    width: 1040,
    height: 420,
    render({ VF, context, overlay }) {
      const examples = [
        { keys: ['c/4', 'c/4'], accidentals: [null, '#'], label: 'Augmented prime' },
        { keys: ['c/4', 'd/4'], accidentals: ['#', 'b'], label: 'Diminished second' },
        { keys: ['c/4', 'e/4'], accidentals: [null, '#'], label: 'Augmented third' },
        { keys: ['c/4', 'a/4'], accidentals: [null, 'bb'], label: 'Diminished sixth' },
        { keys: ['c/4', 'b/4'], accidentals: [null, '#'], label: 'Augmented seventh' },
        { keys: ['c/4', 'c/5'], accidentals: [null, 'b'], label: 'Diminished octave' },
        { keys: ['c/4', 'f/4'], accidentals: [null, '#'], label: 'Augmented fourth' },
        { keys: ['c/4', 'g/4'], accidentals: [null, 'b'], label: 'Diminished fifth' },
      ];
      examples.forEach((example, index) => {
        const x = 15 + (index % 4) * 255;
        const y = index < 4 ? 35 : 225;
        drawInterval(VF, context, { ...example, x, y, width: 240 });
        overlay.text(example.label, x + 120, y + 137, { 'font-size': 16, 'text-anchor': 'middle' });
      });
    },
  },
  {
    id: 'enharmonic-chords-and-intervals',
    sources: ['b5c853589275412d74aa8b6c3cbedd069a6294b3.png'],
    output: 'enharmonic-chords-and-intervals.svg',
    alt: 'Enharmonic intervals and chords written with different note spellings on treble and bass staves.',
    width: 1040,
    height: 520,
    render({ VF, context, overlay }) {
      const intervals = [
        { x: 25, keys: ['c/4', 'f/4'], accidentals: [null, 'b'], label: 'Diminished fourth' },
        { x: 280, keys: ['c/4', 'e/4'], label: 'Major third' },
        { x: 535, keys: ['c/4', 'b/4'], accidentals: [null, 'b'], label: 'Minor seventh' },
        { x: 790, keys: ['c/4', 'a/4'], accidentals: [null, '#'], label: 'Augmented sixth' },
      ];
      intervals.forEach((example) => {
        drawInterval(VF, context, { ...example, y: 35, width: 225 });
        overlay.text(example.label, example.x + 112, 175, { 'font-size': 16, 'text-anchor': 'middle' });
      });
      const chords = [
        { x: 25, keys: ['c/3', 'e/3', 'g/3'], accidentals: ['#', null, '#'], label: 'C♯ minor' },
        { x: 280, keys: ['d/3', 'f/3', 'a/3'], accidentals: ['b', 'b', 'b'], label: 'D♭ minor' },
        { x: 535, keys: ['e/3', 'g/3', 'b/3', 'd/4'], accidentals: [null, null, 'b', 'b'], label: 'E diminished seventh' },
        { x: 790, keys: ['g/3', 'b/3', 'd/4', 'f/4'], accidentals: [null, 'b', 'b', 'b'], label: 'G diminished seventh' },
      ];
      chords.forEach(({ x, keys, accidentals, label }) => {
        const stave = new VF.Stave(x, 270, 225).addClef('bass');
        stave.setContext(context).draw();
        drawVoice(VF, context, stave, [staveNote(VF, keys, 'w', accidentals)], 100);
        overlay.text(label, x + 112, 420, { 'font-size': 16, 'text-anchor': 'middle' });
      });
      overlay.text('Different spellings can represent the same sounding pitches.', 520, 485, {
        'font-size': 18,
        'font-weight': '700',
        'text-anchor': 'middle',
      });
    },
  },
  {
    id: 'approximate-vocal-ranges',
    sources: ['f16500ce77df4e1782cd94f61ad8ed4b0b584405.png'],
    output: 'approximate-vocal-ranges.svg',
    alt: 'Approximate ranges for soprano, mezzo-soprano, alto, tenor, baritone, and bass voices.',
    width: 980,
    height: 470,
    render({ VF, context, overlay }) {
      const rows = [
        { y: 40, clef: 'treble', pitches: ['c/4', 'a/5', 'a/3', 'f/5', 'f/3', 'd/5'], labels: ['Soprano', 'Mezzo-soprano', 'Alto'] },
        { y: 245, clef: 'bass', pitches: ['c/3', 'a/4', 'a/2', 'f/4', 'e/2', 'd/4'], labels: ['Tenor', 'Baritone', 'Bass'] },
      ];
      rows.forEach(({ y, clef, pitches, labels }) => {
        const stave = new VF.Stave(40, y, 900).addClef(clef);
        stave.setContext(context).draw();
        const notes = pitches.map((pitch) => staveNote(VF, pitch));
        drawVoice(VF, context, stave, notes, 740);
        [[185, 293], [410, 518], [635, 743]].forEach(([x1, x2], index) => {
          overlay.line(x1, y + 125, x2, y + 38, { stroke: '#d32f2f', 'stroke-width': 3 });
          overlay.text(labels[index], (x1 + x2) / 2, y + 172, { 'font-size': 17, 'text-anchor': 'middle' });
        });
      });
    },
  },
  {
    id: 'interval-number-answers',
    sources: ['ffb90bf82bdbce7380d5bddb01b62ab9084d239b.png'],
    output: 'interval-number-answers.svg',
    alt: 'Six written intervals labelled third, fifth, octave, second, seventh, and fourth.',
    width: 1050,
    height: 245,
    render({ VF, context, overlay }) {
      const stave = new VF.Stave(35, 40, 980).addClef('treble').addTimeSignature('6/4');
      stave.setContext(context).draw();
      const pairs = [
        ['c/4', 'e/4', 'Third'],
        ['f/4', 'c/5', 'Fifth'],
        ['g/3', 'g/4', 'Octave'],
        ['c/5', 'd/5', 'Second'],
        ['c/4', 'b/4', 'Seventh'],
        ['c/4', 'f/4', 'Fourth'],
      ];
      const notes = pairs.flatMap(([first, second]) => [staveNote(VF, first), staveNote(VF, second)]);
      drawVoice(VF, context, stave, notes, 805);
      const centers = [185, 340, 495, 650, 805, 950];
      centers.forEach((x, index) => {
        if (index) overlay.line(x - 78, 80, x - 78, 160, { stroke: '#111', 'stroke-width': 1.25 });
        overlay.text(pairs[index][2], x, 213, { 'font-size': 17, 'text-anchor': 'middle' });
      });
    },
  },
];
