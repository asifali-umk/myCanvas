import { createContext, useContext, useEffect, useState } from "react";
import { getTransformedCoords } from "../utils/CanvasEvent";

const GraphContext = createContext();
export const useGraph = () => useContext(GraphContext);

export function TreeProvider({ children }) {
  const [mode, setMode] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [counter, setCounter] = useState(0);
  const [jsonSidebar, setJsonSidebar] = useState(false);
  const [jsonData, setJsonData] = useState(null);
  const [edges, setEdges] = useState([]);
  const updateNodePosition = (id, x, y) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, x, y } : node))
    );
  };


    
  // Recursive function to create tree nodes from JSON
const addNodesFromJson = (obj, parentNode = null, level = 0, xOffset = 0) => {
  if (!obj) return;

  const nodeId = obj._id || `node-${counter}`;
  const yGap = 100; // vertical spacing
  const xGap = 120; // horizontal spacing

  // Compute x position based on parent
  const x = parentNode ? parentNode.x + xOffset : window.innerWidth / 2;
  const y = parentNode ? parentNode.y + yGap : 100;

  const newNode = { id: nodeId, x, y, r: 20, data: obj };
  setNodes(prev => [...prev, newNode]);
  setCounter(prev => prev + 1);

  // Create edge from parent
  if (parentNode) addEdge(parentNode.id, nodeId);

  // Recurse for children
  if (obj.assetsTreeObj) {
    const children = Object.values(obj.assetsTreeObj);
    const totalWidth = children.length * xGap;
    let childOffset = -totalWidth / 2 + xGap / 2;

    children.forEach(child => {
      addNodesFromJson(child, newNode, level + 1, childOffset);
      childOffset += xGap;
    });
  }
};


  useEffect(() => {
    if (mode === "reset") {
      setNodes([]);
      setCounter(0);
      setEdges([]);
      setMode(null); // Reset mode after clearing nodes
      setMode(null); // Reset mode after clearing nodes
    }
  }, [mode]);

  const addNode = (x, y) => {
    const newNode = { id: counter, x, y , r: 20, data: {},       // ← IMPORTANT: add empty object
    parent: null };
    setNodes((prev) => [...prev, newNode]);
    setCounter((prev) => prev + 1);
  };

  const addEdge = (fromId, toId) => {
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
        counter,
        setCounter,
        jsonSidebar,
        setJsonSidebar,
        updateNodePosition,
        jsonData,
        setJsonData,
        addNodesFromJson,
      }}
    >
      {children}
    </GraphContext.Provider>
  );
}
