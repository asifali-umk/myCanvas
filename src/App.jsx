import React from 'react'
import Navbar from './components/Navbar.jsx'
import Home from './pages/Canvas.jsx'
import { TreeProvider } from './context/TreeProvider.jsx'

export default function App() {
  return (
    <TreeProvider>
      <Navbar/>
      <Home />
    </TreeProvider>
  )
}