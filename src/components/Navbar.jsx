import React from "react";
import introJs from "intro.js";
import "intro.js/introjs.css";
import { useGraph } from "../context/TreeProvider.jsx";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const { jsonSidebar, setJsonSidebar, showProperties, setShowProperties } =
    useGraph();

  const startTour = () => {
    setJsonSidebar(true);
  introJs.tour().setOptions({scrollToElement: false}).start();
  };


  return (
    <nav className="z-50 bg-linear-to-r from-indigo-500 to-purple-500 shadow-lg p-4 px-8 flex justify-between items-center">
      <h1
        className="text-2xl font-extrabold text-white cursor-pointer"
        data-intro="Welcome to the Canvas Editor"
        data-step="1"
         onClick={() => navigate("/")}

      >
        My Canvas
      </h1>

      <ul className="hidden md:flex space-x-8 text-white font-medium">
        <li
          className="hover:text-yellow-300 cursor-pointer transition-colors duration-200"
          data-intro="Know everything about the canvas: how to add, move, link, and view node properties."
          data-step="2"
          onClick={() => navigate("/about")}
        >
          About
        </li>

        <li
          className="cursor-pointer hover:text-yellow-300"
          onClick={startTour}
          data-intro="Click here to start the guided tour"
          data-step="3"
        >
          Tutorial
        </li>
      </ul>

      <div className="flex space-x-3">
        <button
          data-intro="Expand nodes to view full properties"
          data-step="3"
          onClick={() => setShowProperties((p) => !p)}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg"
        >
          Show Properties
        </button>

        <button
          data-intro="view and load JSON here, you can create a tree from JSON"
          data-step="4"
          onClick={() => setJsonSidebar(!jsonSidebar)}
          className="bg-white text-indigo-600 px-4 py-2 rounded-lg"
        >
          Load JSON
        </button>
      </div>
    </nav>
  );
}
