import React, { useEffect, useState } from 'react';
import ComponentCanvas from './ComponentCanvas';
import CodeEditor from './CodeEditor';
import { availableComponents } from '../utils/componentList';

const DashboardA = () => {
  const [components, setComponents] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [code, setCode] = useState('// Write Arduino code here');

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
    const pin = comp.defaultPin || null;
    const id = `${comp.tag}-${Date.now()}`;
    setComponents((prev) => [...prev, { ...comp, id, pin }]);
    setDropdownOpen(false);
  };

  const handleRun = () => {
    const lines = code.split('\n');
    lines.forEach(line => {
      const match = line.match(/digitalWrite\((\d+),\s*(HIGH|LOW)\);?/);
      if (match) {
        const pin = parseInt(match[1]);
        const value = match[2] === 'HIGH' ? '1' : '0';
        const comp = components.find(c => c.pin === pin && c.tag === 'wokwi-led');
        if (comp) {
          const el = document.getElementById(comp.id);
          if (el) el.setAttribute('value', value);
        }
      }
    });
  };

  return (
    <div className="min-h-screen grid grid-cols-12 gap-4 p-4 bg-gray-100">
      {/* Sidebar */}
      <div className="col-span-3 bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-purple-600 mb-4">User Info</h2>
        <p>Name: Test User</p>
        <p>Email: test@example.com</p>
      </div>

      {/* Main */}
      <div className="col-span-9 flex flex-col gap-4">
        {/* Buttons */}
        <div className="flex justify-between items-center">
          <div className="space-x-4">
            <button className="bg-purple-600 text-white px-4 py-2 rounded-md">Create New</button>
          </div>
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="bg-purple-500 text-white px-4 py-2 rounded-md"
            >
              Add Component ▼
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-md z-10">
                {availableComponents.map((comp, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleAddComponent(comp)}
                    className="px-4 py-2 text-gray-700 hover:bg-purple-100 cursor-pointer"
                  >
                    {comp.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Editor + Canvas */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-purple-600 mb-2">Code Editor</h2>
            <CodeEditor code={code} setCode={setCode} />
            <button
              onClick={handleRun}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
            >
              Run
            </button>
          </div>
          <div className="bg-white rounded-xl shadow-md p-4">
            <h2 className="text-lg font-semibold text-purple-600 mb-2">Canvas</h2>
            <ComponentCanvas components={components} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardA;
