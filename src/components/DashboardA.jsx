import React, { useEffect, useState } from 'react';
import ComponentCanvas from './ComponentCanvas';
import CodeEditor from './CodeEditor';
import { availableComponents } from '../utils/componentList';
import { FaPlay, FaPlus, FaEllipsisV } from 'react-icons/fa';

const DashboardA = () => {
  const [components, setComponents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [code, setCode] = useState(`void setup() {\n  pinMode(13, OUTPUT);\n}\n\nvoid loop() {\n  digitalWrite(13, HIGH);\n  delay(500);\n  digitalWrite(13, LOW);\n  delay(500);\n}`);
  const [showTab, setShowTab] = useState('ino');
  const [wireJson, setWireJson] = useState([]);
  const firstName = localStorage.getItem('firstName') || 'First';
  const lastName = localStorage.getItem('lastName') || 'Last';
  const email = localStorage.getItem('email') || 'example@example.com';

  useEffect(() => {
    if (!window.wokwiElementsLoaded) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@wokwi/elements@0.48.3/dist/wokwi-elements.bundle.js';
      script.async = true;
      document.body.appendChild(script);
      window.wokwiElementsLoaded = true;
    }
  }, []);

  const handleAddComponent = (comp) => {
    const id = `${comp.tag}-${Date.now()}`;
    setComponents((prev) => [...prev, { ...comp, id }]);
    setDropdownOpen(false);
  };

  // 👇 Simulate Arduino code execution
  const simulateCode = () => {
    const setupCode = [];
    const loopCode = [];
    let inLoop = false;

    code.split('\n').forEach(line => {
      if (line.includes('void loop()')) inLoop = true;
      else if (line.includes('void setup()')) inLoop = false;
      else if (line.includes('{') || line.includes('}')) return;
      else if (inLoop) loopCode.push(line.trim());
      else setupCode.push(line.trim());
    });

    const runCommands = (commands, startDelay = 0) => {
      let delay = startDelay;

      commands.forEach(line => {
        if (line.startsWith('digitalWrite')) {
          const match = line.match(/digitalWrite\((\d+),\s*(HIGH|LOW)\);?/);
          if (match) {
            const pin = match[1];
            const value = match[2] === 'HIGH' ? '1' : '0';

            setTimeout(() => {
              document.querySelectorAll('.ele').forEach(elem => {
                if (elem.pinInfo && elem.pinInfo[pin]) {
                  elem.setAttribute('value', value);
                }
//                 if (elem.pinInfo) {
//   for (const [label, pin] of Object.entries(elem.pinInfo)) {
//     // Convert numeric pin (like 13) to string to match against pin labels
//     if (label === pin) continue; // skip invalid
//     if (pin.name === pin) continue; // skip unknowns

//     // Check if label or name matches the pin number
//     if (label === pin || pin.name === pin || label === pinNum || pin.name === pinNum || label.endsWith(pinNum)) {
//       elem.setAttribute('value', value);
//     }
//   }
// }

              });
            }, delay);
          }
        } else if (line.startsWith('delay')) {
          const match = line.match(/delay\((\d+)\);?/);
          if (match) {
            delay += parseInt(match[1]);
          }
        }
      });

      return delay;
    };

    runCommands(setupCode);

    const loopDuration = runCommands(loopCode);
    if (loopDuration > 0) {
      setInterval(() => {
        runCommands(loopCode);
      }, loopDuration);
    }
  };

  const handleRun = () => {
    simulateCode();
  };

  const handlePinClick = (componentId, pinName, label) => {
    console.log(`Clicked pin: ${pinName} (${label}) on component ${componentId}`);
  };

  const generateCircuitJSON = () => {
    const parts = components.map((comp) => {
      const elem = document.getElementById(`wrap-${comp.id}`);
      const top = elem?.style?.top?.replace('px', '') || 100;
      const left = elem?.style?.left?.replace('px', '') || 100;
      return {
        type: comp.tag,
        id: comp.id,
        top: parseInt(top),
        left: parseInt(left),
        attrs: comp.attrs || {},
      };
    });

    const connections = wireJson.map((conn) => {
      const fromId = conn.from.compId || conn.from.componentId;
      const toId = conn.to.compId || conn.to.componentId;
      const fromPinName = conn.from.pinData?.name || conn.from.pinName;
      const toPinName = conn.to.pinData?.name || conn.to.pinName;
      const fromLabel = conn.from.pinData?.label || fromPinName;
      const toLabel = conn.to.pinData?.label || toPinName;
      return [
        `${fromId}:${fromLabel}`,
        `${toId}:${toLabel}`,
        'black',
        ['v0']
      ];
    });

    return {
      version: 1,
      author: `${firstName} ${lastName}`,
      editor: 'SVR Simulator',
      parts,
      connections,
      dependencies: {}
    };
  };

  return (
    <div className="flex h-screen w-full bg-white font-sans">
      {/* Left Panel: Editor */}
      <div className="w-1/2 flex flex-col border-r">
        <div className="bg-gray-100 border-b px-4 py-2 text-sm font-semibold flex justify-between">
          <div>
            👤 {firstName} {lastName}
            <div className="text-xs text-gray-500">{email}</div>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setShowTab('ino')}
              className={`px-3 py-1 ${showTab === 'ino' ? 'bg-white border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              sketch.ino
            </button>
            <button
              onClick={() => setShowTab('json')}
              className={`px-3 py-1 ${showTab === 'json' ? 'bg-white border-b-2 border-blue-600' : 'text-gray-500'}`}
            >
              diagram.json
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-auto p-4">
          {showTab === 'ino' ? (
            <CodeEditor code={code} setCode={setCode} />
          ) : (
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(generateCircuitJSON(), null, 2)}
            </pre>
          )}
        </div>
      </div>

      {/* Right Panel: Simulator */}
      <div className="w-1/2 relative bg-gray-100">
        <div className="absolute top-2 left-2 z-10 flex gap-2">
          <button
            onClick={handleRun}
            className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow"
            title="Run"
          >
            <FaPlay />
          </button>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow"
            title="Add Component"
          >
            <FaPlus />
          </button>
          <button
            className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full shadow"
            title="More Options"
          >
            <FaEllipsisV />
          </button>
        </div>

        {dropdownOpen && (
          <div className="absolute top-16 left-2 bg-white border shadow rounded w-48 max-h-64 overflow-y-auto z-20">
            {availableComponents.map((comp, idx) => (
              <div
                key={idx}
                onClick={() => handleAddComponent(comp)}
                className="p-2 hover:bg-blue-100 cursor-pointer text-sm"
              >
                {comp.name}
              </div>
            ))}
          </div>
        )}

        <ComponentCanvas
          components={components}
          onPinClick={handlePinClick}
          setWireJson={setWireJson}
        />
      </div>
    </div>
  );
};

export default DashboardA;
