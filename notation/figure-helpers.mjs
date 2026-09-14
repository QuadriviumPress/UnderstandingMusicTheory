export function note(VF, spec = {}) {
  if (typeof spec === 'string') spec = { key: spec };
  const keys = spec.keys ?? [spec.key ?? (spec.rest ? 'b/4' : 'c/5')];
  const duration = `${spec.duration ?? 'q'}${spec.rest ? 'r' : ''}`;
  const staveNote = new VF.StaveNote({
    keys,
    duration,
    clef: spec.clef,
    stemDirection: spec.stemDirection,
  });
  (spec.accidentals ?? []).forEach((accidental, index) => {
    if (accidental) staveNote.addModifier(new VF.Accidental(accidental), index);
  });
  if (spec.accidental) staveNote.addModifier(new VF.Accidental(spec.accidental), 0);
  if (spec.dots) VF.Dot.buildAndAttach([staveNote], { all: true });
  return staveNote;
}

export function drawStave(VF, context, options = {}) {
  const {
    x = 40,
    y = 50,
    width = 700,
    clef = 'treble',
    key,
    time,
    notes = [],
    formatWidth = width - 110,
    beams = false,
    beginBar,
    endBar,
  } = options;
  const stave = new VF.Stave(x, y, width);
  if (clef) stave.addClef(clef);
  if (key) stave.addKeySignature(key);
  if (time) stave.addTimeSignature(time);
  if (beginBar) stave.setBegBarType(beginBar);
  if (endBar) stave.setEndBarType(endBar);
  stave.setContext(context).draw();
  if (!notes.length) return { stave, notes: [], voice: null };
  const tickables = notes.map((item) => item instanceof VF.StaveNote ? item : note(VF, { clef, ...item }));
  const voice = new VF.Voice({ num_beats: 64, beat_value: 4 }).setStrict(false).addTickables(tickables);
  new VF.Formatter().joinVoices([voice]).format([voice], formatWidth);
  voice.setStave(stave).draw(context, stave);
  if (beams) VF.Beam.generateBeams(tickables).forEach((beam) => beam.setContext(context).draw());
  return { stave, notes: tickables, voice };
}

export function drawKeyboard(overlay, options = {}) {
  const {
    x = 40,
    y = 35,
    whiteWidth = 46,
    whiteHeight = 180,
    whiteKeys = 14,
    labels = [],
    blackLabels = {},
  } = options;
  overlay.path(`M ${x} ${y} H ${x + whiteKeys * whiteWidth} V ${y + whiteHeight} H ${x} Z`, {
    fill: 'white', stroke: '#111', 'stroke-width': 2,
  });
  for (let index = 1; index < whiteKeys; index += 1) {
    overlay.line(x + index * whiteWidth, y, x + index * whiteWidth, y + whiteHeight, { stroke: '#111', 'stroke-width': 2 });
  }
  const blackAfter = [0, 1, 3, 4, 5];
  for (let index = 0; index < whiteKeys - 1; index += 1) {
    if (!blackAfter.includes(index % 7)) continue;
    const center = x + (index + 1) * whiteWidth;
    overlay.path(`M ${center - whiteWidth * 0.3} ${y} H ${center + whiteWidth * 0.3} V ${y + whiteHeight * 0.62} H ${center - whiteWidth * 0.3} Z`, {
      fill: '#111', stroke: '#111', 'stroke-width': 1,
    });
    if (blackLabels[index]) overlay.text(blackLabels[index], center, y + whiteHeight * 0.35, {
      fill: 'white', 'font-size': 14, 'font-weight': '700', 'text-anchor': 'middle', 'data-line-height': 18,
    });
  }
  labels.forEach((label, index) => overlay.text(label, x + (index + 0.5) * whiteWidth, y + whiteHeight - 14, {
    'font-size': 15, 'text-anchor': 'middle',
  }));
}

export function labelUnder(overlay, labels, startX, step, y, attributes = {}) {
  labels.forEach((label, index) => overlay.text(label, startX + index * step, y, {
    'font-size': 16,
    'text-anchor': 'middle',
    ...attributes,
  }));
}
