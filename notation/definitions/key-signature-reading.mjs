export const definition = {
  id: 'key-signature-reading',
  sources: ['f55fb28bd8a6394d7cdcacddfa5cf7ce92c1ca53.png'],
  output: 'key-signature-reading.svg',
  alt: 'Treble and bass staves showing how flats and sharps in a key signature affect notes on the same line or space.',
  width: 900,
  height: 300,
  render({ VF, context, overlay }) {
    const examples = [
      { x: 35, clef: 'treble', key: 'Bb', top: 'Notes in top space\nare E flat', line: 'Notes on fourth line\nare D natural', caption: 'Treble clef; key signature has two flats' },
      { x: 485, clef: 'bass', key: 'A', top: 'Notes in top space\nare G sharp', line: 'Notes on fourth line\nare F sharp', caption: 'Bass clef; key signature has three sharps' },
    ];
    examples.forEach((example) => {
      const stave = new VF.Stave(example.x, 120, 350).addClef(example.clef).addKeySignature(example.key);
      stave.setContext(context).draw();
      overlay.text('On this staff:', example.x + 80, 28, { 'text-anchor': 'middle', 'font-size': 17 });
      overlay.text(example.top, example.x + 105, 72, { fill: '#1769aa', 'text-anchor': 'middle', 'font-size': 16 });
      overlay.text(example.line, example.x + 270, 72, { fill: '#1769aa', 'text-anchor': 'middle', 'font-size': 16 });
      overlay.text(example.caption, example.x + 85, 245, { fill: '#b3261e', 'font-size': 16, 'text-anchor': 'middle' });
    });
  },
};
