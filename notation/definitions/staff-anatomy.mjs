export const definition = {
  id: 'staff-anatomy',
  sources: ['e9c7307b9a2752128fb6dbf906ddb725735750df.png'],
  output: 'staff-anatomy.svg',
  alt: 'A labelled staff showing clef, key and time signatures, note positions, ledger lines, bar lines, and double bar lines.',
  width: 760,
  height: 220,
  render({ VF, context, overlay }) {
    const stave = new VF.Stave(48, 62, 650);
    stave.addClef('treble').addKeySignature('D').addTimeSignature('4/4');
    stave.setEndBarType(VF.Barline.type.END).setContext(context).draw();
    const notes = [
      new VF.StaveNote({ keys: ['g/4'], duration: 'w' }),
      new VF.StaveNote({ keys: ['f/5'], duration: 'w' }),
      new VF.StaveNote({ keys: ['e/5'], duration: 'w' }),
    ];
    const voice = new VF.Voice({ num_beats: 12, beat_value: 4 }).setStrict(false);
    voice.addTickables(notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 380);
    voice.draw(context, stave);
    overlay.line(350, 62, 350, 142, { stroke: '#b3261e', 'stroke-width': 2 });
    overlay.line(594, 62, 594, 142, { stroke: '#b3261e', 'stroke-width': 2 });
    overlay.line(604, 62, 604, 142, { stroke: '#b3261e', 'stroke-width': 5 });
    overlay.text('Clef symbol', 42, 170, { fill: '#b3261e', 'text-anchor': 'middle' });
    overlay.text('Key signature', 134, 25, { fill: '#1769aa', 'text-anchor': 'middle' });
    overlay.text('Time signature', 205, 170, { fill: '#b3261e', 'text-anchor': 'middle' });
    overlay.text('Note in a space', 285, 25, { fill: '#1769aa', 'text-anchor': 'middle' });
    overlay.text('Note on a line', 453, 25, { fill: '#1769aa', 'text-anchor': 'middle' });
    overlay.text('Bar line', 350, 170, { fill: '#b3261e', 'text-anchor': 'middle' });
    overlay.text('Double bar line', 594, 170, { fill: '#b3261e', 'text-anchor': 'middle' });
    overlay.text('Heavy double bar line', 665, 170, { fill: '#b3261e', 'text-anchor': 'middle' });
    overlay.text('Music on a staff is read from left to right', 380, 210, { 'font-weight': '700', 'text-anchor': 'middle' });
  },
};
