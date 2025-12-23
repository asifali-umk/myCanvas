import React from "react";

export default function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-10">
     <h1 className="text-3xl font-bold text-indigo-600 mb-4">
  About Tree Canvas
</h1>

<p className="mb-4 text-gray-700">
  Welcome to the Tree Canvas! This tool is specially designed to help you 
  visualize your rough JSON data in an intuitive tree format. It allows you 
  to interactively create, move, link, and delete nodes on the canvas, giving 
  you a clear view of your hierarchical structure.
</p>

<p className="mb-4 text-gray-700">
  Whether you want to start from scratch or load an existing JSON structure, 
  Tree Canvas makes it easy to organize and inspect your data. Each node represents 
  a data element, and edges show parent-child relationships, helping you understand 
  complex nested structures at a glance.
</p>

<p className="mb-4 text-gray-700">
  The tool is especially useful for developers, data analysts, and anyone who 
  works with JSON trees, object hierarchies, or structured data. You can also 
  edit node properties, enforce tree rules, and export your work back to JSON for 
  further use.
</p>


      <h2 className="text-2xl font-semibold text-indigo-500 mt-6 mb-2">
        Features:
      </h2>
      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
        <li>
          <strong>Create Nodes:</strong> Double-click anywhere on the canvas to
          create a new node at that position. Each node is automatically
          assigned a unique identifier. This allows you to start building your
          tree from scratch.
        </li>

        <li>
          <strong>Drag Nodes:</strong> Click and hold on a node, then drag it to
          reposition it anywhere on the canvas. This helps you organize your
          tree visually and avoid overlapping nodes for a cleaner structure.
        </li>

        <li>
          <strong>Link Nodes:</strong> Connect parent and child nodes to define
          relationships. Click on a node to select it as the parent, then click
          on another node to set it as the child. The canvas enforces rules such
          as one parent per node, no cycles, and the root node cannot have a
          parent.
        </li>

        <li>
          <strong>View & Edit Node Properties:</strong> Double-click on a node
          to open its properties panel. Here, you can view, edit, or add
          properties such as name, type, or any custom data. All changes are
          automatically reflected in the canvas.
        </li>

        <li>
          <strong>Load & Save JSON:</strong> Use the JSON sidebar to import or
          export your tree structure. - <em>Loading JSON:</em> Paste your saved
          JSON tree data into the sidebar and click "Load" to recreate the tree
          on the canvas. - <em>Saving JSON:</em> The canvas automatically
          generates JSON for the current tree, which you can copy to save your
          work or share it.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-indigo-500 mt-6 mb-2">
        Rules:
      </h2>
      <ul className="list-disc list-inside text-gray-700 mb-4">
        <li>
          <strong>Single Root:</strong> There can be only one root node.
        </li>
        <li>
          <strong>One Parent Only:</strong> Each node can have only one parent.
        </li>
        <li>
          <strong>No Cycles:</strong> You cannot create loops in the tree.
        </li>
        <li>
          <strong>Cascade Delete:</strong> Deleting a node removes all its child
          nodes.
        </li>
        <li>
          <strong>Root Restrictions:</strong> The root node cannot have any
          parent.
        </li>
      </ul>

      <h2 className="text-2xl font-semibold text-indigo-500 mt-6 mb-2">
        Tips:
      </h2>
      <ul className="list-disc list-inside text-gray-700">
        <li>Zoom in/out using the mouse wheel to navigate large trees.</li>
        <li>Pan the canvas by clicking and dragging empty space.</li>
        <li>Use the JSON sidebar to import/export tree structures.</li>
        <li>
          Ensure all rules are followed to prevent errors while linking nodes.
        </li>
      </ul>

      <p className="mt-6 text-gray-600 italic">
        This canvas is ideal for visualizing hierarchical data structures, such
        as organizational charts, family trees, or dependency trees.
      </p>
    </div>
  );
}
