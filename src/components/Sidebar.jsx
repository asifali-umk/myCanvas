import React, { useState } from "react";
import {
  AddCircleOutline,
  TextFields,
  OpenWith,
  CallMade,
  Functions,
  DeleteOutline,
  Save,
  RestartAlt,
  Menu,
  Cancel
} from "@mui/icons-material";
import { useGraph } from "../context/TreeProvider";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { mode, setMode } = useGraph(); // get mode from context
  const toggleSidebar = () => setIsOpen(!isOpen);

  const menuItems = [
    { icon: <AddCircleOutline />, label: "Add Node", value: "addNode" },
    { icon: <TextFields />, label: "Add Text", value: "addText" },
    { icon: <OpenWith />, label: "Move Node", value: "moveNode" },
    { icon: <CallMade />, label: "Directed Link", value: "directedLink" },
    { icon: <Functions />, label: "Weighted", value: "weighted" },
    { icon: <DeleteOutline />, label: "Delete", value: "delete" },
    { icon: <Save />, label: "Save", value: "save" },
    { icon: <RestartAlt />, label: "Reset", value: "reset" },
  ];

  

  return (
    <div className={`relative z-20 bg-linear-to-r from-gray-200 to-gray-300 text-gray-800 border-r border-gray-200 h-screen p-3 flex flex-col transition-all duration-300 ${isOpen ? "w-52" : "w-16"}`}>
      <button onClick={toggleSidebar} className="absolute top-3 right-5 text-gray-900 focus:outline-none">
        {isOpen ? <Cancel /> : <Menu />}
      </button>
      <div className="mt-12 flex flex-col gap-4">
        {menuItems.map((item, index) => {
          const isActive = mode === item.value; // check if current mode
          return (
            <button
              key={index}
              onClick={() => setMode(item.value)}
              className={`flex items-center gap-3 p-2 rounded-md transition-colors duration-200
                ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-800"}`}
            >
              {item.icon}
              {isOpen && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>      
  );
}
