export const definitions = [
  {
    id: 'melodic-contour',
    sources: ['c32e677198a253273e91fa742ab010574fb28de7.png'],
    output: 'melodic-contour.svg',
    alt: 'A melody that rises and then falls, with a red curve tracing its contour.',
    width: 820,
    height: 240,
    render({ VF, context, overlay }) {
      const stave = new VF.Stave(45, 65, 730).addClef('treble');
      stave.setContext(context).draw();
      const keys = ['c/4', 'e/4', 'g/4', 'b/4', 'd/5', 'c/5', 'a/4'];
      const notes = keys.map((key) => new VF.StaveNote({ keys: [key], duration: 'q' }));
      const voice = new VF.Voice({ num_beats: 7, beat_value: 4 }).setStrict(false).addTickables(notes);
      new VF.Formatter().joinVoices([voice]).format([voice], 590);
      voice.setStave(stave).draw(context, stave);
      overlay.path('M 130 180 C 280 165 390 90 500 92 C 600 94 650 135 700 170', { fill: 'none', stroke: '#d32f2f', 'stroke-width': 4, 'stroke-linecap': 'round' });
      overlay.text('ascending', 270, 220, { fill: '#b3261e', 'text-anchor': 'middle' });
      overlay.text('descending', 600, 220, { fill: '#b3261e', 'text-anchor': 'middle' });
    },
  },
  {
    id: 'vocal-range-example',
    sources: ['402dd0fcd9295e3f332d3afc3f834bb36322a789.png'],
    output: 'vocal-range-example.svg',
    alt: 'Two whole notes from low C to high G connected by a red line to illustrate musical range.',
    width: 680,
    height: 260,
    render({ VF, context, overlay }) {
      const stave = new VF.Stave(55, 60, 570).addClef('treble');
      stave.setContext(context).draw();
      const notes = [new VF.StaveNote({ keys: ['c/4'], duration: 'w' }), new VF.StaveNote({ keys: ['g/5'], duration: 'w' })];
      const voice = new VF.Voice({ num_beats: 8, beat_value: 4 }).setStrict(false).addTickables(notes);
      new VF.Formatter().joinVoices([voice]).format([voice], 390);
      voice.setStave(stave).draw(context, stave);
      overlay.line(190, 175, 480, 85, { stroke: '#d32f2f', 'stroke-width': 4 });
      overlay.text('Range from low C to high G', 340, 230, { 'font-size': 19, 'font-weight': '700', 'text-anchor': 'middle' });
    },
  },
];
