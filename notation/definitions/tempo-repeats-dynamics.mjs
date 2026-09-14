function wholeNoteStave(VF, context, y) {
  const stave = new VF.Stave(55, y, 790).addClef('treble').addTimeSignature('C');
  stave.setContext(context).draw();
  const notes = Array.from({ length: 5 }, () => new VF.StaveNote({ keys: ['c/5'], duration: 'w' }));
  const voice = new VF.Voice({ num_beats: 20, beat_value: 4 }).setStrict(false).addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], 630);
  voice.setStave(stave).draw(context, stave);
}

export const definitions = [
  {
    id: 'tempo-and-meter-examples',
    sources: ['5a8209d773fa3b65be50ec156c652a8d8389e5c1.png'],
    output: 'tempo-and-meter-examples.svg',
    alt: 'Examples showing how tempo markings combine with four-four, cut, six-eight, and six-sixteen time.',
    width: 900,
    height: 470,
    render({ VF, context, overlay }) {
      const rows = [['4/4', '♩ = 88', 'Four-four time: 88 quarter-note beats per minute'], ['C|', '𝅗𝅥 = 120', 'Cut time: 120 half-note beats per minute'], ['6/8', '♩. = 80', 'Six-eight time: about 80 dotted-quarter beats per minute'], ['6/16', '♪. = 148', 'Six-sixteen time: about 148 dotted-eighth beats per minute']];
      rows.forEach(([time, tempo, explanation], index) => {
        const y = 35 + index * 105;
        const stave = new VF.Stave(45, y, 210).addClef('treble').addTimeSignature(time);
        stave.setContext(context).draw();
        overlay.text(tempo, 275, y + 38, { 'font-size': 19 });
        overlay.text(explanation, 395, y + 38, { 'font-size': 17 });
      });
    },
  },
  {
    id: 'repeat-barlines',
    sources: ['b4c37691fafd379d87d5be52dc7271c4a6364cba.png'],
    output: 'repeat-barlines.svg',
    alt: 'Repeat barlines showing a return to the beginning and a repeated section enclosed by repeat signs.',
    width: 900,
    height: 330,
    render({ VF, context, overlay }) {
      const first = new VF.Stave(50, 55, 800).addClef('treble').addTimeSignature('C');
      first.setEndBarType(VF.Barline.type.REPEAT_END).setContext(context).draw();
      const second = new VF.Stave(50, 185, 800).addClef('treble').addTimeSignature('C');
      second.setBegBarType(VF.Barline.type.REPEAT_BEGIN).setEndBarType(VF.Barline.type.REPEAT_END).setContext(context).draw();
      overlay.text('Return to the beginning and repeat once', 450, 160, { 'font-size': 18, 'text-anchor': 'middle' });
      overlay.text('Repeat only the music enclosed by the repeat barlines', 450, 300, { 'font-size': 18, 'text-anchor': 'middle' });
    },
  },
  {
    id: 'dynamic-vocabulary',
    sources: ['f2b61cfd8801b8d1548d9d7df76190770472186e.png'],
    output: 'dynamic-vocabulary.svg',
    alt: 'Common dynamic markings from fortississimo through pianississimo with their names and meanings.',
    width: 900,
    height: 500,
    render({ overlay }) {
      const rows = [['fff', 'fortississimo', 'very, very loud'], ['ff', 'fortissimo', 'very loud'], ['f', 'forte', 'loud'], ['mf', 'mezzo forte', 'medium loud'], ['mp', 'mezzo piano', 'medium quiet'], ['p', 'piano', 'quiet'], ['pp', 'pianissimo', 'very quiet'], ['ppp', 'pianississimo', 'very, very quiet']];
      rows.forEach(([mark, name, meaning], index) => {
        const y = 48 + index * 55;
        overlay.text(mark, 90, y, { 'font-size': 25, 'font-style': 'italic', 'font-weight': '700', 'text-anchor': 'middle' });
        overlay.text(name, 205, y, { 'font-size': 18, 'font-weight': '700' });
        overlay.text('=', 430, y, { 'font-size': 18 });
        overlay.text(meaning, 480, y, { 'font-size': 18 });
      });
    },
  },
  {
    id: 'gradual-dynamics',
    sources: ['0da96940e079272e14f867fb6afe50aab934db38.png'],
    output: 'gradual-dynamics.svg',
    alt: 'Three equivalent ways to notate crescendo from piano to forte and diminuendo back to piano.',
    width: 900,
    height: 480,
    render({ VF, context, overlay }) {
      [35, 175, 315].forEach((y) => wholeNoteStave(VF, context, y));
      ['p     crescendo     f     decrescendo     p', 'p     cresc.     f     dim.     p', 'p                  f                  p'].forEach((text, index) => overlay.text(text, 450, 145 + index * 140, { 'font-size': 18, 'font-style': 'italic', 'text-anchor': 'middle' }));
      overlay.path('M 230 423 L 430 397 L 430 449 Z', { fill: 'none', stroke: '#111', 'stroke-width': 2 });
      overlay.path('M 470 397 L 670 423 L 470 449 Z', { fill: 'none', stroke: '#111', 'stroke-width': 2 });
    },
  },
  {
    id: 'tie-example',
    sources: ['22b5ae512ec83d6deb1ceb4ddee6e040e09b7d52.png'],
    output: 'tie-example.svg',
    alt: 'Two notes of the same pitch joined by a tie across a barline.',
    width: 720,
    height: 230,
    render({ VF, context, overlay }) {
      const stave = new VF.Stave(55, 65, 610).addClef('treble').addTimeSignature('C');
      stave.setContext(context).draw();
      const notes = [new VF.StaveNote({ keys: ['d/5'], duration: 'w' }), new VF.StaveNote({ keys: ['d/5'], duration: 'w' })];
      const voice = new VF.Voice({ num_beats: 8, beat_value: 4 }).setStrict(false).addTickables(notes);
      new VF.Formatter().joinVoices([voice]).format([voice], 430);
      voice.setStave(stave).draw(context, stave);
      new VF.StaveTie({ firstNote: notes[0], lastNote: notes[1], firstIndexes: [0], lastIndexes: [0] }).setContext(context).draw();
      overlay.text('Tie: sustain the first note through the second', 360, 205, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'articulation-sampler',
    sources: ['7c179b36f452ae1939fc4bfc193fb62e59a75154.png'],
    output: 'articulation-sampler.svg',
    alt: 'A phrase demonstrating staccato, tenuto, accents, slurs, and marcato articulation marks.',
    width: 920,
    height: 280,
    render({ VF, context, overlay }) {
      const stave = new VF.Stave(45, 75, 830).addClef('treble').addTimeSignature('3/4');
      stave.setContext(context).draw();
      const codes = ['a.', 'a.', 'a-', 'a-', 'a>', 'a>', 'a^', 'a^'];
      const notes = codes.map((code, index) => new VF.StaveNote({ keys: [index < 4 ? 'b/4' : 'd/5'], duration: 'q' }).addModifier(new VF.Articulation(code).setPosition(VF.Modifier.Position.ABOVE), 0));
      const voice = new VF.Voice({ num_beats: 8, beat_value: 4 }).setStrict(false).addTickables(notes);
      new VF.Formatter().joinVoices([voice]).format([voice], 690);
      voice.setStave(stave).draw(context, stave);
      overlay.text('staccato', 180, 225, { 'text-anchor': 'middle' });
      overlay.text('tenuto', 350, 225, { 'text-anchor': 'middle' });
      overlay.text('accent', 535, 225, { 'text-anchor': 'middle' });
      overlay.text('marcato', 720, 225, { 'text-anchor': 'middle' });
    },
  },
];
