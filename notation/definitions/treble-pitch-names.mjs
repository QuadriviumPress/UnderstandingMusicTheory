export const definition = {
  id: 'treble-pitch-names',
  sources: ['847e7d248b6177b8cf0144658beed19346001782.png'],
  output: 'treble-pitch-names.svg',
  alt: 'A treble clef staff labelled with ascending note names from C through A above and below the staff.',
  width: 760,
  height: 220,
  render({ VF, context, overlay }) {
    new VF.Stave(55, 65, 650).addClef('treble').setContext(context).draw();
    overlay.text('Treble Clef\nSymbol', 45, 20, { 'text-anchor': 'middle', 'font-size': 17 });
    [['C', 142, 165], ['D', 183, 151], ['E', 224, 137], ['F', 265, 123], ['G', 306, 109], ['A', 347, 95], ['B', 388, 81], ['C', 429, 67], ['D', 470, 53], ['E', 511, 39], ['F', 552, 25], ['G', 593, 11], ['A', 634, -3]].forEach(([name, x, y]) => overlay.text(name, x, y, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' }));
    overlay.text('etc.', 35, 205, { 'font-size': 16 });
    overlay.text('etc.', 680, 24, { 'font-size': 16 });
  },
};
