export const definition = {
  id: 'common-and-cut-time',
  sources: ['475b22aebf81fa1ea80faef5e6f79f78d2ffa09d.png'],
  output: 'common-and-cut-time.svg',
  alt: 'Common-time and cut-time symbols compared with four-four and two-two numerical time signatures.',
  width: 820,
  height: 360,
  render({ VF, context, overlay }) {
    const examples = [
      [50, 55, 'C', 'Common time'], [460, 55, '4/4', 'Four-four time'],
      [50, 205, 'C|', 'Cut time'], [460, 205, '2/2', 'Two-two time'],
    ];
    examples.forEach(([x, y, time, label]) => {
      const stave = new VF.Stave(x, y, 300).addClef('treble').addTimeSignature(time);
      stave.setContext(context).draw();
      overlay.text(label, x + 150, y + 110, { 'font-size': 18, 'text-anchor': 'middle' });
    });
    overlay.text('=', 410, 145, { 'font-size': 26, 'text-anchor': 'middle' });
    overlay.text('=', 410, 295, { 'font-size': 26, 'text-anchor': 'middle' });
  },
};
