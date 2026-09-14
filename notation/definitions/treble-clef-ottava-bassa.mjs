export const definition = {
  id: 'treble-clef-ottava-bassa',
  sources: ['bb2ac01e554b5fe1aca0a602b0dce40e252716fe.png'],
  output: 'treble-clef-ottava-bassa.svg',
  alt: 'A treble clef staff with a small 8 below the clef, indicating that notes sound an octave lower than written.',
  width: 520,
  height: 200,
  render({ VF, context, overlay }) {
    new VF.Stave(55, 58, 400).addClef('treble').setContext(context).draw();
    overlay.text('8', 83, 164, { 'font-size': 28, 'text-anchor': 'middle' });
  },
};
