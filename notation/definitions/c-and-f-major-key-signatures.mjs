export const definition = {
  id: 'c-and-f-major-key-signatures',
  sources: ['8859d5d2572195fac36408d32de9539a6f696b09.png'],
  output: 'c-and-f-major-key-signatures.svg',
  alt: 'C major has no sharps or flats; F major has one flat in its key signature.',
  width: 760,
  height: 190,
  render({ VF, context, overlay }) {
    const cMajor = new VF.Stave(55, 75, 300).addClef('treble');
    const fMajor = new VF.Stave(405, 75, 300).addClef('treble').addKeySignature('F');
    cMajor.setContext(context).draw();
    fMajor.setContext(context).draw();
    overlay.text('C major', 205, 35, { 'text-anchor': 'middle', 'font-size': 20 });
    overlay.text('F major', 555, 35, { 'text-anchor': 'middle', 'font-size': 20 });
    overlay.text('No sharps or flats', 205, 165, { 'text-anchor': 'middle' });
    overlay.text('One flat', 555, 165, { 'text-anchor': 'middle' });
  },
};
