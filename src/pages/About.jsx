import React from "react";

export default function About() {
  return (
    <div className="p-8 max-w-4xl mx-auto bg-white rounded-lg shadow-md mt-10">
      {/* Title */}
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">
        About Tree Canvas
      </h1>

      {/* Intro */}
      <p className="mb-4 text-gray-700">
        Tree Canvas is an interactive visual tool designed to help you transform
        rough or complex JSON data into a clear and structured tree diagram.
        It allows you to build, explore, and manage hierarchical relationships
        in an intuitive canvas-based environment.
      </p>

      <p className="mb-4 text-gray-700">
        Each node represents a data object, while edges define parent-child
        relationships. The canvas enforces tree rules to ensure your structure
        remains valid, readable, and easy to understand.
      </p>

      <p className="mb-4 text-gray-700">
        This tool is ideal for developers, students, and analysts who work with
        nested JSON, object hierarchies, dependency trees, or any structured data.
        You can visually design your tree and export it back to JSON for further use.
      </p>

      {/* Keyboard Shortcuts */}
      <h2 className="text-2xl font-semibold text-indigo-500 mt-6 mb-2">
        Keyboard Shortcuts
      </h2>

      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
        <li>
          <strong>L</strong> → Link nodes (Directed link mode)
        </li>
        <li>
          <strong>N</strong> → Add node mode
        </li>
        <li>
          <strong>M</strong> → Move node mode
        </li>
        <li>
          <strong>Delete</strong> → Delete mode
        </li>
        <li>
          <strong>P</strong> → Show / hide node properties
        </li>
        <li>
          <strong>E</strong> → Open / close left sidebar
        </li>
        <li>
          <strong>J</strong> → Open / close JSON sidebar
        </li>
        <li>
          <strong>R</strong> → Reset canvas (confirmation required)
        </li>
        <li>
          <strong>Esc</strong> → Exit current mode and clear selection
        </li>
      </ul>

      {/* Features */}
      <h2 className="text-2xl font-semibold text-indigo-500 mt-6 mb-2">
        Features
      </h2>

      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
        <li>
          <strong>Create Nodes:</strong> Double-click anywhere on the canvas to
          create a new node. Each node is assigned a unique identifier.
        </li>

        <li>
          <strong>Move Nodes:</strong> Drag nodes freely to organize your tree
          layout and improve readability.
        </li>

        <li>
          <strong>Link Nodes:</strong> Create parent-child relationships while
          enforcing strict tree rules (no cycles, one parent per node).
        </li>

        <li>
          <strong>Edit Properties:</strong> Double-click a node to view or edit
          its properties. Changes are reflected instantly on the canvas.
        </li>

        <li>
          <strong>Load & Save JSON:</strong> Import an existing JSON tree or
          export the current canvas structure using the JSON sidebar.
        </li>

        <li>
          <strong>Edge Selection:</strong> Click edges to inspect relationships
          and manage connections visually.
        </li>
      </ul>

      {/* Rules */}
      <h2 className="text-2xl font-semibold text-indigo-500 mt-6 mb-2">
        Tree Rules
      </h2>

      <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
        <li>
          <strong>Single Root:</strong> Only one root node is allowed.
        </li>
        <li>
          <strong>One Parent:</strong> Each node can have only one parent.
        </li>
        <li>
          <strong>No Cycles:</strong> Circular relationships are not permitted.
        </li>
        <li>
          <strong>Cascade Delete:</strong> Deleting a node removes all its children.
        </li>
        <li>
          <strong>Root Restriction:</strong> The root node cannot have a parent.
        </li>
      </ul>

      {/* Tips */}
      <h2 className="text-2xl font-semibold text-indigo-500 mt-6 mb-2">
        Tips
      </h2>

      <ul className="list-disc list-inside text-gray-700 space-y-1">
        <li>Use the mouse wheel to zoom in and out of large trees.</li>
        <li>Drag empty space to pan the canvas.</li>
        <li>Use keyboard shortcuts for faster workflow.</li>
        <li>Keep node spacing clean to improve readability.</li>
      </ul>

      {/* Footer */}
      <p className="mt-6 text-gray-600 italic">
        Tree Canvas helps you think visually, reduce complexity, and better
        understand hierarchical data structures.
      </p>
    </div>
  );
}
