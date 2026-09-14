function drawPair({ VF, context }) {
  const stave = new VF.Stave(45, 78, 430).addClef('treble');
  stave.setContext(context).draw();
  const notes = [
    new VF.StaveNote({ keys: ['d/4'], duration: 'w' }).addModifier(new VF.Accidental('#'), 0),
    new VF.StaveNote({ keys: ['e/4'], duration: 'w' }).addModifier(new VF.Accidental('b'), 0),
  ];
  const voice = new VF.Voice({ num_beats: 8, beat_value: 4 }).setStrict(false).addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], 270);
  voice.setStave(stave).draw(context, stave);
}

export const definition = {
  id: 'enharmonic-d-sharp-e-flat',
  sources: ['83d12745a48c3a3f1f65ab8b3f003a09c8a1e460.png'],
  output: 'enharmonic-d-sharp-e-flat.svg',
  alt: 'D sharp and E flat written differently on a treble staff although they sound the same on a piano.',
  width: 520,
  height: 210,
  render(args) {
    drawPair(args);
    args.overlay.text('D♯', 205, 185, { 'font-size': 20, 'text-anchor': 'middle' });
    args.overlay.text('E♭', 340, 185, { 'font-size': 20, 'text-anchor': 'middle' });
  },
};
