function drawNote(overlay, x, y, value, dots = 0) {
  const hollow = value === 'whole' || value === 'half';
  overlay.ellipse(x, y, 10, 7, { fill: hollow ? 'white' : '#111', stroke: '#111', 'stroke-width': 2, transform: `rotate(-18 ${x} ${y})` });
  if (value !== 'whole') overlay.line(x + 9, y, x + 9, y - 48, { stroke: '#111', 'stroke-width': 3 });
  if (value === 'eighth') overlay.path(`M ${x + 9} ${y - 48} Q ${x + 34} ${y - 34} ${x + 18} ${y - 16}`, { fill: 'none', stroke: '#111', 'stroke-width': 3 });
  for (let index = 0; index < dots; index += 1) overlay.circle(x + 18 + index * 10, y, 3, { fill: '#111', stroke: 'none' });
}

export const definition = {
  id: 'dotted-note-equations',
  sources: ['b2f53b8fe81baba62a2f0351451a7587266069df.png'],
  output: 'dotted-note-equations.svg',
  alt: 'A dotted whole, half, and quarter note shown as the original note plus a note worth half its duration.',
  width: 700,
  height: 390,
  render({ overlay }) {
    const rows = [['whole', 'whole', 'half'], ['half', 'half', 'quarter'], ['quarter', 'quarter', 'eighth']];
    rows.forEach(([dotted, original, addition], index) => {
      const y = 95 + index * 125;
      drawNote(overlay, 75, y, dotted, 1);
      overlay.text('=', 145, y + 7, { 'font-size': 28, 'text-anchor': 'middle' });
      drawNote(overlay, 220, y, original);
      overlay.text('+', 300, y + 7, { 'font-size': 28, 'text-anchor': 'middle' });
      drawNote(overlay, 385, y, addition);
      overlay.text(`A dotted ${dotted} note`, 535, y - 12, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' });
      overlay.text(`adds one ${addition} note`, 535, y + 18, { 'font-size': 17, 'text-anchor': 'middle' });
    });
  },
};
