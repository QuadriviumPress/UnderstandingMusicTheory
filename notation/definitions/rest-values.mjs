export const definition = {
  id: 'rest-values',
  sources: ['bd711483c83680623a2d7c368a02da858e0ffc8f.png'],
  output: 'rest-values.svg',
  alt: 'Whole, half, quarter, eighth, sixteenth, and thirty-second rests on a treble staff.',
  width: 920,
  height: 260,
  render({ VF, context, overlay }) {
    const stave = new VF.Stave(40, 75, 840).addClef('treble');
    stave.setContext(context).draw();
    const entries = [['wr', 'Whole'], ['hr', 'Half'], ['qr', 'Quarter'], ['8r', 'Eighth'], ['16r', 'Sixteenth'], ['32r', 'Thirty-second']];
    const rests = entries.map(([duration]) => new VF.StaveNote({ keys: ['b/4'], duration }));
    const voice = new VF.Voice({ num_beats: 8, beat_value: 4 }).setStrict(false).addTickables(rests);
    new VF.Formatter().joinVoices([voice]).format([voice], 700);
    voice.setStave(stave).draw(context, stave);
    entries.forEach(([, label], index) => overlay.text(`${label}\nrest`, 175 + index * 124, 205, { 'font-size': 16, 'text-anchor': 'middle', 'data-line-height': 18 }));
  },
};
