export const definition = {
  id: 'ties-and-dots',
  sources: ['78e448e0e53633bbab129e0a9338f671f7aeaf2a.png'],
  output: 'ties-and-dots.svg',
  alt: 'A four-four staff comparing notes joined by ties with equivalent dotted-note durations.',
  width: 900,
  height: 250,
  render({ VF, context, overlay }) {
    const stave = new VF.Stave(45, 75, 810).addClef('treble').addTimeSignature('4/4');
    stave.setContext(context).draw();
    const notes = [
      new VF.StaveNote({ keys: ['b/4'], duration: 'h' }),
      new VF.StaveNote({ keys: ['b/4'], duration: 'h' }),
      new VF.StaveNote({ keys: ['a/4'], duration: 'h' }),
      new VF.StaveNote({ keys: ['a/4'], duration: 'q' }),
      new VF.StaveNote({ keys: ['c/5'], duration: 'q' }),
      new VF.StaveNote({ keys: ['c/5'], duration: 'q' }),
      new VF.StaveNote({ keys: ['b/4'], duration: 'h' }),
    ];
    VF.Dot.buildAndAttach([notes[2]], { all: true });
    const voice = new VF.Voice({ num_beats: 10, beat_value: 4 }).setStrict(false).addTickables(notes);
    new VF.Formatter().joinVoices([voice]).format([voice], 680);
    voice.setStave(stave).draw(context, stave);
    [new VF.StaveTie({ firstNote: notes[0], lastNote: notes[1], firstIndexes: [0], lastIndexes: [0] }), new VF.StaveTie({ firstNote: notes[4], lastNote: notes[5], firstIndexes: [0], lastIndexes: [0] })]
      .forEach((tie) => tie.setContext(context).draw());
    overlay.text('A tie combines adjacent durations; a dot adds half the note value', 450, 220, { 'font-size': 18, 'font-weight': '700', 'text-anchor': 'middle' });
  },
};
