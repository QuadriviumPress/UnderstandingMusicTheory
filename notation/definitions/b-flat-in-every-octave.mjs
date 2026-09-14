export const definition = {
  id: 'b-flat-in-every-octave',
  sources: ['4216daa4328f8456a887e88bd49184ab8697d084.png'],
  output: 'b-flat-in-every-octave.svg',
  alt: 'A treble staff with one flat in the key signature and B-flat notes shown in three octaves.',
  width: 760,
  height: 220,
  render({ VF, context, overlay }) {
    const stave = new VF.Stave(50, 65, 650).addClef('treble').addKeySignature('F');
    stave.setContext(context).draw();
    const notes = ['b/3', 'b/4', 'b/5'].map((key) => new VF.StaveNote({ keys: [key], duration: 'w' }));
    const voice = new VF.Voice({ num_beats: 12, beat_value: 4 }).setStrict(false).addTickables(notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 470);
    voice.setStave(stave).draw(context, stave);
    overlay.text('One flat in the key signature makes every B flat', 380, 30, { 'font-size': 19, 'font-weight': '700', 'text-anchor': 'middle' });
    overlay.text('B♭ below the staff', 205, 195, { 'text-anchor': 'middle' });
    overlay.text('B♭ on the staff', 380, 195, { 'text-anchor': 'middle' });
    overlay.text('B♭ above the staff', 560, 195, { 'text-anchor': 'middle' });
  },
};
