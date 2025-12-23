import { getTransformedCoords } from "./CanvasEvent";

export function drawNodes(ctx, nodes, selectedNodeId, showProperties) {
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  const isVisible = (node) => {
    if (!node.parent) return true; // root is always visible
    const parent = nodeMap[node.parent];
    if (!parent) return true;
    if (parent.expanded === false) return false;
    return isVisible(parent); // recursively check ancestors
  };

  nodes.forEach(node => {
    if (!isVisible(node)) return; // skip collapsed nodes

    const isSelected = node.id === selectedNodeId;
// simple node
    if (!showProperties) {
      const width = 90;
      const height = 40;
      const radius = 8;

      ctx.beginPath();
      ctx.roundRect(
        node.x - width / 2,
        node.y - height / 2,
        width,
        height,
        radius
      );
      ctx.fillStyle = "skyblue";
      ctx.fill();
      ctx.strokeStyle = isSelected ? "red" : "black";
      ctx.lineWidth = isSelected ? 2 : 1;
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.font = "13px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.data?.properties?.unitId || node.id, node.x, node.y);
//expand and collapse circle
      const hasChildren = nodes.some(n => n.parent === node.id);
      if (hasChildren) {
        const circleX = node.x; // horizontal center
        const circleY = node.y + height / 2 + 9; // just below the node
        const RADIUS = 8;

        ctx.beginPath();
        ctx.arc(circleX, circleY, RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 1.5;
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = "black";
        ctx.font = "bold 14px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.expanded ? "-" : "+", circleX, circleY);
      }

      return;
    }
    
  // detailed node
    const HEADER_HEIGHT = 26;
    const PADDING = 6;
    const LINE_HEIGHT = 14;
    const MAX_BODY_HEIGHT = 120; // prevents infinite growth
    const radius = 10;
    const width = 260;

    const props = node.data?.properties || {};
    const entries = Object.entries(props).filter(([k]) => k !== "unitId");

    /* ---- calculate key column width ---- */
    ctx.font = "bold 12px Arial";
    let maxKeyWidth = 0;
    entries.forEach(([key]) => {
      maxKeyWidth = Math.max(maxKeyWidth, ctx.measureText(key + ":").width);
    });

    const VALUE_OFFSET = maxKeyWidth + 12;
    const height = 160;
    const x = node.x - width / 2;
    const y = node.y - height / 2;

    /* ---- container ---- */
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, radius);
    ctx.fillStyle = "skyblue";
    ctx.fill();
    ctx.strokeStyle = isSelected ? "red" : "black";
    ctx.lineWidth = isSelected ? 2 : 1;
    ctx.stroke();

    /* ---- header ---- */
    ctx.beginPath();
    ctx.roundRect(x, y, width, HEADER_HEIGHT, [radius, radius, 0, 0]);
    ctx.fillStyle = "#4a90e2";
    ctx.fill();

    ctx.fillStyle = "white";
    ctx.font = "bold 14px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(node.data?.properties?.unitId || node.id, node.x, y + HEADER_HEIGHT / 2);

    let currentY = y + HEADER_HEIGHT + PADDING;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";

    const maxVisibleLines = Math.floor(MAX_BODY_HEIGHT / LINE_HEIGHT);

    entries.slice(0, maxVisibleLines).forEach(([key, value]) => {
      // key
      ctx.font = "bold 12px Arial";
      ctx.fillStyle = "black";
      ctx.fillText(key + ":", x + PADDING, currentY);

      // value
      ctx.font = "12px Arial";
      ctx.fillText(String(value), x + PADDING + VALUE_OFFSET, currentY);

      currentY += LINE_HEIGHT;
    });

    /* ---- overflow indicator ---- */
    if (entries.length > maxVisibleLines) {
      ctx.font = "italic 12px Arial";
      ctx.fillText("… dbl click to view more", x + PADDING, currentY);
    }

    // --- draw expand/collapse circle for outgoing edges ---
    const hasChildren = nodes.some(n => n.parent === node.id);
    if (hasChildren) {
      const circleX = node.x; // horizontal center
      const circleY = y + height + 10; // just below the node rectangle
      const RADIUS = 10 ;

      ctx.beginPath();
      ctx.arc(circleX, circleY, RADIUS, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = "black";
      ctx.font = "bold 16px Arial";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(node.expanded ? "-" : "+", circleX, circleY);
    }
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
        // canvas.style.cursor = "grabbing";
      }
    };

    const handleMouseMove = (e) => {
      if (!selectedNode.current) return;
      const { x, y } = getTransformedCoords(e, canvas, scaleRef.current, originRef.current);
      updateNodePosition(selectedNode.current.id, x - offset.current.x, y - offset.current.y);
    };

    const handleMouseUp = () => {
      selectedNode.current = null;
      // canvas.style.cursor = "default";
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



export function drawEdges(ctx, nodes, edges, showProperties) {
  const NODE_HEIGHT = showProperties ? 160 : 40;

  // build a quick lookup map
  const nodeMap = Object.fromEntries(nodes.map(n => [n.id, n]));

  // recursive visibility check
  const isVisible = (node) => {
    if (!node.parent) return true; // root is always visible
    const parent = nodeMap[node.parent];
    if (!parent) return true; 
    if (parent.expanded === false) return false;
    return isVisible(parent); // check ancestors
  };

  ctx.strokeStyle = "black";
  ctx.lineWidth = 0.8;

  edges.forEach(edge => {
    const from = nodeMap[edge.from];
    const to = nodeMap[edge.to];
    if (!from || !to) return;

    // skip edge if either end is not visible
    if (!isVisible(from) || !isVisible(to)) return;

    const startY = from.y + NODE_HEIGHT / 2;
    const endY   = to.y   - NODE_HEIGHT / 2;

    const dx = to.x - from.x;

    // straight line (vertical)
    if (dx === 0) {
      ctx.beginPath();
      ctx.moveTo(from.x, startY);
      ctx.lineTo(to.x, endY);
      ctx.stroke();

      drawArrowhead(ctx, to.x, endY, Math.PI / 2, 10);
    } 
    // curved line
    else {
      const r = 12;
      const midY = startY + (endY - startY) / 2;

      ctx.beginPath();
      ctx.moveTo(from.x, startY);
      ctx.lineTo(from.x, midY - r);

      ctx.quadraticCurveTo(
        from.x,
        midY,
        from.x + (dx > 0 ? r : -r),
        midY
      );
      ctx.lineTo(to.x - (dx > 0 ? r : -r), midY);

      ctx.quadraticCurveTo(
        to.x,
        midY,
        to.x,
        midY + r
      );
      ctx.lineTo(to.x, endY);
      ctx.stroke();

      drawArrowhead(ctx, to.x, endY , Math.PI / 2, 10);
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

export function enableNodeLinking(canvas, nodes, addEdge, mode, scaleRef, originRef , selectedNodeId) {
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
        selectedNodeId.current = null;
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
export function positionSubtree(obj, parentNode, setNodes, setEdges, nodesMap, horizontalGap , verticalGap) {
  const childKeys = Object.keys(obj).filter(k => k !== "properties");
  if (childKeys.length === 0) return;
  if (parentNode.expanded === false) {
    console.log("positionSubtree: parentNode is collapsed, skipping children");
  return; // do NOT layout children
}

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
      parent: parentNode.id,
      expanded: true,
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
