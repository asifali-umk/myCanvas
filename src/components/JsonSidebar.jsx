import React, { useEffect, useState } from "react";
import { useGraph } from "../context/TreeProvider.jsx";
import { Cancel } from "@mui/icons-material";

export default function JsonSidebar() {
  const {
    jsonSidebar,
    setJsonSidebar,
    generatedJson,     // tree → json
    setJsonData,
    setNodes,
    setEdges,
    counter, 
    setCounter,
    addNodesFromJson,
  } = useGraph();

  // ✅ Editable JSON input state
  const [jsonInput, setJsonInput] = useState("");

  // ✅ Keep textarea updated when tree changes
  useEffect(() => {
    if (generatedJson) {
      setJsonInput(generatedJson);
    }
  }, [generatedJson]);

  const handleLoad = () => {
    try {
      const parsed = JSON.parse(jsonInput);

      setJsonData(parsed);
      setNodes([]);
      setEdges([]);
      addNodesFromJson(parsed , null, 0, 0, 0);
    } catch (err) {
      alert("Invalid JSON");
    }
  };

  return (
    <div
      className={`fixed top-18 right-0 z-30 h-screen w-70 bg-linear-to-l from-gray-200 to-gray-300
      border-l border-gray-200 p-2 flex flex-col transition-transform duration-300
      ${jsonSidebar ? "translate-x-0" : "translate-x-full"}`}
    >
      <h2 className="text-xl font-extrabold text-indigo-500 mb-4 text-center">
        JSON Loader
      </h2>

      {/* Textarea */}
      <textarea
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        className="h-[70%] w-full resize-none rounded-md border border-gray-300 p-2
        font-mono text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
        data-intro="Paste your JSON data here and click 'Load' to load it into the canvas."
        data-step="16"
      />

      <div className="flex justify-between mt-4">
        <button
          onClick={handleLoad}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          data-intro="Click 'Load' to load the JSON data into the canvas."
          data-step="17"
        >
          Load
        </button>

        <button
          onClick={() => setJsonSidebar(false)}
          className="bg-gray-300 px-4 py-2 rounded"
          data-intro="Click 'Cancel' to close the JSON loader."
          data-step="18"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
