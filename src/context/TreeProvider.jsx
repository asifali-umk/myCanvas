// fixed code
import { createContext, useContext, useEffect, useState } from "react";
import { getTransformedCoords } from "../utils/CanvasEvent";
import { useRef } from "react";
import { convertTreeToJson } from "../utils/Treehelpers";
import { recalcPositionsSync } from "../utils/DrawUtils";

const GraphContext = createContext();
export const useGraph = () => useContext(GraphContext);

export function TreeProvider({ children }) {
  const [mode, setMode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [jsonSidebar, setJsonSidebar] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [edges, setEdges] = useState([]);
  const selectedNodeId = useRef(null);
  const [selectedNodeProperties, setSelectedNodeProperties] = useState(null);
  const [generatedJson, setGeneratedJson] = useState("");
  const [showProperties, setShowProperties] = useState(false);
  const counterRef = useRef(1);
  const [rootNodeId, setRootNodeId] = useState(null);

  const updateNodePosition = (id, x, y) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, x, y } : node))
    );
  };

  const toggleNodeExpand = (nodeId) => {
  setNodes(prev => {
    const toggled = prev.map(node =>
      node.id === nodeId ? { ...node, expanded: !node.expanded } : node
    );

    const rootId = rootNodeId || (toggled.length ? toggled[0].id : null);
    if (!rootId) return toggled;

    // Recalculate positions synchronously using current edges
    try {
      const recalced = recalcPositionsSync(toggled, edges, rootId, 120, 100);
      return recalced;
    } catch (err) {
      console.error("recalcPositionsSync failed", err);
      return toggled;
    }
  });
};


  const updateNodeProperties = (nodeId, properties) => {
    setNodes((prevNodes) => {
      const updatedNodes = prevNodes.map((n) =>
        n.id === nodeId
          ? {
              ...n,
              data: {
                ...n.data,
                properties,
                updatedAt: new Date().toISOString(),
              },
            }
          : n
      );

      return updatedNodes;
    });
  };

  // Recursive function to create tree nodes from JSON
  const addNodesFromJson = (obj, parentNode = null, level = 0, xOffset = 0) => {
    if (!obj) return;

    setShowProperties(false);

    const nodeId = obj._id;
    const yGap = 100;
    const xGap = 120;

    // Compute x position based on parent
    const x = parentNode ? parentNode.x + xOffset : window.innerWidth / 2;
    const y = parentNode ? parentNode.y + yGap : 100;

    const newNode = { id: nodeId, x, y, r: 20, data: obj, expanded: true };
    setNodes((prev) => [...prev, newNode]);

    // Create edge from parent
    if (parentNode) addEdge(parentNode.id, nodeId);

    // Recurse for children
    if (obj.assetsTreeObj) {
      const children = Object.values(obj.assetsTreeObj);
      const totalWidth = children.length * xGap;
      let childOffset = -totalWidth / 2 + xGap / 2;

      children.forEach((child) => {
        addNodesFromJson(child, newNode, level + 1, childOffset);
        childOffset += xGap;
      });
    }
  };

  useEffect(() => {
    const treeJson = convertTreeToJson(nodes, edges);
    if (treeJson) {
      setGeneratedJson(JSON.stringify(treeJson, null, 2));
    }
  }, [nodes, edges]);

  useEffect(() => {
    if (mode === "reset") {
      setNodes([]);
      counterRef.current = 1;
      setEdges([]);
      setMode(null); // Reset mode after clearing nodes
      setMode(null); // Reset mode after clearing nodes
    }
  }, [mode]);

  const addNode = (x, y) => {
    const newNode = {
      id: counterRef.current, // generate a new unique ID
      x,
      y,
      r: 20,
      data: {},
      parent: null,
      expanded: true,
    };
    setNodes((prev) => [...prev, newNode]);
    counterRef.current += 1;
  };

  useEffect(() => {
    if (nodes.length > 0) {
      setRootNodeId(nodes[0].id);
    }
  });

  const deleteNode = (nodeId) => {
    // If deleting the root, clear entire tree
    const rootIdLocal = rootNodeId || (nodes[0] && nodes[0].id);
    if (nodeId === rootIdLocal) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Build children map from edges for traversal
    const childrenMap = {};
    edges.forEach((e) => {
      if (!childrenMap[e.from]) childrenMap[e.from] = [];
      childrenMap[e.from].push(e.to);
    });

    // Collect node and all descendants to delete
    const toDelete = new Set();
    const stack = [nodeId];
    while (stack.length) {
      const cur = stack.pop();
      if (toDelete.has(cur)) continue;
      toDelete.add(cur);
      const kids = childrenMap[cur] || [];
      kids.forEach((k) => stack.push(k));
    }

    // Remove nodes and any edges touching deleted nodes
    setNodes((prev) => prev.filter((n) => !toDelete.has(n.id)));
    setEdges((prev) => prev.filter((e) => !toDelete.has(e.from) && !toDelete.has(e.to)));
  };

  const addEdge = (fromId, toId) => {
    const toNode = nodes.find((n) => n.id === toId);

    // 🚫 Root cannot have parent
    if (toNode?.id === rootNodeId) {
      // replace rootNodeId with your actual root node ID
      alert("Cannot make root node a child");
      return;
    }

    // one parent only
    if (edges.some((e) => e.to === toId)) {
      alert("Node already has a parent");
      return;
    }

    // // no cycles
    // if (createsCycle(fromId, toId)) {
    //   alert("Cycle not allowed");
    //   return;
    // }

    setEdges((prev) => [...prev, { from: fromId, to: toId }]);
  };

  return (
    <GraphContext.Provider
      value={{
        edges,
        addEdge,
        setEdges,
        nodes,
        setNodes,
        addNode,
        mode,
        setMode,
        jsonSidebar,
        setJsonSidebar,
        updateNodePosition,
        jsonData,
        setJsonData,
        addNodesFromJson,
        deleteNode,
        selectedNodeId,
        selectedNodeProperties,
        setSelectedNodeProperties,
        updateNodeProperties,
        generatedJson,
        setShowProperties,
        showProperties,
        toggleNodeExpand
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}
