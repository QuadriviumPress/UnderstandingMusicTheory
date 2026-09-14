export const definition = {
  id: 'enharmonic-key-signatures',
  sources: ['cbfa55d933eebda424353b4e388f6efa93374438.png'],
  output: 'enharmonic-key-signatures.svg',
  alt: 'The three-flat E-flat major and nine-sharp D-sharp major key signatures, which are enharmonic.',
  width: 760,
  height: 230,
  render({ VF, context, overlay }) {
    const flat = new VF.Stave(50, 80, 300).addClef('treble').addKeySignature('Eb');
    const sharp = new VF.Stave(410, 80, 300).addClef('treble');
    flat.setContext(context).draw();
    sharp.setContext(context).draw();
    // D-sharp major is a theoretical signature containing double sharps,
    // which VexFlow's built-in key-signature table intentionally omits.
    [['𝄪', 475, 105], ['♯', 500, 120], ['♯', 525, 95], ['♯', 550, 112], ['♯', 575, 128], ['♯', 600, 104], ['𝄪', 625, 121]].forEach(([symbol, x, y]) => {
      overlay.text(symbol, x, y, { 'font-size': 30, 'text-anchor': 'middle' });
    });
    overlay.text('E♭ major', 200, 38, { 'font-size': 21, 'font-weight': '700', 'text-anchor': 'middle' });
    overlay.text('D♯ major', 560, 38, { 'font-size': 21, 'font-weight': '700', 'text-anchor': 'middle' });
    overlay.text('Enharmonic keys: different spelling, same piano pitches', 380, 208, { 'font-size': 18, 'text-anchor': 'middle' });
  },
};
