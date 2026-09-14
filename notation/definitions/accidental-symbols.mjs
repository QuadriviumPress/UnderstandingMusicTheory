export const definition = {
  id: 'accidental-symbols',
  sources: ['7bdb702ae46b9f046bc9e058e4fb2172d4d4a597.png'],
  output: 'accidental-symbols.svg',
  alt: 'Sharp, natural, and flat symbols shown above a staff with D-sharp, D-natural, and D-flat notes.',
  width: 820,
  height: 270,
  render({ VF, context, overlay }) {
    const stave = new VF.Stave(40, 130, 730).addClef('treble').addKeySignature('Bb').addTimeSignature('4/4');
    stave.setContext(context).draw();
    const pitches = [['d/5', '#'], ['d/5', 'n'], ['d/5', 'b']];
    const voice = new VF.Voice({ num_beats: 12, beat_value: 4 }).setStrict(false);
    voice.addTickables(pitches.map(([key, accidental]) => new VF.StaveNote({ keys: [key], duration: 'w' }).addModifier(new VF.Accidental(accidental), 0)));
    new VF.Formatter().joinVoices([voice]).format([voice], 560);
    voice.setStave(stave).draw(context, stave);
    [['Sharp Symbol', '♯', 'D sharp', 235], ['Natural Symbol', '♮', 'D natural', 425], ['Flat Symbol', '♭', 'D flat', 615]].forEach(([label, symbol, note, x]) => {
      overlay.text(label, x, 28, { 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text(symbol, x, 88, { 'font-size': 52, 'text-anchor': 'middle' });
      overlay.text(note, x, 116, { 'text-anchor': 'middle' });
    });
    overlay.text('Key signature: two flats (B-flat major)', 62, 205, { 'font-size': 16 });
  },
};
