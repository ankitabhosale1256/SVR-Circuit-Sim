import React, { useEffect, useRef } from 'react';
import * as avr8js from 'avr8js';

const hexCode = `
:100000000C9434000C9446000C9446000C944600C2
:100010000C9446000C9446000C9446000C94460098
:00000001FF
`;

const AVRSimulator = () => {
  const logRef = useRef();

  useEffect(() => {
    (async () => {
      const program = new Uint8Array(32 * 1024);
      await avr8js.loadHex(hexCode, new avr8js.FlashProgrammer(program));
      const runner = new avr8js.AVRRunner(program);

      runner.portB.addListener((value) => {
        if (logRef.current) {
          logRef.current.innerText = `PORTB: ${value.toString(2).padStart(8, '0')}`;
        }
      });

      runner.execute(() => true);
    })();
  }, []);

  return (
    <div className="p-4 bg-gray-100 rounded-md shadow mt-4">
      <h2 className="text-lg font-bold mb-2">AVR8js Simulator</h2>
      <div ref={logRef} className="bg-black text-green-400 p-2 rounded-md h-10" />
    </div>
  );
};

export default AVRSimulator;
