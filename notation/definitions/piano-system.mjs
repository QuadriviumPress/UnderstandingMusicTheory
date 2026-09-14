export const definition = {
  id: 'piano-system',
  sources: ['4bf971ff8e9d7002fb3539c064b9a8d2ca601677.png'],
  output: 'piano-system.svg',
  alt: 'A vocal staff and two braced piano staves that share bar lines.',
  width: 820,
  height: 410,
  render({ VF, context, overlay }) {
    const vocal = new VF.Stave(260, 50, 500).addClef('treble').addKeySignature('D').addTimeSignature('C');
    const rightHand = new VF.Stave(260, 175, 500).addClef('treble').addKeySignature('D').addTimeSignature('C');
    const leftHand = new VF.Stave(260, 285, 500).addClef('bass').addKeySignature('D').addTimeSignature('C');
    [vocal, rightHand, leftHand].forEach((stave) => stave.setContext(context).draw());
    new VF.StaveConnector(rightHand, leftHand).setType(VF.StaveConnector.type.BRACE).setContext(context).draw();
    new VF.StaveConnector(rightHand, leftHand).setType(VF.StaveConnector.type.SINGLE_LEFT).setContext(context).draw();
    const drawVoice = (stave, keys) => {
      const voice = new VF.Voice({ num_beats: 4, beat_value: 4 }).setStrict(false);
      voice.addTickables(keys.map((key) => new VF.StaveNote({ keys: [key], duration: 'q' })));
      new VF.Formatter().joinVoices([voice]).format([voice], 380);
      voice.draw(context, stave);
    };
    drawVoice(vocal, ['a/4', 'a/4', 'a/4', 'a/4']);
    drawVoice(rightHand, ['d/4', 'a/4', 'd/5', 'a/5']);
    drawVoice(leftHand, ['d/3', 'a/3', 'd/4', 'a/3']);
    [390, 520, 650].forEach((x) => overlay.line(x, 175, x, 325, { stroke: '#111', 'stroke-width': 1.5 }));
    overlay.text('Vocal line', 112, 110, { 'font-size': 20 });
    overlay.text('The two staves of a piano part\n(left hand and right hand)\nare usually also connected\nby a brace.', 12, 235, { 'font-size': 18 });
    overlay.text('Staves that are to be played at the same time\nare connected at least by a line at the end.\nThey may also be connected at each bar line.', 280, 365, { 'font-size': 18 });
  },
};
