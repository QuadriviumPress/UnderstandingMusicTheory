export const definition = {
  id: 'time-signature-anatomy',
  sources: ['2f9271d0daa8bc0f5e23bb4724651674a7814787.png'],
  output: 'time-signature-anatomy.svg',
  alt: 'A three-four time signature labelled to show beats per measure and the note value receiving one beat.',
  width: 760,
  height: 220,
  render({ VF, context, overlay }) {
    const stave = new VF.Stave(50, 70, 250).addClef('treble').addTimeSignature('3/4');
    stave.setContext(context).draw();
    overlay.text('3', 126, 105, { fill: '#1769aa', 'font-size': 27, 'font-weight': '700', 'text-anchor': 'middle' });
    overlay.text('4', 126, 135, { fill: '#b3261e', 'font-size': 27, 'font-weight': '700', 'text-anchor': 'middle' });
    overlay.text('Top number = how many beats are in one measure', 420, 45, { fill: '#1769aa', 'font-size': 18, 'text-anchor': 'middle' });
    overlay.text('Bottom number = which note value receives one beat', 430, 190, { fill: '#b3261e', 'font-size': 18, 'text-anchor': 'middle' });
  },
};
