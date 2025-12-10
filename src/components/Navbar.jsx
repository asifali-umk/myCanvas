import React from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import { useGraph } from '../context/TreeProvider.jsx';
export default function Navbar() {
  const { jsonSidebar, setJsonSidebar  } = useGraph();

  return (
    <nav className="z-50 bg-linear-to-r from-indigo-500 to-purple-500 shadow-lg p-4 px-8 flex justify-between items-center">
      
      {/* Left: Logo + Menu */}
      <div >
        <h1 className="text-2xl font-extrabold text-white tracking-wide">My Canvas</h1>
      </div>
      <ul className="hidden md:flex space-x-8 text-white font-medium">
        <li className="hover:text-yellow-300 cursor-pointer transition-colors duration-200">Home</li>
        <li className="hover:text-yellow-300 cursor-pointer transition-colors duration-200">About</li>
        <li className="hover:text-yellow-300 cursor-pointer transition-colors duration-200">Tutorial</li>
      </ul>
      
      {/* Right: Buttons */}
      <div className="flex space-x-3">
        <button className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-yellow-300 hover:text-white transition-colors duration-200">
          Show Properties
        </button>
        <button onClick={()=>{setJsonSidebar(!jsonSidebar); console.log(jsonSidebar);
        }} className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg shadow-md hover:bg-yellow-300 hover:text-white transition-colors duration-200">
          Load JSON
        </button>
      </div>
    </nav>
  );
}
