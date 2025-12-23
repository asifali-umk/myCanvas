import React from 'react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Canvas.jsx';
import About from './pages/About.jsx'; // ✅ Make sure you have this file
import { TreeProvider } from './context/TreeProvider.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <TreeProvider>
      <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </BrowserRouter>
    </TreeProvider>
  );
}
