// highlight.js
let currentHighlight = null;

const highlightSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
highlightSvg.setAttribute('class', 'absolute top-0 left-0 w-full h-full pointer-events-none z-10');
highlightSvg.style.position = 'absolute';
highlightSvg.style.top = '0';
highlightSvg.style.left = '0';
highlightSvg.style.width = '100%';
highlightSvg.style.height = '100%';
highlightSvg.style.pointerEvents = 'none';
document.body.appendChild(highlightSvg);

function clearPinHighlight() {
  if (currentHighlight) {
    highlightSvg.removeChild(currentHighlight);
    currentHighlight = null;
  }
  hidePinTooltip();
}

function getPinPosition(element, pinName) {
  const pinData = element.pinInfo?.[pinName];
  return pinData
    ? { x: pinData.x + element.offsetLeft, y: pinData.y + element.offsetTop }
    : { x: 0, y: 0 };
}

function showPinTooltip(label, x, y) {
  let tooltip = document.getElementById('pin-tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.id = 'pin-tooltip';
    tooltip.className = 'fixed z-50 bg-black text-white text-xs px-2 py-1 rounded';
    document.body.appendChild(tooltip);
  }
  tooltip.innerText = label;
  tooltip.style.left = `${x + 10}px`;
  tooltip.style.top = `${y + 10}px`;
  tooltip.style.display = 'block';
}

function hidePinTooltip() {
  const tooltip = document.getElementById('pin-tooltip');
  if (tooltip) tooltip.remove();
}

export function updatePinHighlight(pin, mouseEvent = null) {
  clearPinHighlight();
  if (pin) {
    const pos = getPinPosition(pin.element, pin.pinName);
    currentHighlight = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    currentHighlight.classList.add('pin-highlight');
    currentHighlight.setAttribute('r', '5');
    currentHighlight.setAttribute('cx', pos.x);
    currentHighlight.setAttribute('cy', pos.y);
    currentHighlight.setAttribute('fill', 'red');
    highlightSvg.appendChild(currentHighlight);

    const pinData = pin.element.pinInfo?.[pin.pinName];
    const tooltipLabel = pinData?.label || `Pin: ${pin.pinName}`;
    if (mouseEvent) {
      showPinTooltip(tooltipLabel, mouseEvent.clientX, mouseEvent.clientY);
    }
  } else {
    hidePinTooltip();
  }
}
