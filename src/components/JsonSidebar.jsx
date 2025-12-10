import React from 'react'
import { useGraph } from '../context/TreeProvider.jsx';
import {Cancel} from '@mui/icons-material';

export default function JsonSidebar() {
    const { jsonSidebar, setJsonSidebar , setJsonData, setNodes, setEdges, addEdge, setCounter , addNodesFromJson} = useGraph();
  return (
    <div
     className={`fixed top-18 right-0 z-30 h-screen bg-linear-to-l w-70 from-gray-200 to-gray-300 text-gray-800 border-l border-gray-200 p-2 flex flex-col transition-transform duration-300
    ${jsonSidebar ? "translate-x-0" : "translate-x-full"}`}
    >
       <h2 className="text-xl font-extrabold text-indigo-500 tracking-wide mb-4 text-center">JSON Loader</h2>

      {/* Textarea */}
     
        <textarea
          name="jsonInput"
          id="jsonInput"
          className="h-[70%] w-full resize-none rounded-md border border-gray-300 p-1 font-mono text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white/80"
        ></textarea>
      

      <div className="flex justify-between mt-4">
       <button
  onClick={() => {
    const input = document.getElementById("jsonInput").value;
    const json = JSON.parse(input);
    setJsonData(json);

    setNodes([]);
    setEdges([]);
    setCounter(0);
    addNodesFromJson(json); // call recursive function
  }}
>
  Load
</button>

        <button
          onClick={() => setJsonSidebar(false)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-400 transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
