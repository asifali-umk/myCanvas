import React, { useState } from "react";
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
  const { mode, setMode, sidebarOpen, setSidebarOpen } = useGraph(); // get mode + sidebar control from context
  const isOpen = !!sidebarOpen;
  const toggleSidebar = () => setSidebarOpen(!isOpen);


const menuItems = [
  { 
    icon: <AddCircleOutline />, 
    label: "Add Node", 
    value: "addNode",
    "data-intro": "Add a new node to the canvas",
    "data-step": "7"
  },
 
  { 
    icon: <OpenWith />, 
    label: "Move Node", 
    value: "moveNode",
    "data-intro": "Move a node anywhere on the canvas",
    "data-step": "9"
  },
  { 
    icon: <CallMade />, 
    label: "Directed Link", 
    value: "directedLink",
    "data-intro": "Create a directed link (arrow) between two nodes",
    "data-step": "10"
  },
  { 
    icon: <DeleteOutline />, 
    label: "Delete", 
    value: "delete",
    "data-intro": "Delete a node or an edge from the canvas",
    "data-step": "12"
  },
  { 
    icon: <Save />, 
    label: "Save", 
    value: "save",
    "data-intro": "Save the current state of the canvas",
    "data-step": "13"
  },
  { 
    icon: <RestartAlt />, 
    label: "Reset", 
    value: "reset",
    "data-intro": "Reset the canvas ",
    "data-step": "14"
  },
];

  

  return (
    <div className={`relative scroll-auto z-20 bg-linear-to-r from-gray-200 to-gray-300 text-gray-800 border-r border-gray-200 h-screen p-3 flex flex-col transition-all duration-300 ${isOpen ? "w-52" : "w-16"}`}>
      <button onClick={toggleSidebar} className="absolute top-3 right-5 text-gray-900 focus:outline-none" data-intro="Open and close the sidebar to view full list of Tools with names" data-step="6">
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
                ${isActive ? "bg-blue-500 text-white" : "hover:bg-gray-100 text-gray-800"}`
              }
                data-intro={item["data-intro"]}
      data-step={item["data-step"]}
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
