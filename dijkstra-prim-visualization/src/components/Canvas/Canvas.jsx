import React, { useState, useRef, useContext } from "react";
import classes from "./Canvas.module.css";
import Node from "./Node/Node";
import Edge from "./Edge/Edge";
import { newEdgeValid, newNodePositionValid } from "./CanvasUtils";
import { GraphParamsContext } from "../../GraphParamsContext";

/**
 * Canvas component for visualizing nodes and edges.
 * Handles user interactions for adding nodes and edges
 * @returns {JSX.Element} The Canvas component.
 */
const Canvas = () => {
  // Destructure the states from context
  const { nodePoints, setNodePoints, edges, setEdges } =
    useContext(GraphParamsContext);

  // Object with default data to reset firstClickedNode, when needed
  const resetFirstClickedNode = {
    isClicked: false,
    node: null,
  };

  // State variable to keep track of the first node clicked when creating an edge
  const [firstClickedNode, setFirstClickedNode] = useState(
    resetFirstClickedNode,
  );

  // Reference to the canvas SVG element
  const canvasRef = useRef(null);

  /**
   * Handler function for when the canvas is clicked.
   * Adds a new node at the clicked position if the position is valid.
   * @param {MouseEvent} event - The click event.
   */
  const canvasClickHandler = (event) => {
    // Reset the firstClickedNode state variable
    setFirstClickedNode(resetFirstClickedNode);

    // Calculate the coordinates of the clicked point relative to the canvas
    const nodePointAbsoluteX = event.clientX;
    const nodePointAbsoluteY = event.clientY;
    const nodePointCanvasRelativeX =
      nodePointAbsoluteX - canvasRef.current.getBoundingClientRect().left;
    const nodePointCanvasRelativeY =
      nodePointAbsoluteY - canvasRef.current.getBoundingClientRect().top;

    // Create a new node point object
    const newNodePoint = {
      id:
        String(nodePointCanvasRelativeX) +
        ":" +
        String(nodePointCanvasRelativeY),
      x: nodePointCanvasRelativeX,
      y: nodePointCanvasRelativeY,
    };

    // Check if the new node position is valid (not overlapping with existing nodes)
    if (!newNodePositionValid(newNodePoint, nodePoints, canvasRef)) {
      return;
    }

    // Add the new node point to the list of all nodes
    setNodePoints((prevNodePoints) => [...prevNodePoints, newNodePoint]);
  };

  /**
   * Handler function for when a node is clicked.
   * Adds a new edge between the first and second nodes if a second node is clicked.
   * Resets the first node if the same node is clicked again.
   * @param {MouseEvent} event - The click event.
   * @param {Object} node - The clicked node object.
   */
  const nodeClickHandler = (event, node) => {
    event.stopPropagation();

    // If no first node has been clicked yet, set the clicked node as the first node
    if (!firstClickedNode.isClicked) {
      setFirstClickedNode({ isClicked: true, node: node });
    }
    // If the same node is clicked again, reset the first node
    else if (
      firstClickedNode.node.x === node.x &&
      firstClickedNode.node.y === node.y
    ) {
      console.log("first node clicked again, reset firstClickedNode");
      setFirstClickedNode(resetFirstClickedNode);
    }
    // If a different node is clicked, create a new edge between the first and second nodes
    else {
      addEdge(firstClickedNode.node, node);
      setFirstClickedNode(resetFirstClickedNode);
    }
  };

  /**
   * Function to add a new edge to the list of all edges.
   * @param {Object} firstNode - The first node object.
   * @param {Object} secondNode - The second node object.
   */
  const addEdge = (firstNode, secondNode) => {
    const newEdge = {
      id: firstNode.id + "-" + secondNode.id,
      weight: Math.floor(Math.random() * 100) + 1,
      firstNode: firstNode,
      secondNode: secondNode,
    };

    // Check if the new edge is valid (not overlapping with existing edges)
    if (!newEdgeValid(newEdge, edges)) {
      return;
    }

    // Add the new edge to the list of all edges
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };

  // Render the canvas SVG element with all nodes and edges
  return (
    <svg
      ref={canvasRef}
      className={classes.canvas}
      onClick={canvasClickHandler}
    >
      {/* Render all edges */}
      {edges.map((edge) => (
        <React.Fragment key={edge.id}>
          <Edge
            id={edge.id}
            x1={edge.firstNode.x}
            y1={edge.firstNode.y}
            x2={edge.secondNode.x}
            y2={edge.secondNode.y}
          />
          <text
            x={(edge.firstNode.x + edge.secondNode.x) / 2}
            y={(edge.firstNode.y + edge.secondNode.y) / 2}
            fill="white"
          >
            {edge.weight}
          </text>
        </React.Fragment>
      ))}
      {/* Render all nodes */}
      {nodePoints.map((nodePoint) => (
        <Node
          key={nodePoint.id}
          id={nodePoint.id}
          cx={nodePoint.x}
          cy={nodePoint.y}
          onNodeClick={nodeClickHandler}
        />
      ))}
    </svg>
  );
};

export default Canvas;
