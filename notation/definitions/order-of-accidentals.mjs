export const definition = {
  id: 'order-of-accidentals',
  sources: ['1e680bce00d5343675596e1b60c05b74baee38fe.png'],
  output: 'order-of-accidentals.svg',
  alt: 'The fixed order of sharps, F C G D A E B, and the reverse order of flats, B E A D G C F.',
  width: 900,
  height: 260,
  render({ VF, context, overlay }) {
    const sharps = new VF.Stave(45, 70, 390).addClef('treble').addKeySignature('C#');
    const flats = new VF.Stave(465, 70, 390).addClef('treble').addKeySignature('Cb');
    sharps.setContext(context).draw();
    flats.setContext(context).draw();
    overlay.text('Order of Sharps', 240, 34, { 'font-size': 20, 'font-weight': '700', 'text-anchor': 'middle' });
    overlay.text('Order of Flats', 660, 34, { 'font-size': 20, 'font-weight': '700', 'text-anchor': 'middle' });
    overlay.text('F   C   G   D   A   E   B', 450, 205, { 'font-size': 22, 'font-weight': '700', 'text-anchor': 'middle' });
    overlay.text('Order of sharps  →', 250, 170, { 'font-size': 18, 'text-anchor': 'middle' });
    overlay.text('←  Order of flats', 650, 238, { 'font-size': 18, 'text-anchor': 'middle' });
  },
};
