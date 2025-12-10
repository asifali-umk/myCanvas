import { getTransformedCoords } from "./CanvasEvent";

// Setup double-click node creation
export function enableAddNode(canvas, addNode, scaleRef, originRef) {
  const handleDblClick = (e) => {
    const { x, y } = getTransformedCoords(e, canvas, scaleRef.current, originRef.current);
    addNode(x, y);
  };

  canvas.addEventListener("dblclick", handleDblClick);
  return () => canvas.removeEventListener("dblclick", handleDblClick);
}



// Draw all nodes
export function drawNodes(ctx, nodes) {
  nodes.forEach((node) => {
    const width = 80;
    const height = 40;
    const radius = 8;

    // Draw rounded rectangle
    ctx.beginPath();
    ctx.roundRect(node.x - width / 2, node.y - height / 2, width, height, radius);
    ctx.fillStyle = "skyblue";
    ctx.fill();
    ctx.strokeStyle = "black";
    ctx.stroke();

    // Draw text (ID)
    ctx.fillStyle = "black";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.data.properties ? node.data.properties.unitId : node.id, node.x, node.y);
  });
}

export function getNodeAtPosition(nodes, x, y) {
  return nodes.find(
    (node) =>
      x >= node.x - 40 && x <= node.x + 40 && 
      y >= node.y - 20 && y <= node.y + 20    
  );
}

  export function enableNodeDragging(canvas, nodesRef, updateNodePosition, mode, selectedNode, offset, scaleRef, originRef) {
    if (mode !== "moveNode") return;

    const handleMouseDown = (e) => {
      const { x, y } = getTransformedCoords(e, canvas, scaleRef.current, originRef.current);

      const node = nodesRef.current.find(
        n => x >= n.x - 40 && x <= n.x + 40 &&
            y >= n.y - 20 && y <= n.y + 20
      );

      if (node) {
        selectedNode.current = node;
        offset.current.x = x - node.x;
        offset.current.y = y - node.y;
        canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e) => {
      if (!selectedNode.current) return;
      const { x, y } = getTransformedCoords(e, canvas, scaleRef.current, originRef.current);
      updateNodePosition(selectedNode.current.id, x - offset.current.x, y - offset.current.y);
    };

    const handleMouseUp = () => {
      selectedNode.current = null;
      canvas.style.cursor = "default";
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
    };
  }



export function drawEdges(ctx, nodes, edges) {
  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;

  edges.forEach(edge => {
    const from = nodes.find(n => n.id === edge.from);
    const to = nodes.find(n => n.id === edge.to);
    if (!from || !to) return;

    const startY = from.y + 20; // Assuming node height is 40
    const endY = to.y - 20;
    
   // Calculate horizontal difference
const dx = to.x - from.x;
const dy = to.y - from.y;

// Only draw straight line if nodes are exactly aligned vertically
if (dx === 0) {
  // Nodes fully vertically aligned - straight line
  ctx.beginPath();
  ctx.moveTo(from.x, startY);
  ctx.lineTo(to.x, endY);
  ctx.stroke();
  drawArrowhead(ctx, to.x, endY, Math.PI / 2, 10);
} else {
  // Always draw curved line if not perfectly vertical
  const r = 12;
  const midY = startY + (endY - startY) / 2;

  ctx.beginPath();
  ctx.moveTo(from.x, startY);

  if (dx > 0) {
    ctx.lineTo(from.x, midY - r);
    ctx.quadraticCurveTo(from.x, midY, from.x + r, midY);
    ctx.lineTo(to.x - r, midY);
    ctx.quadraticCurveTo(to.x, midY, to.x, midY + r);
  } else {
    ctx.lineTo(from.x, midY - r);
    ctx.quadraticCurveTo(from.x, midY, from.x - r, midY);
    ctx.lineTo(to.x + r, midY);
    ctx.quadraticCurveTo(to.x, midY, to.x, midY + r);
  }

  ctx.lineTo(to.x, endY);
  ctx.stroke();
  drawArrowhead(ctx, to.x, endY, Math.PI / 2, 10);
}

  });
}

function drawArrowhead(ctx, x, y, angle, length) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(-length, -length / 2);
  ctx.lineTo(-length, length / 2);
  ctx.closePath();
  ctx.fill();
  
  ctx.restore();
}

export function enableNodeLinking(canvas, nodes, addEdge, mode, scaleRef, originRef) {
  if (mode !== "directedLink") return;

  let linkStart = null;

  const handleClick = (e) => {
    const { x, y } = getTransformedCoords(e, canvas, scaleRef.current, originRef.current);

    const node = nodes.find(
      n => x >= n.x - 40 && x <= n.x + 40 &&
           y >= n.y - 20 && y <= n.y + 20
    );
    if (!node) return;

    if (linkStart === null) {
      linkStart = node.id;
    } else {
      if (linkStart !== node.id) {
        addEdge(linkStart, node.id);
      }
      linkStart = null;
    }
  };

  canvas.addEventListener("click", handleClick);
  return () => canvas.removeEventListener("click", handleClick);
}


// 1. Calculate total width of subtree
export function calculateSubtreeWidth(obj, horizontalGap = 150) {
  const childKeys = Object.keys(obj).filter(k => k !== "properties");
  if (childKeys.length === 0) return horizontalGap;

  let totalWidth = 0;
  childKeys.forEach(key => {
    totalWidth += calculateSubtreeWidth(obj[key], horizontalGap);
  });

  // Add spacing between children
  totalWidth += (childKeys.length - 1) * 20;

  return totalWidth;
}

// 2. Position children recursively
export function positionSubtree(obj, parentNode, setNodes, setEdges, nodesMap, horizontalGap = 100, verticalGap = 100) {
  const childKeys = Object.keys(obj).filter(k => k !== "properties");
  if (childKeys.length === 0) return;

  const subtreeWidths = childKeys.map(key => calculateSubtreeWidth(obj[key], horizontalGap));
  const totalWidth = subtreeWidths.reduce((sum, w) => sum + w, 0) + (childKeys.length - 1) * 20;

  let currentX = parentNode.x - totalWidth / 2;

  childKeys.forEach((key, i) => {
    const childObj = obj[key];

    const childNode = {
      id: key,
      x: currentX + subtreeWidths[i] / 2,
      y: parentNode.y + verticalGap,
      r: 20,
      data: childObj,
      parent: parentNode.id
    };

    setNodes(prev => [...prev, childNode]);
    setEdges(prev => [...prev, { from: parentNode.id, to: childNode.id }]);
    nodesMap[key] = childNode;

    positionSubtree(childObj, childNode, setNodes, setEdges, nodesMap, horizontalGap, verticalGap);

    currentX += subtreeWidths[i] + 15; // move to next child
  });

  // Center parent above children
  const visibleChildren = childKeys.map(k => nodesMap[k]);
  if (visibleChildren.length > 0) {
    parentNode.x = (visibleChildren[0].x + visibleChildren[visibleChildren.length - 1].x) / 2;
  }
}
