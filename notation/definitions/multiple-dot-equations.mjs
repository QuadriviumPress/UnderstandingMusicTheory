function drawNote(overlay, x, y, value, dots = 0) {
  const hollow = value === 'whole' || value === 'half';
  overlay.ellipse(x, y, 9, 6, { fill: hollow ? 'white' : '#111', stroke: '#111', 'stroke-width': 2, transform: `rotate(-18 ${x} ${y})` });
  if (value !== 'whole') overlay.line(x + 8, y, x + 8, y - 42, { stroke: '#111', 'stroke-width': 3 });
  if (['eighth', 'sixteenth'].includes(value)) {
    const flags = value === 'sixteenth' ? 2 : 1;
    for (let index = 0; index < flags; index += 1) overlay.path(`M ${x + 8} ${y - 42 + index * 9} Q ${x + 30} ${y - 29 + index * 9} ${x + 17} ${y - 12 + index * 9}`, { fill: 'none', stroke: '#111', 'stroke-width': 3 });
  }
  for (let index = 0; index < dots; index += 1) overlay.circle(x + 17 + index * 10, y, 3, { fill: '#111', stroke: 'none' });
}

export const definition = {
  id: 'multiple-dot-equations',
  sources: ['e122067156ff2d35ecb1f8b0835d8b83fdc339ac.png'],
  output: 'multiple-dot-equations.svg',
  alt: 'Double- and triple-dotted notes expanded into the successively halved note values that the dots add.',
  width: 820,
  height: 400,
  render({ overlay }) {
    const rows = [
      ['whole', 2, ['whole', 'half', 'quarter']],
      ['half', 2, ['half', 'quarter', 'eighth']],
      ['half', 3, ['half', 'quarter', 'eighth', 'sixteenth']],
    ];
    rows.forEach(([value, dots, parts], row) => {
      const y = 92 + row * 125;
      drawNote(overlay, 65, y, value, dots);
      overlay.text('=', 135, y + 7, { 'font-size': 28, 'text-anchor': 'middle' });
      parts.forEach((part, index) => {
        drawNote(overlay, 210 + index * 135, y, part);
        if (index < parts.length - 1) overlay.text('+', 278 + index * 135, y + 7, { 'font-size': 26, 'text-anchor': 'middle' });
      });
    });
  },
};
