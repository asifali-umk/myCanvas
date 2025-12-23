import { useEffect, useState } from "react";
import { useGraph } from "../context/TreeProvider.jsx";

export default function Properties({ onClose }) {
  const { selectedNodeId, nodes, updateNodeProperties } = useGraph();
  const selectedNode = nodes.find(n => n.id === selectedNodeId.current);

  const [rows, setRows] = useState([{ key: "", value: "" }]);

  // Pre-fill form when selectedNode changes
  useEffect(() => {
    if (selectedNode?.data?.properties) {
      const entries = Object.entries(selectedNode.data.properties);
      setRows(entries.length ? entries.map(([key, value]) => ({ key, value })) : [{ key: "", value: "" }]);
    }
  }, [selectedNode]);

  const handleChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { key: "", value: "" }]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const properties = {};
    rows.forEach(r => {
      if (r.key.trim()) properties[r.key] = r.value;
    });

    if (selectedNode) updateNodeProperties(selectedNode.id, properties);
  console.log("Properties: ", properties);
    onClose();

  };

  return (
    <div className="absolute h-80 w-auto bg-white/95 backdrop-blur-sm border border-gray-200 shadow-xl z-40 flex flex-col rounded-lg overflow-hidden">
      <button type="button" onClick={onClose} className="absolute top-1 right-2 text-gray-500 hover:text-gray-800 text-xl font-bold">&times;</button>
      <form onSubmit={handleSubmit} className="flex flex-col h-full py-3">
        <div className="flex-1 overflow-y-auto space-y-3 p-6">
          <h1 className="text-2xl font-bold text-center text-gray-600">Enter properties</h1>
          {rows.map((row, index) => (
            <div key={index} className="flex gap-3">
              <input
                type="text"
                placeholder="Key"
                value={row.key}
                onChange={e => handleChange(index, "key", e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Value"
                value={row.value}
                onChange={e => handleChange(index, "value", e.target.value)}
                className="flex-1 border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-between bg-gray-50">
          <button type="button" onClick={addRow} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">Add Row</button>
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">Submit</button>
        </div>
      </form>
    </div>
  );
}
