// Pure helpers: wires ⇄ Arduino sketch. Extend as you add parts.
export function generateInoFromWires(wires = []) {
  const setup = new Set();
  const loop  = [];

  wires.forEach(w => {
    // example rule: LED wired to Uno pin-13 → blink sketch
    const pins = [w.from.pinName, w.to.pinName];
    if (pins.includes('13')) {
      setup.add(13);
      loop.push(
        '  digitalWrite(13, HIGH);\n' +
        '  delay(500);\n' +
        '  digitalWrite(13, LOW);\n' +
        '  delay(500);'
      );
    }
  });

  const setupLines = [...setup].map(p => `  pinMode(${p}, OUTPUT);`).join('\n');
  const loopLines  = loop.length ? loop.join('\n') : '  // add logic here';

  return `void setup() {\n${setupLines}\n}\n\nvoid loop() {\n${loopLines}\n}`;
}

export function parseWiresFromCode(code = '') {
  // Simple regex scan for pinMode / digitalWrite numbers
  const re   = /\b(?:pinMode|digitalWrite)\s*\(\s*(\d+)\s*,/g;
  const pins = new Set();
  let m; while ((m = re.exec(code))) pins.add(m[1]);

  // Build one fake LED wire for each pin-13 found (demo only)
  const wires = [];
  pins.forEach(p => {
    if (p === '13') {
      wires.push({
        from: { compId: 'uno-1', pinName: '13', pinData: { x: 0, y: 0 } },
        to:   { compId: 'led-13', pinName: 'A',  pinData: { x: 0, y: 0 } },
      });
    }
  });
  return wires;
}
