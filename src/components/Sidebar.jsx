import React from "react";
import {
  AddCircleOutline,
  OpenWith,
  CallMade,
  DeleteOutline,
  Save,
  RestartAlt,
  Menu,
  Cancel
} from "@mui/icons-material";
import { useGraph } from "../context/TreeProvider";

export default function Sidebar() {
  const {
    mode,
    setMode,
    sidebarOpen,
    setSidebarOpen,
    handleSaveCanvas
  } = useGraph();

  const isOpen = !!sidebarOpen;
  const toggleSidebar = () => setSidebarOpen(!isOpen);

  const baseBtn =
    "flex items-center gap-3 p-2 rounded-md transition-colors duration-200";
  const active = "bg-blue-500 text-white";
  const normal = "hover:bg-gray-100 text-gray-800";

  return (
    <div
      className={`relative z-20 bg-linear-to-r from-gray-200 to-gray-300 text-gray-800 border-r border-gray-200 h-screen p-3 flex flex-col transition-all duration-300 ${
        isOpen ? "w-52" : "w-16"
      }`}
    >
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-3 right-5 text-gray-900"
        data-intro="Open and close the sidebar"
        data-step="6"
      >
        {isOpen ? <Cancel /> : <Menu />}
      </button>

      {/* Buttons */}
      <div className="mt-12 flex flex-col gap-4">
        {/* Add Node */}
        <button
          onClick={() => setMode("addNode")}
          className={`${baseBtn} ${mode === "addNode" ? active : normal}`}
          data-intro="Add a new node"
          data-step="7"
        >
          <AddCircleOutline />
          {isOpen && <span>Add Node</span>}
        </button>

        {/* Move Node */}
        <button
          onClick={() => setMode("moveNode")}
          className={`${baseBtn} ${mode === "moveNode" ? active : normal}`}
          data-step="9"
        >
          <OpenWith />
          {isOpen && <span>Move Node</span>}
        </button>

        {/* Directed Link */}
        <button
          onClick={() => setMode("directedLink")}
          className={`${baseBtn} ${mode === "directedLink" ? active : normal}`}
          data-step="10"
        >
          <CallMade />
          {isOpen && <span>Directed Link</span>}
        </button>

        {/* Delete */}
        <button
          onClick={() => setMode("delete")}
          className={`${baseBtn} ${mode === "delete" ? active : normal}`}
          data-step="12"
        >
          <DeleteOutline />
          {isOpen && <span>Delete</span>}
        </button>

        {/* Save */}
        <button
          onClick={handleSaveCanvas}
          className={`${baseBtn} ${normal}`}
          data-step="13"
        >
          <Save />
          {isOpen && <span>Save</span>}
        </button>

        {/* Reset */}
        <button
          onClick={() => {
            const ok = window.confirm("Do you really want to reset?");
            if (ok) setMode("reset");
          }}
          className={`${baseBtn} ${normal}`}
          data-step="14"
        >
          <RestartAlt />
          {isOpen && <span>Reset</span>}
        </button>
      </div>
    </div>
  );
}
