export function getTransformedCoords(e, canvas, scale = 1, origin = { x: 0, y: 0 }) {
  const rect = canvas.getBoundingClientRect();
  const x = (e.clientX - rect.left - origin.x) / scale;
  const y = (e.clientY - rect.top - origin.y) / scale;
  return { x, y };
}

export function updateCanvasCursor(canvas, mode) {
  if (!canvas) return;

  switch (mode) {
    case "addNode":
      canvas.style.cursor = "crosshair";
      break;
    case "addText":
      canvas.style.cursor = "text";
      break;
    case "moveNode":
      canvas.style.cursor = "grab";
      break;

    case "directedLink":
      canvas.style.cursor = "pointer";
      break;

    case "delete":
      canvas.style.cursor = "not-allowed";
      break;

    default:
      canvas.style.cursor = "default";
  }
};
