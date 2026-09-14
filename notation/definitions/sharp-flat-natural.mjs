export const definition = {
  id: 'sharp-flat-natural',
  sources: ['25354c60c6686014216c73df293a583d4275aca5.png'],
  output: 'sharp-flat-natural.svg',
  alt: 'D sharp, D flat, and D natural written on a treble staff with their accidental symbols labelled.',
  width: 760,
  height: 270,
  render({ VF, context, overlay }) {
    const stave = new VF.Stave(45, 105, 670).addClef('treble');
    stave.setContext(context).draw();
    const entries = [['#', 'Sharp', 'D sharp'], ['b', 'Flat', 'D flat'], ['n', 'Natural', 'D natural']];
    const notes = entries.map(([accidental]) => new VF.StaveNote({ keys: ['d/4'], duration: 'w' }).addModifier(new VF.Accidental(accidental), 0));
    const voice = new VF.Voice({ num_beats: 12, beat_value: 4 }).setStrict(false).addTickables(notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 500);
    voice.setStave(stave).draw(context, stave);
    entries.forEach(([, label, note], index) => {
      const x = 220 + index * 190;
      overlay.text(label, x, 28, { 'font-size': 20, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text(note, x, 238, { 'font-size': 18, 'text-anchor': 'middle' });
    });
  },
};
