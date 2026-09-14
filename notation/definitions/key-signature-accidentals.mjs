export const definition = {
  id: 'key-signature-accidentals',
  sources: ['d5fbd204f80fa9fe24ff054c8d36e40421292834.png'],
  output: 'key-signature-accidentals.svg',
  alt: 'A key signature with C sharp and later C notes showing the difference between a key signature and an accidental.',
  width: 800,
  height: 280,
  render({ VF, context, overlay }) {
    const stave = new VF.Stave(40, 110, 720).addClef('treble').addKeySignature('G');
    stave.setContext(context).draw();
    const notes = [
      new VF.StaveNote({ keys: ['c/5'], duration: 'w' }),
      new VF.StaveNote({ keys: ['c/4'], duration: 'w' }),
      new VF.StaveNote({ keys: ['c/5'], duration: 'w' }).addModifier(new VF.Accidental('n'), 0),
    ];
    const voice = new VF.Voice({ num_beats: 12, beat_value: 4 }).setStrict(false).addTickables(notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 560);
    voice.setStave(stave).draw(context, stave);
    overlay.text('C sharp in the key signature', 105, 72, { 'text-anchor': 'middle' });
    overlay.text('C sharp', 315, 72, { 'text-anchor': 'middle' });
    overlay.text('C natural (accidental)', 570, 72, { 'text-anchor': 'middle' });
    overlay.text('Every C is sharp unless an accidental changes it.', 400, 244, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' });
  },
};
