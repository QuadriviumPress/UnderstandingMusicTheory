export const definition = {
  id: 'c-clefs',
  sources: ['64c29809ac6c72db4b257c2f609c46335c115990.png'],
  output: 'c-clefs.svg',
  alt: 'Five C clefs—soprano, mezzo-soprano, alto, tenor, and baritone—each marking middle C on a different staff line.',
  width: 900,
  height: 280,
  render({ VF, context, overlay }) {
    const clefs = [
      ['soprano', 'Soprano\nClef'], ['mezzo-soprano', 'Mezzo Soprano\nClef'], ['alto', 'Alto\nClef'], ['tenor', 'Tenor\nClef'], ['baritone-c', 'Baritone\nClef'],
    ];
    clefs.forEach(([clef, label], index) => {
      const x = 35 + index * 172;
      const stave = new VF.Stave(x, 70, 150).addClef(clef);
      stave.setContext(context).draw();
      const note = new VF.StaveNote({ clef, keys: ['c/4'], duration: 'w' });
      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 }).setStrict(false).addTickables([note]);
      new VF.Formatter().joinVoices([voice]).format([voice], 60);
      voice.setStave(stave);
      voice.draw(context, stave);
      overlay.text(label, x + 75, 205, { 'text-anchor': 'middle', 'font-size': 17 });
    });
  },
};
