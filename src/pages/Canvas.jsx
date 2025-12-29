import React, { useEffect, useRef, useCallback, useState } from "react";
import { useGraph } from "../context/TreeProvider.jsx";
import Sidebar from "../components/Sidebar.jsx";
import JsonSidebar from "../components/JsonSidebar.jsx";
import { getTransformedCoords } from "../utils/CanvasEvent.js";
import PropertiesForm from "../components/Properties.jsx";
// Import all necessary utilities
import {
  // enableAddNode,
  drawNodes,
  enableNodeDragging,
  enableNodeLinking,
  drawEdges,
  positionSubtree,
  getEdgeAtPosition,
} from "../utils/DrawUtils.js";
import { updateCanvasCursor } from "../utils/CanvasEvent.js";

const screenToCanvas = (clientX, clientY, scale, originX, originY) => {
  const canvasX = (clientX - originX) / scale;
  const canvasY = (clientY - originY) / scale;
  return { x: canvasX, y: canvasY };
};
// ----------------------------------------------------

export default function Canvas() {
  const {
    nodes,
    addNode,
    mode,
    setMode,
    updateNodePosition,
    edges,
    addEdge,
    jsonData,
    setNodes,
    setEdges,
    deleteNode,
    selectedNodeId,
    setSelectedNodeProperties,
    toggleNodeExpand,
    showProperties,
    setJsonSidebar,
    setSidebarOpen,
    sidebarOpen,
    setShowProperties,
    clickedEdge,
    setClickedEdge,
  } = useGraph();
  const [showForm, setShowForm] = useState(false);

  const canvasRef = useRef(null);

  // Transformation Refs
  const scaleRef = useRef(1);
  const originRef = useRef({ x: 0, y: 0 }); // Pan offset

  // Interaction Refs
  const selectedNode = useRef(null);
  const offset = useRef({ x: 0, y: 0 }); // Offset for node dragging

  // Ref to always hold latest nodes for use in event listeners
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  // --- Drawing Function (Memoized) ---
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    ctx.save();

    // 1. Reset transform and clear the full canvas area
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 2. Apply current pan and zoom transformations
    ctx.setTransform(
      scaleRef.current,
      0,
      0,
      scaleRef.current,
      originRef.current.x,
      originRef.current.y
    );

    // 3. Draw content using the transformed context
    drawEdges(ctx, nodesRef.current, edges, showProperties, clickedEdge);
    drawNodes(ctx, nodesRef.current, selectedNodeId.current, showProperties);

    ctx.restore();
  }, [edges, showProperties, clickedEdge]);

  // --- Initial Graph Layout Logic ---

  const addChildNodes = useCallback(
    (obj, parentNode, level = 1, horizontalGap = 150, verticalGap = 100) => {
      const childKeys = Object.keys(obj).filter((k) => k !== "properties");
      const totalWidth = childKeys.length * horizontalGap;
      let currentX = parentNode.x - totalWidth / 2 + horizontalGap / 2;

      childKeys.forEach((key) => {
        const childObj = obj[key];
        const childNode = {
          id: key,
          x: currentX,
          y: parentNode.y + verticalGap,
          r: 20,
          data: childObj,
          parent: parentNode.id,
          expanded: true,
        };

        setNodes((prev) => [...prev, childNode]);
        setEdges((prev) => [
          ...prev,
          { from: parentNode.id, to: childNode.id },
        ]);

        addChildNodes(
          childObj,
          childNode,
          level + 1,
          horizontalGap / 1.5,
          verticalGap
        );
        currentX += horizontalGap;
      });
    },
    [setNodes, setEdges]
  ); // Dependencies ensure state setters are current

  useEffect(() => {
    const canvas = canvasRef.current;
    updateCanvasCursor(canvas, mode);
  }, [mode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !jsonData) return;

    setNodes([]);
    setEdges([]);

    const rootNode = {
      id: jsonData._id || "root",
      x: canvas.width / 2,
      y: 100,
      r: 20,
      data: jsonData,
      parent: null,
      expanded: true,
    };

    const nodesMap = { [rootNode.id]: rootNode };
    setNodes([rootNode]);

    if (jsonData.assetsTreeObj) {
      positionSubtree(
        jsonData.assetsTreeObj,
        rootNode,
        setNodes,
        setEdges,
        nodesMap,
        showProperties ? 270 : 90,
        showProperties ? 300 : 100
      );
    }
  }, [jsonData, showProperties]);

  // Rerender when nodes or edges change
  useEffect(() => {
    draw(); 
  }, [nodes, edges, draw , clickedEdge]);

  // Enable Node Linking - FIX: Use transformed coordinates for hit testing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || mode !== "directedLink") return;

    const cleanup = enableNodeLinking(
      canvas,
      nodes,
      addEdge,
      mode,
      scaleRef,
      originRef,
      selectedNodeId
    );
    return cleanup;
  }, [mode, nodes, addEdge]);

  // Enable Node Dragging - FIX: Utility must handle scale/origin and call draw
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const transformRefs = { scaleRef, originRef };

    const cleanup = enableNodeDragging(
      canvas,
      nodesRef,
      updateNodePosition,
      mode,
      selectedNode,
      offset,
      scaleRef,
      originRef
    );
    return cleanup;
  }, [mode, updateNodePosition, draw]);

  // --- Zooming (Wheel) Effect ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleWheel = (e) => {
      e.preventDefault();

      const scaleAmount = -e.deltaY * 0.001;
      let newScale = scaleRef.current + scaleAmount;
      newScale = Math.min(Math.max(0.1, newScale), 2);

      // Zoom around the mouse cursor (Zoom towards mouse)
      const mouseBefore = screenToCanvas(
        e.clientX,
        e.clientY,
        scaleRef.current,
        originRef.current.x,
        originRef.current.y
      );

      scaleRef.current = newScale;

      // Adjust origin to keep the mouse point stable
      originRef.current.x = e.clientX - mouseBefore.x * newScale;
      originRef.current.y = e.clientY - mouseBefore.y * newScale;

      draw();
    };

    canvas.addEventListener("wheel", handleWheel);
    return () => canvas.removeEventListener("wheel", handleWheel);
  }, [draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isDraggingNode = false;
    let isPanning = false;
    let lastPos = { x: 0, y: 0 };

    const handleMouseDown = (e) => {
      const { x, y } = getTransformedCoords(
        e,
        canvas,
        scaleRef.current,
        originRef.current
      );

      const node = nodesRef.current.find(
        (n) => x >= n.x - 40 && x <= n.x + 40 && y >= n.y - 20 && y <= n.y + 20
      );

      if (node) {
        isDraggingNode = true;
        selectedNode.current = node;
        offset.current = { x: x - node.x, y: y - node.y };
      } else {
        isPanning = true;
        lastPos = { x: e.clientX, y: e.clientY };
      }
    };

    const handleKeyDown = (ev) => {
      if (ev.repeat) return;
      const key = ev.key.toLowerCase();
      // L → Linking
      if (key === "l") {
        setMode("directedLink");
        return;
      }

      if(key === "escape"){
        setMode(null);
        setClickedEdge(null);
        return;
      }

      // N → Add Node mode
      if (key === "n") {
        setMode("addNode");
        return;
      }
      // Delete key → Delete mode
      if (ev.key === "Delete") {
        setMode("delete");
        return;
      }
      // E → open left sidebar
      if (key === "e") {
        setSidebarOpen((prev) => !prev);
        return;
      }
      // P → Show Properties
      if (key === "p") {
        console.log("toggled properties");
        setShowProperties((prev) => !prev);
        return;
      }
      // M → Move Node
      if (key === "m") {
        setMode("moveNode");
        return;
      }
      // S → Save (open JSON sidebar to copy)
      if (key === "j") {
        setJsonSidebar((prev) => !prev); // toggle JSON sidebar
        console.log("toggled json sidebar");
        return;
      }

      // R → Reset (confirm)
      if (key === "r") {
        const ok = window.confirm("Do you really want to reset?");
        if (ok) setMode("reset");
        return;
      }
    };

    const handleMouseMove = (e) => {
      if (!isDraggingNode && !isPanning) return;

      const { x, y } = getTransformedCoords(
        e,
        canvas,
        scaleRef.current,
        originRef.current
      );

      if (isDraggingNode && selectedNode.current) {
        updateNodePosition(
          selectedNode.current.id,
          x - offset.current.x,
          y - offset.current.y
        );
      } else if (isPanning) {
        const dx = e.clientX - lastPos.x;
        const dy = e.clientY - lastPos.y;
        originRef.current.x += dx;
        originRef.current.y += dy;
        lastPos = { x: e.clientX, y: e.clientY };
        draw();
      }
    };

    const handleMouseUp = (e) => {
      if (isDraggingNode && isPanning) {
        isDraggingNode = false;
      }

      isPanning = false;
      selectedNode.current = null;
    };

    const handleDoubleClick = (e) => {
      const { x, y } = getTransformedCoords(
        e,
        canvas,
        scaleRef.current,
        originRef.current
      );
      const node = nodesRef.current.find(
        (n) => x >= n.x - 40 && x <= n.x + 40 && y >= n.y - 20 && y <= n.y + 20
      );
      if (node) {
        console.log("node: ", node);
        setSelectedNodeProperties(node.data?.properties || {});
        setShowForm(true);
      } else {
        addNode(x, y);
      }
    };

    const handleSingleClick = (e) => {
      const { x, y } = getTransformedCoords(
        e,
        canvas,
        scaleRef.current,
        originRef.current
      );

      const node = nodesRef.current.find(
        (n) => x >= n.x - 40 && x <= n.x + 40 && y >= n.y - 20 && y <= n.y + 20
      );

      const expandNode = nodesRef.current.find((n) => {
        const NODE_HEIGHT = showProperties ? 160 : 40;

        const circleX = n.x;
        const circleY = n.y + NODE_HEIGHT / 2 + 10;
        const r = 8;

        return (
          x >= circleX - r &&
          x <= circleX + r &&
          y >= circleY - r &&
          y <= circleY + r
        );
      });

      if (expandNode) {
        toggleNodeExpand(expandNode.id);
        return; // 🔥 stop everything else
      }

      const clickedEdge = getEdgeAtPosition(
        nodesRef.current,
        edges,
        x,
        y,
        showProperties
      );

      if (mode === "delete") {
        if (clickedEdge) {
          // Delete the clicked edge
          setEdges((prev) =>
            prev.filter(
              (e) => !(e.from === clickedEdge.from && e.to === clickedEdge.to)
            )
          );
          setClickedEdge(null); // clear selection
          return;
        }

        if (node) deleteNode(node.id);
        return;
      } else {
        if (clickedEdge) {
          console.log("Clicked edge: ", clickedEdge);
          // Highlight the clicked edge
         setClickedEdge({ from: clickedEdge.from, to: clickedEdge.to });
          draw(); // redraw to show highlighting
          return;
        }
      }

      // Add node mode: click on empty canvas to add a node
      if (mode === "addNode") {
        if (!node) addNode(x, y);
        return;
      }

      selectedNodeId.current = node ? node.id : null;
      draw(); // immediately request a redraw
    };

    canvas.addEventListener("mousedown", handleMouseDown);
    canvas.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    canvas.addEventListener("mouseleave", handleMouseUp);
    canvas.addEventListener("dblclick", handleDoubleClick); // Prevent default dblclick zoom
    canvas.addEventListener("click", handleSingleClick);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      canvas.removeEventListener("mousedown", handleMouseDown);
      canvas.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      canvas.removeEventListener("mouseleave", handleMouseUp);
      canvas.removeEventListener("dblclick", handleDoubleClick);
      canvas.removeEventListener("click", handleSingleClick);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [updateNodePosition, addNode, draw]);

  // Disable body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <div className="relative h-screen w-screen bg-linear-to-br from-slate-100 via-gray-200 to-slate-300">
      <Sidebar />

      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="absolute top-0 left-0 border border-gray-400 bg-white z-0"
        data-intro="Here you can create your tree, double click on canvas to create node, double click on node to see and view its properties, click and drage to drage node, click and drage on canvas to move canvas"
        data-step="19"
      />

      <JsonSidebar />

      {/* 🔥 CENTERED PROPERTIES FORM */}
      {showForm && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/30">
          <PropertiesForm onClose={() => setShowForm(false)} />
        </div>
      )}
    </div>
  );
}
