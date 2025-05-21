import React, { useEffect, useRef, useState } from 'react';

const ComponentCanvas = ({ components, onPinClick, setWireJson }) => {
  const canvasRef = useRef(null);
  const highlightSvgRef = useRef(null);
  const [positions, setPositions] = useState({});
  const [cursorType, setCursorType] = useState('default');

  const dragItem = useRef(null);
  const offset = useRef({ x: 0, y: 0 });
  const currentHighlight = useRef({ box: null, text: null, square: null });
  const [startPin, setStartPin] = useState(null);
  const [wires, setWires] = useState([]);

  useEffect(() => {
    const newPositions = {};
    components.forEach((comp, idx) => {
      if (!positions[comp.id]) {
        newPositions[comp.id] = { top: 50 + idx * 100, left: 50 };
      }
    });
    setPositions(prev => ({ ...prev, ...newPositions }));
  }, [components]);

  const attachPins = () => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    components.forEach(comp => {
      const elem = document.getElementById(comp.id);
      const wrapper = document.getElementById(`wrap-${comp.id}`);
      if (!elem || !elem.shadowRoot || !wrapper) return;

      const pins = elem.shadowRoot.querySelectorAll('[data-pin]');
      if (!pins.length) return;

      const wrapperRect = wrapper.getBoundingClientRect();
      const wrapperOffsetX = wrapperRect.left - canvasRect.left;
      const wrapperOffsetY = wrapperRect.top - canvasRect.top;

      const pinInfo = {};
      pins.forEach(pin => {
        const name = pin.getAttribute('data-pin')?.trim() || 'Unknown';
        const label = pin.getAttribute('data-label')?.trim() || name;
        const pinRect = pin.getBoundingClientRect();
        const x = pinRect.left - canvasRect.left - wrapperOffsetX + pinRect.width / 2;
        const y = pinRect.top - canvasRect.top - wrapperOffsetY + pinRect.height / 2;
        pinInfo[label] = { name, label, x, y };
      });

      elem.pinInfo = pinInfo;
    });
  };

  useEffect(() => {
    const retry = (n = 10) => {
      attachPins();
      if (n > 0) setTimeout(() => retry(n - 1), 300);
    };
    retry();
  }, [components]);

  useEffect(() => {
    attachPins();
  }, [positions]);

  const clearPinHighlight = () => {
    const { box, text, square } = currentHighlight.current;
    if (box && highlightSvgRef.current.contains(box)) highlightSvgRef.current.removeChild(box);
    if (text && highlightSvgRef.current.contains(text)) highlightSvgRef.current.removeChild(text);
    if (square && highlightSvgRef.current.contains(square)) highlightSvgRef.current.removeChild(square);
    currentHighlight.current = { box: null, text: null, square: null };
  };

  const findPinAtPosition = (clientX, clientY) => {
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const clickX = clientX - canvasRect.left;
    const clickY = clientY - canvasRect.top;

    for (const comp of components) {
      const elem = document.getElementById(comp.id);
      const wrapperPos = positions[comp.id];
      if (!elem || !elem.pinInfo || !wrapperPos) continue;

      for (const [pinName, pin] of Object.entries(elem.pinInfo)) {
        const pinX = wrapperPos.left + pin.x;
        const pinY = wrapperPos.top + pin.y;
        const dx = clickX - pinX;
        const dy = clickY - pinY;
        if (Math.hypot(dx, dy) < 10) {
          return { compId: comp.id, pinName, pinData: pin, element: elem };
        }
      }
    }
    return null;
  };

  const updatePinHighlight = (pin) => {
    clearPinHighlight();
    if (!pin) return;

    const { compId, pinName, pinData } = pin;
    const wrap = positions[compId] || { left: 0, top: 0 };
    const x = wrap.left + pinData.x;
    const y = wrap.top + pinData.y;

    const square = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    square.setAttribute('x', x - 5);
    square.setAttribute('y', y - 5);
    square.setAttribute('width', 10);
    square.setAttribute('height', 10);
    square.setAttribute('fill', '#226622');
    square.setAttribute('stroke', 'black');
    square.setAttribute('stroke-width', '1');

    const labelText = pinData.label || pinData.name || pinName;
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.setAttribute('font-size', '14');
    text.setAttribute('font-family', 'Arial, sans-serif');
    text.setAttribute('fill', 'black');
    text.textContent = labelText;

    highlightSvgRef.current.appendChild(text);
    const bbox = text.getBBox();
    highlightSvgRef.current.removeChild(text);

    const textX = x - bbox.width / 2;
    const textY = y - 20;

    text.setAttribute('x', textX + 4);
    text.setAttribute('y', textY + 16);

    const box = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const padding = 4;
    box.setAttribute('x', textX);
    box.setAttribute('y', textY);
    box.setAttribute('width', bbox.width + padding * 2);
    box.setAttribute('height', bbox.height + padding);
    box.setAttribute('rx', 4);
    box.setAttribute('ry', 4);
    box.setAttribute('fill', 'white');
    box.setAttribute('stroke', 'green');
    box.setAttribute('stroke-width', '1');

    highlightSvgRef.current.appendChild(box);
    highlightSvgRef.current.appendChild(text);
    highlightSvgRef.current.appendChild(square);

    currentHighlight.current = { box, text, square };
  };

  const handleCanvasMouseMove = e => {
    const pin = findPinAtPosition(e.clientX, e.clientY);
    if (pin) {
      updatePinHighlight(pin);
      setCursorType('crosshair');
    } else {
      clearPinHighlight();
      if (!dragItem.current) setCursorType('default');
    }
  };

  const handleCanvasClick = e => {
    const pin = findPinAtPosition(e.clientX, e.clientY);
    if (!pin) return;

    updatePinHighlight(pin);

    if (!startPin) {
      setStartPin(pin);
    } else {
      if (startPin.compId !== pin.compId || startPin.pinName !== pin.pinName) {
        const newWire = {
          from: { ...startPin },
          to: { ...pin },
        };

        const updatedWires = [...wires, newWire];
        setWires(updatedWires);

        const newJson = updatedWires.map(wire => ({
          from: {
            compId: wire.from.compId,
            pinName: wire.from.pinName,
            pinData: {
              ...wire.from.pinData
            }
          },
          to: {
            compId: wire.to.compId,
            pinName: wire.to.pinName,
            pinData: {
              ...wire.to.pinData
            }
          }
        }));

        setWireJson(newJson);
      }
      setStartPin(null);
    }

    onPinClick(pin.compId, pin.pinName, pin.pinData.label || pin.pinName);
  };

  const handleMouseDown = (e, id) => {
    dragItem.current = id;
    offset.current = {
      x: e.clientX - positions[id].left,
      y: e.clientY - positions[id].top,
    };
    setCursorType('grabbing');
  };

  const handleMouseMove = e => {
    if (!dragItem.current) return;
    const id = dragItem.current;
    const canvasBox = canvasRef.current.getBoundingClientRect();
    const wrapElem = document.getElementById(`wrap-${id}`);
    if (!wrapElem) return;
    const wrapBox = wrapElem.getBoundingClientRect();

    const newX = Math.min(Math.max(0, e.clientX - offset.current.x), canvasBox.width - wrapBox.width);
    const newY = Math.min(Math.max(0, e.clientY - offset.current.y), canvasBox.height - wrapBox.height);
    setPositions(prev => ({ ...prev, [id]: { top: newY, left: newX } }));
  };

  const handleMouseUp = () => {
    if (dragItem.current) {
      dragItem.current = null;
      attachPins();
      setCursorType('default');
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [positions]);

  return (
    <div
      ref={canvasRef}
      id="component-canvas"
      onMouseMove={handleCanvasMouseMove}
      onClick={handleCanvasClick}
      className="relative w-full h-screen bg-gray-50 overflow-visible rounded"
      style={{ cursor: cursorType }}
    >
      {components.map(comp => {
        const TagName = comp.tag;
        const pos = positions[comp.id] || { top: 50, left: 50 };
        return (
          <div
            key={comp.id}
            id={`wrap-${comp.id}`}
            className="absolute"
            style={{ top: pos.top, left: pos.left, cursor: 'grab' }}
            onMouseDown={e => handleMouseDown(e, comp.id)}
          >
            {React.createElement(TagName, { id: comp.id, class: 'ele', ...comp.attrs })}
          </div>
        );
      })}

      <svg ref={highlightSvgRef} className="absolute top-0 left-0 w-full h-full pointer-events-none z-10" />

      <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="black" />
          </marker>
        </defs>
        {wires.map((wire, index) => {
          const fromPos = positions[wire.from.compId];
          const toPos = positions[wire.to.compId];
          if (!fromPos || !toPos) return null;

          const x1 = fromPos.left + wire.from.pinData.x;
          const y1 = fromPos.top + wire.from.pinData.y;
          const x2 = toPos.left + wire.to.pinData.x;
          const y2 = toPos.top + wire.to.pinData.y;

          return (
            <line
              key={index}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="black"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
            />
          );
        })}
      </svg>
    </div>
  );
};

export default ComponentCanvas;
